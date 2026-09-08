/*
 * ===========================================================================
 * IL SEGNO DELLA SOCIETÀ — i bastoni incrociati
 * ===========================================================================
 * Sulla maglia e dentro lo scudetto c'è sempre la stessa cosa: due bastoni
 * incrociati e una pallina. È il segno dell'Amatori, e vale più di dieci
 * effetti diversi — quindi il sito ne usa uno solo, ripetuto: dietro il
 * titolo dell'eroe, come separatore fra le sezioni, in fondo al piede.
 *
 * Perché in SVG e non l'immagine del logo. Il segno qui serve a misure che
 * vanno da 24 px (accanto alla voce di menu) a mezzo schermo (la filigrana
 * dell'eroe), in tre colori diversi, e in un motivo che si ripete. Un PNG a
 * quelle misure o è sgranato o pesa. Il disegno vettoriale prende il colore
 * dal testo (`currentColor`) e non pesa niente.
 *
 * Lo stemma vero della società resta un'immagine: `public/media/stemma.png`.
 * È il marchio di una società reale e non si ridisegna a memoria — il
 * componente `Stemma` mostra quel file. Lo `Scudetto` in SVG qui sotto è la
 * sua riduzione geometrica, quella che regge anche a 32 px: scudo, quarti
 * rosso e bianco, bastoni, pallina. Il marchio è il PNG; questo è il motivo.
 *
 * I colori sono quelli misurati dal PNG con sharp (vedi `tema.css`):
 * rosso #E72F35, blu-nero dei bastoni #1C1728.
 * ===========================================================================
 */

import { useId } from 'react'
import { indirizzoMedia } from './Foto.tsx'

/* La geometria dei due bastoni, scritta una volta sola. Il bastone sale da
 * in alto a sinistra, scende oltre il centro e finisce con l'uncino della
 * paletta che si arrotola verso l'alto: è la forma del bastone da hockey
 * pista. Il secondo bastone è lo stesso, specchiato. */
const BASTONE = 'M 24 16 L 82 80 C 90 89, 102 88, 103 77 C 104 69, 97 65, 91 69'

/** Il disegno nudo: due tracciati e la pallina, in un riquadro 120×116.
 *  Sta dentro un <g> così può essere usato tanto da solo quanto dentro un
 *  <pattern>, senza duplicare i tracciati. */
function TracciatiBastoni({ spessore = 12 }: { readonly spessore?: number }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={spessore} strokeLinecap="round" strokeLinejoin="round">
      <path d={BASTONE} />
      {/* Lo specchio: translate(120) + scale(-1,1) ribalta sul lato destro. */}
      <path d={BASTONE} transform="translate(120,0) scale(-1,1)" />
      <circle cx="60" cy="99" r="8.5" fill="currentColor" stroke="none" />
    </g>
  )
}

/**
 * IL SEGNO, da solo. Prende il colore dal testo che lo contiene.
 * È decorativo ovunque venga usato in questo sito, quindi `aria-hidden`:
 * il nome della società è già scritto accanto, e farlo leggere due volte a
 * chi usa uno screen reader è rumore.
 */
export function BastoniIncrociati({ className, spessore }: { readonly className?: string; readonly spessore?: number }) {
  return (
    <svg viewBox="0 0 120 116" className={className} aria-hidden="true" focusable="false">
      <TracciatiBastoni spessore={spessore} />
    </svg>
  )
}

/**
 * LA FILIGRANA: lo stesso segno ripetuto a piastrella. Serve come fondo
 * dell'eroe e come fascia di separazione fra le sezioni. L'identificativo
 * del pattern viene da `useId` perché in pagina ce n'è più d'uno e due id
 * uguali in un documento fanno collassare il secondo sul primo.
 */
export function MotivoBastoni({
  className,
  passo = 96,
  opacita = 0.07,
  inclinazione = -12,
}: {
  readonly className?: string
  readonly passo?: number
  readonly opacita?: number
  readonly inclinazione?: number
}) {
  const id = useId()
  const scala = passo / 120
  return (
    <svg className={className} aria-hidden="true" focusable="false" style={{ opacity: opacita }}>
      <defs>
        <pattern
          id={id}
          width={passo}
          height={passo * (116 / 120)}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${inclinazione})`}
        >
          <g transform={`scale(${scala})`}>
            <TracciatiBastoni spessore={14} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/**
 * LO SCUDETTO ridotto a vettore: scudo, quarti rosso e bianco, bastoni,
 * pallina. Non è il marchio — è la sua forma, quella che si può colorare e
 * ingrandire. Dove serve il marchio vero si usa `Stemma`.
 */
export function Scudetto({ className }: { readonly className?: string }) {
  const id = useId()
  const scudo = 'M 6 18 L 60 3 L 114 18 C 114 60, 111 80, 101 97 C 92 113, 78 125, 60 132 C 42 125, 28 113, 19 97 C 9 80, 6 60, 6 18 Z'
  return (
    <svg viewBox="0 0 120 136" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          <path d={scudo} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {/* Metà rossa e metà bianca, come sul marchio: il rosso sta a
            sinistra, il bianco a destra, i bastoni ci passano sopra. */}
        <rect x="0" y="0" width="60" height="136" fill="#e72f35" />
        <rect x="60" y="0" width="60" height="136" fill="#ffffff" />
        <g transform="translate(0,6) scale(1,0.93)" color="#1c1728">
          <TracciatiBastoni spessore={13} />
        </g>
      </g>
      <path d={scudo} fill="none" stroke="#1c1728" strokeWidth="7" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * IL MARCHIO VERO, come immagine. `alt` descrittivo perché in testata questa
 * immagine è anche il collegamento alla home: se resta senza testo, chi non
 * vede la pagina si trova un collegamento chiamato «immagine».
 * `width`/`height` dichiarati per non far ballare la pagina al caricamento.
 */
export function Stemma({ className, alt = 'Amatori Hockey Pesaro' }: { readonly className?: string; readonly alt?: string }) {
  return <img src={indirizzoMedia('/media/stemma.png')} width={415} height={415} alt={alt} className={className} decoding="async" />
}

/**
 * IL SEPARATORE fra due sezioni: una riga nera sottile, il segno al centro
 * su fondo pagina. Sostituisce il gradiente o l'ombra morbida che qui non
 * vogliamo — è un bordo deciso e un simbolo, e basta.
 */
export function SeparatoreBastoni({ className = '' }: { readonly className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-riga" />
      {/* 56 px: sotto questa misura gli uncini delle palette si chiudono e i
          due bastoni diventano una X qualunque. */}
      <BastoniIncrociati className="w-14 text-rosso" spessore={13} />
      <span className="h-px flex-1 bg-riga" />
    </div>
  )
}
