/*
 * ===========================================================================
 * /storia/ — la storia vera, che sul sito di oggi non c'è
 * ===========================================================================
 * È il difetto peggiore del sito attuale: la pagina STORIA mostra il
 * contenuto delle GIOVANILI — titolo del documento «Le Giovanili», le stesse
 * cinque categorie (CONTESTO §3.1). La storia esiste, ma sta chiusa dentro un
 * PDF della libreria media che dal sito non si raggiungeva:
 * `rilievo/pdf/AHP-La-Storia.pdf`, dieci pagine, dal 1946 al 2024.
 *
 * Qui quel PDF diventa una linea del tempo che si legge sul telefono: un
 * filetto verticale, l'anno in rosso, un fatto per tappa. Niente caroselli e
 * niente animazioni allo scorrimento — una storia si legge, non si guarda
 * passare.
 *
 * ⚠️ QUELLO CHE IL PDF NON DICE, QUI NON C'È.
 * Il PDF racconta «le difficoltà economiche che portarono alla chiusura
 * temporanea della società» ma non scrive l'anno, e nessun'altra fonte del
 * rilievo lo scrive. Perciò la tappa della chiusura non ha una data: dice che
 * è successo, e dice che l'anno non lo sappiamo. Mettere lì un anno
 * plausibile sarebbe l'errore più facile di tutta la pagina, e il più
 * difficile da scoprire per chi legge.
 *
 * Per lo stesso motivo non si usa la tabella dei piazzamenti a pagina 5 del
 * PDF: è un grafico, e il testo estratto ne restituisce le etichette
 * mescolate («1° 2° 3° Campionato Coppa Italia 2018-19 … 2023-24»).
 * Ricostruire da lì chi è arrivato dove vorrebbe dire indovinare un palmarès.
 *
 * Ogni tappa porta la sua fonte: è la regola §9.5 del CONTESTO.
 * ===========================================================================
 */

import { FONTE_FEDERALE, STAGIONE_ROSA } from '../../dati/rosa.ts'
import { GIRONE_CAMPIONATO } from '../../dati/stagione-2026-27.ts'
import { SeparatoreBastoni } from '../componenti/Scudetto.tsx'

interface Tappa {
  /** L'anno come si legge in pagina. `null` quando la fonte non lo dice. */
  readonly anno: string | null
  readonly titolo: string
  readonly testo: string
  readonly fonte: string
  /** La tappa che merita il riquadro. Una per pagina, non tre. */
  readonly evidenza?: boolean
}

const TAPPE: readonly Tappa[] = [
  {
    anno: '1946',
    titolo: 'Nasce lo Skating Club Pesaro',
    testo:
      "Nell'Italia che si rialza dalla guerra nasce lo Skating Club Pesaro. Diventa presto uno dei pilastri dello sport cittadino e contribuisce a diffondere l'hockey su pista: centinaia di tesserati, e una presenza costante nei tornei locali e nazionali.",
    fonte: 'AHP · La Storia (PDF della società)',
  },
  {
    anno: 'Gli anni d’oro',
    titolo: 'Corrado Amori, Enzo Boiani e la pista di Viale Trieste',
    testo:
      "Presidente storico è Corrado Amori. Enzo Boiani produce pattini di alta qualità, usati a livello internazionale, ed è lui a costruire la pista di pattinaggio di Viale Trieste — quella che ancora oggi si chiama Pista al mare. Intorno al club lavorano i dirigenti Gaetano Ginepro, Giorgio Baioni, Giancarlo Pagnini e Galeazzo Boattini; il sostegno economico arriva da imprese pesaresi, la Morbidelli dei forni e l'Italcomma.",
    fonte: 'AHP · La Storia (PDF della società)',
  },
  {
    anno: null,
    titolo: 'Poi lo Skating Club chiude',
    testo:
      "Le difficoltà economiche portano alla chiusura della società. In che anno, non lo sappiamo: il documento della società non lo scrive e nessun'altra fonte raccolta lo dice — quindi qui non c'è una data messa al suo posto. Quello che il documento scrive è che «lo spirito non si spense mai».",
    fonte: 'AHP · La Storia (PDF della società) — la data manca alla fonte',
  },
  {
    anno: '2016',
    titolo: "Rinasce come Amatori Hockey Pesaro",
    testo:
      "Sulle ceneri dello Skating Club nasce l'Amatori Hockey Pesaro, con l'obiettivo di rimettere in moto l'hockey su pista in città e con la guida del presidente Edgar Vincent Barberi. Da subito la società non punta solo sulla squadra senior: costruisce un settore giovanile, che è poi la parte che darà i risultati.",
    fonte: 'AHP · La Storia (PDF della società); registro CONI per il legale rappresentante',
  },
  {
    anno: 'I primi due campionati',
    titolo: 'Si gioca nel girone del sud',
    testo:
      "All'inizio l'Amatori Pesaro viene inserita nel girone meridionale: si va a giocare contro le pugliesi Molfetta e Giovinazzo, le campane Salerno ed Eboli, le lucane Roller Matera e Asd Matera. Negli anni successivi Pesaro passa stabilmente al girone Emilia Romagna – Marche, che ogni tanto comprende anche squadre del mantovano o del cremonese.",
    fonte: 'AHP · La Storia (PDF della società)',
  },
  {
    anno: '2020/21',
    titolo: 'La finale di Coppa Nazionale, a Forte dei Marmi',
    testo:
      "È il risultato più prestigioso della società. Una formazione con giocatori di grande esperienza — il molfettese Daniele Uva, i modenesi Andrea Lucchi e Davide Ferri, insieme ai fratelli Barberi — domina il girone di qualificazione, supera i toscani del Prato nei quarti di finale e i vicentini dell'Hockey Montecchio Precalcino in semifinale. La finale della Coppa Nazionale di Serie B si gioca a Forte dei Marmi, contro l'Engas Vercelli.",
    fonte: 'AHP · La Storia (PDF della società)',
    evidenza: true,
  },
  {
    anno: '2023/24',
    titolo: 'Spazio ai pesaresi, e le prime finali nazionali',
    testo:
      "Stagione complicata in prima squadra, con molti infortuni, ma la scelta è dichiarata: dare spazio ai pesaresi Alessio Urbinati, Filippo Roberti e Nicholas Ridolfi, appoggiati dai veterani Pierluigi Morri, Edgar e Antonino Barberi, con il contributo dei vicentini Alessandro Zanazzo e Jonathan Dal Santo. Nello stesso anno l'Under 11 raggiunge le prime finali nazionali della storia del club e chiude al quarto posto della classifica Coppa FISR.",
    fonte: 'AHP · La Storia (PDF della società)',
  },
  {
    anno: '2024/25',
    titolo: 'Arriva Simone Carnevali',
    testo:
      "Simone Carnevali, che da giocatore ha militato in Serie A con Modena, Vercelli e Scandiano e ha poi allenato a Bassano e Scandiano, prende la prima squadra e l'Under 19. Viene confermato il portiere colombiano Juan Giraldo, che è anche il preparatore dei portieri della società. All'inizio del campionato, a Correggio, Carnevali è allenatore-giocatore.",
    fonte: 'AHP · La Storia (PDF della società); Il Resto del Carlino, 04/01/2025',
  },
  {
    anno: STAGIONE_ROSA,
    titolo: 'Un altro cambio in panchina',
    testo:
      "Nella rosa depositata in federazione per la Serie B il capo allenatore risulta Edoardo Rubien Escardilla, allenatore di primo livello; Simone Carnevali, che l'anno prima guidava la prima squadra, compare come allenatore di terzo livello. È un passaggio che il sito attuale non racconta, e che invece sul portale federale si legge.",
    fonte: `Portale dei risultati FISR, staff depositato per la Serie B ${STAGIONE_ROSA}`,
  },
]

const FONTI = [
  {
    nome: 'AHP · La Storia',
    dettaglio:
      "Documento della società, dieci pagine, 1946-2024. Stava nella libreria media del sito vecchio, e dal sito non si raggiungeva.",
  },
  {
    nome: 'Portale dei risultati FISR',
    dettaglio: 'Rose depositate, staff tesserato, gironi e calendari. Codice di affiliazione della società: 3947.',
  },
  { nome: 'Registro CONI', dettaglio: 'Legale rappresentante della società: Edgar Vincent Barberi.' },
  {
    nome: 'Il Resto del Carlino',
    dettaglio:
      'Cronache locali del 04/01/2025 e del 07/03/2025: inizio di campionato a Correggio con Carnevali allenatore-giocatore, e Scandianese-Pesaro 5-4.',
  },
] as const

export function Storia() {
  return (
    <>
      {/* ================= INTESTAZIONE ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-12 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
          <p className="occhiello text-rosso-cupo">Dal 1946 a oggi</p>
          <h1 className="titolo mt-3 text-[clamp(2.75rem,13vw,6rem)]">La nostra storia</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-nero sm:text-lg">
            Ottant'anni di hockey su pista a Pesaro: una città che di questo sport ha avuto un club fra i più
            frequentati, poi non l'ha più avuto per anni, e se l'è ricostruito. Quello che segue viene dal documento
            della società, dal registro CONI e dal portale federale — e ogni tappa dice da dove viene.
          </p>
        </div>
      </section>

      {/* ================= LA LINEA DEL TEMPO ================= */}
      <section aria-labelledby="titolo-tempo" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 sm:pb-20">
          <h2 id="titolo-tempo" className="sr-only">
            Le tappe della società, dal 1946 a oggi
          </h2>

          {/* Il filetto è il bordo sinistro di ogni voce, il quadratino rosso è
              il segno della tappa: nessuna immagine, nessuna animazione allo
              scorrimento. Su un telefono in tribuna deve solo leggersi. */}
          <ol className="max-w-3xl">
            {TAPPE.map((t) => (
              <li key={t.titolo} className="relative border-l-2 border-riga pb-10 pl-5 last:pb-0 sm:pl-8">
                <span aria-hidden="true" className="absolute top-2 -left-[7px] block h-3 w-3 bg-rosso-cupo" />

                {/* Una tappa non ha l'anno, ed è quella che conta di più non
                    falsificare: vedi la nota in testa al file.
                    Le altre a volte hanno un anno («1946») e a volte un
                    periodo («Gli anni d'oro»). Non si scrivono uguale: la
                    classe `.cifra` ha interlinea 0,82, misura giusta per le
                    cifre che non hanno discendenti e sbagliata per una «g»,
                    che finiva addosso al titolo sotto. Quindi le cifre restano
                    cifre, e i periodi diventano un occhiello grande — più
                    piccolo, quindi in rosso-cupo, che a quella misura tiene i
                    4,5:1 mentre il rosso della marca no. */}
                {t.anno !== null &&
                  (/^\d/.test(t.anno) ? (
                    <p className="cifra text-[clamp(1.75rem,7vw,2.75rem)] text-rosso">{t.anno}</p>
                  ) : (
                    <p className="font-titolo text-[clamp(1.25rem,5vw,1.75rem)] leading-tight tracking-[0.02em] text-rosso-cupo uppercase">
                      {t.anno}
                    </p>
                  ))}

                <div className={t.evidenza ? 'mt-3 border-4 border-rosso-cupo bg-panna p-5 sm:p-8' : 'mt-2'}>
                  {t.evidenza && <p className="occhiello text-rosso-cupo">Il risultato più prestigioso</p>}
                  <h3
                    className={`titolo text-nero ${t.evidenza ? 'mt-2 text-[clamp(1.5rem,6vw,2.25rem)]' : 'text-xl sm:text-2xl'}`}
                  >
                    {t.titolo}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-nero sm:text-[17px]">{t.testo}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-grigio">Fonte: {t.fonte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ OGGI — l'unica fascia scura della pagina ============ */}
      <section aria-labelledby="titolo-oggi" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-chiaro">Oggi</p>
          <h2 id="titolo-oggi" className="titolo mt-2 max-w-3xl text-[clamp(2rem,9vw,3.75rem)]">
            L'unica società di hockey su pista delle Marche
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white">
            Nel registro della Federazione Italiana Sport Rotellistici l'Amatori Hockey Pesaro risulta l'unica società
            di hockey su pista della regione, con il codice di affiliazione 3947. Per il 2026/27 la Serie B l'ha
            inserita nel {GIRONE_CAMPIONATO}, dieci giornate a partire dal 10 gennaio 2027.
          </p>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-grigio-chiaro">
            La pista di Viale Trieste che costruì Enzo Boiani è ancora lì, ed è ancora quella dove si gioca d'estate:
            ottant'anni dopo, il posto è lo stesso.
          </p>
        </div>
      </section>

      {/* ================= LE FONTI ================= */}
      <section aria-labelledby="titolo-fonti" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <SeparatoreBastoni className="mb-10" />
          <h2 id="titolo-fonti" className="titolo text-[clamp(1.5rem,6vw,2.25rem)]">
            Da dove viene questa pagina
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Non è una ricostruzione a memoria. Ogni fatto scritto qui sopra ha una di queste fonti, e dove la fonte
            tace il testo lo dice invece di colmare il vuoto. Rose, staff e calendari si controllano sul{' '}
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
          <ul className="mt-6 max-w-3xl divide-y divide-riga border-y border-riga">
            {FONTI.map((f) => (
              <li key={f.nome} className="py-4">
                <p className="titolo text-lg text-nero">{f.nome}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-grigio">{f.dettaglio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default Storia
