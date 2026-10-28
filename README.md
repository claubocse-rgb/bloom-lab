# Bloom Lab

Aplicație web (PWA) pentru cafea mai bună acasă, în română și engleză. Live: https://claubocse-rgb.github.io/bloom-lab/ · se instalează pe telefon și merge offline.

## Ce face
- **Rețete** (peste 80) cu ghid pas cu pas: cronometru pe pas, numărătoare inversă, bip 3‑2‑1, voce opțională, ecran ținut aprins, reluare după închidere, scalare după doză.
- **Ce cafea ai?** Scrii ce e pe pungă (origine, procesare, prăjire, data) și primești rețeta recomandată pentru metoda ta, plus la ce să te aștepți. Pungile salvate învață din jurnal.
- **Manual**: 43 de capitole despre metode (filtru, imersie, hibride, la rece, tradiționale, espresso, lapte, băuturi), 44 de trenduri 2025–2026 și ghidul de piață pentru râșnițe.
- **Râșnița mea**: 117 râșnițe (52 manuale, 65 electrice). Alegi râșnița ta și fiecare rețetă arată setarea exactă. Unde producătorul nu publică un tabel, îți salvezi propriile setări.
- **Tutoriale**: 80 de videoclipuri YouTube verificate (22 în română), pe metode, espresso, lapte, echipament; apar și în capitolele și rețetele potrivite.
- **Cost pe ceașcă**: prețul pungii, doza, lapte, filtru → cost pe ceașcă, pe lună și economia față de cafenea; pungile salvate își arată costul în rețetă.
- **Diagnostic**, **Jurnal** (setare râșniță, notă, gust, „prepară din nou cu schimbarea”), **Calculator** (TDS → extracție) și **Teste A/B**.

## Planuri
- **Gratuit:** tot ce e mai sus.
- **Pro (pregătit, nelansat):** recunoaștere din poză. Fiecare citire folosește un model AI și e acoperită din abonament. Analiza de costuri e în `docs/research/pricing-photo-recognition.md`. Pentru test local: `localStorage.setItem('bloom.plan','pro')`, doar în versiunea din Claude.

## Structură
```
index.html                    aplicația (generată de build.py din sursa artifact)
manifest.webmanifest, sw.js   PWA: instalare și offline
icons/                        iconițe aplicație
src/bloom-lab.artifact.html   sursa (varianta publicată ca artifact Claude)
data/*.json                   datele de cercetare: râșnițe, metode, trenduri, tutoriale
docs/research/*.md            studiile de piață și verificarea datelor
docs/spec.md, docs/review-*.md
```

## Calitatea datelor
Setările râșnițelor vin din tabelele producătorilor și din surse independente. 34 de modele populare au fost verificate separat, detalii în `docs/research/grinders-verification.md`. Fiecare râșniță are un nivel de încredere afișat în aplicație. Setările sunt un punct de plecare: ajustezi după gust.
