/*
 * ===========================================================================
 * IL PIEDE — solo cose vere
 * ===========================================================================
 * Recapiti e indirizzo vengono dalla scheda federale FISR e dal rilievo
 * (`CONTESTO.md` §10): Via dei Girasoli 14, 61122 Pesaro; PEC
 * amatoripesaro@pec.it; codice di affiliazione 3947. Le due pagine social
 * sono quelle ufficiali, confermate anche dal Comune di Pesaro (§4).
 *
 * ⚠️ LA PARTITA IVA NON C'È, ED È VOLUTO.
 * Il sito di oggi ne stampa una inventata — 6545454554545, tredici cifre,
 * che non è nemmeno un numero possibile. Toglierla è metà del lavoro; l'altra
 * metà sarebbe scriverne una giusta, e quella non ce l'abbiamo verificata.
 * Sul foglio del committente la P.IVA è 02689960413 e il codice fiscale
 * 92054780413; il registro CONI riporta solo il secondo. Per una ASD è
 * normale che i due numeri differiscano, ma «normale» non è «confermato», e
 * un identificativo fiscale sbagliato nel piede di un sito è una
 * dichiarazione falsa su una società che esiste davvero.
 *
 * Quindi: niente P.IVA finché il presidente o il commercialista non la
 * confermano per iscritto. Quando arriva, si aggiunge qui una riga sola —
 * `<li>P. IVA 0000000000</li>` — e si cancella questo commento.
 * Il rimedio a un numero inventato non è un altro numero non verificato.
 * ===========================================================================
 */

import { ROTTE, SOCIETA } from '../rotte.ts'
import { BastoniIncrociati, Stemma } from './Scudetto.tsx'

const SOCIAL = [
  { nome: 'Facebook', url: 'https://www.facebook.com/amatorihockeypesaro' },
  { nome: 'Instagram', url: 'https://www.instagram.com/amatori_hockey_pesaro_asd' },
] as const

export function Piede() {
  return (
    <footer className="su-nero relative overflow-hidden border-t-4 border-rosso bg-nero text-white">
      {/* Il segno della società, in filigrana: l'unico ornamento del piede. */}
      <MotivoDiFondo />

      <div className="relative mx-auto max-w-[1240px] px-4 pt-12 pb-10 sm:px-6">
        <div className="flex items-center gap-3">
          <Stemma className="h-14 w-14" alt="" />
          <p className="titolo text-2xl sm:text-3xl">Amatori Hockey Pesaro</p>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <section>
            <h2 className="occhiello text-rosso-chiaro">Dove siamo</h2>
            <address className="mt-3 text-[15px] leading-relaxed text-grigio-chiaro not-italic">
              {SOCIETA}
              <br />
              Via dei Girasoli 14
              <br />
              61122 Pesaro (PU)
            </address>
          </section>

          <section>
            <h2 className="occhiello text-rosso-chiaro">Contatti</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-grigio-chiaro">
              <li>
                <a className="underline underline-offset-4 hover:text-white" href="mailto:info@hockeypesaro.it">
                  info@hockeypesaro.it
                </a>
              </li>
              <li>
                {/* Il numero si scrive leggibile e si compone senza spazi:
                    sul telefono deve bastare toccarlo. */}
                <a className="underline underline-offset-4 hover:text-white" href="tel:+393475132745">
                  347 513 2745
                </a>
              </li>
              <li>
                <a className="underline underline-offset-4 hover:text-white" href="mailto:amatoripesaro@pec.it">
                  amatoripesaro@pec.it
                </a>
                {/* Colore pieno, non bianco trasparente: un testo con
                    l'opacità non ha un contrasto misurabile, e qui il
                    contrasto va misurato. */}
                <span className="block text-grigio-chiaro">posta certificata</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="occhiello text-rosso-chiaro">Social</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-grigio-chiaro">
              {SOCIAL.map((s) => (
                <li key={s.nome}>
                  <a
                    className="underline underline-offset-4 hover:text-white"
                    href={s.url}
                    rel="noopener noreferrer me"
                    target="_blank"
                  >
                    {s.nome}
                    <span className="sr-only"> (si apre in una nuova scheda)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Mappa del sito">
            <h2 className="occhiello text-rosso-chiaro">Il sito</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-grigio-chiaro">
              {ROTTE.map((r) => (
                <li key={r.percorso}>
                  <a className="underline underline-offset-4 hover:text-white" href={r.percorso}>
                    {r.etichetta}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-[13px] text-grigio-chiaro sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SOCIETA} — associazione sportiva dilettantistica.
            <br className="sm:hidden" />
            <span className="sm:ml-1">Affiliata FISR, codice 3947.</span>
          </p>
          {/*
            Qui, in un sito qualunque, ci sarebbe la partita IVA. Vedi il
            commento in cima al file: manca perché non è confermata, non
            perché è stata dimenticata.
          */}
          <p>
            <a className="underline underline-offset-4 hover:text-white" href="/notizie/">
              Aggiornamenti
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

/* Estratto in un componente suo perché il motivo è posizionato in assoluto e
 * dentro al JSX del piede rendeva illeggibile la struttura. */
function MotivoDiFondo() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <BastoniIncrociati
        className="absolute -right-10 -bottom-14 w-64 text-white/[0.05] sm:w-80"
        spessore={11}
      />
    </div>
  )
}
