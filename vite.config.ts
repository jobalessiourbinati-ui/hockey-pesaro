/*
 * ===========================================================================
 * LA CONFIGURAZIONE — sei pagine, sei ingressi
 * ===========================================================================
 * Sito statico multipagina: niente router in pagina, un documento HTML per
 * ogni indirizzo. Vite di suo conosce solo `index.html`, quindi gli altri
 * cinque vanno dichiarati in `rollupOptions.input`.
 *
 * L'elenco NON è scritto qui a mano: viene da `sito/rotte.ts`, lo stesso
 * file che riempie il menu della testata e la mappa del piede. Aggiungere una
 * pagina è una riga sola in un posto solo — se invece l'elenco stesse in tre
 * file diversi, prima o poi due sarebbero d'accordo e il terzo no, e la
 * pagina nuova esisterebbe nel menu ma non nel build.
 *
 * I percorsi sono relativi alla radice del progetto: Vite li risolve da lì,
 * e così non serve `node:path` (né `@types/node`, che qui non è installato).
 * ===========================================================================
 */

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { ROTTE } from './sito/rotte.ts'

/* Il nome del pacchetto: `/` diventa `home`, `/squadra/` diventa `squadra`.
 * Serve solo a Rollup per nominare i file in `dist/assets/`. */
const nomeIngresso = (percorso: string): string => percorso.replaceAll('/', '') || 'home'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Il traguardo è il browser che c'è oggi in tribuna, non quello del 2018.
    target: 'es2022',
    rollupOptions: {
      input: Object.fromEntries(ROTTE.map((r) => [nomeIngresso(r.percorso), r.file])),
    },
  },
})
