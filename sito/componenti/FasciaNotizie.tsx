/*
 * ===========================================================================
 * LA FASCIA DELLE NOTIZIE — il carosello che il committente ha chiesto
 * ===========================================================================
 * «caroselli intendo tipo sezione news con un carosello di notizie con quelle
 * più nuove». Questa è quella fascia, e sta in due posti — in home e in cima
 * a /notizie/ — perché è la stessa cosa: scritta due volte, prima o poi le due
 * copie direbbero cose diverse.
 *
 * ⚠️ MAI UN CAROSELLO VUOTO.
 * `dati/notizie.json` è vuoto e resterà vuoto finché non parte la pratica con
 * Meta (CONTESTO §4). Una fila di schede vuote, o una sezione che sparisce,
 * sono due modi di dire a chi apre il sito che il sito non funziona. Quindi
 * quando non ci sono notizie la fascia mostra quello che abbiamo davvero e
 * che a un tifoso interessa uguale: i prossimi appuntamenti e gli ultimi
 * risultati veri, presi dal calendario della società.
 *
 * E li dice per quello che sono. Le partite giocate sono del 2024/25 — il
 * campionato 2026/27 comincia il 10 gennaio 2027 e non ha ancora un risultato
 * — quindi ogni scheda porta scritta la sua stagione. Una scheda con un
 * punteggio e nessuna data è una scheda che mente al primo sguardo.
 * ===========================================================================
 */

import { ARCHIVIO, ETICHETTA_FONTE, indirizzoImmagine, titoloBreve } from '../../dati/notizie.ts'
import { STAGIONE_2024_25, inCasa } from '../../dati/stagione-2024-25.ts'
import type { Partita } from '../../dati/stagione-2024-25.ts'
import { COPPA_ITALIA_2026_27 } from '../../dati/stagione-2026-27.ts'
import { inItaliano, oggiISO, pezziData } from '../date.ts'
import { Carosello } from './Carosello.tsx'
import { indirizzoMedia } from './Foto.tsx'

/* La misura di una scheda. A 390 px se ne vede una e mezza: la mezza è quello
 * che dice «si scorre» senza bisogno di scriverlo. */
const SCHEDA = 'w-[78vw] max-w-[320px] sm:w-[340px] lg:w-[360px]'

/* La fila esce dal margine della pagina e rientra col suo passo: così la
 * prima scheda è allineata al titolo e l'ultima non si ferma prima del bordo
 * dello schermo, che è il segno tipico del carosello fatto male. */
const PISTA = '-mx-4 scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6'

export function FasciaNotizie() {
  const voci = ARCHIVIO.voci.slice(0, 8)
  return voci.length > 0 ? <FilaNotizie voci={voci} /> : <FilaPartite />
}

/* ===========================================================================
 * QUANDO LE NOTIZIE CI SONO
 * =========================================================================== */
function FilaNotizie({ voci }: { readonly voci: typeof ARCHIVIO.voci }) {
  return (
    <Carosello etichetta="Ultime notizie" className={PISTA}>
      {voci.map((v) => (
        <li key={v.id} className={SCHEDA}>
          <article className="flex h-full flex-col border-2 border-nero bg-white">
            {v.immagine === undefined ? null : (
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
              <h3 className="titolo mt-2 text-[1.6rem] text-nero">
                <a href={v.link} target="_blank" rel="noreferrer" className="hover:text-rosso-cupo">
                  {titoloBreve(v.testo)}
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              </h3>
            </div>
          </article>
        </li>
      ))}
    </Carosello>
  )
}

/* ===========================================================================
 * QUANDO NON CI SONO — le partite, che invece ci sono
 * =========================================================================== */

/** I prossimi appuntamenti: quelli veri, dal calendario di Coppa Italia. */
const prossimi = (oggi: string): readonly Partita[] => COPPA_ITALIA_2026_27.filter((p) => p.data >= oggi).slice(0, 4)

/** Le ultime giocate con un risultato scritto in una fonte. Le partite senza
 *  punteggio non entrano: qui niente si completa a memoria. */
const giocate = (): readonly Partita[] =>
  [...STAGIONE_2024_25].filter((p) => p.risultato !== null).sort((a, b) => b.data.localeCompare(a.data)).slice(0, 4)

function FilaPartite() {
  const oggi = oggiISO()
  const daGiocare = prossimi(oggi)
  const fatte = giocate()

  return (
    <Carosello etichetta="Prossimi appuntamenti e ultimi risultati" className={PISTA} soloTesto>
      {daGiocare.map((p) => (
        <li key={`p-${p.data}-${p.ospiti}`} className={SCHEDA}>
          <SchedaPartita partita={p} stagione="Coppa Italia 2026/27" />
        </li>
      ))}
      {fatte.map((p) => (
        <li key={`g-${p.data}-${p.ospiti}-${p.ora}`} className={SCHEDA}>
          <SchedaPartita partita={p} stagione="stagione 2024/25" />
        </li>
      ))}
    </Carosello>
  )
}

function SchedaPartita({ partita, stagione }: { readonly partita: Partita; readonly stagione: string }) {
  const { giorno, mese, anno } = pezziData(partita.data)
  const casa = inCasa(partita)
  const avversaria = casa ? partita.ospiti : partita.casa
  const punteggio = partita.risultato

  return (
    <article
      className={`flex h-full flex-col justify-between border-2 p-5 ${
        punteggio === null ? 'border-nero bg-white' : 'border-riga bg-panna'
      }`}
    >
      <div>
        <p className="occhiello text-rosso-cupo">{punteggio === null ? 'Prossimo impegno' : 'Giocata'}</p>
        <p className="mt-3 flex items-end gap-2">
          <span className="cifra text-[3.5rem] text-rosso">{giorno}</span>
          <span className="titolo pb-1.5 text-xl text-nero">
            {mese} <span className="text-grigio">{anno}</span>
          </span>
        </p>
      </div>

      <div className="mt-5">
        <p className="titolo text-[1.75rem] text-nero">
          {casa ? 'Pesaro' : avversaria} <span className="text-rosso">–</span> {casa ? avversaria : 'Pesaro'}
        </p>
        {punteggio === null ? (
          <p className="occhiello mt-2 text-grigio">
            {casa ? 'in casa' : 'in trasferta'} · <time dateTime={partita.data}>{partita.ora}</time>
          </p>
        ) : (
          <p className="cifra mt-2 text-4xl text-nero">
            {punteggio[0]}<span className="px-1.5 text-rosso">–</span>{punteggio[1]}
          </p>
        )}
        <p className="mt-3 text-[13px] text-grigio">{stagione}</p>
      </div>
    </article>
  )
}
