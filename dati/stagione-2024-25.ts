/*
 * ===========================================================================
 * STAGIONE 2024/2025 — il calendario vero, con i risultati
 * ===========================================================================
 * FONTE: `rilievo/pdf/Partite-2425-271124.pdf`, il calendario che la società
 * aveva caricato nella libreria media di WordPress e che dal sito non si
 * vedeva. È un documento della società, non una ricostruzione: i risultati
 * mancanti sono quelli che il PDF non riportava (compilato il 27/11/2024,
 * quindi le partite successive erano ancora da giocare).
 *
 * ⚠️ NON SI COMPLETA A MEMORIA. Le partite senza risultato restano senza
 * risultato finché non arriva una fonte: il portale federale, un comunicato
 * FISR, o il committente. Un punteggio inventato è la cosa peggiore che
 * possa stare sul sito di una squadra vera — lo leggerebbero le persone che
 * quella partita l'hanno giocata.
 * ===========================================================================
 */

export type Categoria = 'B' | 'B Coppa' | 'U13' | 'U17'

export interface Partita {
  /** Data in formato ISO, per ordinare e per il tag <time>. */
  readonly data: string
  /** Ora di inizio, come sul calendario della società. */
  readonly ora: string
  readonly categoria: Categoria
  readonly casa: string
  readonly ospiti: string
  /** `null` quando il documento non riportava il risultato. */
  readonly risultato: readonly [number, number] | null
}

/** Vero quando la squadra di casa è Pesaro: serve alla pagina per dire
 *  «in casa» o «in trasferta» senza confrontare stringhe ogni volta. */
export const inCasa = (p: Partita): boolean => p.casa === 'Pesaro'

export const STAGIONE_2024_25: readonly Partita[] = [
  { data: '2024-09-29', ora: '17.30', categoria: 'B Coppa', casa: 'Pesaro', ospiti: 'Modena', risultato: [0, 1] },
  { data: '2024-10-06', ora: '20.45', categoria: 'B Coppa', casa: 'Correggio Italplastic', ospiti: 'Pesaro', risultato: [5, 2] },
  { data: '2024-10-20', ora: '12.00', categoria: 'U13', casa: 'Pesaro', ospiti: 'Mirandola', risultato: [4, 6] },
  { data: '2024-10-20', ora: '17.30', categoria: 'B Coppa', casa: 'Pesaro', ospiti: 'Mirandola', risultato: [2, 1] },
  { data: '2024-10-26', ora: '17.00', categoria: 'B Coppa', casa: 'Scandianese', ospiti: 'Pesaro', risultato: [3, 2] },
  { data: '2024-11-10', ora: '17.30', categoria: 'B Coppa', casa: 'Pesaro', ospiti: 'Correggio Italplastic', risultato: [1, 1] },
  { data: '2024-11-12', ora: '21.00', categoria: 'B Coppa', casa: 'Modena', ospiti: 'Pesaro', risultato: [3, 2] },
  { data: '2024-11-23', ora: '18.30', categoria: 'U17', casa: 'Pesaro', ospiti: 'Modena', risultato: [4, 6] },
  { data: '2024-11-30', ora: '18.00', categoria: 'B Coppa', casa: 'Mirandola', ospiti: 'Pesaro', risultato: null },
  { data: '2024-12-01', ora: '12.00', categoria: 'U13', casa: 'Pesaro', ospiti: 'Modena', risultato: null },
  { data: '2024-12-08', ora: '17.30', categoria: 'B Coppa', casa: 'Pesaro', ospiti: 'Scandianese', risultato: null },
  { data: '2024-12-22', ora: '15.00', categoria: 'U13', casa: 'Correggio B', ospiti: 'Pesaro', risultato: null },
  { data: '2024-12-22', ora: '11.00', categoria: 'U13', casa: 'Suzzara', ospiti: 'Pesaro', risultato: null },
  { data: '2025-01-05', ora: '17.30', categoria: 'B', casa: 'Pesaro', ospiti: 'Correggio Minimotor', risultato: null },
  { data: '2025-01-12', ora: '16.30', categoria: 'B', casa: 'Modena', ospiti: 'Pesaro', risultato: null },
  { data: '2025-01-19', ora: '16.30', categoria: 'U17', casa: 'Scandiano B', ospiti: 'Pesaro', risultato: null },
  { data: '2025-01-19', ora: '15.00', categoria: 'U17', casa: 'Scandiano A', ospiti: 'Pesaro', risultato: null },
  { data: '2025-01-26', ora: '12.00', categoria: 'U13', casa: 'Pesaro', ospiti: 'Scandianese', risultato: null },
  { data: '2025-01-26', ora: '11.00', categoria: 'U17', casa: 'Modena', ospiti: 'Pesaro', risultato: null },
  { data: '2025-01-26', ora: '18.00', categoria: 'B', casa: 'Scandiano', ospiti: 'Pesaro', risultato: null },
  { data: '2025-02-02', ora: '15.00', categoria: 'U13', casa: 'Pesaro', ospiti: 'Correggio A', risultato: null },
  { data: '2025-02-02', ora: '17.30', categoria: 'B', casa: 'Pesaro', ospiti: 'Correggio Italplastic', risultato: null },
  { data: '2025-02-09', ora: '10.30', categoria: 'U13', casa: 'Scandianese', ospiti: 'Pesaro', risultato: null },
  { data: '2025-02-09', ora: '11.00', categoria: 'U13', casa: 'Mirandola', ospiti: 'Pesaro', risultato: null },
  { data: '2025-02-09', ora: '16.00', categoria: 'U17', casa: 'Pesaro', ospiti: 'Scandiano B', risultato: null },
  { data: '2025-02-12', ora: '15.30', categoria: 'U13', casa: 'Scandiano B', ospiti: 'Pesaro', risultato: null },
  { data: '2025-02-16', ora: '16.45', categoria: 'U13', casa: 'Scandiano A', ospiti: 'Pesaro', risultato: null },
  { data: '2025-02-22', ora: '18.30', categoria: 'U17', casa: 'Pesaro', ospiti: 'Scandiano A', risultato: null },
  { data: '2025-02-23', ora: '17.30', categoria: 'B', casa: 'Pesaro', ospiti: 'Mirandola', risultato: null },
  { data: '2025-03-01', ora: '17.00', categoria: 'B', casa: 'Scandianese', ospiti: 'Pesaro', risultato: null },
  { data: '2025-03-02', ora: '14.00', categoria: 'U17', casa: 'Pesaro', ospiti: 'Correggio', risultato: null },
  { data: '2025-03-09', ora: '11.00', categoria: 'U13', casa: 'Modena', ospiti: 'Pesaro', risultato: null },
  { data: '2025-03-09', ora: '15.00', categoria: 'B', casa: 'Correggio Minimotor', ospiti: 'Pesaro', risultato: null },
  { data: '2025-03-23', ora: '17.30', categoria: 'B', casa: 'Pesaro', ospiti: 'Modena', risultato: null },
  { data: '2025-03-30', ora: '11.00', categoria: 'U13', casa: 'Pesaro', ospiti: 'Correggio B', risultato: null },
  { data: '2025-03-30', ora: '17.30', categoria: 'B', casa: 'Pesaro', ospiti: 'Scandiano', risultato: null },
  { data: '2025-04-06', ora: '12.00', categoria: 'U13', casa: 'Pesaro', ospiti: 'Suzzara', risultato: null },
  { data: '2025-04-06', ora: '11.15', categoria: 'U17', casa: 'Correggio', ospiti: 'Pesaro', risultato: null },
  { data: '2025-04-06', ora: '18.00', categoria: 'B', casa: 'Correggio Italplastic', ospiti: 'Pesaro', risultato: null },
  { data: '2025-04-26', ora: '18.00', categoria: 'B', casa: 'Mirandola', ospiti: 'Pesaro', risultato: null },
  { data: '2025-05-04', ora: '12.30', categoria: 'U13', casa: 'Correggio A', ospiti: 'Pesaro', risultato: null },
  { data: '2025-05-04', ora: '17.30', categoria: 'B', casa: 'Pesaro', ospiti: 'Scandianese', risultato: null },
] as const

/**
 * LE AVVERSARIE DEL 2024/25, ricavate dal calendario e non da un elenco a
 * parte: se il calendario cambia, cambia anche questo, e non possono
 * divergere.
 */
export const AVVERSARIE = [
  ...new Set(STAGIONE_2024_25.flatMap((p) => [p.casa, p.ospiti]).filter((s) => s !== 'Pesaro')),
].sort()
