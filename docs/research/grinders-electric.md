# Râșnițe electrice de cafea pentru acasă – studiu de piață (RO/UE, oct. 2026)

Date: `grinders-electric.json` (65 de modele: 2 cu cuțit, 63 cu freze). Conversie: 1 EUR ≈ 5,1 lei. Prețurile sunt valori tipice pentru produse noi în UE și sunt orientative.

## 1. Segmente și benzi de preț

| Segment | EUR | ≈ lei | Ce primești | Exemple |
|---|---|---|---|---|
| Cu cuțit | 20–45 | 100–230 | Fără reglaj, controlezi doar timpul; măcinătura e neuniformă | Bosch TSM6A013B, De'Longhi KG200 |
| Freze de supermarket | 35–90 | 180–460 | Freze plate sau conice simple; merg pentru filtru și French press, nu pentru espresso | De'Longhi KG79/KG89, Krups GVX231, Melitta Molino, Cuisinart DBM8 |
| Mid de bucătărie | 90–250 | 460–1.300 | Conice cu 15–70 de trepte; fac espresso doar cu coș presurizat | Dedica KG520/521, Graef CM 702/800/850, Sage Dose Control Pro, Smart Grinder Pro, Smeg, KitchenAid, Melitta Calibra, Bodum Bistro |
| Mid de specialitate | 150–330 | 770–1.700 | Freze de calitate și setări documentate | Baratza Encore/ESP/Virtuoso+/Sette 30, Fellow Opus, Wilfa Uniform, DF54, Varia VS3, Eureka Notte |
| Premium | 330–700 | 1.700–3.600 | Râșnițe dedicate de espresso sau filtru, single dose | Fellow Ode Gen 2, Niche Zero, DF64 Gen 2, Eureka Silenzio/Specialità/Libra, Timemore 064S, Lagom Mini, Rocky, Sette 270, Vario+ |
| Prosumer / referință | 700–3.000 | 3.600–15.000 | Freze plate de 64–98 mm, turație variabilă | DF83, Niche Duo, Eureka Oro SD, Mazzer Philos/Mini, Lagom P64, Mahlkönig X54, Forté AP, EK43 |

## 2. Disponibilitate în România

- **Retail mare (eMAG, Altex, De'Longhi RO).** Aici găsești mai ales râșnițe cu cuțit și cu freze de supermarket. Exemple confirmate pe De'Longhi RO: KG200 la 169 lei, KG79 la 349 lei, Dedica KG520.M la 849,99 lei (listă 1.199,99). Paginile Altex/eMAG nu au putut fi citite automat, deci stocul trebuie verificat manual.
- **Specialty RO și UE cu livrare în RO:**
  - barshaker.ro: DF64 Gen 2 la ~2.749 lei.
  - skroutz.ro: Eureka Specialità la ~2.284 lei, livrată din Grecia.
  - naturbohne.de/ro-ro: Eureka, Timemore 064/064S/078, livrare UE ~40 lei.
  - Pentru Fellow, Baratza, Wilfa, Niche, Option-O și Varia, sursa realistă sunt magazinele UE: Galaxus, Coffeedesk, Cremashop, Bean Bros, direct de la producător.
- **Niche** vinde doar direct din UK (preț în GBP, eventual taxe vamale). **Macap M2M** și **Graef CM 900** par greu de găsit în prezent.

## 3. Recomandări pe buget și utilizare

| Utilizare | Buget mic | Mediu | Sus |
|---|---|---|---|
| **Doar filtru** (V60, Chemex, AeroPress, French press) | De'Longhi KG79 (~70 €) | Baratza Encore (~165 €), Wilfa Svart Uniform (~240 €) | Fellow Ode Gen 2 (~350 €), Timemore 064 / Moccamaster KM5 |
| **Espresso** | Sage Dose Control Pro (~150 €, coș presurizat) | Eureka Mignon Notte/Silenzio (~260–340 €), Baratza Encore ESP (~220 €) | Niche Zero, DF64 Gen 2, Eureka Specialità/Libra, Mazzer Philos |
| **All-rounder** | Sage Smart Grinder Pro (~200 €) | Fellow Opus (~215 €), Baratza Encore ESP | DF64 Gen 2, Timemore 064S, Mahlkönig X54, Baratza Vario+ |
| **Single dose** | DF54 (~250 €) | Varia VS3 (~290 €), Fellow Opus | Niche Zero, DF64 Gen 2, Lagom Mini; prosumer: DF83, Lagom P64, Eureka Oro SD, Philos |
| **Cafea turcească** | – (râșnițele cu cuțit nu sunt recomandate) | Sage SGP (trepte 1–2), Varia VS3, DF54 | Niche Zero, DF64, EK43. Atenție: multe râșnițe de filtru nu ajung la sub ~200 µm. |

## 4. Observații despre date

1. **Unitățile diferă de la o râșniță la alta.** Treptele sunt în unitățile cadranului fiecărui model, deci nu le compara între modele. Ca să compari, folosește microni. Reglajul fără trepte e notat diferit: Eureka în rotații + cifră, Niche în rotație.cifră, DF/Timemore/Varia ca cifră de la punctul zero.
2. **Ierarhia surselor:**
   - Primele sunt tabelele producătorului: Baratza, Fellow Ode, Sage, Niche, De'Longhi Dedica (doar zona de espresso), Wilfa Uniform. Unde Baratza dă un singur punct de pornire, intervalul are forma `[x, x]`.
   - Urmează Honest Coffee Guide. Intervalele HCG sunt largi pentru că adună rețete diferite.
   - La sfârșit vin ghidurile de retaileri (Rocky, de la Seattle Coffee Gear), cu încredere scăzută.
3. **Valori derivate**, marcate în `notes` și cu `confidence` coborât: KG89 (de la KG79), Uniform+ (de la Uniform), Graef CM 850 (de la CM 800), zonele de filtru și French press la Dedica.
4. **36 de modele au `settings` null.** Fie producătorul nu publică un tabel, fie tabelul HCG era imagine și nu a putut fi extras. Au aceeași problemă Eureka (toate), DF54, DF83, Philos, X54, Lagom P64, VS6 și Calibra. Aici aplicația ar trebui să ceară utilizatorului să-și noteze propriile setări.
5. **Punctul zero diferă între unități la râșnițele fără trepte.** La DF64, Niche, Varia și Timemore recalibrarea mută toată scala.
6. **Corecturi la lista inițială:** „Wilfa Classic+” este o cafetieră, nu o râșniță; am inclus în schimb râșnița Svart/Classic Aroma. Comandante este manuală și a fost exclusă. EK43 este inclusă doar ca referință comercială.
7. **Prețurile și stocul se schimbă des.** Valorile în lei sunt o captură din oct. 2026 și ar trebui reverificate înainte de publicare.
