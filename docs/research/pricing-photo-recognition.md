# Bloom Lab: prețuri pentru recunoașterea pungilor de cafea din fotografie

**Data cercetării:** 28.10.2026 · **Autor:** analiză de prețuri SaaS (asistată de AI) · **Monede:** USD → EUR → RON, la cursul BNR din 02.10.2026 (1 EUR = 5,3447 RON; 1 USD = 4,7519 RON, deci 1 USD ≈ 0,889 EUR) [S20]

> **Pe scurt:** O citire foto costă **~0,03–0,05 eurocenți** cu Claude Haiku 5.5, GPT-6 Luna sau Gemini 2.5 Flash-Lite și **~0,6–0,8 eurocenți** cu Sonnet 5.5. Costul LLM e neglijabil. Costul real al unui abonat ieftin vine din **comisionul de plată** (în special partea fixă de ~0,45 €/tranzacție la Paddle sau Lemon Squeezy). Recomandare: **Pro la 2,99 €/lună (14,99 lei) sau 23,99 €/an (119,99 lei)**, cu **40 de citiri foto pe lună**, plus **pachete de 50 de citiri la 2,99 € (14,99 lei)**. Promovează abonamentul anual. Marja brută rezultată: ~74% la lunar și ~89% la anual. Pragul de rentabilitate e de 4–15 abonați.

---

## 0. Ipoteze de lucru

| Parametru | Valoare |
|---|---|
| Imagine | 1 foto, latura lungă ~1600 px, 4:3 (1600×1200), redimensionată în browser înainte de upload (JPEG/WebP ~250–400 KB) |
| Text de intrare | ~600 tokeni (prompt de sistem + schemă JSON + instrucțiuni RO/EN) |
| Text de ieșire | ~300 tokeni (JSON: origine, proces, nivel prăjire, dată prăjire, note) |
| Cost de planificare | **0,002 €/citire**. Include rezervă pentru reîncercări (~10%), escaladare la un model mai mare (~10%) și o marjă de siguranță de ~2× |
| TVA | 21% (România, standard din 01.08.2025). Prețurile afișate consumatorilor UE includ TVA-ul țării clientului |

---

## 1. Costul pe citire, pe modele

### 1.1 Prețuri oficiale (per 1M tokeni, USD, nivel standard)

| Furnizor / model | Input | Cache read | Output | Observații | Sursă |
|---|---|---|---|---|---|
| **Claude Haiku 5.5** (prompturi ≤100k) | 0,10 $ | 0,01 $ | 0,50 $ | Batch -50%. Cache minim 512 tokeni | [S1][S3] |
| Claude Haiku 4.5 | 1,00 $ | 0,10 $ | 5,00 $ | Cache minim 4.096 tokeni, deci nu se aplică aici | [S1][S3] |
| **Claude Sonnet 5.5** | 2,00 $ | 0,10 $ (0,05×) | 10,00 $ | | [S1][S3] |
| Claude Opus 5.5 | 4,00 $ | 0,20 $ | 20,00 $ | Supradimensionat pentru acest caz | [S1] |
| **OpenAI GPT-6 Luna** | 0,10 $ | 0,01 $ | 0,50 $ | Flex/Batch: 0,05/0,25 | [S4] |
| Gemini 3.8 Flash / 3.6 Flash | 0,75 $ | 0,075 $ | 3,75 $ | **Se dublează de la 01.01.2027** (1,50/7,50). Output-ul include tokenii de „thinking” | [S6] |
| Gemini 3.5 Flash-Lite | 0,30 $ | 0,03 $ | 2,50 $ | | [S6] |
| **Gemini 3.1 Flash-Lite** | 0,25 $ | 0,025 $ | 1,50 $ | | [S6] |
| Gemini 2.5 Flash-Lite | 0,10 $ | 0,01 $ | 0,40 $ | Generație veche, risc de retragere | [S6] |
| *Gemini free tier* | 0 $ | – | 0 $ | **Datele „sunt folosite pentru îmbunătățirea produselor”**, deci nu e potrivit pentru producție sau GDPR | [S6] |

### 1.2 Cum se numără tokenii pentru imagine

- **Claude:** `⌈lățime/28⌉ × ⌈înălțime/28⌉` tokeni. Modelele Claude 4.7+ (inclusiv Haiku/Sonnet/Opus 5.5) sunt în nivelul *high-resolution*: latura lungă max. 2.576 px și max. 4.784 tokeni. Celelalte modele (de ex. Haiku 4.5) sunt în nivelul *standard*: 1.568 px și 1.568 tokeni, cu redimensionare automată [S2].
  - 1600×1200 → 58 × 43 = **2.494 tokeni** (high-res)
  - 1092×819 → 39 × 30 = **1.170 tokeni** (recomandat; textul unei etichete rămâne lizibil)
  - Haiku 4.5 (standard) → redus automat la ~1.560 tokeni
- **OpenAI:** patch-uri de 32×32 px × un multiplicator specific modelului; limită de 30.000 de patch-uri [S5]. 1600×1200 → 50 × 38 = 1.900 patch-uri. Multiplicatorul pentru GPT-6 Luna nu e publicat în textul paginii, așa că am folosit plaja istorică pentru modelele mici, 1,2–1,62×, adică ~2.280–3.078 tokeni. **De verificat cu calculatorul oficial [S5].**
- **Gemini 3.x:** număr fix de tokeni în funcție de `media_resolution`: low 280, medium 560, **high/implicit 1.120**, ultra_high 2.240 [S8]. **Gemini 2.x:** ≤384 px = 258 tokeni; peste, plăci de 768×768 a câte 258 tokeni fiecare [S7]. 1600×1200 → 3×2 plăci = 1.548 tokeni.

### 1.3 Calculul pe citire (imagine + 600 tokeni input, 300 tokeni output)

Formula: `cost = (tokeni_imagine + 600) × preț_input + 300 × preț_output`

| Model | Tokeni imagine | Input total | Calcul | **USD/citire** | **EUR/citire** | USD / 1.000 citiri |
|---|---|---|---|---|---|---|
| **Haiku 5.5, 1092 px** | 1.170 | 1.770 | 1.770×0,10/1M + 300×0,50/1M | **0,00033** | **0,00029** | 0,33 |
| Haiku 5.5, 1600 px | 2.494 | 3.094 | 3.094×0,10/1M + 300×0,50/1M | 0,00046 | 0,00041 | 0,46 |
| Haiku 5.5 + cache prompt (1600 px) | 2.494 | 3.094 | 600 tokeni la 0,01 $ | 0,00041 | 0,00036 | 0,41 |
| Haiku 4.5 | ~1.560 | 2.160 | 2.160×1/1M + 300×5/1M | 0,00366 | 0,00325 | 3,66 |
| **Sonnet 5.5, 1092 px** | 1.170 | 1.770 | 1.770×2/1M + 300×10/1M | **0,00654** | **0,00582** | 6,54 |
| Sonnet 5.5, 1600 px | 2.494 | 3.094 | 3.094×2/1M + 300×10/1M | 0,00919 | 0,00817 | 9,19 |
| Sonnet 5.5 + cache (1600 px) | 2.494 | 3.094 | 600 tokeni la 0,10 $ | 0,00805 | 0,00716 | 8,05 |
| Opus 5.5, 1600 px | 2.494 | 3.094 | 3.094×4/1M + 300×20/1M | 0,01838 | 0,01634 | 18,38 |
| **GPT-6 Luna** (mult. 1,2–1,62) | 2.280–3.078 | 2.880–3.678 | ×0,10/1M + 300×0,50/1M | **0,00044–0,00052** | 0,00039–0,00046 | 0,44–0,52 |
| Gemini 3.1 Flash-Lite (high) | 1.120 | 1.720 | 1.720×0,25/1M + 300×1,5/1M | 0,00088 | 0,00078 | 0,88 |
| Gemini 3.1 Flash-Lite (medium) | 560 | 1.160 | 1.160×0,25/1M + 300×1,5/1M | 0,00074 | 0,00066 | 0,74 |
| Gemini 3.5 Flash-Lite | 1.120 | 1.720 | ×0,30 + 300×2,5 | 0,00127 | 0,00113 | 1,27 |
| Gemini 3.8 Flash (până la 31.12.2026) | 1.120 | 1.720 | ×0,75 + 300×3,75 | 0,00242 | 0,00215 | 2,42 |
| Gemini 3.8 Flash (din 2027) | 1.120 | 1.720 | ×1,50 + 300×7,50 | 0,00483 | 0,00429 | 4,83 |
| Gemini 2.5 Flash-Lite | 1.548 | 2.148 | ×0,10 + 300×0,40 | 0,00034 | 0,00030 | 0,34 |

**Note**
- **Prompt caching:** la Haiku 5.5 sau Sonnet 5.5, cei 600 de tokeni de sistem depășesc pragul minim de 512, deci se pot pune în cache. Economia e însă mică (~0,05 cenți/citire la Haiku, ~0,11 cenți la Sonnet). În plus, cache-ul expiră după 5 minute, iar la volum mic majoritatea cererilor vor plăti scrierea în cache (1,25×). **Nu merită complexitatea la început.** Contează mult mai mult să redimensionezi imaginea la ~1100 px.
- **Modelele cu raționament** (Gemini 3.x Flash, GPT-6) facturează tokenii de gândire ca output. Setează un nivel minim de raționament sau „thinking budget” = 0/low. Altfel cei 300 de tokeni de output pot deveni 1.000+.
- **Batch API (-50%)** nu se potrivește, pentru că utilizatorul așteaptă rezultatul în câteva secunde.

### 1.4 Alternative OCR (ieftine sau pe dispozitiv)

| Variantă | Cost/citire | Calitate pe pungi de cafea (fonturi stilizate, suprafețe curbe, reflexii) | Sursă |
|---|---|---|---|
| **Tesseract.js în browser** + parsare cu reguli (regex pentru țări/procese/date) | **0 €** | Slabă: CER ~14% pe fotografii; se descurcă greu cu text curbat sau stilizat | [S9][S10] |
| Tesseract.js + LLM text-only (Haiku 5.5, ~900 in / 300 out) | ~0,00024 $ | Mediocră: LLM-ul repară parțial erorile OCR, dar nu poate recupera ce OCR-ul n-a văzut | [S10] |
| Google Cloud Vision OCR (1,50 $/1.000) + LLM text | ~0,0017 $ | Bună (CER ~5%), dar **mai scumpă** decât vision direct cu Haiku 5.5 | [S10] |
| Chrome Prompt API (Gemini Nano, on-device, imagine) | 0 € | Bună pe text simplu, slabă pe text dens. În 2026 încă e „behind a flag”, deci nu se poate livra utilizatorilor | [S11] |
| **Vision LLM direct (Haiku 5.5 / GPT-6 Luna)** | **0,0003–0,0005 $** | Foarte bună: CER-ul LLM pe fotografii e cel mai mic din test (~3,5% la GPT-4o) | [S10] |

**Concluzie:** OCR-ul pe dispozitiv (Tesseract.js) e potrivit pentru **planul gratuit** („recunoaștere text” cu completare manuală). Pentru Pro, vision LLM-ul direct e și mai bun, și mai ieftin decât combinația OCR cloud + LLM.

**Arhitectură recomandată:** Claude Haiku 5.5 (imagine 1092 px) ca model principal. Dacă JSON-ul e invalid sau încrederea e mică (`confidence < 0.6`), escaladezi o dată la Sonnet 5.5. Gemini 3.1 Flash-Lite sau GPT-6 Luna rămân rezerve dacă furnizorul principal are o pană. Cost mediu estimat: 0,9 × 0,00029 € + 0,1 × 0,0058 € ≈ 0,00084 €, ×1,1 pentru reîncercări ≈ **0,0009 €/citire**. În toate calculele de mai jos se folosește **0,002 €/citire**, ca valoare prudentă.

---

## 2. Infrastructură (backend care ține cheia API secretă)

Imaginea e procesată doar în memorie și nu se stochează nimic. O cerere durează ~2–6 s (timp de așteptare I/O; CPU propriu-zis sub 10 ms).

### 2.1 Limite gratuite și prețuri

| Platformă | Plan gratuit | Plan plătit | Observații | Sursă |
|---|---|---|---|---|
| **Cloudflare Workers** | 100.000 cereri/zi, 10 ms CPU/invocare. KV: 100k citiri/zi, **1.000 scrieri/zi** | 5 $/lună: 10M cereri și 30M ms CPU incluse; apoi 0,30 $/M cereri. KV: 1M scrieri incluse | Durata (wall-clock) nu se facturează, doar CPU-ul. Un proxy de `fetch` consumă foarte puțin CPU | [S12] |
| **Supabase Edge Functions** | 500.000 invocări, 50k MAU, DB de 500 MB. **Proiectul e pus pe pauză după 1 săptămână de inactivitate** | Pro de la 25 $/lună: 2M invocări, apoi 2 $/M | Include Auth și Postgres: soluție completă pentru conturi și cote | [S13] |
| **Netlify Functions** | 300 credite/lună | Personal 9 $/lună (1.000 credite); Pro 20 $/membru (5.000) | 5 credite/GB-oră de compute; 3 credite/10.000 cereri | [S14] |
| **Vercel** | Hobby: 1M invocări, 4 ore CPU. **Doar uz necomercial** | Pro ~20 $/utilizator/lună | Planul Hobby e exclus pentru o funcție plătită | [S15] |

### 2.2 Cost lunar al backend-ului la 1k / 10k / 100k citiri pe lună

Calculul presupune o funcție de 1 GB × ~4 s/citire la Netlify, adică ~0,006 credite pe citire.

| Platformă | 1.000 citiri | 10.000 citiri | 100.000 citiri |
|---|---|---|---|
| Cloudflare Workers + D1/KV | 0 $ | 0 $ (≈330 scrieri/zi în KV, sub limita de 1.000; sau D1) | **5 $** (KV-ul gratuit nu ajunge la ~3.300 scrieri/zi; planul plătit acoperă tot) |
| Supabase | 0 $ (dar cu risc de pauză) | 0 $ | 0 $ tehnic (sub 500k), **25 $ recomandat** pentru producție |
| Netlify | ~6 credite, deci 0 $ | ~59 credite, deci 0 $ | ~590 credite, deci **9 $** (Personal) |
| Vercel | 20 $ (Pro, obligatoriu pentru uz comercial) | 20 $ | 20 $ |
| **+ Cost LLM** (Haiku 5.5 la 1092 px / planificare 0,002 €) | 0,29 € / 2 € | 2,9 € / 20 € | 29 € / 200 € |

**Recomandare:**
- **Varianta lean:** Cloudflare Workers (gratuit, apoi 5 $) + D1 pentru cote și utilizatori + Turnstile (anti-bot, gratuit). Conturile se rezolvă cu magic-link sau cu licențe trimise prin webhook de procesatorul de plăți.
- **Varianta simplă:** Supabase (Auth + Postgres + Edge Function) în beta, cu trecere la Pro (25 $) când există primii ~15 abonați.

Ambele merg cu frontend-ul static pe GitHub Pages.

---

## 3. Plăți pentru un SRL din România care vinde consumatorilor din UE

### 3.1 Comisioane

| Opțiune | Comision | Cine e vânzătorul legal (MoR) | TVA UE / OSS | Comision la 2,99 € | Comision la 23,99 € | Sursă |
|---|---|---|---|---|---|---|
| **Stripe direct** (firmă din RO) | 1,5% + 1 RON (carduri SEE); 2,5% + 1 RON (în afara SEE). + Billing 0,7% + Tax 0,5% | **Tu** | Tu te înregistrezi în OSS, depui declarații trimestriale, emiți facturi (inclusiv e-Factura B2C în RO) și gestionezi chargeback-urile | ~0,27 € (9%) | ~0,85 € (3,5%) | [S16][S17] |
| Stripe Managed Payments (MoR) | +3,5% peste comisioanele Payments | Stripe | Gestionat de Stripe | ~0,37 € | ~1,7 € | [S17] |
| **Paddle** (MoR) | 5% + 0,50 $ (≈0,445 €) | Paddle | **Gestionat complet** (TVA, facturi, chargeback). Facturezi doar Paddle (B2B) | ~0,59 € (20%) | ~1,64 € (6,9%) | [S18][S19] |
| Lemon Squeezy (MoR) | 5% + 0,50 $; +1,5% internațional, +0,5% abonamente, +1,5% PayPal (efectiv 7–8,5% + 0,50 $) | Lemon Squeezy | Gestionat | ~0,65–0,70 € | ~2,1 € | [S19] |
| Creem (MoR) | 3,9% + 0,40 $; payout 7 €/USD sau 1% | Creem | Gestionat | ~0,47 € | ~1,3 € | [S19] |

**Pentru Bloom Lab:**
- La volum mic (sub ~30–100k $/an), un **merchant of record este mai simplu** [S18]. Nu ai înregistrare OSS, nu ai TVA în 27 de țări și nu emiți e-Factura pentru fiecare consumator. SRL-ul emite o singură factură lunară către MoR, ca export de servicii B2B. **Paddle** este alegerea de bază: comisioane clare, prețuri locale în RON și EUR, PayPal inclus.
- Partea fixă de **0,50 $/tranzacție** penalizează abonamentul lunar de 2,99 €: ~20% din preț merge la comision. Prin urmare, **abonamentul anual trebuie promovat agresiv**, cu un discount de ~33%.
- Când veniturile trec de ~1.000–2.000 €/lună, merită reanalizat **Stripe direct** (~9% în loc de ~20% la lunar) împreună cu un contabil pentru OSS.
- **Administrativ:** SRL-ul care facturează trebuie să aibă autorizat un **cod CAEN pentru software sau servicii IT** (editare software, prelucrare date sau găzduire). Verifică codurile autorizate la ONRC înainte de lansare. Pe venit se aplică impozitul pe microîntreprinderi (în calcule: 1% din venitul net).

### 3.2 Dacă aplicația ajunge în store-uri (wrapper iOS/Android)

| Store | Comision pe abonamente (UE, din 2026) | Sursă |
|---|---|---|
| **Apple App Store (UE, termeni noi de la 01.10.2026)** | IAP: 26% standard; **15% pentru Small Business Program și pentru abonamente din luna 13**. Plată alternativă: 20%/10%. Link spre web: 15%/10%. În afara App Store: 5% (Core Technology Commission) | [S21][S22] |
| **Google Play (SEE, de la 30.06.2026)** | **10% pe abonamente**, plus 5% dacă folosești sistemul de billing Google (efectiv ~15%). 10% pe orice tranzacție până la primul 1M $/an | [S22] |

**Implicații:** cu Apple IAP la 15%, din 2,99 € rămân ~2,00 € net de TVA și comision, aproape cât la Paddle (1,88 €). Store-ul **nu strică economia**, pentru că LLM-ul e ieftin. Varianta optimă rămâne abonamentul vândut pe web, cu link din aplicație (10% în UE pentru dezvoltatorii eligibili).

---

## 4. Benchmark: cât cer alte aplicații de cafea

| Aplicație | Model | Preț | Scanează punga? | Sursă |
|---|---|---|---|---|
| **Beanconqueror** | Gratuit, open source (donații) | 0 | Nu | [S23][S25] |
| **Filtru** | Freemium | Pro **3,49 $/lună**, **32,99 $/an**, **79,99 $ pe viață** (verificat 17.07.2026; alt ghid menționează 3,99 $/lună) | Nu | [S24][S25] |
| **iCoffee: Scan & Brew** | Abonament | Plus 4,99 $/lună sau 49,90 $/an; Premium 9,99 $/lună sau 99,90 $/an | **Da** (roaster, origine, prăjire, note) | [S26] |
| **2manybeans** (AI Coffee Coach) | Abonament, cu câteva scanări de probă | Pro 4,99 $ / 49,99 $/an; Ultra 9,99 $ / 99,99 $/an | **Da** (origine, proces, dată prăjire, note) | [S27] |
| **Siip Coffee** | Aplicație gratuită, monetizată prin abonament la cafea (SUA) | de la 14,40 $/pungă | Da | [S25] |
| **Acaia Coffee** | Gratuit (aplicație însoțitoare pentru cântar) | 0 | Nu | [S28] |
| Fellow, Timemore, xBloom, Decent | Aplicații însoțitoare pentru hardware, în general gratuite | 0 (venitul vine din hardware) | Nu | *nevalidat individual în această cercetare* |
| Beanhunter, Coffee Guru, Roast World | Gratuite | 0 | Nu | [S25] |

**Repere de preț pentru consumatori în România:**
- Spotify Premium RO: **26 lei/lună** individual, **14 lei** student [S29]
- Concurenții care scanează pungi cer în jur de **5 $/lună (~24 lei)** și **50 $/an (~240 lei)**
- Filtru cere **3,49 $/lună** fără scanare

Un **Pro la 14,99 lei/lună (~2,80 €)** se află sub jumătatea prețului concurenților cu scanare și sub un abonament Spotify, deci e un preț de „hobby impulsiv”. În zona euro, 2,99 €/lună și 23,99 €/an sunt praguri psihologice uzuale.

---

## 5. Model recomandat

### 5.1 Planuri

| Plan | Preț EUR | Preț RON | Ce include |
|---|---|---|---|
| **Gratuit** | 0 | 0 | Toate rețetele și ghidurile, jurnal, cronometre. **Recunoaștere text pe dispozitiv** (Tesseract.js) cu completare manuală. **5 citiri AI de probă** la crearea contului (o singură dată) |
| **Pro lunar** | **2,99 €** | **14,99 lei** | **40 de citiri foto AI pe lună** (nu se reportează), escaladare automată la un model mai bun, sincronizare jurnal, export |
| **Pro anual** | **23,99 €** (~33% reducere, ≈2,00 €/lună) | **119,99 lei** | La fel, cu 40 citiri/lună. Varianta afișată implicit în paywall |
| **Pachet citiri** (pentru free sau Pro peste cotă) | **2,99 € / 50 citiri** | **14,99 lei / 50** | Nu expiră. Prețul e ales ca să absoarbă comisionul fix de 0,45 € |
| *(opțional)* Fondator, pe viață | 59 € | 299 lei | Pro pe viață, cu limită de 40 citiri/lună. Ofertă limitată la primii 200 de utilizatori, pentru finanțare la lansare |

**De ce 40 de citiri:** un consumator acasă cumpără în mod obișnuit 2–8 pungi pe lună, iar câteva citiri se repetă din cauza fotografiilor neclare. 40 e generos din punctul de vedere al utilizatorului. Chiar la cotă plină, costul e 40 × 0,002 € = 0,08 €/lună, adică ~4% din venitul net. Cota servește ca protecție împotriva abuzului și ca **„fair use” perceput**, nu ca necesitate economică.

### 5.2 Fair use și protecție anti-abuz

| Măsură | Detaliu |
|---|---|
| Autentificare obligatorie | JWT sau sesiune. Nicio citire anonimă; Turnstile la crearea contului |
| Cotă per utilizator | Contor lunar în D1/Postgres (`user_id`, `period`, `used`). Decrementezi doar la răspuns valid. **Citirile eșuate nu se contorizează** |
| Rate limit | Max. **5 citiri/minut** și **30/zi** per utilizator; max. 60/zi per IP (Cloudflare Rate Limiting sau un contor în KV) |
| Limită de mărime | Redimensionare în client la **max. 1.200 px latura lungă**, JPEG/WebP q≈0,85. Serverul respinge fișiere **> 1,5 MB** sau > 1.600 px și orice tip diferit de `image/jpeg`/`image/webp` |
| Limită de output | `max_tokens: 400`; schemă JSON strictă (structured output / tool call) |
| Cache după hash | SHA-256 pe imaginea redimensionată. La un hash deja cunoscut întorci rezultatul salvat (cost 0, nu consumă cotă). Ulterior: cache și pe **cod de bare / prăjitor + nume cafea**, într-o bază comunitară de cafele (doar JSON, fără imagini) |
| Filtru de conținut | Modelul întoarce `is_coffee_bag: false` pentru alte imagini; răspunsul se contorizează după a 3-a încercare pe zi |
| Plafon de cost | Spend limit lunar în consola Anthropic, Google sau OpenAI (de ex. 50 €) și alertă la 50% și 80% |
| Confidențialitate (GDPR) | Imaginile nu se stochează. Folosește API-urile plătite, **nu free tier-ul Gemini** (acolo datele se folosesc la antrenare). Menționează furnizorul în Politica de confidențialitate și semnează DPA |

### 5.3 Marja brută per abonat

Calculul folosește Paddle (5% + 0,445 €), TVA 21% scăzut din preț, impozit micro 1% și costul LLM de planificare de 0,002 €/citire.

**Profiluri de utilizare:** ușor = 5 citiri/lună · mediu = 15 · intens = 40 (cotă plină)

| Plan | Preț brut | Net de TVA | Comision Paddle | Venit net | LLM ușor / mediu / intens | **Contribuție/lună** (ușor / mediu / intens) | **Marjă brută** (față de prețul fără TVA) |
|---|---|---|---|---|---|---|---|
| Pro lunar, EUR | 2,99 € | 2,47 € | 0,59 € | 1,88 € | 0,01 / 0,03 / 0,08 € | 1,85 / 1,83 / 1,78 € | **75% / 74% / 72%** |
| Pro lunar, RON | 14,99 lei (2,80 €) | 2,32 € | 0,59 € | 1,73 € | 0,01 / 0,03 / 0,08 € | 1,70 / 1,68 / 1,63 € | 73% / 72% / 70% |
| Pro anual, EUR (lunarizat) | 23,99 €/an | 1,65 €/lună | 0,14 €/lună | 1,52 € | 0,01 / 0,03 / 0,08 € | 1,49 / 1,47 / 1,42 € | **90% / 89% / 86%** |
| Pro lunar prin Stripe direct | 2,99 € | 2,47 € | 0,27 € | 2,20 € | 0,01 / 0,03 / 0,08 € | 2,17 / 2,15 / 2,10 € | 88% / 87% / 85% (fără costul administrativ OSS) |
| Pro lunar prin Apple IAP 15% | 2,99 € | 2,47 € | 0,37 € | 2,10 € | 0,01 / 0,03 / 0,08 € | 2,07 / 2,05 / 2,00 € | 84% / 83% / 81% |
| Pachet 50 citiri | 2,99 € | 2,47 € | 0,59 € | 1,88 € | 50 × 0,002 = 0,10 € | **1,76 €** | 71% |

**Sensibilitate la costul modelului:** chiar dacă toate citirile ar merge pe Sonnet 5.5 (0,0082 €), un abonat intens (40 citiri) ar costa 0,33 €/lună, iar marja la Pro lunar ar rămâne ~62%. Venitul net al unui abonat lunar (1,88 €) acoperă ~**940 de citiri** la costul de planificare sau ~**6.400** la costul real Haiku 5.5.

### 5.4 Pragul de rentabilitate

**Costuri fixe lunare:**
- **Lean:** Cloudflare Workers Paid 5 $ (4,45 €) + domeniu (~1,5 €/lună) + GitHub Pages 0 € ≈ **6 €/lună**
- **Supabase:** Supabase Pro 25 $ (22,2 €) + domeniu ≈ **24 €/lună**
- *Neincluse:* contabilitatea SRL-ului (există deja), timpul tău, marketing

| Scenariu | Cost fix/lună | Contribuție/abonat (mediu) | **Abonați pentru break-even** |
|---|---|---|---|
| Lean, doar lunar | 6 € | 1,83 € | **4** |
| Lean, doar anual | 6 € | 1,47 € | **5** |
| Lean, mix 50/50 | 6 € | 1,65 € | **4** |
| Supabase Pro, doar lunar | 24 € | 1,83 € | **14** |
| Supabase Pro, doar anual | 24 € | 1,47 € | **17** |
| Supabase Pro, mix 50/50 | 24 € | 1,65 € | **15** |

**Proiecție** (mix 50/50, utilizare medie, varianta lean până la 200 de abonați, apoi Supabase Pro):

| Abonați | Citiri/lună (15 × abonați + 5 × utilizatori noi gratuiți)* | Venit net/lună | Cost LLM | Cost infra | **Profit brut/lună** |
|---|---|---|---|---|---|
| 10 | ~650 | 17 € | 1,3 € | 6 € | **~10 €** |
| 50 | ~1.750 | 85 € | 3,5 € | 6 € | **~75 €** |
| 200 | ~8.000 | 340 € | 16 € | 24 € | **~300 €** |
| 1.000 | ~35.000 | 1.700 € | 70 € | 24 € | **~1.600 €** |

\* Presupune ~100/200/1.000/4.000 de conturi gratuite noi pe lună, fiecare consumând 5 citiri de probă (cost 0,01 €/cont).

### 5.5 Pași concreți

1. **MVP:** Cloudflare Worker `/api/read-bag` → Claude Haiku 5.5 cu output JSON strict. Redimensionare la 1.092–1.200 px în browser, hash SHA-256 și cotă în D1.
2. **Plăți:** Paddle Billing cu prețuri locale (EUR 2,99 / 23,99 și RON 14,99 / 119,99). Webhook-ul Paddle actualizează în D1 `plan = pro`.
3. **Plan gratuit:** Tesseract.js (lazy-load, ~2–4 MB, doar când e nevoie) + parsare cu reguli. Butonul „Citire AI” afișează contorul de probă „3/5 rămase”.
4. **Monitorizare:** cost/zi, rată de escaladare la Sonnet, rată de răspunsuri din cache, cei mai activi utilizatori. Revizuiești cota după 60 de zile de date reale.
5. **De verificat înainte de lansare:** multiplicatorul de imagine pentru GPT-6 Luna (dacă îl folosești ca rezervă); codul CAEN IT autorizat pe SRL; DPA cu furnizorul LLM; dacă Haiku 5.5 extrage corect data prăjirii în format RO/EU (zz.ll.aaaa) pe 20–30 de pungi reale.

---

## Surse

Toate au fost accesate pe 28.10.2026, dacă nu se precizează altfel.

- [S1] Anthropic, *Pricing* (tabel de prețuri pe modele, Batch, cache): https://platform.claude.com/docs/en/about-claude/pricing
- [S2] Anthropic, *Vision: Resolution and token cost* (formula 28×28, niveluri high-res și standard): https://platform.claude.com/docs/en/build-with-claude/vision
- [S3] Anthropic, *Prompt caching* (lungimi minime, multiplicatori): https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- [S4] OpenAI, *API Pricing* (GPT-6 Luna: 0,10 / 0,01 / 0,50 $): https://developers.openai.com/api/docs/pricing
- [S5] OpenAI, *Image cost calculator* (patch-uri de 32 px × multiplicator): https://developers.openai.com/api/docs/guides/image-cost-calculator și https://developers.openai.com/api/docs/guides/images-vision
- [S6] Google, *Gemini API pricing* (Flash / Flash-Lite, free tier, dublarea prețului din 2027): https://ai.google.dev/gemini-api/docs/pricing
- [S7] Google, *Understand and count tokens* (258 tokeni / plăci de 768 px): https://ai.google.dev/gemini-api/docs/tokens
- [S8] Google, *Media resolution* (280 / 560 / 1.120 / 2.240 tokeni): https://ai.google.dev/gemini-api/docs/media-resolution
- [S9] Tesseract.js (GitHub): https://github.com/naptha/tesseract.js
- [S10] ToolKoala, *OCR in 2026: Tesseract vs Google Vision vs ChatGPT vs Apple Live Text* (CER pe fotografii; Cloud Vision 1,50 $/1.000): https://toolkoala.pages.dev/blog/ocr-comparison-2026/
- [S11] R. Camden, *Testing OCR with Chrome Built-in AI* (11.04.2026): https://www.raymondcamden.com/2026/04/11/testing-ocr-with-chrome-built-in-ai
- [S12] Cloudflare, *Workers pricing*: https://developers.cloudflare.com/workers/platform/pricing/
- [S13] Supabase, *Pricing*: https://supabase.com/pricing
- [S14] Netlify, *Introducing credit-based plans* (05.09.2025): https://www.netlify.com/changelog/netlify-pricing-update-introducing-credit-based-plans/
- [S15] Vercel, *Hobby plan* (uz necomercial): https://vercel.com/docs/plans/hobby
- [S16] Pronet Design, *Online payment processors Romania 2026* (Stripe RO: 1,5% + 1 RON SEE; 2,5% + 1 RON non-SEE): https://pronetdesign.ro/en/blog/online-payment-processors-romania-2026/
- [S17] Stripe, *Pricing* (Billing 0,7%, Tax 0,5%, Managed Payments +3,5%; pagina în versiunea US): https://stripe.com/pricing
- [S18] dev.to, *Stripe vs Paddle vs Lemon Squeezy fee comparison 2026*: https://dev.to/jettfu/stripe-vs-paddle-vs-lemon-squeezy-fee-comparison-2026-2c77
- [S19] Creem, *Honest payment fee breakdown: Creem vs Stripe, Paddle, LS* (24.10.2026; sursă interesată, de verificat): https://www.creem.io/blog/honest-payment-fee-breakdown-creem-vs-stripe-paddle-ls
- [S20] Curs BNR 02.10.2026: https://cursbnr.nxm.ro/data/02-10-2026
- [S21] MacRumors, *Apple Overhauls EU App Store Fees* (18.08.2026): https://www.macrumors.com/2026/08/18/eu-app-store-fee-change/
- [S22] Make Influence, *Apple and Google's EU app store fee overhaul*: https://www.makeinfluence.com/en/academy/apple-and-googles-eu-app-store-fee-overhaul-what-it-means-for-creator-subscription-and-tipping-apps
- [S23] Kaffeemacher, *Beanconqueror*: https://kaffeemacher.de/en/blogs/kaffeewissen/beanconqueror
- [S24] AppPricingLab, *Filtru IAP prices* (verificat 17.07.2026): https://apppricinglab.com/iap/apple/1150921819
- [S25] Siip, *Best coffee apps 2026* (sursă interesată): https://siip-coffee-website.pages.dev/guides/best-coffee-apps-2026
- [S26] App Store, *iCoffee: Scan & Brew Coffee*: https://apps.apple.com/ml/app/id6760366760
- [S27] App Store, *2manybeans*: https://apps.apple.com/us/app/2manybeans/id6761014463
- [S28] App Store, *Acaia Coffee*: https://apps.apple.com/us/app/id834883045
- [S29] Spotify Premium România: https://www.spotify.com/ro-en/premium

*Limitări: prețurile LLM se schimbă des (de ex. Gemini 3.8 Flash se dublează la 01.01.2027). Multiplicatorul de imagine OpenAI și ratele Stripe pentru SEE au fost luate din surse secundare. Aplicațiile Fellow, Timemore, xBloom și Decent nu au fost verificate individual.*
