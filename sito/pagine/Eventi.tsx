/*
 * ===========================================================================
 * /eventi/ — quello che è annunciato, e quello che è soltanto previsto
 * ===========================================================================
 * Questa pagina ha un solo problema serio, e non è grafico: mescolare le due
 * cose. Il Torneo Città di Pesaro la società lo ha annunciato davvero, con
 * date, luogo e categorie. Il Memorial Perry e il Trofeo Boattini stanno nel
 * progetto triennale «Pesaro in pista» 2024-27 come eventi **da fare**: non
 * hanno una data, non hanno un programma, e scriverli accanto al primo come
 * se fossero appuntamenti fissati sarebbe inventare un calendario.
 *
 * Perciò ogni evento porta il suo stato in chiaro — «annunciato» o «previsto
 * dal progetto» — e i previsti hanno il bordo tratteggiato: la differenza si
 * vede prima di leggerla. Il sito attuale invece riempie il calendario con
 * due riquadri «Prossimo evento in arrivo», che è un modo elegante di non
 * dire niente.
 *
 * ⚠️ LE DATE NON SI INVENTANO, NEMMENO QUELLE FACILI.
 * Il torneo è annunciato per il 3, 4 e 5 luglio. L'edizione annunciata sul
 * sito è quella del 2026, che a oggi è passata: la pagina lo calcola da sé
 * confrontando la data con l'oggi del browser e cambia il testo, invece di
 * lasciare in giro un annuncio scaduto o — peggio — di spostarlo all'anno
 * dopo da solo. Che il torneo si ripeta è probabile; «probabile» non è una
 * data.
 *
 * ⚠️ IL LUOGO È DA CONFERMARE, e non per pignoleria.
 * La stessa pagina del sito attuale nomina due posti diversi per lo stesso
 * torneo: nel testo «la cornice del Palazzetto dello Sport di Pesaro», nella
 * scheda «Pista al mare Pesaro». Il CONTESTO §7 e §10 registrano la stessa
 * confusione fra Pista al mare, Palazzetto e Pala Borgo. Qui si scrive Pista
 * al mare — è la pista di Viale Trieste, comunale e scoperta, quella usata da
 * maggio a settembre, e un torneo di luglio si gioca lì. Se il committente
 * dice altro, si cambia una riga in `EVENTI` e basta.
 * ===========================================================================
 */

import { SeparatoreBastoni } from '../componenti/Scudetto.tsx'
import { link } from '../rotte.ts'

interface Evento {
  readonly nome: string
  readonly sommario: string
  /** Le date annunciate, come le scrive la società. `null` se non ce ne sono. */
  readonly quando: string | null
  /**
   * L'ultimo giorno dell'edizione annunciata, in ISO. Serve solo a capire se
   * l'annuncio è ancora valido: non è una data da mostrare.
   */
  readonly fineEdizione: string | null
  readonly dove: string
  readonly dettagli: readonly string[]
  readonly stato: 'annunciato' | 'previsto'
  readonly fonte: string
}

const EVENTI: readonly Evento[] = [
  {
    nome: 'Torneo Città di Pesaro',
    sommario:
      "Un appuntamento estivo di hockey su pista aperto a squadre giovanili e senior del panorama nazionale, organizzato dall'Amatori nella propria città.",
    quando: '3, 4 e 5 luglio',
    fineEdizione: '2026-07-05',
    dove: 'Pista al mare, Viale Trieste',
    dettagli: ['Categorie Senior, Under 19 e Under 17', 'Ingresso gratuito per il pubblico'],
    stato: 'annunciato',
    fonte: 'Sito della società, pagina Eventi',
  },
  {
    nome: 'Memorial Perry',
    sommario:
      "Un torneo che la società vuole rinnovare, con partite fra vecchie e nuove glorie dell'hockey pesarese, accompagnate da musica e street food.",
    quando: null,
    fineEdizione: null,
    dove: 'Pista Mare o Pala Borgo',
    dettagli: ['Vecchie e nuove glorie dell’hockey pesarese', 'Data non ancora fissata'],
    stato: 'previsto',
    fonte: 'Pesaro in pista 2024-27 (PDF della società)',
  },
  {
    nome: 'Trofeo Boattini',
    sommario:
      "Un torneo nuovo, nello stesso spirito del Memorial: hockey, musica e cucina di strada per riportare la città intorno alla pista. Il nome è quello di Galeazzo Boattini, uno dei dirigenti dello Skating Club degli anni d'oro.",
    quando: null,
    fineEdizione: null,
    dove: 'Pista Mare o Pala Borgo',
    dettagli: ['Vecchie e nuove glorie dell’hockey pesarese', 'Data non ancora fissata'],
    stato: 'previsto',
    fonte: 'Pesaro in pista 2024-27 (PDF della società); AHP · La Storia per Galeazzo Boattini',
  },
] as const

/** L'annuncio è ancora buono? Si guarda l'ultimo giorno dell'edizione, non
 *  si tiene a mente. Senza data, non c'è niente da scadere. */
const annuncioAncoraValido = (e: Evento, oggi: string): boolean => e.fineEdizione === null || e.fineEdizione >= oggi

export function Eventi() {
  const d = new Date()
  // Data locale, non UTC: `toISOString` la sera in Italia torna il giorno dopo.
  const oggi = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const principale = EVENTI[0]
  const previsti = EVENTI.filter((e) => e.stato === 'previsto')

  return (
    <>
      {/* ================= INTESTAZIONE ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-12 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
          <p className="occhiello text-rosso-cupo">Tornei e appuntamenti</p>
          <h1 className="titolo mt-3 text-[clamp(2.75rem,13vw,6rem)]">Gli eventi</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-nero sm:text-lg">
            Qui ci sono due cose diverse, e sono scritte diverse: un torneo che la società ha annunciato, e due che ha
            messo nel proprio progetto triennale ma non ha ancora fissato. Quando i secondi avranno una data,
            passeranno di categoria.
          </p>
        </div>
      </section>

      {/* ====== IL TORNEO — l'unica fascia scura della pagina ====== */}
      {principale && (
        <section aria-labelledby="titolo-torneo" className="su-nero bg-nero text-white">
          <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
            <p className="occhiello text-rosso-chiaro">Il torneo di casa · annunciato</p>
            <h2 id="titolo-torneo" className="titolo mt-3 max-w-3xl text-[clamp(2.25rem,10vw,4.5rem)]">
              {principale.nome}
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white">{principale.sommario}</p>

            <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-3">
              <div>
                <dt className="occhiello text-grigio-chiaro">Quando</dt>
                <dd className="titolo mt-2 text-2xl text-white sm:text-3xl">{principale.quando}</dd>
              </div>
              <div>
                <dt className="occhiello text-grigio-chiaro">Dove</dt>
                <dd className="titolo mt-2 text-2xl text-white sm:text-3xl">{principale.dove}</dd>
              </div>
              <div>
                <dt className="occhiello text-grigio-chiaro">Chi gioca</dt>
                <dd className="mt-2">
                  <ul className="space-y-1 text-[15px] leading-relaxed text-white">
                    {principale.dettagli.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            {/* Se l'edizione annunciata è passata, la pagina lo dice invece di
                lasciare in vetrina un annuncio scaduto — e non sposta la data
                all'anno dopo per conto suo. */}
            {!annuncioAncoraValido(principale, oggi) && (
              <p className="mt-10 max-w-2xl border-l-4 border-rosso-chiaro pl-4 text-[15px] leading-relaxed text-grigio-chiaro">
                L'ultima edizione annunciata dalla società è quella del luglio 2026, ed è passata. La data della
                prossima non è ancora stata comunicata: quando ci sarà, comparirà qui. Non ne mettiamo una plausibile
                al suo posto.
              </p>
            )}

            <p className="mt-6 text-[13px] leading-relaxed text-grigio-chiaro">Fonte: {principale.fonte}.</p>
          </div>
        </section>
      )}

      {/* ================= I DUE TORNEI PREVISTI ================= */}
      <section aria-labelledby="titolo-previsti" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-cupo">Nel progetto 2024-27</p>
          <h2 id="titolo-previsti" className="titolo mt-2 text-[clamp(2rem,9vw,3.5rem)]">
            Previsti, non ancora fissati
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Il progetto triennale «Pesaro in pista» prevede due tornei alla Pista Mare e al Pala Borgo, per riportare
            la città intorno alla pista. Sono intenzioni scritte dalla società, e finché restano tali il bordo di
            questi riquadri resta tratteggiato.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {previsti.map((e) => (
              <li key={e.nome} className="border-2 border-dashed border-riga p-5 sm:p-8">
                <p className="occhiello text-grigio">Previsto dal progetto</p>
                <h3 className="titolo mt-2 text-2xl text-nero sm:text-3xl">{e.nome}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-nero">{e.sommario}</p>
                <ul className="mt-4 space-y-1.5">
                  {e.dettagli.map((x) => (
                    <li key={x} className="border-l-2 border-riga pl-3 text-[14px] leading-snug text-grigio">
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] leading-relaxed text-grigio">Fonte: {e.fonte}.</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= LE PARTITE ================= */}
      <section aria-labelledby="titolo-partite" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 sm:pb-24">
          <SeparatoreBastoni className="mb-10" />
          <h2 id="titolo-partite" className="titolo text-[clamp(1.75rem,7vw,2.75rem)]">
            E le partite?
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-nero">
            Calendario e risultati — Coppa Italia, campionato di Serie B e le stagioni passate — stanno nelle notizie,
            in un tabellone solo che si aggiorna con la federazione.
          </p>
          <p className="mt-6">
            <a href={link('/notizie/')} className="bottone bottone-vuoto">
              Calendario e risultati
            </a>
          </p>
        </div>
      </section>
    </>
  )
}

export default Eventi
