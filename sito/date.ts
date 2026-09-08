/*
 * ===========================================================================
 * LE DATE — in italiano, e senza fusi orari di mezzo
 * ===========================================================================
 * `new Date('2026-09-26')` è mezzanotte UTC: a est di Greenwich va bene, a
 * ovest diventa il 25. Su un sito di partite questo vuol dire una partita che
 * cambia giorno a seconda di dove sta chi guarda — quindi la data ISO si
 * spezza a mano e si costruisce una data locale.
 *
 * Stava scritto tre volte in tre pagine, con tre elenchi di mesi diversi.
 * Adesso sta qui.
 * ===========================================================================
 */

const MESI = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
] as const

/** La data locale da una ISO, o `null` se la stringa non è una data. */
export function dataLocale(iso: string): Date | null {
  const p = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!p) return null
  const d = new Date(Number(p[1]), Number(p[2]) - 1, Number(p[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

/** «26 settembre 2026». Se la stringa non è una data, torna la stringa. */
export function inItaliano(iso: string): string {
  const p = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  const mese = p ? MESI[Number(p[2]) - 1] : undefined
  if (!p || mese === undefined) return iso
  return `${Number(p[3])} ${mese} ${p[1]}`
}

/** I tre pezzi separati, per scrivere il giorno grande e il mese piccolo. */
export function pezziData(iso: string): { readonly giorno: string; readonly mese: string; readonly anno: string } {
  const p = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!p) return { giorno: '—', mese: '', anno: '' }
  return { giorno: String(Number(p[3])), mese: MESI[Number(p[2]) - 1] ?? '', anno: p[1] ?? '' }
}

/** L'oggi in ISO, letto in ora locale: `toISOString` di sera in Italia torna
 *  già il giorno dopo, e una partita di stasera sparirebbe dal calendario. */
export function oggiISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
