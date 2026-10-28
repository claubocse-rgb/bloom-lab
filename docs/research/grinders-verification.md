# Verificarea setărilor de măcinare – jurnal de modificări (28 oct. 2026)

Fișiere verificate și corectate pe loc: `grinders-manual.json` (52 de modele) și `grinders-electric.json` (65 de modele). Ambele se încarcă cu `json.load`, iar scriptul de verificare a ordinii nu mai găsește nicio inversiune.

## Rezumat

- **34 de modele populare verificate.** 32 sunt verificate complet. KINGrinder K4 și Eureka Specialità sunt verificate doar parțial, pentru că nu există un tabel pe metode.
- **48 de intrări cu valori `settings` modificate.** Alte 7 intrări au primit doar note, surse sau confidence corectate.
- **8 schimbări de `confidence`:**
  - în sus: JX-Pro, Skerton Pro, Porlex Mini II, Virtuoso+;
  - în jos: Niche Zero, Sette 270, Specialità, X-Ultra.
- **Schemă:** `adjust.notation` și `adjust.zero` sunt acum obiecte bilingve `{ro, en}` în toate cele 117 intrări. Restul schemei a rămas neschimbat.
- **Ce rămâne nesigur:**
  - 36 de intrări au `confidence: "low"`;
  - 36 de intrări au toate metodele `null` (în mare parte râșnițe electrice fără tabel publicat).

## Reguli folosite

**Ierarhia surselor:**
1. Tabelul producătorului (Baratza, Fellow, Sage, Niche, Timemore, KINGrinder, De'Longhi, Wilfa, VSSL).
2. Honest Coffee Guide (HCG), pagina dedicată fiecărei râșnițe.
3. Prima Coffee, Sweet Maria's, completehomebarista.

**Maparea HCG pe metode** (aplicată peste tot unde nu există tabel oficial):
- pour-over = intervalul HCG „V60”;
- AeroPress = de la max(AeroPress, moka) până la limita de sus V60, pentru că intervalul HCG pentru AeroPress acoperă aproape toată scala;
- Chemex = de la mijlocul V60 până la limita HCG „Pour Over”, plafonat la limita French press;
- mijlocul pe cadranele 1Zpresso/Timemore cu rotație.cifră.diviziune se calculează în clicuri, nu zecimal.

**Ordinea fin → grosier:** turcească ≤ espresso ≤ moka ≤ AeroPress ≈ pour-over ≤ Chemex ≤ French press ≤ cold brew. Suprapunerile sunt permise. VSSL Java are scala inversă, iar acest lucru e declarat în notație.

**Fără sursă → `null`.** Unde nu există date publicate, metoda e `null` și există o notă care explică de ce.

## Modele verificate și surse

| Model | Sursă | Ce s-a schimbat |
|---|---|---|
| Comandante C40 MK4 | FAQ Comandante (prin completehomebarista): espresso 7–13, filtru 18–35, French 25–35; HCG | Turcească 2–8, moka 14–24, Chemex 24–35, French 25–35; zona fină AeroPress ajustată |
| C40 + Red Clix | HCG Red Clix; C40 × 2 | Valori recalculate din C40 (pour-over 36–56, French 50–70) |
| 1Zpresso J-Ultra | HCG + 1zpresso.coffee/grindsetting (8 µm, 100 clicuri/rotație) | Confirmat; AeroPress pornește de la moka; notație clarificată |
| 1Zpresso JX-Pro | HCG JX-Pro S (cadran identic, 12,5 µm, 40 clicuri/rotație) | Toate valorile înlocuite (erau extrapolate din JX); low → medium |
| 1Zpresso K-Plus / K-Max | HCG K-Max; 1Zpresso (22 µm, 10 clicuri/cifră) | **Unitate corectată:** notația oficială „numbers” (2.3 în loc de 0.23) |
| 1Zpresso K-Ultra | HCG K-Ultra (20 µm); K-Max × 22/20 pentru zona grosieră | Unitate „numbers”; Chemex, French și cold brew derivate (graficul HCG se oprește la o tură) |
| 1Zpresso Q Air | HCG; 1Zpresso (30 clicuri/rotație, 3 diviziuni/cifră) | Confirmat; notație clarificată |
| 1Zpresso X-Pro | HCG X-Pro S; 1Zpresso (60 clicuri/rotație = 6 cifre × 10) | Confirmat; notație cu 6 cifre/rotație; X-Ultra are aceleași valori, dar cu confidence low |
| 1Zpresso ZP6 | HCG (deja în notația cifră.click) | **Unitate corectată** (valorile vechi erau împărțite la 10); sub 2.0 frezele freacă |
| Timemore C2, C3 | HCG | Confirmate fără modificări |
| Timemore C3 ESP Pro | HCG (tabel identic cu C3 ESP) | Confirmat; notație clarificată |
| Timemore Chestnut X | Manual Timemore: espresso 5–7, pour-over 13–16, French 17–22 | Confirmat; moka, AeroPress, Chemex și cold brew sunt interpolate (marcat în note) |
| KINGrinder K6 | HCG (rotație.clicuri → clicuri totale, 60/tură); categoriile KINGrinder | Toate valorile recalculate în clicuri totale (espresso 22–45, French 82–154) |
| KINGrinder K4 | Manual KINGrinder, doar categorii | Mapat pe categorii (extra-fin 15–50 … grosier 150); low |
| KINGrinder P2 (+ P1) | HCG | Confirmat; AeroPress pornește de la moka (inversiune mică eliminată) |
| Hario Skerton Pro | HCG | Valorile vechi erau decalate cu 1–3 crestături spre grosier; corectate; low → medium |
| Hario Mini Mill Plus | HCG | Confirmat; AeroPress 4–8 (inversiune mică eliminată) |
| Porlex Mini II | HCG Porlex Mini (același mecanism) | Confirmat; low → medium |
| Baratza Encore | Tabel Baratza (Clive Coffee) + HCG | Confirmat; surse completate |
| Baratza Encore ESP | Manual Encore ESP: espresso 1–20 (start 15), AeroPress 22, V60 25, Chemex 30, French 32 | Moka 12–20 și cold brew 32–40 adăugate din HCG |
| Baratza Virtuoso+ | Tabel Baratza (Virtuoso) + HCG | Moka 7–15 (inversiunea față de AeroPress 12 eliminată); medium → high |
| Baratza Sette 270 | Baratza (9E/13E/16E/26E/28E) + HCG | Chemex 20–28, French/cold brew 28–31 (Chemex era mai grosier decât French); high → medium |
| Fellow Ode Gen 2 | Manual Fellow: AeroPress 3–6, pour-over 4–8, French 8–10, cold brew 9–11 | Chemex 5–8 adăugat (derivat); notația cu sub-clicuri explicată |
| Fellow Opus | HCG (graficul din manual nu are cifre extractibile) | AeroPress și Chemex după regula de mapare; notația 41 de trepte explicată |
| Niche Zero | Niche (espresso 10–20, V60 35–50), completehomebarista, HCG | **Unitate corectată:** cifra de pe cadran 0–50 (+ zona nemarcată), nu 0.1–0.9; high → medium |
| Turin DF64 Gen 2 | HCG | Confirmat; AeroPress, pour-over și Chemex după regula de mapare |
| Eureka Mignon Specialità | HCG Silenzio (același cadran și aceeași plajă; tabelul Specialità nu se poate extrage) | Completat (era null); notație R.M explicată; low |
| Sage Smart Grinder Pro | Manual Sage + HCG | AeroPress 17–45, Chemex 38–54 (în loc de AeroPress 13–60) |
| De'Longhi KG79 (+ KG89) | HCG | AeroPress 0–6, Chemex 4–10, cold brew 8–16 adăugate; KG89 rămâne derivat, low |
| De'Longhi Dedica KG521 (+ KG520) | Manual De'Longhi (espresso 1–6) + zonele marcate pe cadran | Notă corectată: filtru/French urmează etichetele de pe cadran, nu o împărțire presupusă |
| Wilfa Svart Uniform (+ Uniform+) | Manual Wilfa + HCG | Chemex 21–36 adăugat; turcească scoasă (sub ~220 µm nu coboară) |
| Timemore Sculptor 064 | HCG | Completat (era null); espresso null (versiunea pentru filtru) |
| Varia VS3 Gen 2 | HCG + manual Varia (0–10, pas 0,1 = 20 µm) | Notație: peste 10 = a doua tură; AeroPress și Chemex după regula de mapare |

**Completat suplimentar:** Eureka Mignon Silenzio, din HCG (era null; confidence medium).

## Alte intrări semnalate de verificarea automată

- **Lido 3, Lido E/ET, Knock Aergrind/Feld2, Mazzer Omega (Prima).** Prima dă Chemex pentru 45 g (6–10 căni), de unde rezulta un Chemex mai grosier decât French press. Acum se folosește Chemex de 3 căni. Prima dă și un French press „fin”, mai fin decât pour-over:
  - la Lido, intervalul French press e derivat între Chemex și cold brew;
  - la Omega, French press și cold brew sunt `null`, pentru că numărul de cifre pe tură nu e documentat.

  Moka și turcească sunt `null` pentru toate aceste modele. Unitățile sunt acum explicate: fracțiuni de tură, ture.linii, cifră.linie.
- **Zassenhaus Santiago/Brasilia/Havanna, Peugeot Nostalgie/Bresil.** Rămân doar valorile susținute de Sweet Maria's, în ture ale piuliței de la contactul frezelor:
  - turcească 0–0.05;
  - filtru 0.1–0.5;
  - French press 0.75–1.25.

  Celelalte metode sunt `null`. Peugeot se bazează pe analogie cu Zassenhaus.
- **VSSL Java.** Scala e inversă: clicuri spre fin de la poziția „flush”. Rămân doar pour-over (~10) și AeroPress (~20) din ghidul VSSL; French press, Chemex și cold brew sunt `null`.
- **KINGrinder K2, Cuisinart DBM8.** Inversiunile mici moka/AeroPress au fost eliminate.

## Ce rămâne nesigur

- **K-Ultra:** zona grosieră (Chemex, French press, cold brew) e derivată din K-Max.
- **Specialità:** valorile sunt preluate de la Silenzio. Chemex 1+0 e estimat, pentru că Eureka nu documentează câte cifre are o rotație.
- **Niche Zero:** French press și cold brew stau în zona nemarcată a cadranului, iar sursele diferă mult între ele (completehomebarista 45–60, HCG ≥ 56/65).
- **JX-Pro original:** valorile sunt luate din tabelul pentru JX-Pro S.
- **X-Ultra, Porlex Tall II, Mini Mill Slim, J-Max, JX, Q2, Kinu, Weber HG-2, Timemore Nano:** neverificate individual (nu erau în lista celor 30).
- **Electrice:** 36 de modele rămân fără setări (toate Eureka, cu excepția Silenzio și Specialità; DF54, DF83, Philos, X54, Lagom P64, VS6, Calibra etc.). Aplicația ar trebui să ceară utilizatorului să-și noteze propriile setări.
- **Zero-ul diferă între exemplare.** La râșnițele fără trepte (DF64, Niche, Varia, Timemore, Eureka), toate valorile sunt doar puncte de pornire.
- **Wilfa Uniform:** tabelul din manualul PDF a fost citit parțial (text distorsionat), iar asocierea dintre valori și metode trebuie confirmată pe manualul tipărit.
- **Script de verificare:** `/tmp/claude-0/-home-claude/0fb441bd-5380-572b-b43b-3042a7b724d7/scratchpad/check.py` (încarcă ambele fișiere și listează inversiunile, inclusiv pe cele minore).
