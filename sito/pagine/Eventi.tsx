/*
 * ===========================================================================
 * /eventi/ — quello che è annunciato, e quello che è soltanto previsto
 * ===========================================================================
 * Questa pagina ha un solo problema serio, e non è grafico: mescolare le due
 * cose. Il Torneo Città di Pesaro la società lo ha annunciato davvero, con
 * date, luogo e categorie. Il Memorial Perry e il Trofeo Boattini stanno nel
 * progetto triennale «Pesaro in pista» 2024-27 come eventi **da fare**: non
 * hanno una data, non hanno un programma, e scriverli accanto al primo come se
 * fossero appuntamenti fissati sarebbe inventare un calendario.
 *
 * Perciò ogni evento porta il suo stato in chiaro — «annunciato» o «previsto
 * dal progetto» — e i previsti hanno il bordo tratteggiato: la differenza si
 * vede prima di leggerla. Il sito attuale invece riempie il calendario con due
 * riquadri «Prossimo evento in arrivo», che è un modo elegante di non dire
 * niente.
 *
 * ⚠️ LE DATE NON SI INVENTANO, NEMMENO QUELLE FACILI.
 * Il torneo è annunciato per il 3, 4 e 5 luglio. L'edizione annunciata sul
 * sito è quella del 2026, che a oggi è passata: la pagina lo calcola da sé
 * confrontando la data con l'oggi del browser e cambia il testo, invece di
 * lasciare in giro un annuncio scaduto o — peggio — di spostarlo all'anno dopo
 * da solo. Che il torneo si ripeta è probabile; «probabile» non è una data.
 *
 * ⚠️ IL LUOGO È DA CONFERMARE, e non per pignoleria. La stessa pagina del sito
 * attuale nomina due posti diversi per lo stesso torneo: nel testo «il
 * Palazzetto dello Sport», nella scheda «Pista al mare». Qui si scrive Pista al
 * mare — è la pista di Viale Trieste, comunale e scoperta, quella usata da
 * maggio a settembre, e un torneo di luglio si gioca lì. Se il committente dice
 * altro, si cambia una riga in `EVENTI`.
 *
 * ⚠️ LE FOTOGRAFIE SONO IL LUOGO, NON L'EDIZIONE. Del Torneo Città di Pesaro
 * non abbiamo un'immagine certificata; abbiamo però la pista al mare di Viale
 * Trieste — dove il torneo si gioca — in tre momenti veri: le squadre riunite,
 * la premiazione al tramonto, il gioco col lungomare alle spalle. È il luogo
 * giusto sotto il testo giusto, e la didascalia dice esattamente questo invece
 * di lasciar credere che siano scatti di quel torneo.
 * ===========================================================================
 */

import { Foto, Velatura } from '../componenti/Foto.tsx'
import { Rivela } from '../componenti/Rivela.tsx'
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
}

const EVENTI: readonly Evento[] = [
  {
    nome: 'Torneo Città di Pesaro',
    sommario: "Appuntamento estivo aperto a squadre giovanili e senior di tutta Italia, organizzato dall'Amatori.",
    quando: '3, 4 e 5 luglio',
    fineEdizione: '2026-07-05',
    dove: 'Pista al mare, Viale Trieste',
    dettagli: ['Senior, Under 19 e Under 17', 'Ingresso gratuito'],
    stato: 'annunciato',
  },
  {
    nome: 'Memorial Perry',
    sommario: "Vecchie e nuove glorie dell'hockey pesarese, musica e street food. Data non ancora fissata.",
    quando: null,
    fineEdizione: null,
    dove: 'Pista Mare o Pala Borgo',
    dettagli: [],
    stato: 'previsto',
  },
  {
    nome: 'Trofeo Boattini',
    sommario:
      "Stesso spirito del Memorial. Il nome è quello di Galeazzo Boattini, dirigente dello Skating Club degli anni d'oro.",
    quando: null,
    fineEdizione: null,
    dove: 'Pista Mare o Pala Borgo',
    dettagli: [],
    stato: 'previsto',
  },
] as const

/** L'annuncio è ancora buono? Si guarda l'ultimo giorno dell'edizione, non si
 *  tiene a mente. Senza data, non c'è niente da scadere. */
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
        <div className="mx-auto max-w-[1240px] px-4 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-12">
          <p className="occhiello text-rosso-cupo">Tornei e appuntamenti</p>
          <h1 className="titolo mt-2 text-[clamp(2.75rem,13vw,6rem)]">Gli eventi</h1>
          <p className="mt-4 max-w-xl text-[17px] leading-snug text-nero sm:text-lg">
            Un torneo che la società ha annunciato, e due che ha messo nel progetto triennale ma non ha ancora
            fissato. Sono scritti diversi perché sono diversi.
          </p>
        </div>
      </section>

      {/* ====== IL TORNEO — sopra la fotografia ====== */}
      {principale && (
        <section
          aria-labelledby="titolo-torneo"
          className="su-nero relative isolate flex min-h-[54vh] items-end overflow-hidden bg-nero-fondo text-white sm:min-h-[70vh]"
        >
          <div className="absolute inset-0 -z-10">
            {/* NIENTE `center top` QUI, ed è una misura non un gusto: in
                questa fotografia il gruppo sta in basso e il cielo in alto.
                Ancorando in cima le teste erano salve lo stesso — lo sono
                anche al centro, con la fascia alzata — ma il cielo chiaro
                finiva dietro l'occhiello e il contrasto scendeva a 4,55:1,
                cioè al pelo della soglia, mentre il resto del sito sta sopra
                10:1. Al centro il testo torna sul gruppo, che è scuro. */}
            <Foto
              nome="torneo-mare"
              alt="Squadre riunite sulla pista al mare di Viale Trieste, con gli stabilimenti sul fondo."
              primaCosa
            />
            <Velatura />
            {/* UN VELO IN PIÙ, SOLO QUI, E LA QUANTITÀ È CALCOLATA.
                È l'unica fotografia del sito con il cielo aperto dietro il
                testo: misurando i rettangoli VERI delle lettere (non il
                blocco, che è largo quanto la colonna e pesa cielo dove non
                c'è nessuna lettera) il pixel peggiore dell'occhiello faceva
                **4,48:1**, cioè sotto soglia, mentre le altre fasce stanno
                sopra 10:1. Da L=0,184 servono 0,30 di nero per scendere a
                L=0,131, che è ~5,8:1 — margine vero senza spegnere la foto. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-nero-fondo/30" />
          </div>

          <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14" data-sopra-foto>
            {/* Sopra la fotografia il testo è bianco: il rosso chiaro qui
                misurava 1,6:1 sul fondo più illuminato. L'accento è il
                filetto, che è una forma piena. */}
            <span aria-hidden="true" className="mb-3 block h-1.5 w-20 bg-rosso" />
            <p className="occhiello text-white">Il torneo di casa · annunciato</p>
            <h2 id="titolo-torneo" className="titolo mt-2 max-w-3xl text-[clamp(2.25rem,10vw,4.5rem)]">
              {principale.nome}
            </h2>
            <p className="mt-4 max-w-lg text-[17px] leading-snug text-white">{principale.sommario}</p>

            <dl className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-3">
              <div>
                <dt className="occhiello text-white">Quando</dt>
                <dd className="titolo mt-1 text-2xl text-white sm:text-3xl">{principale.quando}</dd>
              </div>
              <div>
                <dt className="occhiello text-white">Dove</dt>
                <dd className="titolo mt-1 text-2xl text-white sm:text-3xl">{principale.dove}</dd>
              </div>
              <div>
                <dt className="occhiello text-white">Chi gioca</dt>
                <dd className="titolo mt-1 text-2xl text-white sm:text-3xl">{principale.dettagli[0]}</dd>
              </div>
            </dl>

            {/* Se l'edizione annunciata è passata, la pagina lo dice invece di
                lasciare in vetrina un annuncio scaduto — e non sposta la data
                all'anno dopo per conto suo. */}
            {!annuncioAncoraValido(principale, oggi) && (
              <p className="mt-7 max-w-xl border-l-4 border-rosso pl-4 text-[15px] leading-snug text-white">
                L'ultima edizione annunciata è quella del luglio 2026, ed è passata. La data della prossima non è
                stata comunicata: non ne mettiamo una plausibile al suo posto.
              </p>
            )}

            <p className="mt-5 max-w-lg text-[13px] leading-snug text-grigio-chiaro">
              Fonte: sito della società, pagina Eventi. La fotografia è la pista al mare, dove il torneo si gioca: non
              è detto che sia di questa edizione.
            </p>
          </div>
        </section>
      )}

      {/* ====== LA PISTA AL MARE — il luogo del torneo, in due scatti veri ====== */}
      <section aria-labelledby="titolo-pista-mare" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 sm:pt-16">
          <p className="occhiello text-rosso-cupo">Dove si gioca</p>
          <h2 id="titolo-pista-mare" className="titolo mt-1 text-[clamp(2rem,9vw,3.5rem)]">
            La pista al mare
          </h2>
          {/* UNA SOLA, e larga. Erano due: la seconda — il campo visto da
              lontano — è passata alla home, dove regge la fascia panoramica di
              «dove giochiamo». Ripeterla qui sarebbe la stessa fotografia in
              due pagine, che è il difetto da cui siamo partiti. */}
          <Rivela className="mt-6 aspect-[3/2] overflow-hidden">
            <Foto
              nome="premiazione-mare"
              alt="Una premiazione al tramonto sulla pista di Viale Trieste."
              quantoLargaLargo="100vw"
            />
          </Rivela>
        </div>
      </section>

      {/* ================= I DUE TORNEI PREVISTI ================= */}
      <section aria-labelledby="titolo-previsti" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-cupo">Nel progetto 2024-27</p>
          <h2 id="titolo-previsti" className="titolo mt-1 text-[clamp(2rem,9vw,3.5rem)]">
            Previsti, non ancora fissati
          </h2>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {previsti.map((e, i) => (
              <Rivela
                come="li"
                ritardo={i * 110}
                key={e.nome}
                className="scheda-viva border-2 border-dashed border-riga p-5 sm:p-8"
              >
                <p className="occhiello text-grigio">Previsto dal progetto</p>
                <h3 className="titolo mt-2 text-2xl text-nero sm:text-3xl">{e.nome}</h3>
                <p className="misura mt-3 text-[15px] leading-snug text-nero">{e.sommario}</p>
                <p className="occhiello mt-3 text-grigio">{e.dove}</p>
              </Rivela>
            ))}
          </ul>

          <p className="misura mt-5 text-[13px] leading-relaxed text-grigio">
            Fonte: Pesaro in pista 2024-27 (PDF della società); AHP · La Storia per Galeazzo Boattini. Sono intenzioni
            scritte dalla società: finché restano tali, il bordo resta tratteggiato.
          </p>
        </div>
      </section>

      {/* ================= LE PARTITE ================= */}
      <section aria-labelledby="titolo-partite" className="border-t-4 border-nero bg-panna">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
          <h2 id="titolo-partite" className="titolo text-[clamp(1.75rem,7vw,2.75rem)]">
            E le partite?
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-snug text-nero">
            Calendario e risultati stanno nelle notizie, in un tabellone solo che si aggiorna con la federazione.
          </p>
          <p className="mt-5">
            <a href={link('/notizie/')} className="bottone bottone-pieno">
              Calendario e risultati
            </a>
          </p>
        </div>
      </section>
    </>
  )
}

export default Eventi
