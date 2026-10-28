import { quotaDecision, isPro, verifyPaddleSignature, parsePaddleSignature, profileUpdateFromPaddle, parseJsonReply, MONTHLY_READS } from '../worker/src/lib.js';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
const now = Date.parse('2026-10-28T12:00:00Z');
// plans and quota
assert.equal(isPro({ plan: 'pro', plan_until: '2026-11-28T00:00:00Z' }, now), true);
assert.equal(isPro({ plan: 'pro', plan_until: '2026-10-01T00:00:00Z' }, now), false);
assert.equal(isPro({ plan: 'free' }, now), false);
assert.deepEqual(quotaDecision({ plan: 'free', photo_credits: 0 }, 0, now), { allow: false, reason: 'not_pro', left: 0 });
assert.equal(quotaDecision({ plan: 'free', photo_credits: 3 }, 0, now).use, 'credit');
assert.equal(quotaDecision({ plan: 'pro', plan_until: '2026-11-28T00:00:00Z' }, 10, now).use, 'monthly');
assert.equal(quotaDecision({ plan: 'pro', plan_until: '2026-11-28T00:00:00Z' }, MONTHLY_READS, now).reason, 'quota_exceeded');
assert.equal(quotaDecision({ plan: 'pro', plan_until: '2026-11-28T00:00:00Z', photo_credits: 5 }, MONTHLY_READS, now).use, 'credit');
// paddle signature
const secret = 'pdl_ntfset_test', body = '{"event_type":"subscription.created"}', ts = Math.floor(now / 1000);
const h1 = createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex');
assert.deepEqual(parsePaddleSignature(`ts=${ts};h1=${h1}`), { ts: String(ts), h1 });
assert.equal(await verifyPaddleSignature(`ts=${ts};h1=${h1}`, body, secret, { now }), true);
assert.equal(await verifyPaddleSignature(`ts=${ts};h1=${h1}`, body + ' ', secret, { now }), false);
assert.equal(await verifyPaddleSignature(`ts=${ts - 3600};h1=${h1}`, body, secret, { now }), false);
// paddle events -> profile
const sub = { event_type: 'subscription.created', data: { id: 'sub_1', status: 'active', customer_id: 'ctm_1', custom_data: { user_id: 'u1' }, current_billing_period: { ends_at: '2026-11-28T00:00:00Z' } } };
assert.deepEqual(profileUpdateFromPaddle(sub), { userId: 'u1', patch: { plan: 'pro', plan_until: '2026-11-28T00:00:00Z', paddle_customer_id: 'ctm_1', paddle_subscription_id: 'sub_1' } });
assert.equal(profileUpdateFromPaddle({ event_type: 'subscription.canceled', data: { custom_data: { user_id: 'u1' }, canceled_at: '2026-11-01T00:00:00Z' } }).patch.plan, 'free');
assert.deepEqual(profileUpdateFromPaddle({ event_type: 'transaction.completed', data: { custom_data: { user_id: 'u1' }, items: [{ price: { id: 'pri_pack' }, quantity: 2 }] } }, { packPriceId: 'pri_pack' }), { userId: 'u1', addCredits: 100 });
assert.equal(profileUpdateFromPaddle({ event_type: 'subscription.created', data: {} }), null);
// json parsing of model replies
assert.deepEqual(parseJsonReply('{"a":1}'), { a: 1 });
assert.deepEqual(parseJsonReply('Here:\n```json\n{"a":2}\n```'), { a: 2 });
assert.deepEqual(parseJsonReply('Sure {"a":3} done'), { a: 3 });
assert.equal(parseJsonReply('no json'), null);
console.log('all backend tests passed');
