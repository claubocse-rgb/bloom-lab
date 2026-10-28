// Bloom Lab Pro backend — Cloudflare Worker
// Routes:
//   POST /api/recognize   photo of a coffee bag -> bean profile JSON (Pro, quota-checked)
//   GET  /api/me          plan, reads used this month, credits left
//   POST /api/paddle      Paddle Billing webhook -> updates plan / credits
// Secrets (wrangler secret put): ANTHROPIC_API_KEY, SUPABASE_SERVICE_KEY, PADDLE_WEBHOOK_SECRET
// Vars (wrangler.toml): SUPABASE_URL, APP_ORIGIN, MODEL, PADDLE_PACK_PRICE_ID
import { quotaDecision, isPro, verifyPaddleSignature, profileUpdateFromPaddle, bagPrompt, parseJsonReply, ORIGINS, MAX_IMAGE_BYTES, IMAGE_TYPES, MONTHLY_READS } from './lib.js';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return cors(env, new Response(null, { status: 204 }));
    try {
      if (url.pathname === '/api/recognize' && req.method === 'POST') return cors(env, await recognize(req, env));
      if (url.pathname === '/api/me' && req.method === 'GET') return cors(env, await me(req, env));
      if (url.pathname === '/api/paddle' && req.method === 'POST') return await paddle(req, env);
      return json({ error: 'not_found' }, 404);
    } catch (e) {
      console.error(e);
      return cors(env, json({ error: 'server_error' }, 500));
    }
  }
};

/* ---------- helpers ---------- */
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
function cors(env, res) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', env.APP_ORIGIN || '*');
  h.set('Access-Control-Allow-Headers', 'authorization, content-type');
  h.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  h.set('Vary', 'Origin');
  return new Response(res.body, { status: res.status, headers: h });
}
async function sb(env, path, init = {}) {
  const res = await fetch(`${env.SUPABASE_URL}${path}`, { ...init, headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'content-type': 'application/json', ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`supabase ${path} ${res.status} ${await res.text()}`);
  const txt = await res.text(); return txt ? JSON.parse(txt) : null;
}
/** Validate the user's Supabase access token by asking Supabase Auth who it belongs to. */
async function userFrom(req, env) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, { headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const u = await res.json(); return u && u.id ? u : null;
}
async function profileOf(env, uid) {
  const rows = await sb(env, `/rest/v1/profiles?id=eq.${uid}&select=*`);
  return rows && rows[0];
}
async function readsThisMonth(env, uid) {
  return await sb(env, '/rest/v1/rpc/reads_this_month', { method: 'POST', body: JSON.stringify({ uid }) });
}

/* ---------- GET /api/me ---------- */
async function me(req, env) {
  const user = await userFrom(req, env); if (!user) return json({ error: 'unauthorized' }, 401);
  const p = await profileOf(env, user.id); const used = await readsThisMonth(env, user.id);
  return json({ plan: isPro(p) ? 'pro' : 'free', planUntil: p?.plan_until || null, readsUsed: used, readsIncluded: MONTHLY_READS, credits: p?.photo_credits || 0 });
}

/* ---------- POST /api/recognize ---------- */
async function recognize(req, env) {
  const user = await userFrom(req, env); if (!user) return json({ error: 'unauthorized' }, 401);
  const ct = (req.headers.get('content-type') || '').split(';')[0];
  if (!IMAGE_TYPES.includes(ct)) return json({ error: 'bad_image_type', allowed: IMAGE_TYPES }, 415);
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_IMAGE_BYTES) return json({ error: 'image_too_large', max: MAX_IMAGE_BYTES }, 413);
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_IMAGE_BYTES || buf.byteLength < 1000) return json({ error: 'image_too_large_or_empty' }, 413);

  const profile = await profileOf(env, user.id);
  const used = await readsThisMonth(env, user.id);
  const q = quotaDecision(profile, used);
  if (!q.allow) return json({ error: q.reason, readsUsed: used }, 402);

  const lang = new URL(req.url).searchParams.get('lang') === 'en' ? 'en' : 'ro';
  const b64 = toBase64(buf);
  const hash = await sha256(buf);
  const t0 = Date.now();
  const ai = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: env.MODEL || 'claude-haiku-5-5', max_tokens: 600,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: ct, data: b64 } },
        { type: 'text', text: bagPrompt(lang, new Date().toISOString().slice(0, 10), ORIGINS) }
      ] }]
    })
  });
  const out = ai.ok ? await ai.json() : null;
  const text = out?.content?.find(c => c.type === 'text')?.text || '';
  const parsed = parseJsonReply(text);
  const ok = !!parsed;
  // log the read (counts only successful reads toward the quota); the image is never stored
  await sb(env, '/rest/v1/photo_reads', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ user_id: user.id, ok, model: env.MODEL || 'claude-haiku-5-5', input_tokens: out?.usage?.input_tokens ?? null, output_tokens: out?.usage?.output_tokens ?? null, image_hash: hash }) });
  if (ok && q.use === 'credit') {
    await sb(env, `/rest/v1/profiles?id=eq.${user.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ photo_credits: Math.max(0, (profile.photo_credits || 0) - 1), updated_at: new Date().toISOString() }) });
  }
  if (!ok) return json({ error: 'read_failed', ms: Date.now() - t0 }, 502);
  return json({ profile: parsed, left: q.left, ms: Date.now() - t0 });
}

/* ---------- POST /api/paddle (webhook) ---------- */
async function paddle(req, env) {
  const raw = await req.text();
  const ok = await verifyPaddleSignature(req.headers.get('paddle-signature'), raw, env.PADDLE_WEBHOOK_SECRET);
  if (!ok) return json({ error: 'bad_signature' }, 401);
  const evt = JSON.parse(raw);
  const upd = profileUpdateFromPaddle(evt, { packPriceId: env.PADDLE_PACK_PRICE_ID });
  if (!upd) return json({ ignored: evt.event_type });
  if (upd.patch) {
    await sb(env, `/rest/v1/profiles?id=eq.${upd.userId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ ...upd.patch, updated_at: new Date().toISOString() }) });
  }
  if (upd.addCredits) {
    const p = await profileOf(env, upd.userId);
    await sb(env, `/rest/v1/profiles?id=eq.${upd.userId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ photo_credits: (p?.photo_credits || 0) + upd.addCredits, updated_at: new Date().toISOString() }) });
  }
  return json({ ok: true });
}

function toBase64(buf) {
  let s = ''; const b = new Uint8Array(buf);
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
}
async function sha256(buf) {
  const d = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(d)].map(x => x.toString(16).padStart(2, '0')).join('');
}
