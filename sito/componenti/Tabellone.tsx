/*
 * ===========================================================================
 * TABELLONE — le partite, senza inventare i risultati che non abbiamo
 * ===========================================================================
 * Due problemi veri, non di stile.
 *
 * 1) A 390 px una tabella a cinque colonne non ci sta. La soluzione qui è
 *    UNA sola tabella nel DOM: sotto i 640 px ogni riga si dispone come una
 *    scheda (griglia), sopra torna una tabella vera. Niente doppia copia del
 *    testo, niente `overflow-x` che porta con sé la pagina intera: scorre il
 *    contenitore, mai il documento. Le intestazioni di colonna spariscono
 *    sul telefono, e allora ogni cella si porta dietro la propria etichetta
 *    scritta nel DOM — non generata dal CSS, che con `content:` non è testo
 *    per nessuno.
 *
 * 2) Il calendario 2024/25 arriva da un PDF compilato il 27/11/2024: le
 *    partite successive non avevano ancora un risultato. Un risultato
 *    mancante NON si completa a memoria (CONTESTO §9.1) — lo leggerebbero le
 *    persone che quella partita l'hanno giocata. Ma «mancante» ha due
 *    significati diversi, e il tabellone li distingue da sé confrontando la
 *    data con oggi: una partita futura è **da giocare**, una passata senza
 *    punteggio è un dato che **non abbiamo**. Sono due cose diverse e vanno
 *    dette diverse.
 * ===========================================================================
 */

import { useMemo, useState } from 'react'
import type { Categoria, Partita } from '../../dati/stagione-2024-25.ts'
import { inCasa } from '../../dati/stagione-2024-25.ts'

/** Come si scrive una categoria in pagina: le sigle del calendario federale
 *  sono chiare a chi gioca, non a chi apre il sito per la prima volta. */
const ETICHETTA_CATEGORIA: Record<Categoria, string> = {
  B: 'Serie B',
  'B Coppa': 'Coppa Italia',
  U13: 'Under 13',
  U17: 'Under 17',
}

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'] as const

/** Giorno e mese da una data ISO, senza `toLocaleDateString`: il fuso orario
 *  del browser può spostare la data di un giorno, e su un calendario di
 *  partite spostare un giorno vuol dire sbagliare la partita. */
function giornoMese(iso: string): { readonly giorno: string; readonly mese: string } {
  const [, m = '01', g = '01'] = iso.split('-')
  return { giorno: g, mese: MESI[Number(m) - 1] ?? '' }
}

type Esito = 'vittoria' | 'pareggio' | 'sconfitta'

/** L'esito dal punto di vista di Pesaro, calcolato: mai scritto a mano. */
function esitoDi(p: Partita): Esito | null {
  if (p.risultato === null) return null
  const [casa, fuori] = p.risultato
  const nostri = inCasa(p) ? casa : fuori
  const loro = inCasa(p) ? fuori : casa
  if (nostri > loro) return 'vittoria'
  if (nostri < loro) return 'sconfitta'
  return 'pareggio'
}

export interface ProprietaTabellone {
  readonly partite: readonly Partita[]
  /** La didascalia sotto la tabella: qui ci va la fonte, sempre (§9.5). */
  readonly fonte: string
  /** I filtri per categoria: servono quando le partite sono più di una decina. */
  readonly filtri?: boolean
  /**
   * QUANTE SE NE VEDONO SUBITO.
   * Il calendario 2024/25 ha quarantadue partite: sul telefono, dove ogni
   * riga diventa una scheda, sono quasi quattromila pixel di scorrimento per
   * arrivare in fondo alla pagina — ed era metà dell'altezza di /notizie/.
   * Con questa proprietà se ne vedono le prime, e le altre si aprono con un
   * bottone. Nessuna sparisce e niente è nascosto: il bottone dice quante ce
   * ne sono, e chi le vuole tutte fa un colpo solo.
   * Senza la proprietà si vedono tutte, che è il comportamento di prima.
   */
  readonly quanteSubito?: number
  /**
   * Il giorno rispetto al quale una partita è «da giocare». Si passa dal di
   * fuori così i controlli e gli scatti di prova sono ripetibili.
   */
  readonly oggi?: Date
}

export function Tabellone({ partite, fonte, filtri = false, quanteSubito, oggi }: ProprietaTabellone) {
  const [tutte, setTutte] = useState(false)
  const isoOggi = useMemo(() => {
    const d = oggi ?? new Date()
    // Data locale, non UTC: `toISOString` di sera in Italia torna il giorno dopo.
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [oggi])

  // Le categorie presenti si ricavano dalle partite: se il calendario cambia,
  // cambiano i filtri, e non possono divergere da quello che c'è in tabella.
  const categorie = useMemo(
    () => [...new Set(partite.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b)),
    [partite],
  )

  const [scelta, setScelta] = useState<Categoria | 'tutte'>('tutte')
  const scelte = scelta === 'tutte' ? partite : partite.filter((p) => p.categoria === scelta)

  /* Il taglio si applica dopo il filtro: chi sceglie «Under 13» vede le prime
   * Under 13, non le prime otto di tutte fra cui zero Under 13. */
  const limite = quanteSubito ?? scelte.length
  const tagliato = !tutte && scelte.length > limite
  const visibili = tagliato ? scelte.slice(0, limite) : scelte

  const mostraFiltri = filtri && categorie.length > 1

  return (
    <div>
      {mostraFiltri && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtra le partite per categoria">
          {(['tutte', ...categorie] as const).map((c) => {
            const attivo = scelta === c
            return (
              <button
                key={c}
                type="button"
                aria-pressed={attivo}
                onClick={() => setScelta(c)}
                className={[
                  // Il contorno del fuoco lo disegna `tema.css` su
                  // :focus-visible per ogni bottone del sito: qui non si
                  // ripete, così resta una regola sola da cambiare.
                  'min-h-11 border px-3 py-1.5 text-xs tracking-[0.1em] uppercase',
                  attivo
                    ? 'border-rosso-cupo bg-rosso-cupo text-white'
                    : 'border-riga text-grigio motion-safe:transition-colors hover:border-nero hover:text-nero',
                ].join(' ')}
              >
                {c === 'tutte' ? `tutte (${partite.length})` : ETICHETTA_CATEGORIA[c]}
              </button>
            )
          })}
        </div>
      )}

      {/* Il contenitore scorre solo lui, e solo se serve: la pagina non si
          muove mai di lato, a nessuna delle tre larghezze provate. */}
      <div className="overflow-x-auto">
        <table className="block w-full border-collapse text-left sm:table">
          {/* La didascalia sta nel `<caption>` per chi legge con uno screen
              reader, e ricompare sotto la tabella per chi legge con gli occhi:
              con `display:block` sul telefono il `caption-side` non è
              affidabile, e la fonte non può finire in un posto a caso. */}
          <caption className="sr-only">
            {visibili.length} {visibili.length === 1 ? 'partita' : 'partite'} · {fonte}
          </caption>

          {/* Sul telefono l'intestazione sparisce e ogni cella si porta la
              propria etichetta: vedi la nota in testa al file. */}
          <thead className="hidden sm:table-header-group">
            <tr className="border-b-2 border-nero">
              {['Data', 'Categoria', 'Incontro', 'Ora', 'Risultato'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="py-2 pr-4 text-xs font-normal tracking-[0.12em] text-grigio uppercase last:pr-0 last:text-right"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="block sm:table-row-group">
            {visibili.map((p) => {
              const { giorno, mese } = giornoMese(p.data)
              const esito = esitoDi(p)
              const daGiocare = p.risultato === null && p.data >= isoOggi

              return (
                <tr
                  key={`${p.data}-${p.ora}-${p.casa}-${p.ospiti}`}
                  className="mb-2 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 gap-y-1 border border-riga p-3 sm:mb-0 sm:table-row sm:border-0 sm:border-b sm:p-0"
                >
                  {/* DATA */}
                  <td className="col-start-1 row-start-1 sm:table-cell sm:py-3 sm:pr-4 sm:align-middle">
                    <time
                      dateTime={p.data}
                      className="cifra text-sm whitespace-nowrap tracking-[0.06em] text-nero"
                    >
                      {giorno} {mese} <span className="text-grigio">{p.data.slice(0, 4)}</span>
                    </time>
                  </td>

                  {/* CATEGORIA — e insieme il «dove». Il casa/trasferta stava
                      in fondo al nome dell'incontro e a 390 px si spezzava a
                      metà («… in / casa»): qui sta su una riga sua, sopra, e
                      non ha più niente da spezzare. */}
                  <td className="col-start-2 row-start-1 sm:table-cell sm:py-3 sm:pr-4 sm:align-middle">
                    <span className="block text-[0.6875rem] tracking-[0.1em] text-grigio uppercase">
                      {ETICHETTA_CATEGORIA[p.categoria]}
                    </span>
                    <span className="block text-[0.625rem] tracking-[0.08em] whitespace-nowrap text-grigio uppercase">
                      {inCasa(p) ? 'in casa' : 'in trasferta'}
                    </span>
                  </td>

                  {/* INCONTRO — su due colonne nella scheda, una nella tabella */}
                  <td className="col-span-2 col-start-1 row-start-2 min-w-0 sm:table-cell sm:py-3 sm:pr-4 sm:align-middle">
                    <span className="sr-only">Incontro: </span>
                    <span className="text-base leading-snug text-nero sm:text-[0.9375rem]">
                      <span className={inCasa(p) ? 'font-semibold' : ''}>{p.casa}</span>
                      <span className="px-1.5 text-grigio">–</span>
                      <span className={inCasa(p) ? '' : 'font-semibold'}>{p.ospiti}</span>
                    </span>
                  </td>

                  {/* ORA */}
                  <td className="col-start-3 row-start-1 text-right sm:table-cell sm:py-3 sm:pr-4 sm:text-left sm:align-middle">
                    <span className="sr-only">Ora: </span>
                    <span className="text-sm text-grigio tabular-nums">{p.ora}</span>
                  </td>

                  {/* RISULTATO — o il motivo per cui non c'è */}
                  <td className="col-start-3 row-start-2 text-right sm:table-cell sm:py-3 sm:text-right sm:align-middle">
                    {p.risultato !== null ? (
                      <span className="inline-flex items-baseline gap-2">
                        <span
                          className={[
                            'cifra text-xl',
                            esito === 'vittoria'
                              ? 'text-rosso-cupo'
                              : 'text-nero',
                          ].join(' ')}
                        >
                          {p.risultato[0]}–{p.risultato[1]}
                        </span>
                        {/* L'esito a parole, per chi non vede il colore: il
                            colore non è mai l'unico portatore del significato. */}
                        <span className="text-[0.625rem] tracking-[0.1em] text-grigio uppercase">
                          {esito === 'vittoria' ? 'vinta' : esito === 'pareggio' ? 'pari' : 'persa'}
                        </span>
                      </span>
                    ) : (
                      /* «Non disponibile» per esteso occupava due righe in una
                         colonna stretta: la parola «risultato» resta nel DOM
                         per chi legge con uno screen reader, e sparisce dalla
                         colonna per chi legge con gli occhi — che la parola
                         «Risultato» ce l'ha già scritta in cima. */
                      <span className="text-[0.6875rem] tracking-[0.08em] whitespace-nowrap text-grigio uppercase">
                        <span className="sr-only">risultato </span>
                        {daGiocare ? 'da giocare' : 'non disponibile'}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {visibili.length === 0 && (
        <p className="border border-dashed border-riga p-6 text-center text-sm text-grigio">
          Nessuna partita in questa categoria.
        </p>
      )}

      {/* Il bottone dice quante ne restano: «mostra tutte» senza un numero
          non fa capire se ne restano tre o trentaquattro. */}
      {tagliato && (
        <p className="pt-4">
          <button type="button" onClick={() => setTutte(true)} className="bottone bottone-vuoto">
            Mostra tutte le {scelte.length} partite
          </button>
        </p>
      )}

      <p aria-hidden="true" className="pt-4 text-xs leading-relaxed text-grigio">
        {visibili.length}
        {tagliato ? ` di ${scelte.length}` : ''} {scelte.length === 1 ? 'partita' : 'partite'} · {fonte}
      </p>
    </div>
  )
}

export default Tabellone
