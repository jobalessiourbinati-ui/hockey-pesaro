/* Ingresso di /squadra/. La pagina la scrive un altro agente in
 * `sito/pagine/Squadra.tsx`: qui si dichiara solo dove va montata. */
import { monta } from '../guscio.tsx'
import { Squadra } from '../pagine/Squadra.tsx'

monta('/squadra/', Squadra)
