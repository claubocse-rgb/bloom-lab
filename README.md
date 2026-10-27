# Bloom Lab

Web app pentru cafea mai bună acasă (RO/EN), gândit pentru telefon.

## Funcții
- **Rețete** cu ghid pas cu pas: timer, ținte pe cântar, semnal sonor, scalare după doză (V60, 4:6, Chemex, Kalita, iced V60, AeroPress, French press, espresso, turbo shot, moka, ibric, cold brew)
- **Calculator**: doză, apă, raport, temperatură, măcinare + randament de extracție (TDS → EY) pe diagrama de control
- **Diagnostic**: busola gustului (acru↔amar, apos↔intens) cu sfaturi pe metodă
- **Jurnal**: boabe, setări, notă, gust; „prepară din nou”
- **Laborator**: rețete neobișnuite, teste A/B, import de rețete de pe internet

## Structură
```
index.html                    aplicația (GitHub Pages servește acest fișier)
src/bloom-lab.artifact.html   sursa pentru varianta publicată ca artifact Claude
docs/spec.md                  scop, decizii, roadmap
assets/                       iconițe, imagini
```

## Stocare
Pe GitHub Pages jurnalul se salvează în browser (localStorage), doar pe dispozitivul respectiv.
Importul automat de rețete cu Claude funcționează doar în varianta artifact; aici rămâne formularul manual.

## Rulare locală
Deschide `index.html` în browser. Nu are build și nici dependențe.
