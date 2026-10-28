# Râșnițe manuale de cafea – studiu de piață pentru Bloom Lab (RO/UE, oct. 2026)

Fișierul de date este `grinders-manual.json`: **52 de intrări**, 16 budget, 19 mid și 17 premium. 27 au încredere medie și 25 scăzută; niciuna nu are încredere ridicată (vezi mai jos de ce).
Conversia folosită: **1 EUR ≈ 5,0 RON** (orientativ). Prețurile sunt intervale tipice pentru produse noi în UE (2025–2026), nu oferte live.

## 1. Segmente și benzi de preț

| Segment | EUR | ≈ RON | Ce găsești | Exemple |
|---|---|---|---|---|
| Generic / „supermarket” | 10–45 | 50–225 | burr ceramic, ax fără rulment, pași inconsistenți | clone Hario Slim de pe eMAG, Bodum Bistro manual, Hario Mini Mill Plus, râșnițe de alamă turcești |
| Budget cu burr de oțel | 35–100 | 175–500 | burr conic de oțel de 38–48 mm, click-uri | KINGrinder P1/P2/K2, Timemore C2/C3/C3 ESP Pro, 1Zpresso Q Air, Porlex |
| Mid (all-rounder) | 100–200 | 500–1.000 | burr de 48 mm, rulmenți dubli, cadran extern, 12–25 µm/click | KINGrinder K4/K6, 1Zpresso JX/JX-Pro/X-Pro/K-Max/K-Plus/Q2, Knock, Timemore Nano, Zassenhaus |
| Premium | 200–450 | 1.000–2.250 | burr-uri speciale (Nitro Blade, Kinu 47 mm, Pietro flat 58 mm), rezoluție de 8–15 µm | Comandante C40, 1Zpresso K-Ultra/J-Ultra/J-Max/ZP6, Kinu M47, Pietro, Timemore Chestnut X, Lido, ROK |
| Ultra-premium | 2.000+ | 10.000+ | râșniță de masă cu volant | Weber HG-2 |

## 2. Disponibilitate în România

- **eMAG (marketplace)**: domină segmentul generic ceramic (50–150 lei), plus Hario, Zassenhaus și Timemore C2/C3 de la selleri terți. KINGrinder și 1Zpresso apar sporadic. Verifică dacă vânzătorul e oficial: există multe clone „Timemore-style”.
- **Altex / Dedeman**: aproape doar râșnițe electrice și câteva modele manuale generice.
- **Magazine românești de cafea de specialitate / prăjitorii**: vând de regulă Comandante, Timemore și uneori 1Zpresso, la prețuri apropiate de UE plus TVA 21%.
- **Magazine UE care livrează în RO** și sunt cele mai folosite de entuziaști: Crema/Cremashop, Gourmetkava.cz, Coffeefriend.eu, MaxiCoffee, Galaxus. Acoperă 1Zpresso, KINGrinder, Timemore, Comandante și Pietro.
- **Second-hand (OLX, grupuri Facebook)**: Comandante, Timemore C2, 1Zpresso JX/K-Plus, Porlex, Hario Skerton și Zassenhaus vechi.
- **Import doar** (rar sau deloc în stocul magazinelor din UE): Orphan Espresso Lido, Helor 101, ROK GrinderGC (ocazional), Weber HG-2.

## 3. Recomandări

**Pe buget**
- **Sub 60 €**: KINGrinder P1/P2 sau 1Zpresso Q Air. Sunt net superioare oricărei râșnițe ceramice generice.
- **60–100 €**: Timemore C2/C3S, pentru filtru. Timemore C3 ESP Pro este cea mai ieftină variantă credibilă pentru espresso.
- **100–150 €**: **KINGrinder K6**, cel mai bun raport preț/performanță pentru espresso și filtru. 1Zpresso JX este o variantă rapidă pentru filtru.
- **150–220 €**: 1Zpresso K-Max/K-Plus (filtru), X-Pro S sau JX-Pro S (all-round), J-Max S (espresso).
- **220–300 €**: 1Zpresso K-Ultra (cel mai bun all-rounder) sau Comandante C40 MK4 (referința la filtru).
- **300 € și peste**: Kinu M47 (espresso) sau Fiorenzato Pietro (claritate de burr plat la filtru).

**Pe utilizare**
- **Espresso**: J-Ultra, Kinu M47 sau J-Max S. Variante cu buget mai mic: KINGrinder K6 sau Timemore C3 ESP Pro. Pentru Comandante, recomandă kitul Red Clix.
- **Filtru (V60/Chemex)**: Comandante C40, 1Zpresso ZP6 Special (light roast), K-Max sau Pietro Pro Brewing. Variante cu buget mai mic: Timemore C2/C3 sau KINGrinder P2.
- **Călătorie**: 1Zpresso Q2/Q Air, Porlex Mini II, Knock Aergrind (toate intră în AeroPress), Timemore Nano, VSSL Java (outdoor).
- **Cafea turcească**: Zassenhaus (Santiago/Havanna), râșnițele clasice de alamă, Porlex (ceramic), Comandante (3–8 clicuri), Kinu și J-Ultra. Turcească nu merge pe ZP6, Timemore C2/C3, Hario Mini Mill sau Pietro.

## 4. Convențiile din JSON

- Setările sunt în **unitățile râșniței**, explicate în `adjust.notation` și `settingsUnit`.
- **1Zpresso** folosește notația R.NT, scrisă ca număr zecimal: `1.53` = o rotație completă + numărul 5 + diviziunea 3. Numărul de numere pe rotație diferă: 9 la K-Plus/K-Max/J-Max/ZP6, 10 la K-Ultra/J-Ultra/JX/Q, 6 la X-Pro/X-Ultra. Notația nu e liniară, deci aplicația trebuie să convertească în clicuri înainte de orice calcul.
- **Knock** folosește R.LL (rotații + linii). **Kinu, Lido, Weber, Zassenhaus și Peugeot** folosesc ture zecimale de la zero.
- **VSSL Java** se măsoară în clicuri spre fin, pornind de la poziția „flush”. Valorile negative înseamnă mai grosier.
- `null` înseamnă fie că metoda e imposibilă pe acea râșniță (de exemplu espresso pe ZP6 sau Timemore C2/C3), fie că nu există niciun reper numeric credibil. Al doilea caz apare la Bodum, la râșnițele generice și la cele de alamă turcești la setări grosiere; aici aplicația trebuie să ofere ghid vizual (pudră, zahăr, sare grunjoasă).
- **Abatere de la schemă**: în 4 intrări, nu doar `turkish`, `espresso` și `moka` pot fi `null`, ci și `aeropress`, `pourover`, `chemex`, `french` și `coldbrew`. Este vorba de turkish-brass-mill, bodum-bistro-manual, generic-ceramic-hand-grinder și generic-wooden-box-mill. Pentru acestea nu există date reale, iar alternativa ar fi fost să inventez valori. Codul aplicației care se așteaptă la intervale pentru aceste metode trebuie să trateze `null`.

## 5. Calitatea datelor – atenție

1. **Nu există o sursă „oficială” unitară.** Hărțile de măcinare oficiale de la 1Zpresso sunt publicate ca imagini, pe care nu le-am putut citi. De aceea niciun model nu are confidence `high`. Ca sursă principală am folosit **Honest Coffee Guide (HCG)**: tabelele lui sunt consistente, dar derivate dintr-o hartă generică de microni. Le-am verificat cu ghidul Prima Coffee, cu manualele producătorilor (Timemore Chestnut X, KINGrinder, Weber, VSSL) și cu Basic Barista.
2. **Reguli de derivare** aplicate peste HCG: `aeropress` = [limita de jos HCG AeroPress, limita de sus V60]; `pourover` = intervalul HCG V60; `chemex` = [mijlocul V60, limita de sus HCG Pour Over]. HCG nu are Chemex.
3. **Valori derivate prin microni**: JX-Pro (din JX), K-Ultra pentru French/cold brew (din K-Max), K2 (din K6), Red Clix (setările standard × 2). La JX-Pro, capătul de sus pentru French/cold brew (până la 6 rotații) poate depăși cursa reală a cadranului; în acest caz folosește poziția maximă.
4. **Surse contradictorii**:
   - Hario Skerton Pro: HCG dă V60 la 2–3, Prima la 5.
   - KINGrinder K6: HCG dă espresso la 22–45, Basic Barista la 40–60. În plus, HCG notează K6 ca și cum ar avea 100 de clicuri pe rotație, deși are 60.
   - Porlex: valorile HCG sunt pentru Mini original; versiunea II are pași mai fini.
   - Prima Coffee recomandă French press mai fin decât V60 (stil Hoffmann).
5. **Puncte unice interpolate în intervale**: Lido, Weber HG-2, Mazzer Omega, Knock, Timemore Chestnut X (moka/AeroPress/Chemex/cold brew), Zassenhaus și Peugeot. Toate au confidence `low`.
6. **Prețuri și disponibilitate în RO**: sunt orientative, din cunoașterea pieței și din câteva pagini de retail. Nu le-am verificat live pe eMAG; prețurile fluctuează și există clone.
7. **Recomandare pentru aplicație**: afișează setarea ca **punct de pornire**, cu mesajul „ajustează după gust: acru → mai fin, amar/astringent → mai grosier”. Permite utilizatorului să își salveze propria setare pentru fiecare râșniță.

## Surse principale
- Honest Coffee Guide – pagini per râșniță: https://honestcoffeeguide.com/
- Prima Coffee – Hand Grinder Grind Size Guide: https://prima-coffee.com/hand-grinder-grind-size-guide/
- 1Zpresso – tabel de reglaj (µm/click, clicuri/rotație): https://1zpresso.coffee/grindsetting
- Manual Timemore Chestnut X: https://cdn.shopify.com/s/files/1/0642/9153/7138/files/Manual-Chestnut_X_20220425-2.pdf
- Manual KINGrinder K4/K6: https://cdn.shopify.com/s/files/1/0294/5679/3675/files/Kingrinder_Manual_-_Exterior_Adjustment_-_V3.pdf
- Basic Barista (K6, Timemore C3): https://thebasicbarista.com/blogs/reviews/king-grinder-k6-review
- Weber HG-2 quick start: https://manuals.plus/weber-workshops/hg-2-grinder-manual
- VSSL Java grind guide: https://cdn.shopify.com/s/files/1/1566/4409/files/VSSL_JAVA_Grind_Guide.pdf
- Sweet Maria's – Zassenhaus: https://library.sweetmarias.com/zassenhaus-hand-crank-mills-use-and-care-instructions/
- eMAG (râșnițe generice): https://www.emag.ro/rasnita-manuala-de-cafea-corp-lemn-sistem-macinare-ceramic-maro-2043/pd/D7G054MBM/
