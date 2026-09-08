/*
 * ===========================================================================
 * /storia/ — la pagina che il committente ha indicato
 * ===========================================================================
 * «guarda la pagina 3»: era questa. Era alta 6118 px su un telefono — nove
 * voci di cronologia, ognuna un paragrafo denso, una dopo l'altra. Si leggeva
 * come un documento, non come il sito di una squadra.
 *
 * COSA È CAMBIATO, E PERCHÉ.
 * · Ogni tappa è un anno gigante, un titolo di tre parole e due righe. Il
 *   resto è tagliato, non nascosto: il PDF della società resta linkato in
 *   fondo per chi vuole tutto.
 * · La cronologia scorre di lato invece che in giù: una tappa per schermata,
 *   si sfoglia col pollice. Nove paragrafi in colonna erano seimila pixel;
 *   nove schede in fila sono un gesto.
 * · I due momenti che contano — il 1946 e la finale del 2020/21 — escono
 *   dalla fila e prendono una fotografia a tutta larghezza. Il ritmo della
 *   pagina è quello: origine, fila, apice, fila, oggi.
 * · Le fonti stanno tutte in fondo, in un blocco solo. Ripeterle sotto ognuna
 *   delle nove voci era un terzo del testo della pagina.
 *
 * ⚠️ LE FOTOGRAFIE SONO DI OGGI, E LA PAGINA LO DICE.
 * Dello Skating Club del 1946 e della finale del 2020/21 non abbiamo nessuna
 * immagine: le tre fotografie che la società ci ha dato sono partite recenti
 * della prima squadra. Metterle sotto la parola «1946» senza dirlo sarebbe
 * lasciar credere a chi guarda di vedere una cosa che non è. Quindi si usano
 * — perché una pagina di sola scrittura non la legge nessuno — e sotto ognuna
 * c'è scritto di cosa sono. È la stessa regola dei numeri: la si dice, non la
 * si aggira.
 *
 * ⚠️ QUELLO CHE IL PDF NON DICE, QUI NON C'È.
 * Il PDF racconta «le difficoltà economiche che portarono alla chiusura
 * temporanea della società» ma non scrive l'anno, e nessun'altra fonte del
 * rilievo lo scrive. Quella tappa ha un punto interrogativo al posto della
 * data: mettere lì un anno plausibile sarebbe l'errore più facile della
 * pagina, e il più difficile da scoprire per chi legge.
 * Per lo stesso motivo non si usa la tabella dei piazzamenti a pagina 5 del
 * PDF: è un grafico, e il testo estratto ne restituisce le etichette
 * mescolate. Ricostruire da lì vorrebbe dire indovinare un palmarès.
 * ===========================================================================
 */

import { FONTE_FEDERALE, STAGIONE_ROSA } from '../../dati/rosa.ts'
import { GIRONE_CAMPIONATO } from '../../dati/stagione-2026-27.ts'
import { Carosello } from '../componenti/Carosello.tsx'
import { Foto, Velatura } from '../componenti/Foto.tsx'
import type { NomeFoto } from '../../dati/foto.ts'
import { BastoniIncrociati } from '../componenti/Scudetto.tsx'

interface Tappa {
  /** L'anno come si legge in pagina. `null` quando la fonte non lo dice. */
  readonly anno: string | null
  readonly titolo: string
  /** Due righe. Non tre. */
  readonly testo: string
}

/* Le origini: dallo Skating Club maturo al ritorno in campo dell'Amatori. */
const ORIGINI: readonly Tappa[] = [
  {
    anno: 'Gli anni d’oro',
    titolo: 'La pista di Boiani',
    testo:
      'Presidente storico Corrado Amori. Enzo Boiani produce pattini usati a livello internazionale e costruisce la pista di Viale Trieste.',
  },
  {
    anno: null,
    titolo: 'Lo Skating Club chiude',
    testo:
      'Le difficoltà economiche fermano la società. In che anno non lo sappiamo: il documento della società non lo scrive.',
  },
  {
    anno: '2016',
    titolo: 'Rinasce come Amatori',
    testo: "Sulle ceneri dello Skating Club nasce l'Amatori Hockey Pesaro, con il presidente Edgar Vincent Barberi.",
  },
  {
    anno: 'I primi campionati',
    titolo: 'Si gioca al sud',
    testo: 'Girone meridionale: Molfetta, Giovinazzo, Salerno, Matera. Poi il passaggio a Emilia-Romagna e Marche.',
  },
]

/* Gli ultimi anni: quelli che si possono controllare sul portale federale. */
const RECENTI: readonly Tappa[] = [
  {
    anno: '2023/24',
    titolo: 'Spazio ai pesaresi',
    testo:
      "Urbinati, Roberti e Ridolfi in prima squadra. L'Under 11 arriva alle prime finali nazionali della storia del club.",
  },
  {
    anno: STAGIONE_ROSA,
    titolo: 'La squadra di oggi',
    testo:
      'La prima squadra la allena Edgar Barberi, che la società l’ha fondata. Il vivaio, dall’Under 11 all’Under 19, lo segue Jason Jamerson, che gioca anche in prima squadra.',
  },
]

/* Le fonti, tutte insieme e una volta sola: erano ripetute sotto ognuna delle
 * nove tappe, ed erano un terzo del testo della pagina. */
const FONTI = [
  { nome: 'AHP · La Storia', dettaglio: 'Documento della società, dieci pagine, 1946-2024.' },
  { nome: 'Portale dei risultati FISR', dettaglio: 'Rose, staff, gironi. Codice di affiliazione 3947.' },
  { nome: 'Registro CONI', dettaglio: 'Legale rappresentante: Edgar Vincent Barberi.' },
  { nome: 'Il Resto del Carlino', dettaglio: 'Cronache del 04/01/2025 e del 07/03/2025.' },
] as const

export function Storia() {
  return (
    <>
      {/* ================= INTESTAZIONE ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-9 pb-6 sm:px-6 sm:pt-14 sm:pb-8">
          <p className="occhiello text-rosso-cupo">Dal 1946 a oggi</p>
          <h1 className="titolo mt-2 text-[clamp(2.75rem,13vw,6rem)]">La nostra storia</h1>
          <p className="mt-4 max-w-xl text-[17px] leading-snug text-nero sm:text-lg">
            Ottant'anni di hockey su pista a Pesaro: un club fra i più frequentati della città, poi il vuoto, poi
            ricostruito da capo.
          </p>
        </div>
      </section>

      {/* ================= 1946 — il primo dei due momenti ================= */}
      <FasciaTappa
        foto="azione-1"
        anno="1946"
        titolo="Nasce lo Skating Club"
        testo="Nell'Italia che si rialza dalla guerra, lo Skating Club Pesaro diventa uno dei pilastri dello sport cittadino e porta in città l'hockey su pista."
        didascalia="La fotografia è di oggi: dello Skating Club non ci sono immagini nell'archivio della società."
      />

      {/* ================= LE ORIGINI ================= */}
      <FilaTappe
        id="origini"
        occhiello="La cronologia"
        titolo="Le origini"
        aiuto="Scorri di lato per le tappe."
        tappe={ORIGINI}
      />

      {/* =========== 2020/21 — il secondo dei due momenti =========== */}
      <FasciaTappa
        foto="azione-3"
        anno="2020/21"
        titolo="Finale di Coppa Nazionale"
        testo="Girone dominato, Prato battuto nei quarti, Montecchio in semifinale. La finale a Forte dei Marmi, contro l'Engas Vercelli."
        occhiello="Il risultato più prestigioso"
        didascalia="La fotografia non è di quella partita: è una gara recente della prima squadra."
      />

      {/* ================= GLI ULTIMI ANNI ================= */}
      <FilaTappe
        id="recenti"
        occhiello="La cronologia"
        titolo="Gli ultimi anni"
        aiuto="Scorri di lato per le tappe."
        tappe={RECENTI}
      />

      {/* ============ OGGI — l'unica fascia nera della pagina ============ */}
      <section aria-labelledby="titolo-oggi" className="su-nero relative overflow-hidden bg-nero text-white">
        <BastoniIncrociati
          className="pointer-events-none absolute -right-8 -bottom-16 w-64 text-white/[0.07] sm:w-80"
          spessore={11}
        />
        <div className="relative mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
          <p className="occhiello text-rosso-chiaro">Oggi</p>
          <h2 id="titolo-oggi" className="titolo mt-2 max-w-3xl text-[clamp(2rem,9vw,3.75rem)]">
            L'unica società di hockey su pista delle Marche
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-snug text-white">
            Codice di affiliazione FISR 3947. Per il 2026/27 la Serie B l'ha messa nel {GIRONE_CAMPIONATO}, dieci
            giornate dal 10 gennaio 2027.
          </p>
          <p className="mt-4 max-w-xl text-[17px] leading-snug text-grigio-chiaro">
            La pista che costruì Enzo Boiani è ancora lì, ed è ancora quella dove si gioca d'estate.
          </p>
        </div>
      </section>

      {/* ================= LE FONTI, tutte qui ================= */}
      <section aria-labelledby="titolo-fonti" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12">
          <h2 id="titolo-fonti" className="titolo text-[clamp(1.5rem,6vw,2.25rem)]">
            Da dove viene questa pagina
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Non è una ricostruzione a memoria: dove la fonte tace, il testo lo dice. Rose, staff e calendari si
            controllano sul{' '}
            <a
              href={FONTE_FEDERALE}
              target="_blank"
              rel="noreferrer"
              className="text-rosso-cupo underline underline-offset-2"
            >
              portale dei risultati FISR
            </a>
            .
          </p>
          <ul className="mt-5 max-w-3xl divide-y divide-riga border-y border-riga">
            {FONTI.map((f) => (
              <li key={f.nome} className="flex flex-wrap items-baseline gap-x-3 py-3">
                <span className="titolo text-lg text-nero">{f.nome}</span>
                <span className="text-[14px] leading-snug text-grigio">{f.dettaglio}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

/* ===========================================================================
 * LA FASCIA CON LA FOTOGRAFIA — il trattamento dei due momenti forti
 * ===========================================================================
 * A tutta larghezza, con l'anno grande quanto un titolo e due righe di testo.
 * La velatura è quella misurata in `componenti/Foto.tsx`: il testo bianco
 * sopra il parquet chiaro, senza velo, sparirebbe.
 *
 * La didascalia dice di che cosa è la fotografia. Non è una nota a piè di
 * pagina: è la riga che separa «una foto della squadra» da «una foto del
 * 1946», e senza di lei la seconda è quello che chi guarda capisce.
 * =========================================================================== */
function FasciaTappa({
  foto,
  anno,
  titolo,
  testo,
  didascalia,
  occhiello,
}: {
  readonly foto: NomeFoto
  readonly anno: string
  readonly titolo: string
  readonly testo: string
  readonly didascalia: string
  readonly occhiello?: string
}) {
  return (
    <section
      aria-label={`${anno} — ${titolo}`}
      className="su-nero relative isolate flex min-h-[40vh] items-end overflow-hidden bg-nero-fondo text-white sm:min-h-[54vh]"
    >
      <div className="absolute inset-0 -z-10">
        <Foto nome={foto} alt="" />
        <Velatura />
      </div>

      {/* Il filetto rosso è l'accento: è una forma piena, non del testo, e il
          contrasto non deve garantirlo. Sopra la fotografia il testo è bianco
          — vedi la nota in `componenti/Foto.tsx`. */}
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12" data-sopra-foto>
        <span aria-hidden="true" className="mb-3 block h-1.5 w-20 bg-rosso" />
        {occhiello && <p className="occhiello text-white">{occhiello}</p>}
        <p className="cifra mt-2 text-[clamp(3.5rem,17vw,7rem)] text-white">{anno}</p>
        <h2 className="titolo mt-2 max-w-2xl text-[clamp(1.75rem,8vw,3rem)] text-white">{titolo}</h2>
        <p className="mt-3 max-w-lg text-[16px] leading-snug text-white">{testo}</p>
        <p className="mt-3 max-w-lg text-[13px] leading-snug text-grigio-chiaro">{didascalia}</p>
      </div>
    </section>
  )
}

/* ===========================================================================
 * LA FILA DELLE TAPPE — il carosello
 * ===========================================================================
 * Dentro le schede non c'è nessun collegamento, quindi la fila stessa deve
 * poter prendere il fuoco della tastiera: è la proprietà `soloTesto` del
 * carosello. Senza, chi non usa il mouse non arriverebbe alle tappe dopo la
 * prima — contenuto raggiungibile solo col dito è contenuto perso.
 * =========================================================================== */
function FilaTappe({
  id,
  occhiello,
  titolo,
  aiuto,
  tappe,
}: {
  readonly id: string
  readonly occhiello: string
  readonly titolo: string
  readonly aiuto: string
  readonly tappe: readonly Tappa[]
}) {
  return (
    <section aria-labelledby={`titolo-${id}`} className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12">
        {/* L'aiuto sta sulla riga dell'occhiello, non su una riga sua: a
            390 px una riga in più costa venti pixel, due volte, e questa
            pagina li sta contando uno per uno. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6">
          <p className="occhiello text-rosso-cupo">{occhiello}</p>
          <p className="text-[13px] text-grigio lg:hidden">{aiuto}</p>
        </div>
        <h2 id={`titolo-${id}`} className="titolo text-[clamp(2rem,9vw,3.5rem)]">
          {titolo}
        </h2>

        <Carosello
          etichetta={`${titolo} — le tappe`}
          className="-mx-4 mt-5 scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6"
          soloTesto
        >
          {tappe.map((t) => (
            <li key={t.titolo} className="w-[78vw] max-w-[320px] sm:w-[330px]">
              <article className="flex h-full flex-col border-t-4 border-nero bg-panna p-4 sm:p-5">
                <Anno anno={t.anno} />
                <h3 className="titolo mt-3 text-[1.75rem] text-nero">{t.titolo}</h3>
                <p className="mt-3 text-[15px] leading-snug text-nero">{t.testo}</p>
              </article>
            </li>
          ))}
        </Carosello>
      </div>
    </section>
  )
}

/* L'anno della tappa. Tre casi, e ognuno ha il suo motivo:
 * · una data vera («2016») va nella classe `.cifra`, interlinea 0,82, fatta
 *   per le cifre che non hanno discendenti;
 * · un periodo («Gli anni d'oro») no: la «g» finirebbe addosso al titolo
 *   sotto. Diventa un occhiello grande, in rosso-cupo perché a quella misura
 *   il rosso della marca non tiene i 4,5:1 e il rosso-cupo sì;
 * · l'anno che non sappiamo è un punto interrogativo, e chi legge con una
 *   sintesi vocale sente «anno non noto» invece di un simbolo solo. */
function Anno({ anno }: { readonly anno: string | null }) {
  if (anno === null) {
    return (
      <p className="cifra text-[2.75rem] text-rosso">
        <span aria-hidden="true">?</span>
        <span className="sr-only">anno non noto</span>
      </p>
    )
  }
  if (/^\d/.test(anno)) return <p className="cifra text-[clamp(2.5rem,11vw,3.25rem)] text-rosso">{anno}</p>
  return (
    <p className="font-titolo text-[1.5rem] leading-tight tracking-[0.02em] text-rosso-cupo uppercase">{anno}</p>
  )
}

export default Storia
