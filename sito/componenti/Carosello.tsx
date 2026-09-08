/*
 * ===========================================================================
 * IL CAROSELLO — quello che il committente ha chiesto, fatto col browser
 * ===========================================================================
 * «caroselli a scorrimento laterale», «tipo sezione news con un carosello di
 * notizie con quelle più nuove». È la richiesta, ed è anche la cosa giusta da
 * fare: su un telefono una fila di schede che si sfoglia col pollice occupa
 * una schermata invece di sei, e nove tappe di storia diventano nove gesti
 * invece di seimila pixel di scorrimento.
 *
 * NIENTE LIBRERIA, E NON PER RISPARMIO.
 * Lo scorrimento nativo del browser è già più fluido di qualunque JavaScript:
 * gira sul thread del compositore, segue il dito con l'inerzia del sistema
 * operativo, e non ha nulla da scaricare né da idratare. Una libreria di
 * caroselli aggiungerebbe pacchetti, ricostruirebbe a mano l'inerzia e
 * peggiorerebbe la cosa che deve migliorare. `scroll-snap` fa tutto in CSS.
 *
 * LE FRECCE SOLO DA 1024 px IN SU, ed è una decisione, non una dimenticanza:
 * col dito si trascina, e due bottoni sopra le schede sarebbero due bersagli
 * da evitare mentre si scorre. Da 1024 px in su c'è un puntatore e le frecce
 * servono davvero — lì diventano l'unico modo comodo di muoversi.
 *
 * LA TASTIERA FUNZIONA SEMPRE. Un contenitore che scorre e non è raggiungibile
 * dalla tastiera è contenuto irraggiungibile (WCAG 2.1.1). Due casi:
 *   · le schede sono collegamenti → il fuoco entra da solo e il contenitore
 *     scorre dietro al fuoco: non serve altro.
 *   · le schede sono solo testo (la cronologia della storia) → il contenitore
 *     stesso prende il fuoco (`tabIndex=0`) e le frecce della tastiera lo
 *     muovono, che è il comportamento nativo di un elemento scorrevole a
 *     fuoco. Da qui la proprietà `soloTesto`.
 *
 * LA BARRA DI SCORRIMENTO È NASCOSTA (in `tema.css`), il movimento no: sotto
 * le schede c'è un indicatore di avanzamento che si muove con il dito, così
 * si vede che ce n'è dell'altra anche senza barra.
 *
 * `prefers-reduced-motion`: lo scorrimento morbido è acceso in CSS solo per
 * chi non ha chiesto di ridurre il movimento, e le frecce leggono la stessa
 * preferenza prima di chiamare `scrollBy`. Chi ha chiesto meno movimento salta
 * da una scheda all'altra, senza scivolamento.
 * ===========================================================================
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface ProprietaCarosello {
  /** Il nome della fila per chi non la vede: «Ultime notizie», «Le tappe». */
  readonly etichetta: string
  /** Le schede: `<li>` già formati, uno per scheda. */
  readonly children: ReactNode
  /** Classi in più sul contenitore scorrevole (di solito il passo e i margini). */
  readonly className?: string
  /** Vero quando dentro le schede non c'è niente che prenda il fuoco. */
  readonly soloTesto?: boolean
}

export function Carosello({ etichetta, children, className = '', soloTesto = false }: ProprietaCarosello) {
  const pista = useRef<HTMLUListElement>(null)
  const [posizione, setPosizione] = useState({ inizio: true, fine: false })

  /* Dove siamo: serve a spegnere la freccia che non porta da nessuna parte e
   * a muovere l'indicatore. Il margine di 2 px assorbe gli arrotondamenti
   * dello zoom del browser, che a 110% non danno mai numeri interi. */
  const guarda = useCallback(() => {
    const p = pista.current
    if (!p) return
    setPosizione({
      inizio: p.scrollLeft <= 2,
      fine: p.scrollLeft >= p.scrollWidth - p.clientWidth - 2,
    })
  }, [])

  useEffect(() => {
    guarda()
    /* Anche al ridimensionamento: passando da una colonna a tre, una fila che
     * prima scorreva può non scorrere più, e le frecce devono sparire. */
    window.addEventListener('resize', guarda)
    return () => window.removeEventListener('resize', guarda)
  }, [guarda])

  /* Di quanto ci si sposta: la larghezza di una scheda più lo spazio fra due.
   * Si misura sulle schede vere invece di scriverla qui, perché la stessa
   * fila ha schede di larghezza diversa a 390 px e a 1440 px. */
  const spostati = (verso: 1 | -1) => {
    const p = pista.current
    if (!p) return
    const prima = p.firstElementChild as HTMLElement | null
    const passo = prima ? prima.getBoundingClientRect().width + 16 : p.clientWidth * 0.8
    const fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    p.scrollBy({ left: verso * passo, behavior: fermo ? 'auto' : 'smooth' })
  }

  const scorre = !posizione.inizio || !posizione.fine

  return (
    <div className="relative">
      <ul
        ref={pista}
        onScroll={guarda}
        className={`carosello gap-4 ${className}`}
        /* Un contenitore scorrevole senza collegamenti dentro deve poter
         * prendere il fuoco, o con la tastiera non ci si arriva. Con i
         * collegamenti dentro invece non deve: sarebbe una fermata in più
         * del tabulatore senza nulla da fare. E quando le schede ci stanno
         * tutte — su uno schermo largo capita — non c'è niente da scorrere,
         * quindi nemmeno lì serve una fermata. */
        {...(soloTesto && scorre
          ? { tabIndex: 0, role: 'group', 'aria-label': etichetta }
          : { 'aria-label': etichetta })}
      >
        {children}
      </ul>

      {/* L'INDICATORE: una riga sotto le schede, la parte rossa è quanto se
          ne vede. Sostituisce la barra di scorrimento nascosta, e sul telefono
          è l'unica cosa che dice «ce n'è dell'altra a destra». */}
      {scorre && <Avanzamento pista={pista} />}

      {/* LE FRECCE, solo da 1024 px in su. Sono fuori dalla fila, non sopra le
          schede: sopra coprirebbero una fotografia. */}
      {scorre && (
        <div className="mt-4 hidden justify-end gap-2 lg:flex">
          <Freccia verso="sinistra" spenta={posizione.inizio} onClick={() => spostati(-1)} etichetta={etichetta} />
          <Freccia verso="destra" spenta={posizione.fine} onClick={() => spostati(1)} etichetta={etichetta} />
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * L'indicatore di avanzamento. Decorativo: chi non vede la pagina ha già le
 * schede una dopo l'altra in un elenco, e una barra da leggere in più non
 * aggiunge niente.
 * ------------------------------------------------------------------------- */
function Avanzamento({ pista }: { readonly pista: React.RefObject<HTMLUListElement | null> }) {
  const [stato, setStato] = useState({ quota: 0.3, da: 0 })

  useEffect(() => {
    const p = pista.current
    if (!p) return
    const calcola = () => {
      const quota = p.clientWidth / p.scrollWidth
      const massimo = p.scrollWidth - p.clientWidth
      setStato({ quota, da: massimo > 0 ? p.scrollLeft / massimo : 0 })
    }
    calcola()
    p.addEventListener('scroll', calcola, { passive: true })
    window.addEventListener('resize', calcola)
    return () => {
      p.removeEventListener('scroll', calcola)
      window.removeEventListener('resize', calcola)
    }
  }, [pista])

  /* La parte rossa è larga quanto la quota visibile e si sposta di tutto il
   * resto della pista. `translateX` in percentuale conta sulla larghezza
   * dell'elemento stesso, non su quella della pista: da qui la divisione. */
  const quota = Math.min(1, stato.quota)
  const scorrimento = quota > 0 ? (stato.da * (1 - quota)) / quota : 0

  return (
    <div aria-hidden="true" className="mt-5 h-[3px] w-full overflow-hidden bg-riga">
      <div
        className="h-full bg-rosso-cupo"
        style={{ width: `${quota * 100}%`, transform: `translateX(${scorrimento * 100}%)` }}
      />
    </div>
  )
}

function Freccia({
  verso,
  spenta,
  onClick,
  etichetta,
}: {
  readonly verso: 'sinistra' | 'destra'
  readonly spenta: boolean
  readonly onClick: () => void
  readonly etichetta: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={spenta}
      className={`flex h-12 w-12 items-center justify-center border-2 motion-safe:transition-colors ${
        spenta ? 'border-riga text-riga' : 'border-nero text-nero hover:bg-nero hover:text-white'
      }`}
    >
      <span className="sr-only">
        {verso === 'destra' ? 'Avanti' : 'Indietro'} — {etichetta}
      </span>
      {/* Una freccia disegnata a mano: due segmenti, nessun font di icone da
          scaricare. Prende il colore dal bottone. */}
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
        <path
          d={verso === 'destra' ? 'M4 12 H19 M13 6 L19 12 L13 18' : 'M20 12 H5 M11 6 L5 12 L11 18'}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
      </svg>
    </button>
  )
}
