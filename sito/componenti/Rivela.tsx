/*
 * ===========================================================================
 * RIVELA — il movimento del sito, e non pesa niente
 * ===========================================================================
 * Il sito non aveva UNA transizione: è la ragione principale per cui sembrava
 * grezzo pur essendo corretto. Questo componente aggiunge l'unica cosa che
 * serviva — gli elementi che entrano quando li si raggiunge scorrendo.
 *
 * PERCHÉ NON GSAP, NON MOTION, NON LENIS. Il metodo li permette, ma qui
 * pagherebbero un pacchetto intero per fare una dissolvenza di sedici pixel.
 * Fra spettacolare-e-lento e spettacolare-e-veloce si sceglie il secondo:
 * `IntersectionObserver` è nel browser, la transizione la fa il CSS, e il
 * costo in byte è zero.
 *
 * ⚠️ IL CONTENUTO NON DEVE MAI RESTARE INVISIBILE. È il difetto classico di
 * questo genere di effetti: si parte da `opacity: 0` e se l'animazione non
 * parte — motore fermo, browser vecchio, `prefers-reduced-motion` — il testo
 * non compare più. Qui lo stato di partenza lo decide **React**, non il CSS:
 *   - se il browser non ha `IntersectionObserver`, visibile subito;
 *   - se chi guarda ha chiesto meno movimento, visibile subito;
 *   - e comunque una rete di sicurezza a 1,2 s mostra tutto lo stesso.
 * Lo stato nascosto esiste solo quando siamo certi di poterlo togliere.
 *
 * Il `ritardo` serve a far entrare una fila di schede una dopo l'altra invece
 * che tutte insieme: è quello che distingue una sequenza da un lampo.
 * ===========================================================================
 */

import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Chi ha chiesto meno movimento al sistema operativo non ne riceve. */
const menoMovimento = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export interface ProprietaRivela {
  readonly children: ReactNode
  /** Millisecondi di ritardo, per far entrare una fila in sequenza. */
  readonly ritardo?: number
  /** L'elemento da generare: `div` di norma, `li` dentro una lista. */
  readonly come?: 'div' | 'li' | 'section' | 'p'
  readonly className?: string
}

export function Rivela({ children, ritardo = 0, come = 'div', className = '' }: ProprietaRivela) {
  const riferimento = useRef<HTMLElement>(null)
  /* Si parte da «non ancora visibile» soltanto se il movimento è possibile:
     in tutti gli altri casi si parte già visibili, e non c'è niente da
     rivelare. */
  const [visibile, setVisibile] = useState(true)

  /* `useLayoutEffect` e non `useEffect`: quest'ultimo gira DOPO il disegno,
     quindi l'elemento comparirebbe per un fotogramma e poi si nasconderebbe
     per rientrare — un lampo visibile su tutto quello che sta già in
     schermata. Qui il sito è tutto disegnato dal browser, non c'è render sul
     server, e il layout effect è sicuro. */
  useLayoutEffect(() => {
    if (menoMovimento() || typeof IntersectionObserver === 'undefined') return
    const nodo = riferimento.current
    if (!nodo) return

    setVisibile(false)

    const osservatore = new IntersectionObserver(
      (voci) => {
        for (const v of voci) {
          if (!v.isIntersecting) continue
          setVisibile(true)
          osservatore.disconnect()
        }
      },
      /* `rootMargin` negativo in basso: l'elemento entra quando è dentro per
         davvero, non appena sfiora il bordo dello schermo. */
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    osservatore.observe(nodo)

    /* La rete di sicurezza: se per qualunque ragione l'osservatore non
       scatta, dopo 1,2 s si mostra comunque. Meglio un'entrata mancata che
       un testo che non c'è. */
    const rete = window.setTimeout(() => {
      setVisibile(true)
      osservatore.disconnect()
    }, 1200)

    return () => {
      osservatore.disconnect()
      window.clearTimeout(rete)
    }
  }, [])

  const Tag = come as 'div'
  return (
    <Tag
      ref={riferimento as React.Ref<HTMLDivElement>}
      data-rivela=""
      data-visibile={visibile ? '' : undefined}
      style={ritardo ? ({ '--ritardo': `${ritardo}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  )
}

export default Rivela
