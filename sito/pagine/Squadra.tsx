/*
 * ===========================================================================
 * /squadra/ — LA PRIMA SQUADRA
 * ===========================================================================
 * È la pagina che il committente ha chiesto per prima: «la sezione giocatori
 * divisa per squadra per la Serie B». Oggi sul sito esiste ma è vuota —
 * staff «Da inserire», riquadri Atleti e Campionato senza numeri, galleria
 * con «Foto 1 … Foto 6» al posto delle foto (CONTESTO §3.2). Qui dentro non
 * c'è un solo segnaposto: tutto quello che si legge viene da `dati/rosa.ts`,
 * cioè dal portale federale FISR.
 *
 * DI QUALE STAGIONE PARLIAMO, DETTO IN CHIARO.
 * La rosa depositata è quella del 2025/26. Mostrarla senza scrivere l'anno
 * sarebbe la bugia più facile da fare e più difficile da scoprire: chi apre
 * la pagina a campionato iniziato darebbe per scontato che sia quella di
 * oggi. Perciò la stagione è scritta nell'occhiello, nel titolo della rosa e
 * nella riga di avvertenza — tre volte, così in qualunque punto uno si fermi
 * a leggere la trova.
 *
 * I NUMERI NON SI SCRIVONO A MANO. Tesserati, gol di squadra e miglior
 * marcatore si calcolano dai dati (`golSquadra`, `capocannoniere`): un totale
 * battuto a mano è un totale che fra due mesi non torna più.
 *
 * LE FOTOGRAFIE NON CI SONO, e la pagina non le sta aspettando: vedi la nota
 * in testa a `componenti/SchedaPersona.tsx`, dove sta anche il divieto —
 * scritto in codice, non solo in commento — di pubblicare la foto di un
 * minore senza liberatoria.
 * ===========================================================================
 */

import {
  FONTE_FEDERALE,
  PRIMA_SQUADRA,
  STAFF,
  STAGIONE_ROSA,
  capocannoniere,
  golSquadra,
  inRosa,
  usciti,
} from '../../dati/rosa.ts'
import type { Persona } from '../../dati/rosa.ts'
import { SchedaPersona } from '../componenti/SchedaPersona.tsx'
import { SeparatoreBastoni } from '../componenti/Scudetto.tsx'

/* ---------------------------------------------------------------------------
 * Chi ha una nota da leggere o più di due ruoli non ci sta in mezza colonna a
 * 390 px: la sua scheda prende tutta la riga. Non è una classifica, è una
 * misura — Edgar Barberi ha quattro ruoli, Simone Carnevali una carriera in
 * Serie A alle spalle, e quel testo dentro 169 px diventa una colonna di
 * parole spezzate.
 * ------------------------------------------------------------------------- */
const vuoleTuttaLaRiga = (p: Persona): boolean => Boolean(p.nota) || p.ruoli.length > 2

/* Le schede larghe vanno tutte in testa. Se restassero sparse fra le altre,
 * ognuna lascerebbe mezzo buco nella griglia a due colonne del telefono.
 * `sort` in JavaScript è stabile, quindi dentro i due gruppi l'ordine resta
 * quello di `dati/rosa.ts` — prima chi ha segnato, per gol. */
const perLaGriglia = (persone: readonly Persona[]): readonly Persona[] =>
  [...persone].sort((a, b) => Number(vuoleTuttaLaRiga(b)) - Number(vuoleTuttaLaRiga(a)))

export function Squadra() {
  const rosa = perLaGriglia(PRIMA_SQUADRA.filter(inRosa))
  const chiHaLasciato = usciti(PRIMA_SQUADRA)
  const gol = golSquadra(PRIMA_SQUADRA)
  const migliore = capocannoniere(PRIMA_SQUADRA)

  return (
    <>
      {/* ================= INTESTAZIONE ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pt-12 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
          <p className="occhiello text-rosso-cupo">Serie B · stagione {STAGIONE_ROSA}</p>
          <h1 className="titolo mt-3 text-[clamp(2.75rem,13vw,6rem)]">
            La prima
            <br />
            squadra
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-nero sm:text-lg">
            La rosa depositata in federazione per la Serie B {STAGIONE_ROSA}, con le presenze e i gol del portale
            FISR: non una stima, non un elenco di memoria. Nelle Marche l'Amatori Pesaro è l'unica società di hockey
            su pista.
          </p>

          {/* L'avvertenza sulla stagione, con il filetto rosso a sinistra come
              le note della home: si deve leggere come una precisazione della
              società, non come un messaggio d'errore del sito. */}
          <p className="mt-8 max-w-2xl border-l-4 border-rosso pl-4 text-[15px] leading-relaxed text-grigio">
            Questa è l'ultima rosa depositata. Quella 2026/27 non lo è ancora — il campionato di Serie B comincia il
            10 gennaio 2027 — e finché non arriva, la pagina mostra la precedente dicendo di quale stagione è. Nessun
            nome viene aggiunto o tolto prima del deposito.
          </p>
        </div>
      </section>

      {/* ================= I NUMERI, CALCOLATI ================= */}
      <section aria-labelledby="titolo-numeri-b" className="border-y-4 border-nero bg-panna">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
          <h2 id="titolo-numeri-b" className="occhiello text-rosso-cupo">
            La stagione {STAGIONE_ROSA}, contata
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            <Numero cifra={rosa.length} etichetta="in rosa" dettaglio="tesserati per la Serie B" />
            <Numero cifra={gol} etichetta="gol" dettaglio="somma dei marcatori della stagione" />
            {migliore && (
              <Numero
                cifra={migliore.gol ?? 0}
                etichetta="il migliore"
                dettaglio={`${migliore.nome} ${migliore.cognome}, miglior marcatore`}
              />
            )}
            <Numero cifra={STAFF.length} etichetta="nello staff" dettaglio="allenatori e dirigenti tesserati" />
          </dl>
        </div>
      </section>

      {/* ================= LA ROSA ================= */}
      <section aria-labelledby="titolo-rosa" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-cupo">Chi scende in pista</p>
          <h2 id="titolo-rosa" className="titolo mt-2 text-[clamp(2rem,9vw,3.5rem)]">
            La rosa {STAGIONE_ROSA}
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio">
            Le fotografie della squadra non ci sono ancora: al loro posto ci sono le iniziali e il segno della
            società. Quando arriveranno prenderanno lo stesso riquadro, e non cambierà nient'altro.
          </p>

          {/* Due colonne a 390 px, tre da 640, quattro da 1024. Le schede
              larghe occupano due colonne a ogni misura: sul telefono vuol dire
              tutta la riga. */}
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {rosa.map((p) => {
              const larga = vuoleTuttaLaRiga(p)
              return (
                <li key={`${p.cognome}-${p.nome}`} className={larga ? 'col-span-2' : undefined}>
                  <SchedaPersona persona={p} formato={larga ? 'estesa' : 'compatta'} />
                </li>
              )
            })}
          </ul>

          <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-grigio">
            Fonte: portale dei risultati FISR, {FONTE_FEDERALE} — rose depositate, presenze e gol della Serie B{' '}
            {STAGIONE_ROSA}. I numeri di maglia vengono dai tabellini delle singole partite: chi in un tabellino non è
            mai comparso non ha un numero da mostrare, e la scheda lascia l'angolo pulito invece di inventarlo.
          </p>
        </div>
      </section>

      {/* ========= LO STAFF — l'unica fascia scura di questa pagina ========= */}
      <section aria-labelledby="titolo-staff" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20">
          <p className="occhiello text-rosso-chiaro">Chi la guida</p>
          <h2 id="titolo-staff" className="titolo mt-2 text-[clamp(2rem,9vw,3.5rem)]">
            Lo staff
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio-chiaro">
            Qualche nome torna anche nella rosa qui sopra, e non è una svista: in una società di questa dimensione la
            stessa persona allena, gioca e firma i documenti. Edgar Barberi ne è l'esempio — ha fondato l'Amatori nel
            2016 ed è proprietario, dirigente, allenatore e giocatore.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {STAFF.map((p) => (
              <li key={`staff-${p.cognome}-${p.nome}`}>
                <SchedaPersona persona={p} formato="estesa" tono="scuro" />
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-grigio-chiaro">
            Fonte: staff tesserato per la Serie B {STAGIONE_ROSA} sul portale FISR. Il capo allenatore depositato è
            Edoardo Rubien Escardilla; Simone Carnevali, che nel 2024/25 guidava la prima squadra, nel {STAGIONE_ROSA}{' '}
            risulta allenatore di terzo livello.
          </p>
        </div>
      </section>

      {/* ================= CHI HA LASCIATO ================= */}
      {chiHaLasciato.length > 0 && (
        <section aria-labelledby="titolo-usciti" className="bg-white">
          <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
            <SeparatoreBastoni className="mb-10" />
            <h2 id="titolo-usciti" className="titolo text-[clamp(1.5rem,6vw,2.25rem)]">
              Hanno giocato con noi
            </h2>

            {/* Una riga sobria: né una lapide né un buco. Chi ha smesso di
                giocare qui ha comunque giocato qui, e il portale federale lo
                dice. `usciti()` è l'unica strada per finire in questo elenco,
                come `inRosa()` è l'unica per stare in quello sopra: nessuna
                pagina filtra la rosa a mano, così un nome uscito non può
                ricomparire fra i convocati per distrazione. */}
            <ul className="mt-6 max-w-3xl divide-y divide-riga border-t border-riga">
              {chiHaLasciato.map((p) => (
                <li key={`uscito-${p.cognome}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4">
                  <span className="titolo text-xl text-nero">
                    {p.nome} {p.cognome}
                  </span>
                  {p.presenze !== null && (
                    <span className="text-[13px] text-grigio">
                      {p.presenze} {p.presenze === 1 ? 'presenza' : 'presenze'} nel {STAGIONE_ROSA}
                    </span>
                  )}
                  {p.nota && <span className="w-full text-[15px] leading-relaxed text-grigio">{p.nota}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}

/** Un numero grande con la sua etichetta. Sta qui e non in un componente a
 *  parte perché lo usa solo questa pagina: un file in più per sei righe è un
 *  file in più da cercare. */
function Numero({
  cifra,
  etichetta,
  dettaglio,
}: {
  readonly cifra: number
  readonly etichetta: string
  readonly dettaglio: string
}) {
  /* Dentro un <dl> il <dt> deve stare prima del <dd>, ma il numero si deve
     vedere prima dell'etichetta: l'ordine del sorgente resta quello giusto
     per l'HTML, `order` sistema quello visivo. */
  return (
    <div className="flex flex-col">
      <dt className="order-2 mt-2">
        <span className="titolo block text-lg text-nero">{etichetta}</span>
        <span className="mt-1 block text-[13px] leading-snug text-grigio">{dettaglio}</span>
      </dt>
      <dd className="cifra order-1 text-[clamp(3rem,12vw,4.5rem)] text-rosso-cupo">{cifra}</dd>
    </div>
  )
}

export default Squadra
