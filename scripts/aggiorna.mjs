#!/usr/bin/env node
/*
 * ===========================================================================
 * `npm run aggiorna` — un comando solo
 * ===========================================================================
 * Gira a mano sul portatile e ogni ora su GitHub Actions. Fa tre cose:
 *
 *   1. legge i post di Instagram e Facebook (se i token ci sono),
 *      si copia le immagini, e li unisce a `dati/notizie.json`;
 *   2. legge calendario, risultati e classifica dal portale federale
 *      e scrive `dati/classifica.json`;
 *   3. non rompe mai il sito.
 *
 * LA REGOLA CHE VIENE PRIMA DI TUTTE: se una fonte non risponde, si tiene il
 * dato vecchio e lo si dice. Non si scrive mai un file a metà, non si svuota
 * mai una tabella, non si inventa mai un numero. Un risultato sbagliato sul
 * sito di una squadra vera lo leggono le persone che quella partita l'hanno
 * giocata.
 *
 * CODICI DI USCITA — li guarda GitHub Actions per decidere se avvisare:
 *   0  tutto fatto, oppure una fonte saltata di proposito (token assenti)
 *   1  il portale federale è cambiato: i marcatori attesi non ci sono più
 *   2  il portale federale non risponde da troppo tempo e i dati sono vecchi
 *   3  un token c'è ma Meta lo rifiuta: probabilmente è scaduto
 * ===========================================================================
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { leggiSocial } from './fonti/meta.mjs'
import {
  leggiCampionato,
  notizieDaCampionato,
  ErroreStruttura,
  ErroreRete,
  IDC,
  SQUADRA_PESARO,
  STAGIONE_CORRENTE,
} from './fonti/fisr.mjs'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const F_NOTIZIE = join(RADICE, 'dati', 'notizie.json')
const F_CLASSIFICA = join(RADICE, 'dati', 'classifica.json')

/** Quante notizie tiene il file. Le più vecchie escono da sole. */
const QUANTE_NOTIZIE = 30
/** Oltre quante ore un dato vecchio smette di essere accettabile e diventa un allarme. */
const ORE_TOLLERATE = Number(process.env.FISR_ORE_TOLLERATE || 48)

const log = console.log

/* ------------------------------------------------------------------ file */

async function leggiJson(percorso, seManca) {
  try {
    return JSON.parse(await readFile(percorso, 'utf8'))
  } catch (e) {
    if (e.code === 'ENOENT') return seManca
    // Un JSON rotto non si sovrascrive di nascosto: si dice.
    log(`   ⚠️  ${percorso} non è JSON valido (${e.message}). Riparto dal vuoto senza cancellarlo.`)
    return seManca
  }
}

/** Scrive solo se il contenuto è davvero cambiato — a parte la data. Così
 *  l'automazione non fa un commit all'ora per non aver cambiato niente. */
async function scriviSeCambiato(percorso, nuovo, esistente) {
  const senzaData = (o) => {
    if (!o) return null
    const { aggiornato: _aggiornato, ...resto } = o
    return JSON.stringify(resto)
  }
  if (senzaData(nuovo) === senzaData(esistente)) return false
  await mkdir(dirname(percorso), { recursive: true })
  await writeFile(percorso, `${JSON.stringify(nuovo, null, 2)}\n`, 'utf8')
  return true
}

/* --------------------------------------------------------------- notizie */

/**
 * Unisce invece di sovrascrivere. Una voce già presente non si duplica, e non
 * sparisce se la fonte smette di restituirla (Instagram restituisce solo gli
 * ultimi post: senza questa unione, il sito perderebbe l'archivio ogni volta).
 */
export function unisciNotizie(vecchie, nuove, quante = QUANTE_NOTIZIE) {
  const per = new Map()
  for (const v of vecchie) if (v && v.id) per.set(v.id, v)
  for (const n of nuove) {
    if (!n || !n.id) continue
    const prima = per.get(n.id)
    per.set(n.id, {
      ...prima,
      ...n,
      // Se la nuova lettura non ha portato l'immagine (media_url scaduto,
      // download fallito), si tiene quella già scaricata invece di perderla.
      immagine: n.immagine ?? prima?.immagine ?? null,
      testo: n.testo || prima?.testo || '',
      data: n.data ?? prima?.data ?? null,
      link: n.link ?? prima?.link ?? null,
    })
  }
  return [...per.values()]
    .sort((a, b) => String(b.data ?? '').localeCompare(String(a.data ?? '')))
    .slice(0, quante)
}

/* ----------------------------------------------------------------- avvio */

function argomenti() {
  const a = Object.fromEntries(
    process.argv.slice(2).map((s) => {
      const [k, v] = s.replace(/^--/, '').split('=')
      return [k, v ?? true]
    }),
  )
  const stagione = a.stagione || STAGIONE_CORRENTE
  const idc = Number(a.idc || IDC[stagione])
  return { stagione, idc, squadraId: a.squadra ? Number(a.squadra) : SQUADRA_PESARO[idc] }
}

async function main() {
  const { stagione, idc, squadraId } = argomenti()
  const adesso = new Date()
  let uscita = 0

  log('')
  log('════════════════════════════════════════════════════════════════')
  log(`  Amatori Hockey Pesaro — aggiornamento   ${adesso.toISOString()}`)
  log(`  stagione ${stagione} · idc ${idc} · squadra ${squadraId ?? '(da scoprire)'}`)
  log('════════════════════════════════════════════════════════════════')

  /* ---------------------------------------------------- 1 · i social ---- */
  log('')
  log('1 · SOCIAL — Instagram e Facebook')
  const social = await leggiSocial({ radice: RADICE, log })

  /* ------------------------------------------------- 2 · il campionato -- */
  log('')
  log('2 · CAMPIONATO — portale federale FISR')
  const classificaVecchia = await leggiJson(F_CLASSIFICA, null)
  let campionato = null
  try {
    campionato = await leggiCampionato({ idc, squadraId, stagione })
    log(`   ✅ girone: ${campionato.girone}`)
    log(`      squadre: ${campionato.squadre.join(' · ')}`)
    log(`      partite: ${campionato.partite.length} (${campionato.partiteGiocate} con risultato)`)
    log(
      campionato.classificaDisponibile
        ? `      classifica: ${campionato.classifica.length} righe — ${campionato.classificaNota}`
        : `      classifica: non ancora pubblicata dalla FISR — ${campionato.classificaNota}`,
    )
  } catch (e) {
    if (e instanceof ErroreStruttura) {
      log('')
      log('   ❌ IL PORTALE FEDERALE È CAMBIATO.')
      log(`      marcatore che non trovo più: ${e.marcatore}`)
      log(`      dettaglio: ${e.message}`)
      log(`      pagina:    ${e.url}`)
      log('')
      log('      NON scrivo dati/classifica.json: resta quello di prima, con la sua data.')
      log('      Va aperto scripts/fonti/fisr.mjs e rifatto il parser su come è oggi la pagina.')
      uscita = 1
    } else if (e instanceof ErroreRete) {
      log(`   ⚠️  il portale non risponde: ${e.message}`)
      log(`      pagina: ${e.url}`)
      log('      Tengo dati/classifica.json com’è. Si riprova al giro dopo.')
      const quando = classificaVecchia?.aggiornato ? new Date(classificaVecchia.aggiornato) : null
      const ore = quando ? (adesso - quando) / 36e5 : Infinity
      if (!quando) {
        log('      ❌ ma non c’è nessun dato precedente da tenere: il file non esiste ancora.')
        uscita = 2
      } else if (ore > ORE_TOLLERATE) {
        log(
          `      ❌ e l’ultimo dato buono è di ${Math.round(ore)} ore fa (soglia ${ORE_TOLLERATE}): non è più un intoppo, è un guasto.`,
        )
        uscita = 2
      } else {
        log(`      L’ultimo dato buono è di ${Math.round(ore)} ore fa: ancora accettabile.`)
      }
    } else {
      log(`   ❌ errore inatteso leggendo la FISR: ${e.message}`)
      uscita = 1
    }
  }

  if (campionato) {
    const cambiato = await scriviSeCambiato(F_CLASSIFICA, campionato, classificaVecchia)
    log(
      cambiato
        ? '   💾 dati/classifica.json aggiornato.'
        : '   ⏸️  dati/classifica.json invariato: non lo riscrivo (niente commit a vuoto).',
    )
  }

  /* --------------------------------------------------- 3 · le notizie --- */
  log('')
  log('3 · NOTIZIE — unione, non sovrascrittura')
  const notizieVecchie = await leggiJson(F_NOTIZIE, { aggiornato: null, voci: [] })
  const nuove = [...social.voci, ...notizieDaCampionato(campionato)]
  const voci = unisciNotizie(notizieVecchie.voci ?? [], nuove)
  const notizie = { aggiornato: adesso.toISOString(), voci }
  const cambiate = await scriviSeCambiato(F_NOTIZIE, notizie, notizieVecchie)
  log(`   voci prima: ${(notizieVecchie.voci ?? []).length} · lette ora: ${nuove.length} · in archivio: ${voci.length}`)
  log(
    cambiate
      ? '   💾 dati/notizie.json aggiornato.'
      : '   ⏸️  dati/notizie.json invariato: lo lascio esattamente com’era.',
  )

  /* -------------------------------------------------------- 4 · esito --- */
  if (social.errori.length) {
    log('')
    log('   ❌ Meta ha rifiutato un token che invece è configurato.')
    for (const e of social.errori) log(`      ${e.fonte}: ${e.messaggio}`)
    log('      Di solito vuol dire che il token è scaduto o è stato revocato.')
    log('      Come si rifà: AGGIORNAMENTO.md, sezione «Quando i token scadono».')
    if (uscita === 0) uscita = 3
  }

  log('')
  log('════════════════════════════════════════════════════════════════')
  log(uscita === 0 ? '  Fatto. Nessun problema.' : `  Finito CON SEGNALAZIONE — codice ${uscita}.`)
  log('════════════════════════════════════════════════════════════════')
  log('')
  process.exitCode = uscita
}

// Gira solo quando è lui il comando lanciato. Così `unisciNotizie` si può
// importare e provare senza far partire tutto l'aggiornamento.
const lanciatoDirettamente =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
if (lanciatoDirettamente) await main()
