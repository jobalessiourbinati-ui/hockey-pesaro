/*
 * ===========================================================================
 * LA HOME
 * ===========================================================================
 * Regola di questo cantiere, e dell'intero sito: NIENTE DATI INVENTATI.
 * Ogni numero in questa pagina è calcolato dai file in `dati/`, mai scritto
 * a mano; ogni fatto storico porta la sua fonte in pagina. Dove non abbiamo
 * un dato, la pagina lo dice — «il girone non è ancora sorteggiato», «non ci
 * sono ancora notizie» — invece di lasciare un buco o, peggio, di riempirlo.
 *
 * L'ordine delle sezioni è quello di chi arriva dal telefono: prima chi
 * siamo, poi quando si gioca, poi cosa è successo, poi la società in tre
 * numeri, poi le giovanili (l'ingresso più frequente per una famiglia) e
 * infine dove si gioca.
 * ===========================================================================
 */

import type { ReactNode } from 'react'
import notizie from '../../dati/notizie.json'
import { PRIMA_SQUADRA, STAGIONE_ROSA, capocannoniere, golSquadra, inRosa } from '../../dati/rosa.ts'
import { inCasa } from '../../dati/stagione-2024-25.ts'
import type { Partita } from '../../dati/stagione-2024-25.ts'
import {
  CAMPIONATO_2026_27_USCITO,
  COPPA_ITALIA_2026_27,
  GIRONE_COPPA,
  prossimaPartita,
} from '../../dati/stagione-2026-27.ts'
import { BastoniIncrociati, MotivoBastoni, Scudetto, SeparatoreBastoni } from '../componenti/Scudetto.tsx'
import { link } from '../rotte.ts'

/* ---------------------------------------------------------------------------
 * Le date, in italiano e senza fusi orari di mezzo.
 * `new Date('2026-09-26')` è mezzanotte UTC: a est di Greenwich va bene, a
 * ovest diventa il 25. Quindi la data ISO si spezza a mano e si costruisce
 * una data locale — una partita non deve cambiare giorno per colpa del fuso.
 * ------------------------------------------------------------------------- */
function dataLocale(iso: string): Date | null {
  const p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!p) return null
  const d = new Date(Number(p[1]), Number(p[2]) - 1, Number(p[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

const formatta = (d: Date, opzioni: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('it-IT', opzioni).format(d)

/* Come si chiama in pagina la competizione: la sigla del file dati non si
 * mostra mai a chi legge. */
const NOME_CATEGORIA: Record<Partita['categoria'], string> = {
  B: 'Campionato Serie B',
  'B Coppa': 'Coppa Italia Serie B',
  U13: 'Under 13',
  U17: 'Under 17',
}

export function Home() {
  return (
    <>
      <Eroe />
      <ProssimaPartita />
      <UltimeNotizie />
      <TreNumeri />
      <Giovanili />
      <DoveGiochiamo />
    </>
  )
}

/* ===========================================================================
 * 1 · L'EROE
 * Il fondo è bianco: è il ribaltamento chiesto dal committente rispetto al
 * sito attuale, tutto nero. Il rosso decide una parola sola del titolo, e
 * quella parola è HOCKEY.
 *
 * La riga «dal 1946» del sito attuale — «passione e esperienza dal 1946» —
 * è ambigua: l'Amatori Hockey Pesaro è del 2016. Il 1946 è lo Skating Club
 * Pesaro, sulle cui ceneri l'Amatori è nato (fonte: AHP-La-Storia.pdf,
 * documento della società). Perciò qui si scrive «a Pesaro dal 1946» e la
 * frase sotto spiega esattamente cosa vuol dire: è vero, ed è verificabile.
 * =========================================================================== */
function Eroe() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Le due filigrane del segno di società: il motivo a piastrella e lo
          scudetto grande dietro il titolo. Nessun gradiente, nessun vetro. */}
      <MotivoBastoni className="pointer-events-none absolute inset-0 h-full w-full text-nero" passo={130} opacita={0.05} />
      <Scudetto className="pointer-events-none absolute -top-6 -right-16 w-[280px] opacity-[0.13] sm:right-4 sm:w-[360px] lg:w-[460px]" />

      <div className="relative mx-auto max-w-[1240px] px-4 pt-12 pb-14 sm:px-6 sm:pt-20 sm:pb-20">
        <p className="occhiello text-rosso-cupo">hockey su pista · Serie B · a Pesaro dal 1946</p>

        {/* Il titolo cresce con la finestra ma si ferma: 19vw a 320 px fa
            60 px e ci sta, a 1440 farebbe 273 px e sfonderebbe la colonna. */}
        <h1 className="titolo mt-4 text-[clamp(3.4rem,19vw,10.5rem)]">
          {/* Gli spazi fra le righe sono voluti: senza, il nome accessibile
              del titolo diventa «AmatoriHockeyPesaro» — una parola sola, che
              una sintesi vocale legge come tale. Visivamente non cambia
              niente, perché gli span sono blocchi. */}
          <span className="block">Amatori</span>{' '}
          <span className="block text-rosso">Hockey</span>{' '}
          <span className="block">Pesaro</span>
        </h1>

        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-nero sm:text-lg">
          Lo <strong className="font-semibold">Skating Club Pesaro</strong> nasce nel 1946 e costruisce la pista di
          Viale Trieste. Nel 2016, sulle sue ceneri, nasce l'<strong className="font-semibold">Amatori Hockey Pesaro</strong>:
          stessa città, stessa pista, stesso sport.
        </p>
        <Fonte>AHP-La-Storia.pdf, documento della società</Fonte>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={link('/squadra/')} className="bottone bottone-pieno">
            La squadra
          </a>
          <a href={link('/eventi/')} className="bottone bottone-vuoto">
            I risultati
          </a>
        </div>
      </div>
    </section>
  )
}

/* ===========================================================================
 * 2 · LA PROSSIMA PARTITA
 * La calcola `prossimaPartita()` dal calendario e dalla data di oggi, ogni
 * volta che la pagina si apre. Nessuno deve ricordarsi di aggiornare a mano
 * un riquadro «prossima partita»: nessuno se lo ricorda mai, e resta lì per
 * mesi a dire una partita già giocata.
 *
 * Quando il calendario è finito la sezione lo dice, con il perché — la Coppa
 * è chiusa e il girone di campionato non è ancora sorteggiato — invece di
 * sparire o di mostrare una riga vuota.
 * =========================================================================== */
function ProssimaPartita() {
  const partita = prossimaPartita(new Date(), COPPA_ITALIA_2026_27)

  return (
    <section aria-labelledby="titolo-prossima" className="su-nero relative overflow-hidden bg-nero text-white">
      <BastoniIncrociati className="pointer-events-none absolute -right-8 -bottom-16 w-56 text-white/[0.06] sm:w-72" spessore={11} />

      <div className="relative mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
        <h2 id="titolo-prossima" className="occhiello text-rosso-chiaro">
          {partita ? 'La prossima partita' : 'Il calendario'}
        </h2>

        {partita ? <SchedaPartita partita={partita} /> : <NessunaPartita />}

        {!CAMPIONATO_2026_27_USCITO ? (
          <p className="mt-8 max-w-2xl border-l-4 border-rosso pl-4 text-[15px] leading-relaxed text-grigio-chiaro">
            Il girone di <strong className="font-semibold text-white">Serie B 2026/27</strong> non è ancora stato
            sorteggiato: della stagione nuova è uscita finora solo la Coppa Italia. Il calendario del campionato
            arriva qui appena la FISR lo pubblica.
          </p>
        ) : null}
      </div>
    </section>
  )
}

function SchedaPartita({ partita }: { readonly partita: Partita }) {
  const d = dataLocale(partita.data)
  const casa = inCasa(partita)
  const avversaria = casa ? partita.ospiti : partita.casa

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
      {/* Il giorno grande: è il dato che si cerca, quindi è il più grande. */}
      <p className="flex items-end gap-3">
        <span className="cifra text-[clamp(4.5rem,22vw,8rem)] text-rosso">{d ? formatta(d, { day: 'numeric' }) : '—'}</span>
        <span className="pb-2">
          <span className="titolo block text-3xl sm:text-4xl">{d ? formatta(d, { month: 'long' }) : ''}</span>
          <span className="block text-sm text-grigio-chiaro">{d ? formatta(d, { year: 'numeric' }) : ''}</span>
        </span>
      </p>

      <div>
        <p className="titolo text-[clamp(2rem,9vw,3.5rem)]">
          {casa ? (
            <>
              Pesaro <span className="text-rosso-chiaro">–</span> {avversaria}
            </>
          ) : (
            <>
              {avversaria} <span className="text-rosso-chiaro">–</span> Pesaro
            </>
          )}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:max-w-lg">
          <div>
            <dt className="occhiello text-grigio-chiaro">Dove</dt>
            <dd className="titolo mt-1 text-2xl">{casa ? 'In casa' : 'In trasferta'}</dd>
          </div>
          <div>
            <dt className="occhiello text-grigio-chiaro">Ora</dt>
            <dd className="titolo mt-1 text-2xl">
              <time dateTime={partita.data}>{partita.ora}</time>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="occhiello text-grigio-chiaro">Competizione</dt>
            <dd className="mt-1 text-[15px] text-white">
              {NOME_CATEGORIA[partita.categoria]} — {GIRONE_COPPA.nome}, con {GIRONE_COPPA.squadre.filter((s) => s !== 'Amatori Pesaro').join(' e ')}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-[13px] text-grigio-chiaro">
          Fonte del calendario:{' '}
          <a className="underline underline-offset-4 hover:text-white" href={GIRONE_COPPA.fonte} rel="noopener noreferrer" target="_blank">
            hockeyitalia21.com, 5 agosto 2026
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
        </p>
      </div>
    </div>
  )
}

function NessunaPartita() {
  return (
    <p className="titolo mt-4 max-w-3xl text-[clamp(1.9rem,7vw,3rem)]">
      Non ci sono altre partite in calendario
    </p>
  )
}

/* ===========================================================================
 * 3 · LE ULTIME NOTIZIE
 * Il file `dati/notizie.json` lo riempie lo script `scripts/aggiorna.mjs`.
 * Finché la pratica con Meta non è aperta (CONTESTO §4) quel file resta
 * vuoto, e questa sezione deve reggere il vuoto dicendolo — non inventare
 * una notizia, non nascondere la sezione, non mostrare tre riquadri finti
 * come fa il sito di oggi.
 *
 * Perché la lettura è così prudente: il JSON lo scrive un altro programma, e
 * la sua forma esatta può cambiare (i post di Instagram hanno `caption` e
 * `permalink`, quelli scritti a mano avranno `titolo` e `url`). Quindi ogni
 * campo si legge da più nomi possibili e nulla si dà per scontato: una
 * notizia malformata salta, non fa cadere la pagina.
 * =========================================================================== */
interface Voce {
  readonly titolo: string
  readonly data: string | null
  readonly testo: string | null
  readonly url: string | null
}

const testo = (o: Record<string, unknown>, ...chiavi: readonly string[]): string | null => {
  for (const k of chiavi) {
    const v = o[k]
    if (typeof v === 'string' && v.trim() !== '') return v.trim()
  }
  return null
}

function leggiVoci(grezze: unknown): readonly Voce[] {
  if (!Array.isArray(grezze)) return []
  const voci: Voce[] = []
  for (const g of grezze) {
    if (typeof g !== 'object' || g === null) continue
    const o = g as Record<string, unknown>
    const titolo = testo(o, 'titolo', 'title', 'caption')
    if (titolo === null) continue
    voci.push({
      titolo,
      data: testo(o, 'data', 'date', 'timestamp'),
      testo: testo(o, 'testo', 'descrizione', 'sommario', 'caption'),
      url: testo(o, 'url', 'permalink', 'link'),
    })
  }
  return voci
}

function UltimeNotizie() {
  /* Il JSON arriva da un altro programma: lo si tratta come dato ignoto, non
   * come una forma già nota al compilatore. Quando il file è vuoto TypeScript
   * dedurrebbe `voci: never[]`, un tipo che mente sul futuro. */
  const grezzo = notizie as unknown as Record<string, unknown>
  const voci = leggiVoci(grezzo['voci']).slice(0, 3)
  const aggiornato = testo(grezzo, 'aggiornato')

  return (
    <section aria-labelledby="titolo-notizie" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
        <SeparatoreBastoni className="mb-10" />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="occhiello text-rosso-cupo">Dal club</p>
            <h2 id="titolo-notizie" className="titolo mt-2 text-[clamp(2.5rem,11vw,4.5rem)]">
              Ultime notizie
            </h2>
          </div>
          <a href={link('/notizie/')} className="bottone bottone-vuoto">
            Tutte le notizie
          </a>
        </div>

        {voci.length === 0 ? (
          <div className="mt-8 border-l-4 border-rosso bg-panna p-6">
            <p className="text-[17px] leading-relaxed text-nero">
              Non ci sono ancora notizie pubblicate su questo sito. Nel frattempo la società racconta le partite
              sulle sue pagine{' '}
              <a className="font-semibold underline underline-offset-4" href="https://www.facebook.com/amatorihockeypesaro" rel="noopener noreferrer" target="_blank">
                Facebook
              </a>{' '}
              e{' '}
              <a className="font-semibold underline underline-offset-4" href="https://www.instagram.com/amatori_hockey_pesaro_asd" rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {voci.map((v, i) => (
                <li key={v.url ?? `${v.titolo}-${i}`} className="border-2 border-nero bg-white">
                  <article className="flex h-full flex-col p-5">
                    {v.data ? <DataVoce iso={v.data} /> : null}
                    <h3 className="titolo mt-2 text-2xl">
                      {v.url ? (
                        <a href={v.url} className="hover:text-rosso-cupo" rel="noopener noreferrer" target="_blank">
                          {v.titolo}
                        </a>
                      ) : (
                        v.titolo
                      )}
                    </h3>
                    {v.testo && v.testo !== v.titolo ? (
                      <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-grigio">{v.testo}</p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
            {aggiornato ? <Fonte>Ultimo aggiornamento: {aggiornato}</Fonte> : null}
          </>
        )}
      </div>
    </section>
  )
}

function DataVoce({ iso }: { readonly iso: string }) {
  const d = dataLocale(iso.slice(0, 10))
  if (!d) return <p className="occhiello text-rosso-cupo">{iso}</p>
  return (
    <p className="occhiello text-rosso-cupo">
      <time dateTime={iso.slice(0, 10)}>{formatta(d, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
    </p>
  )
}

/* ===========================================================================
 * 4 · LA SQUADRA IN TRE NUMERI
 * Tutti e tre calcolati dai dati, mai scritti a mano: se qualcuno segna,
 * cambia il file `dati/rosa.ts` e cambia la home. E ognuno porta l'etichetta
 * della stagione a cui si riferisce, perché un numero senza stagione, sul
 * sito di una squadra, è un numero che fra sei mesi mente.
 * =========================================================================== */
function TreNumeri() {
  const tesserati = PRIMA_SQUADRA.filter(inRosa).length
  const gol = golSquadra(PRIMA_SQUADRA)
  const migliore = capocannoniere(PRIMA_SQUADRA)

  return (
    <section aria-labelledby="titolo-numeri" className="border-y-4 border-nero bg-panna">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
        <p className="occhiello text-rosso-cupo">La prima squadra</p>
        <h2 id="titolo-numeri" className="titolo mt-2 text-[clamp(2.5rem,11vw,4.5rem)]">
          Tre numeri
        </h2>

        <dl className="mt-10 grid gap-px border-2 border-nero bg-nero sm:grid-cols-3">
          <Numero valore={String(tesserati)} etichetta="tesserati in rosa" stagione={`Serie B ${STAGIONE_ROSA}`} />
          <Numero valore={String(gol)} etichetta="gol segnati" stagione={`stagione ${STAGIONE_ROSA}`} />
          <Numero
            valore={String(migliore?.gol ?? 0)}
            etichetta={migliore ? `gol di ${migliore.nome} ${migliore.cognome}` : 'gol del capocannoniere'}
            stagione={`capocannoniere ${STAGIONE_ROSA}`}
          />
        </dl>

        <Fonte>
          Rosa, presenze e gol depositati in federazione — portale FISR hockey pista. La rosa 2026/27 non è ancora
          depositata: questi sono i numeri della stagione {STAGIONE_ROSA}.
        </Fonte>
      </div>
    </section>
  )
}

function Numero({
  valore,
  etichetta,
  stagione,
}: {
  readonly valore: string
  readonly etichetta: string
  readonly stagione: string
}) {
  return (
    <div className="bg-panna px-5 py-8 sm:px-6">
      <dt className="sr-only">
        {etichetta}, {stagione}
      </dt>
      <dd>
        <span className="cifra block text-[clamp(4rem,17vw,6.5rem)] text-rosso">{valore}</span>
        <span className="titolo mt-3 block text-xl text-nero sm:text-2xl">{etichetta}</span>
        <span className="mt-1 block text-[13px] text-grigio">{stagione}</span>
      </dd>
    </div>
  )
}

/* ===========================================================================
 * 5 · LE GIOVANILI
 * Cinque categorie, e nient'altro: nessun nome, nessuna foto. Sono ragazzi
 * dagli 8 ai 19 anni e senza la liberatoria di chi esercita la
 * responsabilità genitoriale non si pubblica nulla di riconoscibile
 * (CONTESTO §9.2). La fascia è rossa perché è l'ingresso che una famiglia
 * cerca per primo: il rosso decide dove si guarda.
 * =========================================================================== */
const CATEGORIE = ['Under 11', 'Under 13', 'Under 15', 'Under 17', 'Under 19'] as const

function Giovanili() {
  return (
    <section aria-labelledby="titolo-giovanili" className="su-nero relative overflow-hidden bg-rosso-cupo text-white">
      <MotivoBastoni className="pointer-events-none absolute inset-0 h-full w-full text-white" passo={168} opacita={0.09} inclinazione={14} />

      <div className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
        <p className="occhiello text-white">Il settore giovanile</p>
        {/* «dagli 11 ai 19 anni» sarebbe sbagliato: Under 11 vuol dire sotto
            gli undici, non undici. Del resto la fascia d'età esatta di ogni
            categoria non ce l'abbiamo scritta da nessuna parte, quindi il
            titolo dice le categorie e basta. */}
        <h2 id="titolo-giovanili" className="titolo mt-2 max-w-3xl text-[clamp(2.5rem,11vw,4.5rem)]">
          Cinque categorie, dall'Under 11 all'Under 19
        </h2>

        <ul className="mt-8 flex flex-wrap gap-3">
          {CATEGORIE.map((c) => (
            <li key={c} className="titolo border-2 border-white px-4 py-2 text-xl sm:text-2xl">
              {c}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-white">
          Dall'Under 11 all'Under 19, con gli allenatori della società. Nella stagione 2023-24 l'Under 11 ha giocato
          le prime finali nazionali della storia del club, chiudendo quarta nella classifica di Coppa FISR.
        </p>

        <div className="mt-8">
          <a href={link('/giovanili/')} className="bottone border-white bg-white text-rosso-cupo hover:bg-nero hover:text-white">
            Le giovanili
          </a>
        </div>

        <p className="mt-6 text-[13px] text-white">
          Fonte: AHP-La-Storia.pdf e AHP-Pesaro-in-Pista-24-27.pdf, documenti della società. I nomi dei ragazzi
          minorenni non si pubblicano senza il consenso scritto di chi esercita la responsabilità genitoriale.
        </p>
      </div>
    </section>
  )
}

/* ===========================================================================
 * 6 · DOVE GIOCHIAMO
 * La pista di Viale Trieste è comunale e scoperta: si usa da maggio a
 * settembre. D'inverno la squadra si sposta al coperto, ma quale sia
 * l'impianto della stagione non è confermato — il sito attuale ne nomina due
 * diversi e il registro degli impianti del Comune non scioglie il dubbio
 * (CONTESTO §10). Perciò la pagina dice quello che sappiamo e ammette quello
 * che non sappiamo. È l'unica cosa che si può scrivere senza inventare.
 * =========================================================================== */
function DoveGiochiamo() {
  return (
    <section aria-labelledby="titolo-pista" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
        <SeparatoreBastoni className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="occhiello text-rosso-cupo">Dove giochiamo</p>
            <h2 id="titolo-pista" className="titolo mt-2 text-[clamp(2.5rem,11vw,4.5rem)]">
              La pista di Viale Trieste
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-nero">
              È la pista di pattinaggio comunale sul lungomare, <strong className="font-semibold">scoperta</strong>: si
              gioca da maggio a settembre. L'ha costruita <strong className="font-semibold">Enzo Boiani</strong>, che
              produceva pattini usati a livello internazionale ed era fra i fondatori dello Skating Club.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-nero">
              D'inverno la squadra si sposta al coperto. L'impianto della stagione 2026/27 non è ancora confermato:
              appena lo sarà, sta scritto qui.
            </p>
            <Fonte>
              AHP-La-Storia.pdf e registro degli impianti del Comune di Pesaro
            </Fonte>
          </div>

          {/* Il fatto che vale come titolo: nelle Marche non c'è nessun'altra
              società di hockey su pista. Ha una fonte — il registro FISR —
              quindi si può scrivere grande. */}
          <div className="su-nero flex flex-col justify-center border-4 border-nero bg-nero p-6 text-white sm:p-8">
            <p className="cifra text-[clamp(4rem,18vw,7rem)] text-rosso">1</p>
            <p className="titolo mt-4 text-[clamp(1.8rem,7vw,2.75rem)]">
              L'unica società di hockey su pista delle Marche
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-grigio-chiaro">
              Chi in questa regione vuole giocare a hockey su pista gioca qui. Nel 2025/26 la Serie B contava 37
              squadre in sei gironi, e le altre sei del girone dell'Amatori erano tutte in Emilia: Modena,
              Correggio, Mirandola, Scandiano.
            </p>
            <p className="mt-4 text-[13px] text-grigio-chiaro">Fonte: registro delle società affiliate FISR.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* La riga della fonte, sempre uguale: piccola, grigia, mai nascosta. Una
 * pagina che afferma un fatto storico dice anche da dove lo prende. */
function Fonte({ children }: { readonly children: ReactNode }) {
  return <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-grigio">Fonte: {children}</p>
}
