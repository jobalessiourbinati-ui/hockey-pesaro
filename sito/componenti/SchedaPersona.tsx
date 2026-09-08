/*
 * ===========================================================================
 * SCHEDA PERSONA — la carta di un tesserato, progettata SENZA fotografia
 * ===========================================================================
 * La società non ci ha ancora dato le fotografie della rosa. La tentazione
 * sarebbe stata la sagoma grigia in attesa: è la scelta che fa sembrare
 * provvisorio un sito per mesi. Qui lo stato senza foto è **lo stato
 * principale** — riquadro panna, iniziali in grande, i bastoni incrociati in
 * filigrana tagliati dal bordo, il numero di maglia in un quadrato rosso a
 * filo d'angolo come sulla schiena — ed è pensato per reggere così com'è.
 * Quando le foto arriveranno basterà valorizzare `foto` in `dati/rosa.ts`:
 * non cambia una riga di questo file.
 *
 * ⚠️⚠️ I MINORI E LE FOTOGRAFIE — LEGGERE PRIMA DI TOCCARE.
 * In rosa ci sono tesserati con `minore: true` (Tomassini 2009, Gasparini
 * 2010, i Boniolo). Nome e cognome sono già pubblici sul portale federale
 * FISR e si possono scrivere; **una fotografia è un'altra cosa** e richiede
 * la liberatoria scritta di chi esercita la responsabilità genitoriale
 * (CONTESTO §9.2). Per questo il controllo non è affidato alla buona memoria
 * di chi modificherà i dati fra sei mesi: `mostraFoto` qui sotto **rifiuta**
 * di stampare l'immagine quando `minore` è vero, anche se il campo `foto` è
 * pieno. Se un giorno la liberatoria arriverà davvero, si toglie `minore` da
 * quella persona in `dati/rosa.ts` — con il foglio firmato in mano, non per
 * far comparire una foto.
 *
 * Per lo stesso motivo la scheda NON stampa mai l'anno di nascita, e non
 * stampa la provenienza dei minori: sono dati personali che nessuna pagina
 * ha bisogno di mostrare e che nessuno ci ha chiesto di pubblicare.
 * ===========================================================================
 */

import type { Persona, Ruolo } from '../../dati/rosa.ts'
import { ETICHETTA_RUOLO, iniziali } from '../../dati/rosa.ts'
import { indirizzoMedia } from './Foto.tsx'
import { BastoniIncrociati } from './Scudetto.tsx'

/* ---------------------------------------------------------------------------
 * L'ordine con cui si leggono i ruoli di una persona. Edgar Barberi ne ha
 * quattro — presidente, dirigente, allenatore, giocatore — e in una società
 * di questa dimensione è normale, non è un errore del database. Elencarli
 * nell'ordine in cui capitano nell'array darebbe «giocatore, allenatore,
 * dirigente, presidente», che si legge come una lista sbagliata; ordinarli
 * dal ruolo che spiega gli altri li fa leggere come una biografia corta.
 * ------------------------------------------------------------------------- */
const PESO_RUOLO: Record<Ruolo, number> = {
  presidente: 0,
  dirigente: 1,
  allenatore: 2,
  portiere: 3,
  movimento: 4,
}

const ruoliOrdinati = (p: Persona): readonly Ruolo[] => [...p.ruoli].sort((a, b) => PESO_RUOLO[a] - PESO_RUOLO[b])

/** I ruoli che qualificano la persona nella società, non in pista: si
 *  segnano in rosso perché sono la cosa che distingue una scheda dall'altra. */
const RUOLO_DI_SOCIETA: ReadonlySet<Ruolo> = new Set<Ruolo>(['presidente', 'dirigente'])

export interface ProprietaScheda {
  readonly persona: Persona
  /**
   * `compatta` sta in mezza colonna a 390 px ed è la forma normale.
   * `estesa` occupa tutta la riga: la sceglie la pagina per chi ha una nota
   * da leggere o più di due ruoli, così il testo non strizza la colonna e
   * quattro etichette di ruolo non sembrano un errore.
   */
  readonly formato?: 'compatta' | 'estesa'
  /** `scuro` è la variante per l'unica fascia nera della pagina. */
  readonly tono?: 'chiaro' | 'scuro'
}

export function SchedaPersona({ persona, formato = 'compatta', tono = 'chiaro' }: ProprietaScheda) {
  const scuro = tono === 'scuro'
  const estesa = formato === 'estesa'

  // Vedi l'avvertenza in testa al file: la foto di un minore non esce di qui.
  const mostraFoto = Boolean(persona.foto) && persona.minore !== true

  const ruoli = ruoliOrdinati(persona)
  const haNumeri = persona.gol !== null || persona.presenze !== null

  /* I colori del tema, scelti secondo la regola scritta in `tema.css`: il
   * rosso della marca (#E72F35) fa 4,32:1 su bianco e vale solo per il testo
   * grande, quindi tutto il testo piccolo qui usa `rosso-cupo` (5,69:1). Sul
   * nero il rosso della marca non arriva a 4,5:1 e si usa `rosso-chiaro`. */
  const bordo = scuro ? 'border-white/20' : 'border-riga'
  const titolo = scuro ? 'text-white' : 'text-nero'
  const secondario = scuro ? 'text-grigio-chiaro' : 'text-grigio'
  const accento = scuro ? 'text-rosso-chiaro' : 'text-rosso-cupo'
  const bordoAccento = scuro ? 'border-rosso-chiaro' : 'border-rosso-cupo'

  return (
    <article
      className={[
        /* `scheda-viva`: due pixel di sollevamento e il bordo che si accende
           al passaggio del mouse. Su un dito non succede niente — la regola
           sta dietro `@media (hover: hover)` — ed è giusto così: sul telefono
           un effetto di hover resta acceso dopo il tocco e sembra un difetto. */
        'scheda-viva flex border',
        bordo,
        estesa ? 'flex-row items-start gap-4 p-4 sm:gap-6 sm:p-6' : 'flex-col',
        scuro ? 'bg-white/5' : 'bg-white',
      ].join(' ')}
    >
      {/* ---------- IL RIQUADRO: filigrana, iniziali, numero ---------- */}
      <div
        className={[
          'relative shrink-0 overflow-hidden',
          scuro ? 'bg-white/10' : 'bg-panna',
          /* Il riquadro compatto era quadrato: a 390 px, in due colonne, sono
           * 169 px di altezza per sedici schede — quasi mille pixel di pagina
           * spesi in riquadri che oggi contengono due iniziali, perché le
           * fotografie dei giocatori non ci sono ancora. In 4:3 la scheda
           * resta la stessa e la pagina si accorcia; quando le foto
           * arriveranno, un ritratto in 4:3 è un ritratto uguale. */
          estesa ? 'h-22 w-22 sm:h-32 sm:w-32' : 'aspect-[4/3] w-full',
        ].join(' ')}
      >
        {/* La filigrana esce dal riquadro e viene tagliata dal bordo: così il
            segno della società si legge come una texture e non come una
            icona centrata in mezzo al vuoto — che è esattamente l'aria da
            «immagine mancante» che questo riquadro deve evitare. */}
        <BastoniIncrociati
          className={[
            'pointer-events-none absolute -right-[16%] -bottom-[20%] w-[80%] rotate-12',
            scuro ? 'text-white opacity-15' : 'text-nero opacity-10',
          ].join(' ')}
        />

        {mostraFoto ? (
          <img
            src={indirizzoMedia(`/media/rosa/${persona.foto}`)}
            alt={`${persona.nome} ${persona.cognome}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* Le iniziali sono decorative: il nome per esteso è già scritto
             sotto, nel titolo della scheda, e farlo leggere due volte a chi
             usa uno screen reader è rumore. */
          <span
            aria-hidden="true"
            className={[
              'cifra absolute inset-0 flex items-center justify-center',
              estesa ? 'text-[2rem] sm:text-5xl' : 'text-[2rem] sm:text-5xl',
              titolo,
            ].join(' ')}
          >
            {iniziali(persona)}
          </span>
        )}

        {/* Il numero di maglia, quando c'è. Quando non c'è, l'angolo resta
            pulito: un trattino al suo posto si leggerebbe come un dato
            mancante, mentre è una persona che nei tabellini non è mai
            comparsa — due cose diverse. */}
        {persona.numero !== null && (
          <span
            className={[
              'cifra absolute top-0 right-0 grid place-items-center bg-rosso-cupo text-white',
              estesa ? 'h-9 w-9 text-lg sm:h-12 sm:w-12 sm:text-2xl' : 'h-9 w-9 text-lg sm:h-13 sm:w-13 sm:text-2xl',
            ].join(' ')}
          >
            <span className="sr-only">maglia numero </span>
            {persona.numero}
          </span>
        )}
      </div>

      {/* ---------- IL TESTO ---------- */}
      <div className={estesa ? 'min-w-0 flex-1' : 'flex min-w-0 flex-1 flex-col p-2.5 sm:p-4'}>
        <h3>
          {/* IL NOME NON SI TRONCA. In tre colonne su un telefono «Alessandro»
              e «Lorenzo Mikhael» non ci stavano, e la scheda li tagliava con
              i puntini: il sito di una società vera non mostra il nome di una
              persona a metà. Nella scheda compatta il nome è più piccolo e
              più stretto, e se ancora non basta va a capo. */}
          <span
            className={`occhiello block ${secondario} ${estesa ? '' : 'text-[0.6875rem] tracking-[0.09em]'}`}
          >
            {persona.nome}
          </span>
          {/* Il cognome può essere lungo — «Giraldo Bueno», «Jamerson» — e la
              colonna del telefono è di 111 px. Anton è condensato e ce li fa
              stare tutti; le due parole vanno a capo invece di uscire dalla
              scheda, che è l'unico modo di sbagliare qui. */}
          <span className={`titolo mt-0.5 block text-xl break-words sm:text-3xl ${titolo}`}>{persona.cognome}</span>
        </h3>

        {/* I ruoli come elenco di etichette: con quattro ruoli si dispongono
            su due righe e continuano a sembrare voluti. */}
        <ul className={`flex flex-wrap gap-1 ${estesa ? 'mt-2.5' : 'mt-2'}`}>
          {/* Il capitano è pieno, non contornato: è l'unica etichetta che
              distingue una persona da tutte le altre della rosa, e la fascia
              al braccio nello sport è piena anche lei. */}
          {persona.capitano === true && (
            <li className="border border-rosso-cupo bg-rosso-cupo px-1.5 py-0.5 text-[0.6875rem] leading-tight tracking-[0.08em] text-white uppercase">
              capitano
            </li>
          )}
          {ruoli.map((r) => (
            <li
              key={r}
              className={[
                'border px-1.5 py-0.5 text-[0.6875rem] leading-tight tracking-[0.08em] uppercase',
                RUOLO_DI_SOCIETA.has(r) ? `${accento} ${bordoAccento}` : `${secondario} ${bordo}`,
              ].join(' ')}
            >
              {ETICHETTA_RUOLO[r]}
            </li>
          ))}
        </ul>

        {haNumeri && (
          <dl className={`flex gap-4 sm:gap-5 ${estesa ? 'mt-3' : 'mt-auto pt-2.5'}`}>
            {persona.gol !== null && (
              <div>
                <dd className={`cifra text-xl sm:text-2xl ${persona.gol > 0 ? accento : secondario}`}>{persona.gol}</dd>
                <dt className={`mt-0.5 text-[0.625rem] tracking-[0.12em] uppercase ${secondario}`}>gol</dt>
              </div>
            )}
            {persona.presenze !== null && (
              <div>
                <dd className={`cifra text-xl sm:text-2xl ${titolo}`}>{persona.presenze}</dd>
                <dt className={`mt-0.5 text-[0.625rem] tracking-[0.12em] uppercase ${secondario}`}>presenze</dt>
              </div>
            )}
          </dl>
        )}

        {estesa && persona.nota && <p className={`mt-3 text-sm leading-relaxed ${secondario}`}>{persona.nota}</p>}

        {/* La provenienza non si stampa per i minori: è un dato personale in
            più, e in più non serve a nessuno che legge. */}
        {estesa && persona.provenienza && persona.minore !== true && (
          <p className={`mt-2 text-xs tracking-[0.08em] uppercase ${secondario}`}>da {persona.provenienza}</p>
        )}

        {/* Da dove viene il dato, quando qualcuno l'ha verificato a mano: è la
            regola §9.5 del CONTESTO applicata alla singola riga. */}
        {estesa && persona.verificato && (
          <p className={`mt-2 text-xs ${secondario}`}>
            <span className="opacity-70">Fonte: </span>
            {persona.verificato}
          </p>
        )}
      </div>
    </article>
  )
}

export default SchedaPersona
