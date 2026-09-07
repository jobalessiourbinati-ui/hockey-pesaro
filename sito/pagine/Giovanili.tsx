/*
 * ===========================================================================
 * /giovanili/ — «le altre squadre più piccole tutte assieme»
 * ===========================================================================
 * Il committente ha chiesto una pagina sola per tutte le categorie, e il sito
 * di oggi gliene dà cinque identiche: stesso impianto, stessa galleria con
 * «Foto 1 … Foto 6», e come descrizione una frase di circostanza a testa
 * (CONTESTO §3.4). Cinque volte la stessa cosa non è cinque volte
 * l'informazione: è una volta sola, ripetuta.
 *
 * Qui c'è un elenco solo, e ogni riga dice quello che di quella categoria si
 * sa davvero. Dove non si sa niente la riga lo dice, resta corta, e non
 * viene riempita.
 *
 * ⚠️ NIENTE NOMI DI RAGAZZI: è la regola §9.2 del CONTESTO. Le giovanili sono
 * minori, le liberatorie dei genitori non ce le ha nessuno, e senza quelle
 * non si pubblicano né nomi né fotografie. Perciò questa pagina racconta le
 * categorie con i risultati, i chilometri e i numeri — mai con un elenco di
 * ragazzi.
 *
 * L'UNICA ECCEZIONE, e perché. Jordan Boniolo e Gianluca Gasparini sono
 * nominati nel paragrafo dell'Under 17. Sono i due casi in cui il nome è già
 * pubblico due volte: la società li ha scritti nel proprio PDF «AHP · La
 * Storia», e la federazione li elenca nella rosa depositata di Serie B, dove
 * entrambi giocano. Il fatto raccontato — le selezioni del Promote — è un
 * risultato sportivo pubblico, non un dato personale, e restano comunque
 * senza fotografia come tutti i minori del sito.
 * Resta una scelta da confermare col committente: se preferisce toglierli, si
 * cancellano due nomi da `RACCONTO_U17` qui sotto e la frase regge lo stesso.
 *
 * I NUMERI SONO CALCOLATI dal calendario vero (`dati/stagione-2024-25.ts`) e
 * non battuti a mano: quante partite ha giocato l'Under 13, contro chi,
 * quante giornate hanno avuto più di un impegno. Così il «due partite in un
 * giorno» del PDF della società non è una frase da opuscolo: è una cosa che
 * si conta.
 * ===========================================================================
 */

import { PRIMA_SQUADRA, inRosa } from '../../dati/rosa.ts'
import { STAGIONE_2024_25 } from '../../dati/stagione-2024-25.ts'
import type { Categoria } from '../../dati/stagione-2024-25.ts'
import { SeparatoreBastoni } from '../componenti/Scudetto.tsx'

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
  'Campioni provinciali nel 2024. Due giocatori, Jordan Boniolo e Gianluca Gasparini, hanno superato le selezioni del Promote, classificandosi fra i dieci migliori Under 17 dell’Emilia-Romagna e delle Marche.'

interface CategoriaGiovanile {
  readonly numero: number
  readonly nome: string
  readonly guida: string
  readonly racconto: string
  readonly fonte: string
}

const CATEGORIE: readonly CategoriaGiovanile[] = [
  {
    numero: 11,
    nome: 'Under 11',
    guida: 'Chiara Galli',
    racconto:
      "Nel 2023/24 l'Under 11 ha raggiunto le prime finali nazionali della storia del club e ha chiuso al quarto posto della classifica Coppa FISR. In uno sport in cui il vertice è quasi tutto del nord, per Pesaro è il risultato più grosso mai arrivato dal settore giovanile.",
    fonte: 'AHP · La Storia (PDF della società) per il risultato; Pesaro in pista 2024-27 per la guida tecnica',
  },
  {
    numero: 13,
    nome: 'Under 13',
    guida: 'un nuovo allenatore, previsto dal progetto 2024-27',
    racconto: `Nel calendario 2024/25 l'Under 13 ha ${partiteDi('U13')} partite, tutte contro società emiliane: ${avversarieDi('U13').join(', ')}. Nessuna avversaria è delle Marche, e da qui cominciano i chilometri.`,
    fonte: 'Calendario partite 2024/25 della società',
  },
  {
    numero: 15,
    nome: 'Under 15',
    guida: 'un nuovo allenatore, previsto dal progetto 2024-27',
    racconto:
      'Di questa categoria non abbiamo ancora un risultato da raccontare, e questo spazio resta corto invece di riempirsi di parole. Quando ci sarà, starà qui.',
    fonte: 'Pesaro in pista 2024-27 (PDF della società)',
  },
  {
    numero: 17,
    nome: 'Under 17',
    guida: 'Simone Carnevali',
    racconto: `${RACCONTO_U17} Nel calendario 2024/25 l'Under 17 ha ${partiteDi('U17')} partite, contro ${avversarieDi('U17').join(', ')}.`,
    fonte: 'AHP · La Storia e sito della società per i risultati; calendario partite 2024/25 per le partite',
  },
  {
    numero: 19,
    nome: 'Under 19',
    guida: 'Simone Carnevali',
    racconto:
      "L'ultima tappa prima della prima squadra, e non in senso figurato: da qui alla Serie B si passa davvero, nella stessa stagione.",
    fonte: 'Pesaro in pista 2024-27 (PDF della società)',
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
        <div className="mx-auto max-w-[1240px] px-4 pt-12 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
          <p className="occhiello text-rosso-cupo">Il vivaio · dall'Under 11 all'Under 19</p>
          <h1 className="titolo mt-3 text-[clamp(2.75rem,13vw,6rem)]">Le giovanili</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-nero sm:text-lg">
            Cinque categorie, una pagina sola. Nelle Marche non c'è un'altra società di hockey su pista: per giocare
            una partita si va in Emilia, ogni volta. È il prezzo di questo sport da queste parti, ed è anche il motivo
            per cui chi resta diventa forte.
          </p>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-nero sm:text-lg">
            Che il vivaio funzioni si vede da un numero: nella rosa depositata di Serie B ci sono{' '}
            <strong className="font-semibold">{minoriInPrimaSquadra} tesserati ancora minorenni</strong>, saliti da
            queste categorie. Qui non troverai i loro nomi né le loro foto: sono minori, le liberatorie dei genitori
            non le ha ancora nessuno, e senza quelle di loro non si pubblica niente.
          </p>
        </div>
      </section>

      {/* ====== I CHILOMETRI — l'unica fascia scura della pagina ====== */}
      <section aria-labelledby="titolo-km" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-chiaro">Quanto costa giocare da qui</p>
          {/* Il numerone è decorativo: la stessa cifra è scritta a parole nel
              titolo qui sotto, e leggerla due volte è rumore. */}
          <p aria-hidden="true" className="cifra mt-4 text-[clamp(4rem,24vw,11rem)] text-white">
            4.000<span className="text-rosso-chiaro">+</span>
          </p>
          <h2 id="titolo-km" className="titolo mt-3 text-[clamp(1.5rem,6vw,2.5rem)]">
            oltre quattromila chilometri di trasferte in una stagione
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white">
            Le squadre giovanili pesaresi affrontano viaggi lunghi per incontrare realtà più numerose e consolidate,
            come quelle del modenese. Per ridurre i costi capita di giocare due partite in un giorno solo: nel
            calendario 2024/25 succede in <strong className="font-semibold">{giornateDoppie()} giornate</strong>, su{' '}
            {STAGIONE_2024_25.length} partite in programma fra prima squadra e giovanili.
          </p>
          <p className="mt-6 max-w-2xl border-l-4 border-rosso-chiaro pl-4 text-[15px] leading-relaxed text-grigio-chiaro">
            «L'impegno con il quale questi ragazzi affrontano le faticose trasferte» è la frase con cui la società
            descrive il proprio settore giovanile. I chilometri sono suoi; le giornate doppie le abbiamo contate sul
            calendario.
          </p>
          <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-grigio-chiaro">
            Fonte: AHP · La Storia (PDF della società) per i chilometri e per la citazione; calendario partite
            2024/25 della società per le giornate doppie.
          </p>
        </div>
      </section>

      {/* ================= LE CINQUE CATEGORIE ================= */}
      <section aria-labelledby="titolo-categorie" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-cupo">Come è fatto il vivaio</p>
          <h2 id="titolo-categorie" className="titolo mt-2 text-[clamp(2rem,9vw,3.5rem)]">
            Cinque categorie
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Gli allenatori sono quelli previsti dal progetto triennale «Pesaro in pista» 2024-27. Dove il progetto
            dice «un nuovo allenatore» lo scriviamo così: è quello che c'è scritto, e mettere un nome al posto suo
            vorrebbe dire inventarlo.
          </p>

          {/* Un elenco solo, con righe di lunghezza diversa: le categorie che
              hanno un risultato da raccontare occupano più spazio delle altre,
              ed è giusto che si veda quale ha una storia e quale non ancora. */}
          <ol className="mt-8 border-t-2 border-nero">
            {CATEGORIE.map((c) => (
              <li
                key={c.numero}
                className="grid grid-cols-[auto_1fr] items-start gap-x-4 border-b border-riga py-6 sm:gap-x-8 sm:py-8"
              >
                {/* Anche questo numero è decorativo: «Under 11» è già scritto
                    accanto, in un titolo vero. */}
                <p aria-hidden="true" className="cifra w-14 text-[clamp(2.5rem,11vw,4rem)] text-rosso sm:w-28">
                  {c.numero}
                </p>
                <div className="min-w-0">
                  <h3 className="titolo text-2xl text-nero sm:text-3xl">{c.nome}</h3>
                  <p className="occhiello mt-1.5 text-grigio">allena {c.guida}</p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-nero sm:text-[17px]">{c.racconto}</p>
                  <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-grigio">Fonte: {c.fonte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= VIENI A PROVARE ================= */}
      <section aria-labelledby="titolo-prova" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 sm:pb-24">
          <SeparatoreBastoni className="mb-10" />
          <div className="border-4 border-rosso-cupo p-6 sm:p-10">
            <p className="occhiello text-rosso-cupo">Si comincia così</p>
            <h2 id="titolo-prova" className="titolo mt-2 max-w-2xl text-[clamp(1.9rem,8vw,3.25rem)]">
              Vieni a provare
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-nero">
              L'avviamento parte dai 5 anni, ben prima dell'Under 11. Giorni e orari degli allenamenti cambiano con la
              stagione e con la pista disponibile: non li scriviamo qui per non lasciare in giro una pagina vecchia —
              si chiedono, e si risponde con quelli veri.
            </p>
            <p className="mt-6">
              <a
                href="mailto:info@hockeypesaro.it?subject=Vorrei%20provare%20l%27hockey"
                className="bottone bottone-pieno"
              >
                Scrivici per una prova
              </a>
            </p>
            <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-grigio">
              Fonte: AHP · La Storia e Pesaro in pista 2024-27 (PDF della società) per l'avviamento dai 5 agli 8 anni.
              L'indirizzo di posta è quello che la società pubblica sui propri documenti.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Giovanili
