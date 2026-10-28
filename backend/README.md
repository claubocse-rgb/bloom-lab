# Backend Pro: primii pași

Arhitectură (aleasă pentru cost mic și date în UE):

| Componentă | Ce face | Cost la început |
|---|---|---|
| **Supabase** (regiunea Frankfurt) | conturi (login prin link pe e-mail), sincronizarea jurnalului, planul fiecărui utilizator | gratuit (Free tier); ~25 $/lună la Pro |
| **Cloudflare Worker** (`worker/`) | ține cheia AI secretă, verifică abonamentul și limita de 40 citiri/lună, apelează modelul AI, primește webhook-urile Paddle | gratuit până la 100.000 cereri/zi |
| **Anthropic API** (Claude Haiku) | citește fotografia pungii, întoarce JSON | ~0,03 eurocenți/citire |
| **Paddle** (Merchant of Record) | checkout, abonamente, TVA UE, facturi către clienți | ~5% + 0,50 $ pe tranzacție |

Fotografia nu e stocată nicăieri: e trimisă la model, citită, apoi aruncată. Se păstrează doar un jurnal de citiri (data, reușit/eșuat, tokeni, hash) pentru cote și costuri.

## Ce e gata (în acest folder)
- `supabase/schema.sql`: tabele `profiles`, `photo_reads`, `user_docs` cu Row Level Security (fiecare utilizator vede doar datele lui), profil creat automat la înregistrare, ștergerea contului șterge tot (GDPR).
- `worker/src/index.js`: rutele `POST /api/recognize`, `GET /api/me`, `POST /api/paddle`.
- `worker/src/lib.js`: logica de cote, verificarea semnăturii Paddle, maparea evenimentelor Paddle → plan; testată (`npm test`).
- `worker/wrangler.toml`: configurarea, fără secrete.

## Ce faci tu (conturi, ~1 oră)
1. **Supabase**: cont pe supabase.com → proiect nou, regiunea *Central EU (Frankfurt)* → SQL Editor → rulezi `supabase/schema.sql`. Notezi *Project URL* și *service_role key* (Settings → API).
2. **Anthropic**: cont pe console.anthropic.com → API key → limită lunară de cheltuieli (ex. 20 $).
3. **Cloudflare**: cont gratuit → în acest folder: `npx wrangler login`, completezi `SUPABASE_URL` în `wrangler.toml`, apoi:
   ```
   npx wrangler secret put ANTHROPIC_API_KEY
   npx wrangler secret put SUPABASE_SERVICE_KEY
   npx wrangler secret put PADDLE_WEBHOOK_SECRET
   npx wrangler deploy
   ```
4. **Paddle**: cont de *sandbox* întâi (sandbox-vendors.paddle.com). Necesită firma (Kromosolar) și verificare; cere codurile CAEN de IT autorizate. Creezi produsul „Pro” cu două prețuri (lunar, anual) și un produs „Pachet 50 citiri”. Webhook către `https://<worker>/api/paddle` pentru `subscription.*` și `transaction.completed`.

## Ce urmează în cod (după ce ai conturile)
1. În aplicație: ecran de cont (login prin link pe e-mail), buton „Treci la Pro” (Paddle.js checkout cu `customData: { user_id }`).
2. Recunoașterea din poză trimite imaginea la `/api/recognize` în loc de Claude din artifact.
3. Sincronizarea jurnalului în `user_docs`, cu păstrarea modului offline.
4. Export și ștergere cont din aplicație (cerință GDPR).
5. Test complet în sandbox Paddle, apoi trecere în producție.
