/*
 * ===========================================================================
 * STAGIONE 2026/2027 — quello che è già ufficiale
 * ===========================================================================
 * FONTE: hockeyitalia21.com, 05/08/2026, «Definito il calendario della Coppa
 * Italia di Serie B 2026/27 di hockey su pista».
 * https://hockeyitalia21.com/2026/08/05/definito-il-calendario-della-coppa-italia-di-serie-b-2026-27-di-hockey-su-pista/
 *
 * ⚠️ IL CAMPIONATO NON È ANCORA USCITO. Al 08/09/2026 la FISR ha pubblicato
 * solo la Coppa Italia: il girone di Serie B 2026/27 non è ancora sorteggiato.
 * La pagina del sito deve dire questo — «il calendario di campionato non è
 * ancora uscito» — invece di mostrare una tabella vuota o, peggio, quella
 * dell'anno scorso spacciata per questa.
 * ===========================================================================
 */

import type { Partita } from './stagione-2024-25.ts'

/** Il girone di Coppa Italia: tre squadre, andata e ritorno. */
export const GIRONE_COPPA = {
  nome: 'Girone F',
  squadre: ['Amatori Pesaro', 'Amatori Modena', 'Pico Mirandola'],
  fonte: 'https://hockeyitalia21.com/2026/08/05/definito-il-calendario-della-coppa-italia-di-serie-b-2026-27-di-hockey-su-pista/',
} as const

export const COPPA_ITALIA_2026_27: readonly Partita[] = [
  { data: '2026-09-26', ora: '18.00', categoria: 'B Coppa', casa: 'Pesaro', ospiti: 'Amatori Modena', risultato: null },
  { data: '2026-10-03', ora: '18.00', categoria: 'B Coppa', casa: 'Pico Mirandola', ospiti: 'Pesaro', risultato: null },
  { data: '2026-10-10', ora: '18.00', categoria: 'B Coppa', casa: 'Pico Mirandola', ospiti: 'Pesaro', risultato: null },
  { data: '2026-10-18', ora: '17.30', categoria: 'B Coppa', casa: 'Pesaro', ospiti: 'Pico Mirandola', risultato: null },
  { data: '2026-10-24', ora: '18.00', categoria: 'B Coppa', casa: 'Amatori Modena', ospiti: 'Pesaro', risultato: null },
  { data: '2026-11-01', ora: '17.30', categoria: 'B Coppa', casa: 'Amatori Modena', ospiti: 'Pesaro', risultato: null },
] as const

/**
 * LA PROSSIMA PARTITA. La calcola la pagina dal calendario e dalla data di
 * oggi: nessuno deve ricordarsi di aggiornare a mano un blocco «prossima
 * partita», perché nessuno se lo ricorda mai e resta lì per mesi.
 */
export function prossimaPartita(oggi: Date, calendario: readonly Partita[] = COPPA_ITALIA_2026_27): Partita | null {
  const iso = oggi.toISOString().slice(0, 10)
  return calendario.find((p) => p.data >= iso) ?? null
}

/** Il campionato 2026/27 non è ancora stato sorteggiato: la pagina lo dice. */
export const CAMPIONATO_2026_27_USCITO = false
