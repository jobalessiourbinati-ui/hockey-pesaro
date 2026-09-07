/*
 * ===========================================================================
 * LA TESTATA — pensata a 390 px, non ristretta dopo
 * ===========================================================================
 * Il committente ha chiesto due volte la parte mobile, e ha ragione: il sito
 * di una squadra lo si apre dal telefono, in tribuna o sul divano. Quindi
 * questa testata nasce a 390 px con due sole cose — il marchio e un bottone
 * — e sopra i 1024 px si apre nel menu esteso. Non è un menu da scrivania
 * rimpicciolito.
 *
 * Il nero sta qui, non nel fondo della pagina: testata e piede sono le due
 * fasce scure che tengono in mezzo il bianco. È il ribaltamento chiesto dal
 * committente rispetto al sito attuale, che è nero dappertutto.
 *
 * Il bottone del menu è 48×48 px: la soglia comoda per un dito è 44, e
 * sotto quella misura si sbaglia bersaglio. Vale per tutti i bottoni del
 * sito.
 * ===========================================================================
 */

import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as EventoTastiera } from 'react'
import { VOCI_MENU } from '../rotte.ts'
import { BastoniIncrociati, Stemma } from './Scudetto.tsx'

export function Testata({ percorso }: { readonly percorso: string }) {
  const [aperto, setAperto] = useState(false)
  const idMenu = useId()
  const bottoneRef = useRef<HTMLButtonElement>(null)
  const chiudiRef = useRef<HTMLButtonElement>(null)

  /* Con il menu a tutto schermo aperto, la pagina sotto non deve scorrere:
   * altrimenti si chiude il menu e ci si ritrova a metà pagina senza aver
   * fatto niente. E l'Esc deve chiudere, perché è quello che fa l'Esc. */
  useEffect(() => {
    if (!aperto) return
    const precedente = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    chiudiRef.current?.focus()
    const suTasto = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAperto(false)
    }
    document.addEventListener('keydown', suTasto)
    return () => {
      document.body.style.overflow = precedente
      document.removeEventListener('keydown', suTasto)
    }
  }, [aperto])

  /* Chiudendo il menu il fuoco torna sul bottone che l'ha aperto: chi naviga
   * con la tastiera non deve ripartire dall'inizio della pagina. */
  const chiudi = () => {
    setAperto(false)
    bottoneRef.current?.focus()
  }

  /* Il fuoco resta dentro il menu finché il menu è aperto. Senza questo, il
   * tabulatore esce dal pannello e va a finire sui collegamenti della pagina
   * sotto — che è coperta e non si vede: si naviga alla cieca. È la sola
   * ragione per cui questo componente ha del codice sulla tastiera. */
  const trattieniIlFuoco = (e: EventoTastiera<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const nodi = e.currentTarget.querySelectorAll<HTMLElement>('a[href], button')
    const primo = nodi[0]
    const ultimo = nodi[nodi.length - 1]
    if (!primo || !ultimo) return
    if (e.shiftKey && document.activeElement === primo) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primo.focus()
    }
  }

  return (
    <header className="su-nero sticky top-0 z-50 border-b-2 border-rosso bg-nero text-white">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Amatori Hockey Pesaro, vai alla home">
          <Stemma className="h-10 w-10 shrink-0" alt="" />
          <span className="titolo truncate text-[17px] leading-none sm:text-xl">Amatori Hockey Pesaro</span>
        </a>

        {/* Il menu esteso: solo da 1024 px in su, dove lo spazio c'è davvero.
            Sotto quella misura sei voci in fila diventano illeggibili. */}
        <nav aria-label="Sezioni del sito" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {VOCI_MENU.map((r) => {
              const attiva = r.percorso === percorso
              return (
                <li key={r.percorso}>
                  <a
                    href={r.percorso}
                    aria-current={attiva ? 'page' : undefined}
                    className={`titolo flex h-12 items-center px-3 text-lg transition-colors ${
                      attiva ? 'text-rosso-chiaro' : 'text-white hover:text-rosso-chiaro'
                    }`}
                  >
                    {r.etichetta}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          ref={bottoneRef}
          type="button"
          onClick={() => setAperto(true)}
          aria-expanded={aperto}
          aria-controls={idMenu}
          className="flex h-12 w-12 shrink-0 items-center justify-center bg-rosso-cupo lg:hidden"
        >
          <span className="sr-only">Apri il menu</span>
          {/* Tre righe disegnate a mano invece di un font di icone: sono
              tre <span>, pesano zero e non aspettano nessun download. */}
          <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
            <span className="h-[3px] w-full bg-white" />
            <span className="h-[3px] w-full bg-white" />
            <span className="h-[3px] w-full bg-white" />
          </span>
        </button>
      </div>

      {/* IL MENU A TUTTO SCHERMO. Resta montato solo quando serve: un
          pannello nascosto ma presente resta raggiungibile dalla tastiera e
          fa navigare a vuoto. */}
      {aperto ? (
        <div
          id={idMenu}
          onKeyDown={trattieniIlFuoco}
          className="su-nero fixed inset-0 z-50 flex flex-col overflow-y-auto bg-nero text-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/15 px-4">
            <span className="titolo text-[17px]">Amatori Hockey Pesaro</span>
            <button
              ref={chiudiRef}
              type="button"
              onClick={chiudi}
              className="flex h-12 w-12 items-center justify-center bg-rosso-cupo"
            >
              <span className="sr-only">Chiudi il menu</span>
              <span aria-hidden="true" className="relative block h-6 w-6">
                <span className="absolute top-1/2 left-0 h-[3px] w-full rotate-45 bg-white" />
                <span className="absolute top-1/2 left-0 h-[3px] w-full -rotate-45 bg-white" />
              </span>
            </button>
          </div>

          <nav aria-label="Sezioni del sito" className="flex-1 px-4 py-2">
            <ul>
              <li>
                <a
                  href="/"
                  aria-current={percorso === '/' ? 'page' : undefined}
                  className="titolo flex min-h-[56px] items-center border-b border-white/12 py-3 text-3xl text-white"
                >
                  Home
                </a>
              </li>
              {VOCI_MENU.map((r) => (
                <li key={r.percorso}>
                  <a
                    href={r.percorso}
                    aria-current={r.percorso === percorso ? 'page' : undefined}
                    className="block min-h-[56px] border-b border-white/12 py-3"
                  >
                    <span
                      className={`titolo block text-3xl ${r.percorso === percorso ? 'text-rosso-chiaro' : 'text-white'}`}
                    >
                      {r.etichetta}
                    </span>
                    <span className="mt-1 block text-sm text-grigio-chiaro">{r.descrizione}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 px-4 pt-2 pb-8 text-sm text-grigio-chiaro">
            <BastoniIncrociati className="w-8 shrink-0 text-rosso" spessore={14} />
            <a href="mailto:info@hockeypesaro.it" className="underline underline-offset-4">
              info@hockeypesaro.it
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
