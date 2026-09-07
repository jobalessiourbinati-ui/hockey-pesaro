# Rilievo del sito attuale — 07/09/2026

Tutto quello che c'era su `hockeypesaro.it` prima di rifarlo, scaricato dalle
API pubbliche di WordPress. Serve a due cose: non perdere niente nel
passaggio, e poter dimostrare da dove viene ogni fatto scritto nel sito nuovo.

- `pdf/` — i sei PDF della libreria media. **La miniera**: storia della
  società dal 1946, progetto triennale, piano marketing, calendari.
  Si leggono con `node pdf-testo.mjs <file.pdf>`: i font incorporati hanno
  una codifica propria, e senza pdf.js escono lettere mescolate.
- `img/` — le 25 immagini della libreria, originali.
- `scatti/` — il sito com'era, a 1440 e a 390 px, pagina per pagina.
- `*.json` — pagine, articoli, categorie, media e utenti dalle API.

Niente di tutto questo va in produzione così com'è: è materiale di
riferimento.
