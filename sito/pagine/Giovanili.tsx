/*
 * ===========================================================================
 * /giovanili/ — «le altre squadre più piccole tutte assieme»
 * ===========================================================================
 * Il committente ha chiesto una pagina sola per tutte le categorie, e il sito
 * di oggi gliene dà cinque identiche: stesso impianto, stessa galleria con
 * «Foto 1 … Foto 6», una frase di circostanza a testa. Cinque volte la stessa
 * cosa non è cinque volte l'informazione: è una volta sola, ripetuta.
 *
 * Qui c'è un elenco solo, e ogni riga dice quello che di quella categoria si
 * sa davvero — in due righe, non in un paragrafo. Dove non si sa niente la
 * riga lo dice, resta corta, e non viene riempita.
 *
 * ⚠️ LE FOTOGRAFIE DEI RAGAZZI, E A QUALE CONDIZIONE.
 * Fino all'08/09/2026 questa pagina non mostrava nessun minore: la regola
 * (CONTESTO §9.2) è che senza liberatoria non si pubblica niente di
 * riconoscibile. Quel giorno **la società ha dichiarato che le famiglie hanno
 * firmato la circolare per le foto** (Alessio Urbinati), e da lì la fotografia
 * di questa pagina è il gruppo delle giovanili.
 *
 * Il permesso poggia su quella dichiarazione, non su un documento che abbiamo
 * letto noi: se la circolare non coprisse la pubblicazione sul sito — una cosa
 * diversa dalle foto interne — si torna alla fotografia della prima squadra,
 * che sono adulti, e si cambia una riga sola.
 *
 * L'UNICA ECCEZIONE SUI NOMI, e perché. Jordan Boniolo e Gianluca Gasparini
 * sono nominati nell'Under 17: il nome è già pubblico due volte — la società
 * li ha scritti nel proprio PDF, la federazione li elenca nella rosa
 * depositata di Serie B, dove entrambi giocano. Il fatto raccontato è un
 * risultato sportivo pubblico, non un dato personale, e restano senza
 * fotografia come tutti i minori del sito. Se il committente preferisce
 * toglierli, si cancellano due nomi da `RACCONTO_U17` e la frase regge.
 *
 * I NUMERI SONO CALCOLATI dal calendario vero (`dati/stagione-2024-25.ts`) e
 * non battuti a mano: quante partite ha giocato l'Under 13, contro chi,
 * quante giornate hanno avuto più di un impegno. Così il «due partite in un
 * giorno» del PDF della società non è una frase da opuscolo: è una cosa che si
 * conta.
 * ===========================================================================
 */

import { PRIMA_SQUADRA, inRosa } from '../../dati/rosa.ts'
import { STAGIONE_2024_25 } from '../../dati/stagione-2024-25.ts'
import type { Categoria } from '../../dati/stagione-2024-25.ts'
import { Foto, Velatura } from '../componenti/Foto.tsx'
import { link } from '../rotte.ts'

/* --- quello che si conta dal calendario, invece di ricordarselo ----------- */

const partiteDi = (c: Categoria): number => STAGIONE_2024_25.filter((p) => p.categoria === c).length

/** Le giornate in cui in calendario c'è più di una partita. Il PDF della
 *  società dice che le squadre giocano «due partite in un solo giorno per
 *  ridurre i costi logistici»: questo conta quante volte è successo. */
const giornateDoppie = (): number => {
  const perGiorno = new Map<string, number>()
  for (const p of STAGIONE_2024_25) perGiorno.set(p.data, (perGiorno.get(p.data) ?? 0) + 1)
  return [...perGiorno.values()].filter((n) => n > 1).length
}

/** Le avversarie incontrate da una categoria. Nessuna è delle Marche, ed è
 *  esattamente da lì che vengono i chilometri. */
const avversarieDi = (c: Categoria): readonly string[] =>
  [...new Set(STAGIONE_2024_25.filter((p) => p.categoria === c).flatMap((p) => [p.casa, p.ospiti]))]
    .filter((s) => s !== 'Pesaro')
    .sort((a, b) => a.localeCompare(b))

/* --- le cinque categorie ------------------------------------------------- */

const RACCONTO_U17 =
  'Campioni provinciali nel 2024. Jordan Boniolo e Gianluca Gasparini fra i dieci migliori Under 17 di Emilia-Romagna e Marche alle selezioni Promote.'

interface CategoriaGiovanile {
  readonly numero: number
  readonly nome: string
  readonly guida: string
  readonly racconto: string
}

const CATEGORIE: readonly CategoriaGiovanile[] = [
  {
    numero: 11,
    nome: 'Under 11',
    guida: 'Jason Jamerson',
    racconto:
      "Nel 2023/24 le prime finali nazionali della storia del club, e il quarto posto nella classifica Coppa FISR.",
  },
  {
    numero: 13,
    nome: 'Under 13',
    guida: 'Jason Jamerson',
    racconto: `${partiteDi('U13')} partite nel 2024/25, tutte contro società emiliane: ${avversarieDi('U13').join(', ')}.`,
  },
  {
    numero: 15,
    nome: 'Under 15',
    guida: 'Jason Jamerson',
    racconto: 'Non abbiamo ancora un risultato da raccontare. Questo spazio resta corto finché non c’è.',
  },
  {
    numero: 17,
    nome: 'Under 17',
    guida: 'Jason Jamerson',
    racconto: RACCONTO_U17,
  },
  {
    numero: 19,
    nome: 'Under 19',
    guida: 'Jason Jamerson',
    racconto: "L'ultima tappa prima della prima squadra, e non in senso figurato: si passa davvero.",
  },
] as const

export function Giovanili() {
  /* Quanti minorenni ci sono nella rosa depositata di Serie B. È il dato che
     dice meglio di ogni frase a cosa serve un settore giovanile, ed è un
     totale — non un elenco: nessun nome, nessuna età, niente da chiedere a
     nessun genitore. */
  const minoriInPrimaSquadra = PRIMA_SQUADRA.filter((p) => inRosa(p) && p.minore === true).length

  return (
    <>
      {/* ================= INTESTAZIONE ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-12">
          <p className="occhiello text-rosso-cupo">Il vivaio · dall'Under 11 all'Under 19</p>
          <h1 className="titolo mt-2 text-[clamp(2.75rem,13vw,6rem)]">Le giovanili</h1>
          <p className="mt-4 max-w-xl text-[17px] leading-snug text-nero sm:text-lg">
            Cinque categorie, una pagina sola. Nelle Marche non c'è un'altra società di hockey su pista: per giocare
            una partita si va in Emilia, ogni volta.
          </p>
        </div>
      </section>

      {/* ====== IL DATO CHE CONTA, sopra la fotografia della prima squadra ====== */}
      <section
        aria-labelledby="titolo-minori"
        className="su-nero relative isolate flex min-h-[46vh] items-end overflow-hidden bg-nero-fondo text-white sm:min-h-[54vh]"
      >
        <div className="absolute inset-0 -z-10">
          <Foto nome="giovanili-squadra" alt="Il gruppo delle giovanili dell'Amatori Hockey Pesaro sulla pista." primaCosa />
          <Velatura />
        </div>

        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14" data-sopra-foto>
          {/* Sopra la fotografia il testo è bianco, sempre: vedi la nota in
              `componenti/Foto.tsx`. L'accento è il filetto rosso pieno. */}
          <span aria-hidden="true" className="mb-3 block h-1.5 w-20 bg-rosso" />
          <p className="occhiello text-white">Che il vivaio funzioni si vede da un numero</p>
          <p className="cifra mt-2 text-[clamp(5rem,26vw,10rem)] text-white">{minoriInPrimaSquadra}</p>
          <h2 id="titolo-minori" className="titolo mt-2 max-w-2xl text-[clamp(1.75rem,8vw,3rem)] text-white">
            tesserati ancora minorenni nella rosa di Serie B
          </h2>
          <p className="mt-3 max-w-lg text-[16px] leading-snug text-white">Saliti da queste categorie.</p>
        </div>
      </section>

      {/* ====== I CHILOMETRI ====== */}
      <section aria-labelledby="titolo-km" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-chiaro">Quanto costa giocare da qui</p>
          {/* Il numerone è decorativo: la stessa cifra è scritta a parole nel
              titolo qui sotto, e leggerla due volte è rumore. */}
          <p aria-hidden="true" className="cifra mt-3 text-[clamp(4rem,24vw,11rem)] text-white">
            4.000<span className="text-rosso-chiaro">+</span>
          </p>
          <h2 id="titolo-km" className="titolo mt-2 text-[clamp(1.5rem,6vw,2.5rem)]">
            oltre quattromila chilometri di trasferte in una stagione
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-snug text-white">
            Per ridurre i costi capita di giocare due partite in un giorno solo: nel calendario 2024/25 succede in{' '}
            <strong className="font-semibold">{giornateDoppie()} giornate</strong> su {STAGIONE_2024_25.length}{' '}
            partite fra prima squadra e giovanili.
          </p>
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-grigio-chiaro">
            Fonte: AHP · La Storia (PDF della società) per i chilometri; calendario partite 2024/25 della società per
            le giornate doppie.
          </p>
        </div>
      </section>

      {/* ================= LE CINQUE CATEGORIE ================= */}
      <section aria-labelledby="titolo-categorie" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-cupo">Come è fatto il vivaio</p>
          <h2 id="titolo-categorie" className="titolo mt-1 text-[clamp(2rem,9vw,3.5rem)]">
            Cinque categorie
          </h2>

          {/* Un elenco solo, con righe di lunghezza diversa: le categorie che
              hanno un risultato da raccontare occupano più spazio delle altre,
              ed è giusto che si veda quale ha una storia e quale non ancora. */}
          <ol className="mt-7 border-t-2 border-nero">
            {CATEGORIE.map((c) => (
              <li
                key={c.numero}
                className="grid grid-cols-[auto_1fr] items-start gap-x-4 border-b border-riga py-5 sm:gap-x-8 sm:py-7"
              >
                {/* Anche questo numero è decorativo: «Under 11» è già scritto
                    accanto, in un titolo vero. */}
                <p aria-hidden="true" className="cifra w-16 text-[clamp(3rem,13vw,4.5rem)] text-rosso sm:w-28">
                  {c.numero}
                </p>
                <div className="min-w-0">
                  <h3 className="titolo text-2xl text-nero sm:text-3xl">{c.nome}</h3>
                  <p className="occhiello mt-1 text-grigio">allena {c.guida}</p>
                  <p className="mt-2 max-w-2xl text-[15px] leading-snug text-nero sm:text-[17px]">{c.racconto}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Le fonti, in una riga sola. */}
          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-grigio">
            Fonti: portale FISR e documenti della società; allenatori confermati dalla società.
          </p>
        </div>
      </section>

      {/* ================= VIENI A PROVARE ================= */}
      <section aria-labelledby="titolo-prova" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="border-4 border-rosso-cupo p-6 sm:p-10">
            <p className="occhiello text-rosso-cupo">Si comincia così</p>
            <h2 id="titolo-prova" className="titolo mt-2 max-w-2xl text-[clamp(1.9rem,8vw,3.25rem)]">
              Vieni a provare
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-snug text-nero">
              L'avviamento parte dai 5 anni. Giorni e orari cambiano con la stagione e con la pista disponibile: non
              li scriviamo qui per non lasciare in giro una pagina vecchia — si chiedono, e si risponde con quelli
              veri.
            </p>
            <p className="mt-5">
              <a
                href="mailto:info@hockeypesaro.it?subject=Vorrei%20provare%20l%27hockey"
                className="bottone bottone-pieno"
              >
                Scrivici per una prova
              </a>
            </p>
            <p className="mt-4">
              <a href={link('/squadra/')} className="text-[15px] text-rosso-cupo underline underline-offset-4">
                Da qui si arriva in prima squadra
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Giovanili
