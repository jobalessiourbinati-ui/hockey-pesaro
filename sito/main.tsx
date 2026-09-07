/* L'ingresso della home. Tre righe: il guscio fa il resto, così l'ingresso
 * di ogni pagina è identico e non c'è modo di sbagliarne uno. */
import { monta } from './guscio.tsx'
import { Home } from './pagine/Home.tsx'

monta('/', Home)
