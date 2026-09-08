/*
 * ===========================================================================
 * LE NOTIZIE — un file JSON scritto da un programma, letto una volta sola
 * ===========================================================================
 * `dati/notizie.json` lo riempie `scripts/aggiorna.mjs` leggendo le API di
 * Meta. Oggi è vuoto, e resterà vuoto finché la pratica con Meta non è aperta
 * (CONTESTO §4): non è un errore, è lo stato di fatto, e il sito lo deve
 * reggere senza inventare una notizia e senza sembrare rotto.
 *
 * PERCHÉ QUESTA LETTURA STA QUI E NON NELLE PAGINE.
 * Prima la stessa cosa era scritta due volte — nella home e in /notizie/ —
 * con due controlli diversi e due idee diverse di cosa sia una notizia
 * valida. Due copie di una regola sono due regole, e prima o poi divergono:
 * una pagina mostrava un post che l'altra scartava. Ora la regola è una.
 *
 * IL FILE LO SCRIVE UN ALTRO PROGRAMMA, quindi si legge come dato ignoto: può
 * essere vuoto, può avere una voce senza collegamento, può cambiare forma il
 * giorno in cui qualcuno tocca lo script. Una voce malfatta viene scartata in
 * silenzio — l'alternativa è la pagina bianca a chi apre il sito dal telefono,
 * che è molto peggio di una notizia in meno.
 * ===========================================================================
 */

import grezzo from './notizie.json'

export type FonteNotizia = 'facebook' | 'instagram' | 'fisr'

export interface Notizia {
  readonly id: string
  readonly fonte: FonteNotizia
  /** Data ISO. */
  readonly data: string
  readonly testo: string
  readonly immagine?: string
  readonly link: string
}

export interface ArchivioNotizie {
  readonly aggiornato: string | null
  readonly voci: readonly Notizia[]
}

const FONTI_VALIDE: ReadonlySet<string> = new Set(['facebook', 'instagram', 'fisr'])

const piena = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0

/** Una voce entra in pagina solo se ha tutto quello che serve a mostrarla. */
function eNotizia(x: unknown): x is Notizia {
  if (typeof x !== 'object' || x === null) return false
  const v = x as Record<string, unknown>
  return (
    piena(v['id']) &&
    piena(v['fonte']) &&
    FONTI_VALIDE.has(v['fonte'] as string) &&
    piena(v['data']) &&
    piena(v['testo']) &&
    piena(v['link'])
  )
}

function leggi(x: unknown): ArchivioNotizie {
  if (typeof x !== 'object' || x === null) return { aggiornato: null, voci: [] }
  const a = x as Record<string, unknown>
  const voci = Array.isArray(a['voci']) ? a['voci'].filter(eNotizia) : []
  return {
    aggiornato: piena(a['aggiornato']) ? a['aggiornato'] : null,
    // Le più recenti in cima: l'ordine del file non è una garanzia, e il
    // committente ha chiesto «quelle più nuove» per prime nel carosello.
    voci: [...voci].sort((x1, y) => y.data.localeCompare(x1.data)),
  }
}

export const ARCHIVIO: ArchivioNotizie = leggi(grezzo as unknown)

export const ETICHETTA_FONTE: Record<FonteNotizia, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  fisr: 'Federazione',
}

/**
 * IL TITOLO DI UNA SCHEDA, ricavato dal testo del post.
 * I post dei social non hanno un titolo: hanno una didascalia. Inventargliene
 * uno vorrebbe dire scrivere al posto della società; troncare la didascalia
 * invece è solo mostrarne meno. Si taglia alla prima interruzione forte —
 * l'a capo, il punto — e se non ce n'è, all'ultima parola intera prima del
 * limite. Mai a metà di una parola.
 */
export function titoloBreve(testo: string, limite = 84): string {
  const primaRiga = testo.split(/\r?\n/)[0]?.trim() ?? testo
  const puntoFermo = primaRiga.search(/[.!?](\s|$)/)
  const base = puntoFermo > 24 && puntoFermo < limite ? primaRiga.slice(0, puntoFermo + 1) : primaRiga
  if (base.length <= limite) return base
  const tagliato = base.slice(0, limite)
  const ultimoSpazio = tagliato.lastIndexOf(' ')
  return `${(ultimoSpazio > 40 ? tagliato.slice(0, ultimoSpazio) : tagliato).trimEnd()}…`
}

/** L'immagine può arrivare come percorso assoluto, come indirizzo intero o
 *  come semplice nome di file: nell'ultimo caso sta dove la mette lo script. */
export const indirizzoImmagine = (x: string): string =>
  x.startsWith('http') || x.startsWith('/') ? x : `/media/notizie/${x}`
