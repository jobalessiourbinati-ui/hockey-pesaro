/*
 * ===========================================================================
 * LE FOTOGRAFIE — da 2,6 MB l'una a qualche decina di KB
 * ===========================================================================
 * Le quattro immagini che la società ci ha dato sono JPEG usciti dalla
 * macchina fotografica: `azione-1.jpg` pesa 2,6 MB, e su una rete mobile in
 * palazzetto sono venti secondi di attesa per una foto sola. Servirle così
 * sarebbe il difetto più grave del sito, più di qualunque scelta di layout.
 *
 * Questo script le prepara una volta sola, e il risultato finisce in
 * `public/media/squadra/generate/`, che il sito serve così com'è.
 *
 * DUE TAGLI, NON UNO. Un telefono a 390 px e uno schermo a 1440 px non
 * vogliono la stessa inquadratura: la stessa foto panoramica, su un telefono,
 * o diventa alta due centimetri o taglia via i giocatori. Quindi:
 *   -largo  16:9  per le fasce di scrivania
 *   -alto   4:5   per il telefono, ritagliato al centro dove stanno i corpi
 * La pagina sceglie con <picture> e una media query; dentro ogni taglio,
 * `srcset` sceglie la misura giusta per la densità dello schermo.
 *
 * QUALITÀ 82: sopra si vede la differenza col file originale solo ingrandendo
 * al 400%, sotto cominciano gli aloni intorno ai bastoni. WebP perché lo
 * legge qualunque browser dal 2020 e pesa un terzo del JPEG a parità di resa.
 *
 * NIENTE INGRANDIMENTI, MA NEMMENO SPRECHI. `azione-3.jpg` è larga 1172 px e
 * alta 578: il suo ritaglio 16:9 più grande possibile è 1027 px. Chiederle un
 * file da 1600 vorrebbe dire gonfiarla — più byte per un'immagine più
 * sfocata. Quindi ogni misura richiesta viene *ridotta* al massimo che quella
 * sorgente può dare davvero, e i doppioni che ne nascono si scartano.
 * ===========================================================================
 */

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const SORGENTE = 'public/media/squadra'
const USCITA = 'public/media/squadra/generate'

/** I due tagli, con le larghezze che ha senso generare. */
const TAGLI = [
  { nome: 'largo', rapporto: 16 / 9, larghezze: [1600, 1200, 800] },
  { nome: 'alto', rapporto: 4 / 5, larghezze: [900, 600, 400] },
]

const QUALITA = 82

/** Le fotografie di gioco. `maglia.jpg` non è qui dentro: vedi la nota in
 *  fondo al file. */
const FOTO = [
  'hero-urbinati',
  'azione-contrasto',
  'azione-corsa',
  'portiere',
  'giovanili-squadra',
  'gruppo',
  'pista-tramonto',
  'azione-1',
  'azione-2',
  'azione-3',
]

/** Da dove ritagliare, quando la foto non è panoramica. `hero-urbinati` è un
 *  ritratto quasi quadrato: il ritaglio 16:9 di scrivania, preso dal centro,
 *  taglierebbe la testa; preso dall'alto (`top`) tiene testa, numero e stecca.
 *  Le foto d'azione sono panoramiche e restano al centro. */
const GRAVITA = { 'hero-urbinati': 'top' }
const gravita = (nome) => GRAVITA[nome] ?? 'centre'

async function main() {
  await mkdir(USCITA, { recursive: true })
  const righe = []

  for (const nome of FOTO) {
    const ingresso = join(SORGENTE, `${nome}.jpg`)
    const originale = sharp(ingresso)
    const meta = await originale.metadata()
    const pesoOriginale = (await stat(ingresso)).size

    for (const taglio of TAGLI) {
      /* La larghezza massima che questa sorgente può dare in questo taglio:
       * il ritaglio 4:5 di una foto panoramica è alto quanto la foto, quindi
       * il limite vero non è la larghezza ma l'altezza per il rapporto. */
      const massima = Math.floor(Math.min(meta.width ?? 0, (meta.height ?? 0) * taglio.rapporto))

      /* Ogni misura scende al massimo possibile; poi si tengono solo quelle
       * che si distinguono davvero (più del 5% l'una dall'altra), perché due
       * file da 1027 e 1020 px sono lo stesso file scaricato due volte. */
      const larghezze = []
      for (const w of taglio.larghezze) {
        const utile = Math.min(w, massima)
        if (utile < 200) continue
        if (larghezze.some((altra) => utile > altra * 0.95)) continue
        larghezze.push(utile)
      }

      for (const larghezza of larghezze) {
        const altezza = Math.round(larghezza / taglio.rapporto)
        const file = `${nome}-${taglio.nome}-${larghezza}.webp`
        const info = await sharp(ingresso)
          .resize(larghezza, altezza, { fit: 'cover', position: gravita(nome) })
          .webp({ quality: QUALITA })
          .toFile(join(USCITA, file))

        righe.push({ file, larghezza, altezza, byte: info.size })
      }
    }

    righe.push({ file: `${nome}.jpg (originale)`, larghezza: meta.width, altezza: meta.height, byte: pesoOriginale })
  }

  /* Un piccolo indice, così chi guarda la cartella capisce cosa c'è dentro
   * senza aprire i file uno per uno. */
  await writeFile(join(USCITA, 'INDICE.json'), `${JSON.stringify(righe, null, 2)}\n`, 'utf8')

  /* E l'elenco che serve al sito. Non è scritto a mano da nessuna parte: le
   * misure esistenti le sa solo questo script, e un `srcset` che promette un
   * file che non c'è è un'immagine rotta. Chi aggiunge una fotografia lancia
   * `npm run immagini` e il sito sa già cosa può chiedere. */
  await scriviElencoPerIlSito(righe.filter((r) => r.file.endsWith('.webp')))

  const generati = righe.filter((r) => r.file.endsWith('.webp'))
  const totale = generati.reduce((s, r) => s + r.byte, 0)
  for (const r of righe) console.log(`${r.file.padEnd(34)} ${r.larghezza}×${r.altezza}  ${(r.byte / 1024).toFixed(0)} KB`)
  console.log(`\n${generati.length} file generati, ${(totale / 1024).toFixed(0)} KB in tutto.`)
  console.log(`Cartella: ${USCITA} — ${(await readdir(USCITA)).length} file.`)
}

/** Scrive `dati/foto.ts`: la mappa che il componente `Foto` usa per comporre
 *  `srcset`. È generato, non si modifica a mano. */
async function scriviElencoPerIlSito(generati) {
  const perFoto = new Map()
  for (const r of generati) {
    /* Il nome si legge DALLA FINE: le ultime due parti sono sempre taglio e
     * larghezza, tutto quello che viene prima è il nome della fotografia.
     * Leggerlo dall'inizio — `[nome1, nome2, taglio]` — dava per scontato che
     * ogni nome fosse di due parole: `portiere-largo-1440` finiva con
     * taglio = '1440', e lo script moriva su `undefined.push`. */
    const pezzi = r.file.replace('.webp', '').split('-')
    const larghezza = pezzi.pop()
    const taglio = pezzi.pop()
    const nome = pezzi.join('-')
    if (taglio !== 'largo' && taglio !== 'alto') throw new Error(`nome di file inatteso: ${r.file}`)
    if (!perFoto.has(nome)) perFoto.set(nome, { largo: [], alto: [] })
    perFoto.get(nome)[taglio].push({ file: r.file, larghezza: Number(larghezza), altezza: r.altezza })
  }

  const varianti = (elenco) =>
    [...elenco]
      .sort((a, b) => a.larghezza - b.larghezza)
      .map((v) => `      { file: '${v.file}', larghezza: ${v.larghezza}, altezza: ${v.altezza} },`)
      .join('\n')

  const voci = [...perFoto.entries()]
    .map(
      ([nome, tagli]) =>
        `  '${nome}': {\n` +
        `    largo: [\n${varianti(tagli.largo)}\n    ],\n` +
        `    alto: [\n${varianti(tagli.alto)}\n    ],\n` +
        `  },`,
    )
    .join('\n')

  const sorgente = `/*
 * ===========================================================================
 * LE MISURE DELLE FOTOGRAFIE — file generato, non si tocca a mano
 * ===========================================================================
 * Lo riscrive \`npm run immagini\` (\`scripts/immagini.mjs\`) ogni volta che si
 * rigenerano i ritagli. Serve al componente \`sito/componenti/Foto.tsx\` per
 * comporre \`srcset\`: le misure che esistono davvero le sa solo lo script che
 * le ha prodotte, e un \`srcset\` che promette un file inesistente è
 * un'immagine rotta sul telefono di chi apre il sito.
 *
 * Il testo alternativo NON sta qui: dipende da come la fotografia viene usata
 * in quella pagina, e lo scrive chi scrive la pagina.
 * ===========================================================================
 */

export interface VarianteFoto {
  readonly file: string
  readonly larghezza: number
  readonly altezza: number
}

/** I due tagli: \`largo\` 16:9 per la scrivania, \`alto\` 4:5 per il telefono. */
export interface TagliFoto {
  readonly largo: readonly VarianteFoto[]
  readonly alto: readonly VarianteFoto[]
}

/** La cartella pubblica dei ritagli, senza il percorso di base del sito:
 *  quello lo aggiunge \`link()\` di \`sito/rotte.ts\`. */
export const CARTELLA_FOTO = '/media/squadra/generate/'

export const FOTO = {
${voci}
} as const satisfies Record<string, TagliFoto>

export type NomeFoto = keyof typeof FOTO
`

  await writeFile('dati/foto.ts', sorgente, 'utf8')
  console.log('\nScritto dati/foto.ts')
}

await main()

/*
 * ⚠️ PERCHÉ `maglia.jpg` NON È IN QUESTO ELENCO.
 * Non è la maglia dell'Amatori: è la fotografia di studio di una t-shirt
 * tecnica nera, sfondo bianco, senza stemma, senza numero e senza nessun
 * segno della società — il tipo di immagine che si trova in un catalogo di
 * abbigliamento sportivo. Metterla in pagina sotto la parola «maglia»
 * direbbe a chi guarda che la squadra gioca con quella, e non è vero. Vale
 * la regola §9.1 del CONTESTO: quando manca la prova si cambia il blocco,
 * non i fatti. Quando la società darà la foto della maglia vera, si aggiunge
 * una riga a `FOTO` qui sopra.
 */
