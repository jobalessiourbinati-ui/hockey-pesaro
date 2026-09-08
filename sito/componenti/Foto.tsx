/*
 * ===========================================================================
 * LE FOTOGRAFIE — quattro, e vanno servite bene
 * ===========================================================================
 * La società ci ha dato tre fotografie di gioco. Tre. Quindi il disegno del
 * sito non può contare sull'abbondanza: le stesse tre immagini tornano in
 * ruoli diversi — fondo dell'eroe, fascia di sezione, ritratto di pagina — e
 * ogni volta grandi, tagliate bene, mai francobolli in una griglia.
 *
 * QUESTO COMPONENTE ESISTE PER UN MOTIVO SOLO: il peso.
 * Gli originali pesano 2,6 MB l'uno. Su una rete mobile in palazzetto sono
 * venti secondi per una foto — il difetto più grave che il sito potesse
 * avere, più di qualunque scelta di layout. `npm run immagini` li riduce a
 * WebP di tre misure per due tagli, e questo componente serve al browser la
 * misura giusta e nient'altro.
 *
 * DUE TAGLI, SCELTI DAL BROWSER.
 *   `alto`  4:5   sotto i 640 px: su un telefono una panoramica 16:9 o è alta
 *                 due centimetri o taglia via i giocatori.
 *   `largo` 16:9  da 640 px in su.
 * Il taglio lo sceglie <picture> con una media query — non JavaScript, che
 * arriverebbe dopo il primo disegno. La misura la sceglie `srcset` con
 * `sizes`, che dice al browser quanto sarà larga l'immagine in pagina PRIMA
 * di aver letto il CSS.
 *
 * L'ELENCO DELLE MISURE NON È SCRITTO QUI. Viene da `dati/foto.ts`, che lo
 * genera lo script: se una misura non esiste, non finisce nel `srcset`, e non
 * c'è modo di promettere al browser un file che non c'è.
 * ===========================================================================
 */

import { CARTELLA_FOTO, FOTO } from '../../dati/foto.ts'
import type { NomeFoto, VarianteFoto } from '../../dati/foto.ts'
import { link } from '../rotte.ts'

/** «file.webp 800w, file.webp 1200w» — con il percorso di base del sito
 *  davanti, perché su GitHub Pages la radice non è la radice del dominio. */
const srcset = (varianti: readonly VarianteFoto[]): string =>
  varianti.map((v) => `${link(CARTELLA_FOTO + v.file)} ${v.larghezza}w`).join(', ')

/**
 * L'INDIRIZZO DI UN FILE IN `public/`, col percorso di base davanti.
 * Vale la stessa regola dei collegamenti: su GitHub Pages il sito vive in un
 * sottopercorso, e un `src="/media/…"` scritto a mano cerca la radice del
 * dominio e non trova niente. Gli indirizzi interi (le immagini che arrivano
 * dai social) passano intatti.
 */
export const indirizzoMedia = (percorso: string): string =>
  /^https?:/i.test(percorso) ? percorso : link(percorso)

/** La variante più grande: è quella che va in `src`, il ripiego per chi non
 *  legge `srcset` (nessun browser vivo, ma il `src` resta obbligatorio). */
const piuGrande = (varianti: readonly VarianteFoto[]): VarianteFoto =>
  varianti[varianti.length - 1] ?? { file: '', larghezza: 0, altezza: 0 }

export interface ProprietaFoto {
  readonly nome: NomeFoto
  /**
   * Il testo alternativo. **Obbligatorio e scritto a mano**: descrive quello
   * che si vede, senza nominare le persone — nelle fotografie ci sono anche
   * ragazzi, e un nome accanto a un volto è un dato in più che nessuno ci ha
   * autorizzato a pubblicare.
   * Stringa vuota solo quando la foto è puro fondo e il testo sopra dice già
   * tutto: in quel caso è decorativa, e ripeterla è rumore per chi ascolta.
   */
  readonly alt: string
  /** Le classi dell'`<img>`: di solito `h-full w-full object-cover`. */
  readonly className?: string
  /** Quanto sarà larga in pagina, per il telefono e per la scrivania. */
  readonly quantoLargaAlto?: string
  readonly quantoLargaLargo?: string
  /**
   * `true` solo per la fotografia dell'eroe, che è la prima cosa che si vede:
   * niente `lazy`, e priorità alta nella coda di scaricamento. Su tutte le
   * altre resta `lazy`, altrimenti il telefono scarica in una volta le foto
   * di tutta la pagina.
   */
  readonly primaCosa?: boolean
  /** `object-position`, quando il centro del ritaglio non è il centro. */
  readonly posizione?: string
}

export function Foto({
  nome,
  alt,
  className = 'h-full w-full object-cover',
  quantoLargaAlto = '100vw',
  quantoLargaLargo = '100vw',
  primaCosa = false,
  posizione,
}: ProprietaFoto) {
  const tagli = FOTO[nome]
  const alto = piuGrande(tagli.alto)
  const largo = piuGrande(tagli.largo)

  return (
    <picture>
      <source
        media="(min-width: 640px)"
        type="image/webp"
        srcSet={srcset(tagli.largo)}
        sizes={quantoLargaLargo}
        width={largo.larghezza}
        height={largo.altezza}
      />
      <img
        src={link(CARTELLA_FOTO + alto.file)}
        srcSet={srcset(tagli.alto)}
        sizes={quantoLargaAlto}
        width={alto.larghezza}
        height={alto.altezza}
        alt={alt}
        loading={primaCosa ? 'eager' : 'lazy'}
        fetchPriority={primaCosa ? 'high' : 'auto'}
        decoding={primaCosa ? 'sync' : 'async'}
        className={className}
        style={posizione ? { objectPosition: posizione } : undefined}
      />
    </picture>
  )
}

/*
 * ===========================================================================
 * LA VELATURA — non è decorazione, è leggibilità
 * ===========================================================================
 * Il testo bianco sopra una fotografia di hockey su pista è testo bianco
 * sopra un parquet chiaro: senza velatura il contrasto in certi punti scende
 * sotto 2:1 e la riga sparisce al sole, che è esattamente la condizione in
 * cui questo sito si apre — in tribuna, di pomeriggio.
 *
 * I VALORI NON SONO SCELTI A OCCHIO. Si nasconde il testo, si fotografa la
 * fascia, e per ogni riquadro di testo si cerca il pixel di fondo più chiaro
 * che il browser ha davvero disegnato; il rapporto si calcola fra quello e il
 * colore del testo. Con questa velatura il peggiore di tutto il sito è 6,3:1.
 * La soglia è 4,5:1 e non si tratta.
 *
 * Perché due strati e non uno: il velo pieno da solo, per arrivare a 4,5:1
 * sul parquet, doveva essere così denso da spegnere la fotografia — tanto
 * valeva non metterla. La sfumatura invece è densa in basso, dove sta il
 * testo, e leggera in alto, dove non c'è niente da leggere: la foto resta
 * viva dove si guarda e si spegne dove si legge.
 *
 * ⚠️ SOPRA UNA FOTOGRAFIA IL TESTO È BIANCO. SEMPRE.
 * Il rosso chiaro della marca (#F4565B) sopra il parquet velato misura 1,6:1
 * nel punto peggiore: sparisce. E non c'è velatura che lo salvi senza spegnere
 * la fotografia — per portarlo a 4,5:1 il fondo dovrebbe scendere sotto
 * rgb(40,40,40) dappertutto, cioè diventare nero. Quindi sopra le fotografie
 * l'accento non è il colore: è la dimensione, e il filetto rosso pieno, che
 * essendo una forma e non del testo il contrasto non deve garantirlo.
 * ===========================================================================
 */
export function Velatura({ className = '' }: { readonly className?: string }) {
  return (
    <>
      {/* Lo strato pieno: alza il fondo di tutta l'immagine. */}
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-nero-fondo/40 ${className}`} />
      {/* La sfumatura, con le fermate scelte sul soggetto e non a caso: opaca
          nel quinto in basso dove sta il testo, poi si apre in fretta — nelle
          fotografie che abbiamo i giocatori stanno a metà altezza, e una
          sfumatura densa fino a lì li cancellava. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-nero-fondo from-20% via-nero-fondo/60 via-55% to-nero-fondo/20"
      />
    </>
  )
}
