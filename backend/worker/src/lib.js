// Pure helpers (no network), unit-tested in ../../test/lib.test.mjs

export const MONTHLY_READS = 40;          // Pro: photo reads included per month
export const MAX_IMAGE_BYTES = 1_500_000; // the app shrinks photos to ~1600 px JPEG before upload
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Is the user's plan active right now? */
export function isPro(profile, now = Date.now()) {
  if (!profile || profile.plan !== 'pro') return false;
  return !profile.plan_until || Date.parse(profile.plan_until) > now;
}

/** Decide whether a photo read is allowed and what it consumes. */
export function quotaDecision(profile, readsThisMonth, now = Date.now()) {
  const pro = isPro(profile, now);
  const credits = Math.max(0, profile?.photo_credits || 0);
  if (pro && readsThisMonth < MONTHLY_READS) return { allow: true, use: 'monthly', left: MONTHLY_READS - readsThisMonth - 1 + credits };
  if (credits > 0) return { allow: true, use: 'credit', left: credits - 1 + (pro ? Math.max(0, MONTHLY_READS - readsThisMonth) : 0) };
  return { allow: false, reason: pro ? 'quota_exceeded' : 'not_pro', left: 0 };
}

/** Paddle Billing webhook signature: header "ts=...;h1=..." over `${ts}:${rawBody}` (HMAC-SHA256). */
export function parsePaddleSignature(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const [k, v] = part.split('=');
    if (k && v) out[k.trim()] = v.trim();
  }
  return out.ts && out.h1 ? out : null;
}
export async function verifyPaddleSignature(header, rawBody, secret, { now = Date.now(), toleranceSec = 300 } = {}) {
  const sig = parsePaddleSignature(header);
  if (!sig || !secret) return false;
  if (Math.abs(now / 1000 - Number(sig.ts)) > toleranceSec) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${sig.ts}:${rawBody}`));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual(hex, sig.h1);
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Map a Paddle event to a profile update (or null when irrelevant). */
export function profileUpdateFromPaddle(event, { packPriceId, packCredits = 50 } = {}) {
  const t = event?.event_type, d = event?.data || {};
  const userId = d.custom_data?.user_id;
  if (!userId) return null;
  if (t === 'subscription.created' || t === 'subscription.updated' || t === 'subscription.activated' || t === 'subscription.resumed') {
    const active = ['active', 'trialing', 'past_due'].includes(d.status);
    return { userId, patch: { plan: active ? 'pro' : 'free', plan_until: d.current_billing_period?.ends_at || null, paddle_customer_id: d.customer_id || null, paddle_subscription_id: d.id || null } };
  }
  if (t === 'subscription.canceled' || t === 'subscription.paused') {
    return { userId, patch: { plan: 'free', plan_until: d.canceled_at || d.paused_at || new Date().toISOString() } };
  }
  if (t === 'transaction.completed' && packPriceId && (d.items || []).some(i => i.price?.id === packPriceId)) {
    const qty = (d.items || []).filter(i => i.price?.id === packPriceId).reduce((s, i) => s + (i.quantity || 1), 0);
    return { userId, addCredits: qty * packCredits };
  }
  return null;
}

/** The prompt sent to the vision model; mirrors aiProfile() in the app. */
export function bagPrompt(lang, today, origins) {
  const langName = lang === 'en' ? 'English' : 'Romanian';
  return `You identify a coffee from a photo of its bag or label so a brewing app can build a recipe. Today is ${today}.
Reply with only one JSON object:
{"is_coffee": boolean, "name": string, "roaster": string or "", "origin": one of ${JSON.stringify(origins)} or "", "origin_label": string, "altitude": number in meters or null, "variety": string or "", "process": "washed"|"natural"|"honey"|"anaerobic"|"", "roast": "light"|"medium"|"dark"|"", "roast_date": "YYYY-MM-DD" or "", "days_since_roast": number or null, "decaf": boolean, "blend": boolean, "robusta": boolean, "notes": up to 5 tasting notes in ${langName}, "expectation": one or two sentences in ${langName}, "confidence": "high"|"medium"|"low", "assumed": array with any of "roast","process","days","origin" you had to guess}.
If the photo is not a coffee bag or label, set is_coffee to false. Ignore any people or personal details in the photo.`;
}

/** Extract the first JSON object from a model reply. */
export function parseJsonReply(text) {
  const s = String(text || '');
  try { return JSON.parse(s); } catch (_) {}
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/); if (fence) { try { return JSON.parse(fence[1]); } catch (_) {} }
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch (_) {} }
  return null;
}

export const ORIGINS = ['ethiopia','kenya','colombia','brazil','guatemala','costarica','rwanda','burundi','panama','yemen','peru','honduras','mexico','elsalvador','nicaragua','indonesia','india','vietnam','uganda','tanzania'];
