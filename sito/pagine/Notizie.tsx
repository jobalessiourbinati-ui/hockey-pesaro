/*
 * ===========================================================================
 * /notizie/ — il carosello delle notizie, e il tabellone delle partite
 * ===========================================================================
 * «caroselli intendo tipo sezione news con un carosello di notizie con quelle
 * più nuove»: la fascia in cima è quella, ed è la stessa che sta in home
 * (`componenti/FasciaNotizie.tsx`). Una sola, perché scritta due volte prima o
 * poi direbbe due cose diverse.
 *
 * ⚠️ IL CAROSELLO NON PUÒ ESSERE VUOTO — e oggi le notizie non ci sono.
 * Il committente ha chiesto che compaiano da sole quando la società pubblica
 * su Facebook e Instagram. Quella parte non è codice, è una pratica: serve
 * l'API di Meta con l'account della società e la revisione dell'app
 * (CONTESTO §4). Finché non è aperta, `dati/notizie.json` resta vuoto. La
 * fascia allora mostra i prossimi appuntamenti e gli ultimi risultati veri —
 * cose che un tifoso cerca uguale — invece di tre riquadri finti come fa il
 * sito di oggi.
 *
 * ⚠️ I RISULTATI NON SI COMPLETANO A MEMORIA. Il tabellone mostra quello che
 * c'è nelle fonti e lascia vuoto il resto.
 *
 * PERCHÉ IL CALENDARIO 2024/25 NON SI VEDE TUTTO SUBITO. Sono quarantadue
 * partite: sul telefono, dove ogni riga diventa una scheda, erano quasi
 * quattromila pixel — metà dell'altezza di questa pagina. Ne restano otto, e
 * un bottone apre le altre dicendo quante sono. Niente è nascosto: è ordinato.
 * ===========================================================================
 */

import { ARCHIVIO, ETICHETTA_FONTE, indirizzoImmagine, titoloBreve } from '../../dati/notizie.ts'
import { STAGIONE_2024_25 } from '../../dati/stagione-2024-25.ts'
import { CAMPIONATO_2026_27_USCITO, COPPA_ITALIA_2026_27, GIRONE_CAMPIONATO, GIRONE_COPPA } from '../../dati/stagione-2026-27.ts'
import { FasciaNotizie } from '../componenti/FasciaNotizie.tsx'
import { indirizzoMedia } from '../componenti/Foto.tsx'
import { SeparatoreBastoni } from '../componenti/Scudetto.tsx'
import { Tabellone } from '../componenti/Tabellone.tsx'
import { inItaliano } from '../date.ts'

const SOCIAL = [
  { nome: 'Facebook', url: 'https://www.facebook.com/amatorihockeypesaro' },
  { nome: 'Instagram', url: 'https://www.instagram.com/amatori_hockey_pesaro_asd' },
] as const

/** Quante notizie stanno nel carosello prima di passare all'archivio sotto. */
const NEL_CAROSELLO = 8

export function Notizie() {
  const { aggiornato, voci } = ARCHIVIO
  const archivio = voci.slice(NEL_CAROSELLO)

  return (
    <>
      {/* ================= INTESTAZIONE + CAROSELLO ================= */}
      <section aria-labelledby="titolo-pagina" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
          <p className="occhiello text-rosso-cupo">Dalla società</p>
          <h1 id="titolo-pagina" className="titolo mt-2 text-[clamp(2.75rem,13vw,6rem)]">
            Notizie e risultati
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-snug text-nero sm:text-lg">
            {voci.length > 0
              ? 'Quello che la società pubblica sui suoi canali, e il tabellone delle partite.'
              : 'Il collegamento automatico con Facebook e Instagram non è ancora attivo: qui intanto ci sono le partite, che invece ci sono.'}
          </p>

          <div className="mt-8">
            <FasciaNotizie />
          </div>

          <p className="mt-6 text-[13px] text-grigio">
            {aggiornato !== null ? (
              <>
                Notizie aggiornate il <time dateTime={aggiornato.slice(0, 10)}>{inItaliano(aggiornato)}</time>.
              </>
            ) : (
              'Nessuna notizia importata: preferiamo lasciare la fascia alle partite vere piuttosto che riempirla di comunicati scritti per l’occasione.'
            )}
          </p>
        </div>
      </section>

      {/* ============ L'ARCHIVIO — solo se ci sono più notizie ============ */}
      {archivio.length > 0 && (
        <section aria-labelledby="titolo-archivio" className="bg-white">
          <div className="mx-auto max-w-[1240px] px-4 pb-12 sm:px-6 sm:pb-16">
            <h2 id="titolo-archivio" className="titolo text-[clamp(1.5rem,6vw,2.25rem)]">
              Prima ancora
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {archivio.map((v) => (
                <li key={v.id} className="flex flex-col border border-riga">
                  {v.immagine !== undefined && (
                    /* Il testo della notizia dice già tutto: l'immagine è
                       decorativa e non si inventa una didascalia che nessuno
                       ha scritto. */
                    <img
                      src={indirizzoMedia(indirizzoImmagine(v.immagine))}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full bg-panna object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="occhiello text-rosso-cupo">
                      <time dateTime={v.data.slice(0, 10)}>{inItaliano(v.data)}</time> · {ETICHETTA_FONTE[v.fonte]}
                    </p>
                    <h3 className="titolo mt-2 text-2xl text-nero">
                      <a href={v.link} target="_blank" rel="noreferrer" className="hover:text-rosso-cupo">
                        {titoloBreve(v.testo)}
                      </a>
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ====== I SOCIAL — l'unica fascia scura della pagina ====== */}
      <section aria-labelledby="titolo-social" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
          <p className="occhiello text-rosso-chiaro">Dove si racconta tutto</p>
          <h2 id="titolo-social" className="titolo mt-1 max-w-2xl text-[clamp(1.9rem,8vw,3rem)]">
            Le pagine della società
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {SOCIAL.map((s) => (
              <li key={s.nome}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bottone border-white bg-white text-nero hover:bg-rosso-cupo hover:text-white"
                >
                  {s.nome}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= IL TABELLONE ================= */}
      <section aria-labelledby="titolo-risultati" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-cupo">Il tabellone</p>
          <h2 id="titolo-risultati" className="titolo mt-1 text-[clamp(2rem,9vw,3.5rem)]">
            Calendario e risultati
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Le partite senza risultato restano senza: nessun punteggio viene completato a memoria.
          </p>

          {/* --- Coppa Italia 2026/27 --- */}
          <h3 className="titolo mt-8 text-2xl text-nero sm:text-3xl">Coppa Italia 2026/27</h3>
          <p className="mt-2 text-[15px] text-grigio">
            {GIRONE_COPPA.nome}: {GIRONE_COPPA.squadre.join(', ')}.
          </p>
          <div className="mt-4">
            <Tabellone
              partite={COPPA_ITALIA_2026_27}
              fonte="calendario della Coppa Italia di Serie B 2026/27, hockeyitalia21.com, 05/08/2026"
            />
          </div>

          {/* --- il campionato --- */}
          <p className="mt-6 max-w-2xl border-l-4 border-rosso pl-4 text-[15px] leading-relaxed text-grigio">
            {CAMPIONATO_2026_27_USCITO
              ? `Campionato di Serie B 2026/27: Amatori Pesaro è nel ${GIRONE_CAMPIONATO}, dieci giornate dal 10 gennaio 2027.`
              : 'Il girone di campionato 2026/27 non è ancora stato sorteggiato: quando la federazione lo pubblicherà, comparirà qui.'}
          </p>

          <SeparatoreBastoni className="my-10" />

          {/* --- la stagione 2024/25 --- */}
          <h3 className="titolo text-2xl text-nero sm:text-3xl">Stagione 2024/25</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Prima squadra e giovanili insieme, da un documento della società compilato il 27 novembre 2024: le partite
            giocate dopo quella data non avevano ancora un risultato, e qui restano senza.
          </p>
          <div className="mt-4">
            <Tabellone
              partite={STAGIONE_2024_25}
              filtri
              quanteSubito={8}
              fonte="calendario partite 2024/25 della società (documento interno, 27/11/2024)"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Notizie
