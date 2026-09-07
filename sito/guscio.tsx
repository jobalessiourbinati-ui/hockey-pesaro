/*
 * ===========================================================================
 * IL GUSCIO — quello che sta intorno a ogni pagina
 * ===========================================================================
 * Il sito è statico e multipagina: ogni indirizzo è un file HTML suo, e ogni
 * HTML monta la sua pagina. Testata, piede e salto al contenuto sono uguali
 * dappertutto, quindi stanno qui una volta sola: una pagina scrive il suo
 * contenuto e basta, e nessuno può dimenticarsi il piede.
 *
 * Perché non un router in pagina. Con sei pagine e nessuna sessione, un
 * router costa JavaScript per fare quello che il browser fa già da solo: la
 * prima schermata arriva prima, ogni pagina si carica solo quando serve, e i
 * motori di ricerca trovano sei documenti veri invece di uno che si
 * riscrive. `vite.config.ts` registra i sei ingressi.
 * ===========================================================================
 */

import { StrictMode } from 'react'
import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
/* Il foglio di stile NON si importa da qui: sta come <link> nel <head> di
 * ogni HTML. Così arriva in parallelo al JavaScript invece che dopo, e la
 * pagina non compare mai per un istante senza stile — che sulla connessione
 * di un palazzetto è un istante lungo. */
import { Piede } from './componenti/Piede.tsx'
import { Testata } from './componenti/Testata.tsx'

export function monta(percorso: string, Pagina: ComponentType) {
  const radice = document.getElementById('radice')
  /* Se il contenitore non c'è è un errore di chi ha scritto l'HTML, non una
   * condizione da gestire in silenzio: meglio un messaggio esplicito in
   * console che una pagina bianca senza spiegazione. */
  if (!radice) throw new Error('Manca <div id="radice"> nell\'HTML della pagina')

  createRoot(radice).render(
    <StrictMode>
      {/* Il primo elemento raggiungibile con il tabulatore: chi naviga da
          tastiera non deve attraversare tutto il menu a ogni pagina. */}
      <a href="#contenuto" className="salta">
        Vai al contenuto
      </a>
      <Testata percorso={percorso} />
      {/* `tabIndex={-1}` serve al salto qui sopra: senza, il fuoco non si
          sposta davvero e il collegamento muove solo lo scorrimento. */}
      <main id="contenuto" tabIndex={-1}>
        <Pagina />
      </main>
      <Piede />
    </StrictMode>,
  )
}
