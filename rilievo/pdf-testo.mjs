/**
 * Estrae il testo dei PDF con pdf.js dentro Chromium: i font di questi PDF
 * sono sottoinsiemi con una mappa di codifica propria, quindi leggere gli
 * stream a mano restituisce lettere mescolate. pdf.js applica la mappa.
 *
 *   node pdf-testo.mjs <file.pdf> [altro.pdf ...]
 */
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const b = await chromium.launch()
const p = await b.newPage()
await p.goto('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.min.mjs', { waitUntil: 'domcontentloaded' })
await p.setContent('<!doctype html><meta charset="utf-8"><title>estrattore</title>')
await p.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js' })
await p.evaluate(() => {
  // eslint-disable-next-line no-undef
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
})

for (const file of process.argv.slice(2)) {
  const dati = [...readFileSync(file)]
  const pagine = await p.evaluate(async (bytes) => {
    // eslint-disable-next-line no-undef
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise
    const fuori = []
    for (let i = 1; i <= doc.numPages; i++) {
      const pag = await doc.getPage(i)
      const t = await pag.getTextContent()
      fuori.push(t.items.map((x) => x.str).join(' ').replace(/\s+/g, ' ').trim())
    }
    return fuori
  }, dati)
  console.log('='.repeat(74))
  console.log(basename(file), '·', pagine.length, 'pagine')
  pagine.forEach((t, i) => { if (t) console.log(`\n--- pagina ${i + 1}\n${t}`) })
}
await b.close()
