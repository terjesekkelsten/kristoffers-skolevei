# Kristoffers skolevei

Lærespill for iPad (trafikk, norsk, engelsk, matte, Tenk/sjakk). Ingen byggesteg og ingen avhengigheter: filene serveres som de er.

## Filer
- `index.html` – HTML-skall, lenker `css/style.css` og laster `js/game.js` som ES-modul.
- `js/game.js` – scener, tegning, lyd, input, profiler, foreldreside, klasserom, minispill.
- `js/tasks.js` – alle oppgavegeneratorer (`gen2(fag, modul)`), repetisjon (`taskSnap`/`taskFromSnap`). Ingen DOM. Spilltilstand (CH, PR, PROG, CL, DB) leses via `env`, som `game.js` kobler til med getters.
- `js/data.js` – oppgavebanker og innhold. `js/chess.js` – sjakkmotor. `js/util.js` – `pick`, `shuffle`, `rnd`.
- `sw.js`, `manifest.webmanifest`, `icons/` – hjemskjerm og offline (nett først, lagret kopi uten nett).

## Tester
- `node tests/run.mjs` – sjekker alle moduler i alle fag mange ganger, bankstørrelser og sjakkoppgaver. Kjøres av Vercel før hver publisering (`vercel.json`), så en feil stopper publiseringen.
- `node tests/smoke.mjs` – røyktest i Chromium (Playwright): start, klasserom, modul, offline. Kjøres i GitHub Actions.
- ES-moduler kan ikke åpnes fra `file://`. Bruk en lokal server, f.eks. `python3 -m http.server`.

## Regler
- Nye oppgavetyper og banker legges i `tasks.js`/`data.js` uten DOM-kode, og får en sjekk i `tests/run.mjs`.
- `game.js` kan ikke tilordne nye verdier til importerte navn; muter objekter i stedet.
- Endringer gjøres på egen gren. Produksjon publiseres bare når Terje sier «deploy».
