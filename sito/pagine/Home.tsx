/*
 * ===========================================================================
 * LA HOME
 * ===========================================================================
 * Il committente l'ha guardata dal telefono e ha detto due cose: che nel sito
 * c'è troppo testo, e che l'eroe con la fotografia gli piace. Questa pagina è
 * la risposta a tutte e due — la fotografia prende la prima schermata intera,
 * e il paragrafo sullo Skating Club che stava dentro l'eroe è sceso nella riga
 * sotto, ridotto a due date e sei parole. Il racconto lungo sta in /storia/,
 * che è la pagina fatta per quello.
 *
 * Regola di questo cantiere, e dell'intero sito: NIENTE DATI INVENTATI. Ogni
 * numero è calcolato dai file in `dati/`, mai scritto a mano; ogni fatto
 * storico ha una fonte. Dove non abbiamo un dato la pagina lo dice — «non ci
 * sono ancora notizie» — invece di riempirlo.
 *
 * Le fonti però non si ripetono più sotto ogni blocco: una riga sola in fondo
 * alla pagina. Dirlo sette volte non lo rende più vero, rende solo la pagina
 * il doppio più lunga.
 * ===========================================================================
 */

import { PRIMA_SQUADRA, STAGIONE_ROSA, capocannoniere, golSquadra, inRosa } from '../../dati/rosa.ts'
import { inCasa } from '../../dati/stagione-2024-25.ts'
import type { Partita } from '../../dati/stagione-2024-25.ts'
import { COPPA_ITALIA_2026_27, GIRONE_COPPA, prossimaPartita } from '../../dati/stagione-2026-27.ts'
import { Carosello } from '../componenti/Carosello.tsx'
import { FasciaNotizie } from '../componenti/FasciaNotizie.tsx'
import { Foto, Velatura } from '../componenti/Foto.tsx'
import { Rivela } from '../componenti/Rivela.tsx'
import { BastoniIncrociati, MotivoBastoni } from '../componenti/Scudetto.tsx'
import { pezziData } from '../date.ts'
import { link } from '../rotte.ts'

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
      <DueDate />
      <ProssimaPartita />
      <UltimeNotizie />
      <TreNumeri />
      <Giovanili />
      <DoveGiochiamo />
    </>
  )
}

/* ===========================================================================
 * 1 · L'EROE — la fotografia, e cinque parole sopra
 * ===========================================================================
 * «la hero con le foto mi sembra carina da mobile»: è la richiesta, ed è la
 * cosa giusta. Il sito di una squadra si apre per vedere la squadra, e finora
 * la prima schermata era un titolo su fondo bianco.
 *
 * LA VELATURA NON È UN EFFETTO. Il parquet di un palazzetto è chiaro: il
 * testo bianco sopra, senza velo, in certi punti sta sotto 2:1 e sparisce al
 * sole — cioè esattamente in tribuna, che è dove questo sito si apre. La
 * velatura è misurata sui pixel veri (vedi `componenti/Foto.tsx`), non scelta
 * a occhio, e il rapporto peggiore sotto ogni riga di testo sta nella
 * consegna.
 *
 * IL TESTO STA IN BASSO, non al centro: in basso la sfumatura è densa e il
 * contrasto è alto; in alto la fotografia resta pulita e si vede la partita.
 * =========================================================================== */
function Eroe() {
  return (
    <section className="su-nero relative isolate flex min-h-[64vh] flex-col justify-end overflow-hidden bg-nero-fondo text-white sm:min-h-[72vh] lg:min-h-[78vh]">
      {/* La fotografia sta in un suo involucro perché l'entrata scala LEI e
          non la velatura: scalare anche il velo gli farebbe scoprire i bordi. */}
      <div className="absolute inset-0 -z-10">
        <div className="eroe-foto h-full w-full">
          <Foto
            nome="hero-urbinati"
          /* Decorativa: il nome della società è scritto sopra a caratteri
             alti quattro centimetri, e ridirlo qui è rumore per chi ascolta.
             La persona non si nomina — ed è comunque il capitano, che ha dato
             la fotografia per questo. */
            alt=""
            primaCosa
            /* Il soggetto — testa, numero, palla sulla stecca — sta in alto;
               il testo dell'eroe sta in basso, sopra i pantaloni grigi e non
               sopra la maglia bianca, dove sparirebbe. `center 28%` tiene la
               testa in quadro e porta il grigio dietro le parole. */
            posizione="center 28%"
          />
        </div>
        <Velatura />
      </div>

      {/* L'EROE ENTRA IN SEQUENZA, non tutto insieme: occhiello, titolo,
          riga, bottoni, a centoventi millisecondi l'uno dall'altro. È la
          differenza fra una pagina che si accende e una che si apre. */}
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-24 pb-10 sm:px-6 sm:pt-32 sm:pb-14" data-sopra-foto>
        <Rivela come="p" className="occhiello text-white">
          hockey su pista · Serie B · Pesaro
        </Rivela>

        {/* Il titolo cresce con la finestra ma si ferma: 19vw a 320 px fa
            60 px e ci sta, a 1440 farebbe 273 px e sfonderebbe la colonna.
            Gli spazi fra le righe sono voluti: senza, il nome accessibile del
            titolo diventa «AmatoriHockeyPesaro», una parola sola che una
            sintesi vocale legge come tale. */}
        {/* IL ROSSO SOPRA LA FOTOGRAFIA È UN BLOCCO, NON UNA PAROLA.
            «Hockey» in rosso chiaro sopra il parquet velato misura 3,2:1: sotto
            la soglia, e nessuna velatura lo salva senza spegnere la
            fotografia. Invertito — parola bianca dentro un rettangolo rosso
            pieno — il rapporto è quello del rosso-cupo col bianco, 5,7:1,
            misurato in `tema.css` e indipendente da cosa c'è sotto. In più è
            più forte da vedere: è il rosso della maglia, non una parola
            colorata. */}
        <Rivela ritardo={120}>
          <h1 className="titolo mt-3 text-[clamp(3.4rem,19vw,10.5rem)]">
            <span className="block">Amatori</span>{' '}
            <span className="mt-1 inline-block bg-rosso-cupo px-3 pt-1 pb-2 text-white">Hockey</span>{' '}
            <span className="mt-1 block">Pesaro</span>
          </h1>
        </Rivela>

        <Rivela come="p" ritardo={260} className="mt-5 max-w-md text-[17px] leading-snug text-white sm:text-xl">
          L'unica società di hockey su pista delle Marche.
        </Rivela>

        <Rivela ritardo={380} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={link('/squadra/')} className="bottone bottone-pieno">
            La squadra
          </a>
          <a
            href={link('/notizie/')}
            className="bottone border-white bg-transparent text-white hover:bg-white hover:text-nero"
          >
            Calendario e risultati
          </a>
        </Rivela>
      </div>
    </section>
  )
}

/* ===========================================================================
 * 2 · DUE DATE — quello che prima era un paragrafo
 * ===========================================================================
 * Nell'eroe c'erano quattro righe sullo Skating Club del 1946 e sulla nascita
 * dell'Amatori nel 2016. Sono due date e una frase: scritte come due date e
 * una frase occupano un quinto dello spazio e si leggono in un colpo d'occhio,
 * che è quello che si fa su un telefono.
 *
 * La distinzione resta esatta, ed è quella che il sito vecchio sbagliava:
 * «dal 1946» è lo Skating Club, l'Amatori Hockey Pesaro è del 2016.
 * =========================================================================== */
function DueDate() {
  return (
    <section aria-labelledby="titolo-date" className="border-b-4 border-nero bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12">
        <h2 id="titolo-date" className="sr-only">
          Dallo Skating Club del 1946 all'Amatori Hockey Pesaro del 2016
        </h2>
        <Rivela className="flex flex-wrap items-end gap-x-8 gap-y-6 sm:gap-x-14">
          <Data anno="1946" cosa="Skating Club Pesaro" />
          <BastoniIncrociati className="hidden w-12 shrink-0 pb-3 text-rosso sm:block" spessore={13} />
          <Data anno="2016" cosa="Amatori Hockey Pesaro" />
          <p className="max-w-[15rem] pb-1 text-[15px] leading-snug text-grigio">
            Stessa città, stessa pista.{' '}
            <a href={link('/storia/')} className="legame text-rosso-cupo">
              Ottant'anni di storia
            </a>
            .
          </p>
        </Rivela>
      </div>
    </section>
  )
}

function Data({ anno, cosa }: { readonly anno: string; readonly cosa: string }) {
  return (
    <p>
      <span className="cifra block text-[clamp(3rem,14vw,5.5rem)] text-rosso">{anno}</span>
      <span className="titolo mt-2 block text-xl text-nero sm:text-2xl">{cosa}</span>
    </p>
  )
}

/* ===========================================================================
 * 3 · LA PROSSIMA PARTITA
 * La calcola `prossimaPartita()` dal calendario e dalla data di oggi, ogni
 * volta che la pagina si apre: nessuno deve ricordarsi di aggiornare a mano un
 * riquadro «prossima partita», perché nessuno se lo ricorda mai e resta lì per
 * mesi a dire una partita già giocata.
 * =========================================================================== */
function ProssimaPartita() {
  const partita = prossimaPartita(new Date(), COPPA_ITALIA_2026_27)

  return (
    <section aria-labelledby="titolo-prossima" className="su-nero relative overflow-hidden bg-nero text-white">
      <BastoniIncrociati
        className="pointer-events-none absolute -right-10 -bottom-20 w-72 text-white/[0.07] sm:w-96"
        spessore={11}
      />

      <div className="relative mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
        <h2 id="titolo-prossima" className="occhiello text-rosso-chiaro">
          {partita ? 'La prossima partita' : 'Il calendario'}
        </h2>
        <Rivela>{partita ? <SchedaPartita partita={partita} /> : <NessunaPartita />}</Rivela>
      </div>
    </section>
  )
}

function SchedaPartita({ partita }: { readonly partita: Partita }) {
  const { giorno, mese, anno } = pezziData(partita.data)
  const casa = inCasa(partita)
  const avversaria = casa ? partita.ospiti : partita.casa

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
      {/* Il giorno grande: è il dato che si cerca, quindi è il più grande. */}
      <p className="flex items-end gap-3">
        <span className="cifra text-[clamp(4.5rem,22vw,8rem)] text-rosso">{giorno}</span>
        <span className="pb-2">
          <span className="titolo block text-3xl sm:text-4xl">{mese}</span>
          <span className="block text-sm text-grigio-chiaro">{anno}</span>
        </span>
      </p>

      <div>
        <p className="titolo text-[clamp(2rem,9vw,3.5rem)]">
          {casa ? 'Pesaro' : avversaria} <span className="text-rosso-chiaro">–</span> {casa ? avversaria : 'Pesaro'}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
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
          <div>
            <dt className="occhiello text-grigio-chiaro">Competizione</dt>
            <dd className="titolo mt-1 text-2xl">{NOME_CATEGORIA[partita.categoria]}</dd>
          </div>
        </dl>

        <p className="mt-5 text-[13px] text-grigio-chiaro">
          {GIRONE_COPPA.nome} ·{' '}
          <a
            className="underline underline-offset-4 hover:text-white"
            href={GIRONE_COPPA.fonte}
            rel="noopener noreferrer"
            target="_blank"
          >
            calendario di Coppa Italia, 5 agosto 2026
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
        </p>
      </div>
    </div>
  )
}

function NessunaPartita() {
  return <p className="titolo mt-4 max-w-3xl text-[clamp(1.9rem,7vw,3rem)]">Non ci sono altre partite in calendario</p>
}

/* ===========================================================================
 * 4 · IL CAROSELLO DELLE NOTIZIE
 * La fascia è la stessa che sta in cima a /notizie/: vive in
 * `componenti/FasciaNotizie.tsx`, e da vuota mostra partite vere invece di
 * schede finte. Qui restano solo il titolo e il collegamento all'archivio.
 * =========================================================================== */
function UltimeNotizie() {
  return (
    <section aria-labelledby="titolo-notizie" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="occhiello text-rosso-cupo">Dal club</p>
            <h2 id="titolo-notizie" className="titolo mt-1 text-[clamp(2.5rem,11vw,4.5rem)]">
              Ultime notizie
            </h2>
          </div>
          <a href={link('/notizie/')} className="bottone bottone-vuoto">
            Tutte le notizie
          </a>
        </div>

        <Rivela className="mt-7">
          <FasciaNotizie />
        </Rivela>
      </div>
    </section>
  )
}

/* ===========================================================================
 * 5 · LA SQUADRA IN TRE NUMERI
 * Tutti e tre calcolati dai dati, mai scritti a mano: se qualcuno segna,
 * cambia `dati/rosa.ts` e cambia la home. La stagione è scritta una volta
 * sopra i tre numeri, non tre volte: è la stessa per tutti.
 * =========================================================================== */
function TreNumeri() {
  const tesserati = PRIMA_SQUADRA.filter(inRosa).length
  const gol = golSquadra(PRIMA_SQUADRA)
  const migliore = capocannoniere(PRIMA_SQUADRA)

  return (
    <section aria-labelledby="titolo-numeri" className="border-y-4 border-nero bg-panna">
      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
        <p className="occhiello text-rosso-cupo">La prima squadra · Serie B</p>
        <h2 id="titolo-numeri" className="titolo mt-1 text-[clamp(2.5rem,11vw,4.5rem)]">
          La stagione {STAGIONE_ROSA}
        </h2>

        {/* I tre numeri entrano uno dopo l'altro: in blocco sarebbero un
            lampo, in sequenza si leggono come tre cose distinte. */}
        <dl className="mt-8 grid gap-px border-2 border-nero bg-nero sm:grid-cols-3">
          <Numero valore={String(tesserati)} etichetta="tesserati in rosa" />
          <Numero valore={String(gol)} etichetta="gol segnati" ritardo={110} />
          <Numero
            valore={String(migliore?.gol ?? 0)}
            etichetta={migliore ? `gol di ${migliore.nome} ${migliore.cognome}` : 'gol del capocannoniere'}
            ritardo={220}
          />
        </dl>

        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-grigio">
          Rosa, presenze e gol della Serie B {STAGIONE_ROSA} depositati in federazione (portale FISR). La rosa 2026/27
          non è ancora depositata.
        </p>
      </div>
    </section>
  )
}

function Numero({
  valore,
  etichetta,
  ritardo = 0,
}: {
  readonly valore: string
  readonly etichetta: string
  readonly ritardo?: number
}) {
  return (
    <Rivela ritardo={ritardo} className="bg-panna px-5 py-7 sm:px-6">
      <dt className="sr-only">{etichetta}</dt>
      <dd>
        <span className="cifra block text-[clamp(4.5rem,19vw,7rem)] text-rosso">{valore}</span>
        <span className="titolo mt-3 block text-xl text-nero sm:text-2xl">{etichetta}</span>
      </dd>
    </Rivela>
  )
}

/* ===========================================================================
 * 6 · LE GIOVANILI
 * Cinque categorie, e nient'altro: nessun nome, nessuna foto. Sono ragazzi
 * dagli 8 ai 19 anni e senza la liberatoria di chi esercita la responsabilità
 * genitoriale non si pubblica nulla di riconoscibile (CONTESTO §9.2) — ed è
 * anche il motivo per cui questa fascia è fatta di segni e di categorie
 * grandi invece che di fotografie.
 * =========================================================================== */
const CATEGORIE = ['Under 11', 'Under 13', 'Under 15', 'Under 17', 'Under 19'] as const

function Giovanili() {
  return (
    <section aria-labelledby="titolo-giovanili" className="su-nero relative overflow-hidden bg-rosso-cupo text-white">
      <MotivoBastoni
        className="pointer-events-none absolute inset-0 h-full w-full text-white"
        passo={180}
        opacita={0.1}
        inclinazione={14}
      />

      <div className="relative mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
        <p className="occhiello text-white">Il settore giovanile</p>
        {/* «dagli 11 ai 19 anni» sarebbe sbagliato: Under 11 vuol dire sotto
            gli undici, non undici. La fascia d'età esatta non ce l'abbiamo
            scritta da nessuna parte, quindi il titolo dice le categorie. */}
        <h2 id="titolo-giovanili" className="titolo mt-1 max-w-3xl text-[clamp(2.5rem,11vw,4.5rem)]">
          Cinque categorie
        </h2>

        {/* Le categorie scorrono di lato invece di andare a capo: sul telefono
            restano su una riga sola e diventano grandi il doppio. */}
        <Carosello
          etichetta="Le categorie del settore giovanile"
          className="-mx-4 mt-7 scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6"
          soloTesto
        >
          {CATEGORIE.map((c) => (
            <li key={c} className="titolo border-2 border-white px-5 py-3 text-[clamp(1.75rem,7vw,2.5rem)]">
              {c}
            </li>
          ))}
        </Carosello>

        <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-white">
          Nel 2023/24 l'Under 11 ha giocato le prime finali nazionali della storia del club: quarta nella classifica
          Coppa FISR.
        </p>

        <div className="mt-7">
          <a
            href={link('/giovanili/')}
            className="bottone border-white bg-white text-rosso-cupo hover:bg-nero hover:text-white"
          >
            Le giovanili
          </a>
        </div>
      </div>
    </section>
  )
}

/* ===========================================================================
 * 7 · DOVE GIOCHIAMO
 * La pista di Viale Trieste è comunale e scoperta: si usa da maggio a
 * settembre. D'inverno la squadra si sposta al coperto, ma quale sia
 * l'impianto della stagione non è confermato — il sito attuale ne nomina due
 * diversi e il registro degli impianti del Comune non scioglie il dubbio
 * (CONTESTO §10). La pagina dice quello che sappiamo e ammette quello che non
 * sappiamo: è l'unica cosa che si può scrivere senza inventare.
 * =========================================================================== */
function DoveGiochiamo() {
  return (
    <>
      <section
        aria-labelledby="titolo-pista"
        /* PIÙ ALTA DI PRIMA, e non per gusto: a 1280 px una fascia da 52vh ha
           un rapporto di 3,08 — più del doppio di una fotografia 3:2 — e
           `object-cover` si mangiava metà dell'immagine in altezza, teste
           comprese. Alzandola il ritaglio in pagina si dimezza. */
        className="su-nero relative isolate flex min-h-[64vh] items-end overflow-hidden bg-nero-fondo text-white sm:min-h-[74vh]"
      >
        <div className="absolute inset-0 -z-10">
          {/* UNA FOTOGRAFIA DAVVERO PANORAMICA, per una fascia panoramica: il
              campo ripreso da lontano, con le figure piccole e a metà quadro.
              Qui `cover` può togliere cielo sopra e asfalto sotto senza
              tagliare nessuno — che è l'unica cosa che una fascia larga sa
              fare. E per «dove giochiamo» mostrare l'impianto intero è anche
              più giusto della squadra in posa. */}
          <Foto
            nome="pista-mare-gioco"
            alt="La pista di Viale Trieste vista dal fondo, con il lungomare alle spalle."
          />
          <Velatura />
        </div>

        <Rivela className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
          <div data-sopra-foto>
            <span aria-hidden="true" className="filetto mb-3" />
            <p className="occhiello text-white">Dove giochiamo</p>
            <h2 id="titolo-pista" className="titolo mt-2 max-w-2xl text-[clamp(2.5rem,11vw,4.5rem)]">
              La pista di Viale Trieste
            </h2>
            <p className="misura mt-4 text-[17px] leading-snug text-white">
              Comunale e scoperta, sul lungomare: si gioca da maggio a settembre. L'ha costruita Enzo Boiani, fra i
              fondatori dello Skating Club.
            </p>
          </div>
        </Rivela>
      </section>

      {/* FOTOGRAFIA A SINISTRA, TESTO A DESTRA. È l'impaginato che rompe la
          fila: fin qui la home è tutta fasce a tutta larghezza, una sopra
          l'altra, e sette blocchi uguali si leggono come un elenco. Qui la
          pagina cambia respiro — e la fotografia entra in colonna invece che
          a fondo pieno, che è la seconda cosa che mancava. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <Rivela>
              <div className="aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
                <Foto
                  nome="pista-tramonto"
                  alt="La prima squadra dell'Amatori Hockey Pesaro sulla pista di Viale Trieste, al tramonto."
                  /* QUI, E NON IN UNA FASCIA PANORAMICA. Questa squadra occupa
                     780 px di altezza su 1080: in un taglio orizzontale — 720
                     px anche a 3:2 — una delle due file resta sempre fuori.
                     Nel taglio verticale ci sta intera, e una foto di squadra
                     sotto la frase «l'unica società delle Marche» dice la cosa
                     giusta meglio di un giocatore solo. */
                  taglio="alto"
                  quantoLargaAlto="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </Rivela>

            <Rivela ritardo={140}>
              <span aria-hidden="true" className="filetto" />
              <p className="cifra mt-5 text-[clamp(5rem,20vw,9rem)] text-rosso">1</p>
              <p className="titolo mt-2 text-[clamp(1.9rem,8vw,3.25rem)] text-nero">
                L'unica società di hockey su pista delle Marche
              </p>
              <p className="misura mt-4 text-[17px] leading-relaxed text-nero">
                Le altre del girone sono tutte in Emilia: Modena, Correggio, Mirandola, Scandiano. Chi da queste parti
                vuole giocare a hockey su pista, gioca qui.
              </p>
              {/* Le fonti stanno nelle pagine di dentro, non in vetrina: la
                  home di una squadra si guarda, non si legge. */}
            </Rivela>
          </div>
        </div>
      </section>
    </>
  )
}
