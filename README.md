# Bloom Lab

Web app pentru cafea mai bună acasă (RO/EN), gândit pentru telefon. Live: https://claubocse-rgb.github.io/bloom-lab/

## Funcții
- **Ce cafea ai?** Poză la pungă sau text („Etiopia Guji, natural, prăjire deschisă, acum 10 zile”) → profilul boabelor → rețetă recomandată pentru metoda ta (temperatură, raport, măcinare, bloom), la ce să te aștepți și sfaturi de prospețime. Profilul se poate corecta, iar pungile se salvează și învață din jurnal (dacă ultimele cafele au ieșit acre/amare, rețeta se ajustează).
- **Rețete** cu ghid pas cu pas: cronometru pe pas, numărătoare inversă, bip 3‑2‑1, voce opțională, ecran ținut aprins, reluare după închidere; scalare după doză (V60, 4:6, Chemex, Kalita, iced V60, AeroPress, French press, espresso, turbo shot, moka, ibric, cold brew + rețete neobișnuite)
- **Calculator**: doză, apă, raport, temperatură, măcinare + randament de extracție (TDS → EY) pe diagrama de control
- **Diagnostic**: busola gustului (acru↔amar, apos↔intens) cu sfaturi pe metodă
- **Jurnal**: boabe, setare râșniță, notă, gust; după o cafea acră/amară propune o singură schimbare și „Prepară din nou cu schimbarea”
- **Laborator**: teste A/B (temperatura și raportul se aplică automat), câștigător după 2 preparări pe variantă
- **+ Rețetă**: import de pe internet (cu Claude) sau scrisă manual

## Structură
```
index.html                    aplicația (GitHub Pages servește acest fișier)
src/bloom-lab.artifact.html   sursa pentru varianta publicată ca artifact Claude
docs/spec.md                  scop, decizii, roadmap
docs/review-2026-10-27.md     rezultatele review-urilor UI, UX și expert cafea
assets/                       iconițe, imagini
```

## Unde merge ce
| Funcție | Artifact Claude | GitHub Pages |
|---|---|---|
| Recunoaștere din poză | da | nu |
| Recunoaștere din text | da (Claude) | da (reguli locale) |
| Import rețetă de pe internet | da | nu (formular manual) |
| Jurnal | în cont + pe dispozitiv | doar pe dispozitiv |

Rețeta recomandată e calculată mereu de aceleași reguli (tabelul de decizie din `buildRecipe`); Claude doar citește punga.

## Rulare locală
Deschide `index.html` în browser. Nu are build și nici dependențe.
