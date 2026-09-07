/*
 * ===========================================================================
 * /notizie/ — le notizie dai social, e il tabellone delle partite
 * ===========================================================================
 * Il committente ha chiesto che le notizie compaiano da sole quando vengono
 * pubblicate su Facebook e Instagram. La parte automatica non è codice, è una
 * pratica: serve l'API di Meta con l'account della società, un'app su
 * developers.facebook.com e la revisione da parte di Meta (CONTESTO §4).
 * Finché quella pratica non è aperta, `dati/notizie.json` resta vuoto — e
 * questa pagina deve reggere quel vuoto senza mentire e senza sembrare rotta.
 *
 * COME LEGGE IL FILE, E PERCHÉ COSÌ.
 * `dati/notizie.json` lo scrive un programma, non una persona: può essere
 * vuoto, può avere una voce senza `link`, può cambiare forma il giorno in cui
 * qualcuno tocca lo script. Perciò l'importazione è tipizzata a mano e
 * ogni voce passa da un controllo prima di finire in pagina. Una voce
 * malfatta viene scartata in silenzio; l'alternativa è una pagina bianca a
 * chi apre il sito dal telefono, che è molto peggio di una notizia in meno.
 *
 * ⚠️ MAI UNA NOTIZIA FINTA, MAI UNA PAGINA VUOTA. Sono due regole insieme, e
 * il modo di rispettarle entrambe è dire come stanno le cose e mandare la
 * persona dove il contenuto c'è davvero: le due pagine social della società.
 *
 * ⚠️ I RISULTATI NON SI COMPLETANO A MEMORIA. Il tabellone mostra quello che
 * c'è nelle fonti e lascia vuoto il resto: vedi la nota in testa a
 * `componenti/Tabellone.tsx`.
 * ===========================================================================
 */

import archivioGrezzo from '../../dati/notizie.json'
import { STAGIONE_2024_25 } from '../../dati/stagione-2024-25.ts'
import {
  CAMPIONATO_2026_27_USCITO,
  COPPA_ITALIA_2026_27,
  GIRONE_CAMPIONATO,
  GIRONE_COPPA,
} from '../../dati/stagione-2026-27.ts'
import { SeparatoreBastoni } from '../componenti/Scudetto.tsx'
import { Tabellone } from '../componenti/Tabellone.tsx'

/* ---------------------------------------------------------------------------
 * LA FORMA DEL FILE, dichiarata qui e non dedotta da com'è oggi.
 * Oggi `notizie.json` è vuoto: se lasciassi dedurre i tipi a TypeScript,
 * `voci` sarebbe `never[]` e `aggiornato` sarebbe `null`, e la pagina
 * smetterebbe di compilare il giorno in cui il file si riempie. Il contratto
 * è questo, e vale sia da vuoto sia da pieno.
 * ------------------------------------------------------------------------- */

type FonteNotizia = 'facebook' | 'instagram' | 'fisr'

interface Voce {
  readonly id: string
  readonly fonte: FonteNotizia
  readonly data: string
  readonly testo: string
  readonly immagine?: string
  readonly link: string
}

interface Archivio {
  readonly aggiornato: string | null
  readonly voci: readonly Voce[]
}

const FONTI_VALIDE: ReadonlySet<string> = new Set(['facebook', 'instagram', 'fisr'])

const eStringaPiena = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0

/** Una voce entra in pagina solo se ha tutto quello che serve a mostrarla. */
function eVoce(x: unknown): x is Voce {
  if (typeof x !== 'object' || x === null) return false
  const v = x as Record<string, unknown>
  return (
    eStringaPiena(v['id']) &&
    eStringaPiena(v['fonte']) &&
    FONTI_VALIDE.has(v['fonte']) &&
    eStringaPiena(v['data']) &&
    eStringaPiena(v['testo']) &&
    eStringaPiena(v['link'])
  )
}

/** Legge il file com'è, non come vorremmo che fosse. */
function leggiArchivio(grezzo: unknown): Archivio {
  if (typeof grezzo !== 'object' || grezzo === null) return { aggiornato: null, voci: [] }
  const a = grezzo as Record<string, unknown>
  const voci = Array.isArray(a['voci']) ? a['voci'].filter(eVoce) : []
  // Le più recenti in cima: l'ordine del file non è una garanzia.
  return {
    aggiornato: eStringaPiena(a['aggiornato']) ? a['aggiornato'] : null,
    voci: [...voci].sort((x, y) => y.data.localeCompare(x.data)),
  }
}

const ARCHIVIO = leggiArchivio(archivioGrezzo)

const SOCIAL = [
  { nome: 'Facebook', url: 'https://www.facebook.com/amatorihockeypesaro' },
  { nome: 'Instagram', url: 'https://www.instagram.com/amatori_hockey_pesaro_asd' },
] as const

const ETICHETTA_FONTE: Record<FonteNotizia, string> = {
  facebook: 'da Facebook',
  instagram: 'da Instagram',
  fisr: 'dalla federazione',
}

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

/** «7 settembre 2026» da una data ISO, tagliando a mano invece di passare da
 *  `toLocaleDateString`: il fuso orario del browser può spostare il giorno. */
function dataInItaliano(iso: string): string {
  const [a, m, g] = iso.slice(0, 10).split('-')
  const mese = MESI[Number(m) - 1]
  if (a === undefined || mese === undefined || g === undefined) return iso
  return `${Number(g)} ${mese} ${a}`
}

/** L'immagine può arrivare come percorso assoluto, come indirizzo intero o
 *  come semplice nome di file: nell'ultimo caso sta dove la mette lo script. */
function indirizzoImmagine(x: string): string {
  return x.startsWith('http') || x.startsWith('/') ? x : `/media/notizie/${x}`
}

export function Notizie() {
  const { aggiornato, voci } = ARCHIVIO

  return (
    <>
      {/* ================= INTESTAZIONE ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-12 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
          <p className="occhiello text-rosso-cupo">Dalla società</p>
          <h1 className="titolo mt-3 text-[clamp(2.75rem,13vw,6rem)]">Notizie e risultati</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-nero sm:text-lg">
            Quello che la società pubblica sui suoi canali, e il tabellone delle partite. Le partite senza risultato
            restano senza: nessun punteggio viene completato a memoria.
          </p>
          <p className="mt-4 text-[13px] text-grigio">
            {aggiornato !== null ? (
              <>
                Notizie aggiornate il{' '}
                <time dateTime={aggiornato.slice(0, 10)}>{dataInItaliano(aggiornato)}</time>.
              </>
            ) : (
              'Le notizie dai social non sono ancora state importate.'
            )}
          </p>
        </div>
      </section>

      {/* ================= LE NOTIZIE, O LA LORO ASSENZA ================= */}
      <section aria-labelledby="titolo-notizie" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pb-12 sm:px-6 sm:pb-16">
          <h2 id="titolo-notizie" className="sr-only">
            Le notizie della società
          </h2>

          {voci.length === 0 ? (
            /* Lo stato vuoto detto per intero: cosa manca, perché, e dove
               andare nel frattempo. Un riquadro tratteggiato invece di un
               segnaposto che finge di essere una notizia. */
            <div className="max-w-3xl border-2 border-dashed border-riga p-6 sm:p-10">
              <p className="occhiello text-rosso-cupo">Ancora niente, qui</p>
              <p className="mt-3 text-[17px] leading-relaxed text-nero">
                Su questa pagina non c'è ancora nessuna notizia: il collegamento automatico con Facebook e Instagram
                non è ancora attivo, e finché non lo è preferiamo lasciarla vuota piuttosto che riempirla di
                comunicati scritti per l'occasione.
              </p>
              <p className="mt-4 text-[17px] leading-relaxed text-nero">
                La società intanto racconta tutto sulle sue due pagine, e lì il materiale c'è.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {voci.map((v) => (
                <li key={v.id} className="flex flex-col border border-riga">
                  {v.immagine !== undefined && (
                    /* Il testo della notizia è subito sotto e dice già tutto:
                       l'immagine è decorativa e non si inventa una didascalia
                       che nessuno ha scritto. */
                    <img
                      src={indirizzoImmagine(v.immagine)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full bg-panna object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <p className="occhiello text-rosso-cupo">
                      <time dateTime={v.data.slice(0, 10)}>{dataInItaliano(v.data)}</time> · {ETICHETTA_FONTE[v.fonte]}
                    </p>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed whitespace-pre-line text-nero">{v.testo}</p>
                    <p className="mt-4">
                      <a
                        href={v.link}
                        target="_blank"
                        rel="noreferrer"
                        className="titolo text-lg text-rosso-cupo underline underline-offset-4"
                      >
                        Apri il post originale
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ====== I SOCIAL — l'unica fascia scura della pagina ====== */}
      <section aria-labelledby="titolo-social" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-chiaro">Dove si racconta tutto</p>
          <h2 id="titolo-social" className="titolo mt-2 max-w-2xl text-[clamp(1.9rem,8vw,3rem)]">
            Le pagine della società
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
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

      {/* ================= I RISULTATI ================= */}
      <section aria-labelledby="titolo-risultati" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-cupo">Il tabellone</p>
          <h2 id="titolo-risultati" className="titolo mt-2 text-[clamp(2rem,9vw,3.5rem)]">
            Calendario e risultati
          </h2>

          {/* --- Coppa Italia 2026/27 --- */}
          <h3 className="titolo mt-10 text-2xl text-nero sm:text-3xl">Coppa Italia 2026/27</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-grigio">
            {GIRONE_COPPA.nome}, tre squadre e ritorno: {GIRONE_COPPA.squadre.join(', ')}. Il campionato comincia
            dopo.
          </p>
          <div className="mt-5">
            <Tabellone
              partite={COPPA_ITALIA_2026_27}
              fonte="calendario della Coppa Italia di Serie B 2026/27, hockeyitalia21.com, 05/08/2026"
            />
          </div>

          {/* --- il campionato --- */}
          <p className="mt-8 max-w-2xl border-l-4 border-rosso pl-4 text-[15px] leading-relaxed text-grigio">
            {CAMPIONATO_2026_27_USCITO
              ? `Il campionato di Serie B 2026/27 è stato sorteggiato: Amatori Pesaro è nel ${GIRONE_CAMPIONATO}, dieci giornate a partire dal 10 gennaio 2027.`
              : 'Il girone di campionato 2026/27 non è ancora stato sorteggiato: quando la federazione lo pubblicherà, comparirà qui.'}
          </p>

          <SeparatoreBastoni className="my-12" />

          {/* --- la stagione 2024/25 --- */}
          <h3 className="titolo text-2xl text-nero sm:text-3xl">Stagione 2024/25</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Il calendario completo della società, prima squadra e giovanili insieme. Arriva da un documento compilato
            il 27 novembre 2024: le partite giocate dopo quella data non avevano ancora un risultato, e qui restano
            senza finché non arriva una fonte.
          </p>
          <div className="mt-5">
            <Tabellone
              partite={STAGIONE_2024_25}
              filtri
              fonte="calendario partite 2024/25 della società (documento interno, 27/11/2024)"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Notizie
