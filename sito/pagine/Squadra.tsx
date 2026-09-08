/*
 * ===========================================================================
 * /squadra/ — LA PRIMA SQUADRA
 * ===========================================================================
 * È la pagina che il committente ha chiesto per prima: «la sezione giocatori
 * divisa per squadra per la Serie B». Non c'è un solo segnaposto: tutto quello
 * che si legge viene da `dati/rosa.ts`, cioè dal portale federale FISR.
 *
 * DI QUALE STAGIONE PARLIAMO, DETTO IN CHIARO E DETTO CORTO.
 * La rosa depositata è quella del 2025/26. Mostrarla senza scrivere l'anno
 * sarebbe la bugia più facile da fare e più difficile da scoprire. Prima era
 * scritto tre volte in tre paragrafi; adesso sta nell'occhiello sopra il
 * titolo, nel titolo della rosa e in una riga sola — le stesse tre volte, un
 * terzo delle parole.
 *
 * LE FOTOGRAFIE DEI GIOCATORI NON CI SONO, e la pagina non le sta aspettando
 * in silenzio: le tre foto che abbiamo sono azioni di gioco della società, e
 * quella in testa alla pagina è una di quelle. I ritratti li deve dare la
 * società; finché non arrivano, le schede portano le iniziali e il segno del
 * club. Vedi la nota in testa a `componenti/SchedaPersona.tsx`, dove sta anche
 * il divieto — scritto in codice, non solo in commento — di pubblicare la foto
 * di un minore senza liberatoria.
 *
 * I NUMERI NON SI SCRIVONO A MANO: `golSquadra`, `capocannoniere`. Un totale
 * battuto a mano è un totale che fra due mesi non torna più.
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
import { Foto, Velatura } from '../componenti/Foto.tsx'
import { SchedaPersona } from '../componenti/SchedaPersona.tsx'

/* ---------------------------------------------------------------------------
 * Chi ha una nota da leggere o più di due ruoli non ci sta in mezza colonna a
 * 390 px: la sua scheda prende tutta la riga. Non è una classifica, è una
 * misura — Edgar Barberi ha quattro ruoli, e quel testo dentro 169 px diventa
 * una colonna di parole spezzate.
 * ------------------------------------------------------------------------- */
const vuoleTuttaLaRiga = (p: Persona): boolean => Boolean(p.nota) || p.ruoli.length > 2

/* Le schede larghe vanno tutte in testa: sparse fra le altre, ognuna
 * lascerebbe mezzo buco nella griglia a due colonne del telefono. `sort` in
 * JavaScript è stabile, quindi dentro i due gruppi l'ordine resta quello di
 * `dati/rosa.ts` — prima chi ha segnato, per gol. */
const perLaGriglia = (persone: readonly Persona[]): readonly Persona[] =>
  [...persone].sort((a, b) => Number(vuoleTuttaLaRiga(b)) - Number(vuoleTuttaLaRiga(a)))

export function Squadra() {
  const rosa = perLaGriglia(PRIMA_SQUADRA.filter(inRosa))
  const chiHaLasciato = usciti(PRIMA_SQUADRA)
  const gol = golSquadra(PRIMA_SQUADRA)
  const migliore = capocannoniere(PRIMA_SQUADRA)

  return (
    <>
      {/* ============ INTESTAZIONE — con la fotografia ============ */}
      <section className="su-nero relative isolate flex min-h-[46vh] items-end overflow-hidden bg-nero-fondo text-white sm:min-h-[56vh]">
        <div className="absolute inset-0 -z-10">
          <Foto
            nome="azione-contrasto"
            alt="Due giocatori si contendono la palla in una partita dell'Amatori Hockey Pesaro."
            primaCosa
          />
          <Velatura />
        </div>

        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14" data-sopra-foto>
          <p className="occhiello text-white">Serie B · stagione {STAGIONE_ROSA}</p>
          <h1 className="titolo mt-2 text-[clamp(2.75rem,13vw,6rem)]">
            La prima
            <br />
            squadra
          </h1>
          <p className="mt-4 max-w-lg text-[17px] leading-snug text-white">
            La rosa depositata in federazione, con le presenze e i gol del portale FISR.
          </p>
        </div>
      </section>

      {/* ================= I NUMERI, CALCOLATI ================= */}
      <section aria-labelledby="titolo-numeri-b" className="border-b-4 border-nero bg-panna">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12">
          <h2 id="titolo-numeri-b" className="occhiello text-rosso-cupo">
            La stagione {STAGIONE_ROSA}, contata
          </h2>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            <Numero cifra={rosa.length} etichetta="in rosa" dettaglio="tesserati per la Serie B" />
            <Numero cifra={gol} etichetta="gol" dettaglio="somma dei marcatori" />
            {migliore && (
              <Numero
                cifra={migliore.gol ?? 0}
                etichetta="il migliore"
                dettaglio={`${migliore.nome} ${migliore.cognome}`}
              />
            )}
            <Numero cifra={STAFF.length} etichetta="nello staff" dettaglio="allenatori e dirigenti" />
          </dl>
        </div>
      </section>

      {/* ================= LA ROSA ================= */}
      <section aria-labelledby="titolo-rosa" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-cupo">Chi scende in pista</p>
          <h2 id="titolo-rosa" className="titolo mt-1 text-[clamp(2rem,9vw,3.5rem)]">
            La rosa {STAGIONE_ROSA}
          </h2>
          {/* Le due cose vere da dire, in due righe invece che in due
              paragrafi: di quale stagione è questa rosa, e perché al posto
              delle facce ci sono le iniziali. */}
          <p className="mt-4 max-w-2xl border-l-4 border-rosso pl-4 text-[15px] leading-relaxed text-grigio">
            È l'ultima rosa depositata: quella 2026/27 non lo è ancora, il campionato comincia il 10 gennaio 2027.
            <br />
            Le fotografie dei giocatori non ci sono ancora: al loro posto, le iniziali e il segno della società.
          </p>

          {/* TRE COLONNE GIÀ SUL TELEFONO, e non è una scelta di gusto.
              Con due colonne le dodici schede compatte facevano sei righe,
              quasi millecinquecento pixel per una rosa che si legge in un
              colpo d'occhio. Con tre ne fanno quattro. La scheda regge: il
              cognome è in Anton, che è un condensato, e a 111 px di colonna
              «Tomassini» ci sta intero.
              Le schede larghe — chi ha una nota o più di due ruoli — prendono
              tutta la riga fino a 1024 px, dove tornano a occuparne due. */}
          <ul className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {rosa.map((p) => {
              const larga = vuoleTuttaLaRiga(p)
              return (
                <li key={`${p.cognome}-${p.nome}`} className={larga ? 'col-span-3 lg:col-span-2' : undefined}>
                  <SchedaPersona persona={p} formato={larga ? 'estesa' : 'compatta'} />
                </li>
              )
            })}
          </ul>

          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-grigio">
            Fonte:{' '}
            <a
              href={FONTE_FEDERALE}
              target="_blank"
              rel="noreferrer"
              className="text-rosso-cupo underline underline-offset-2"
            >
              portale dei risultati FISR
            </a>
            , Serie B {STAGIONE_ROSA}. I numeri di maglia vengono dai tabellini: chi non è mai comparso in un
            tabellino non ne ha uno, e la scheda lascia l'angolo pulito invece di inventarlo.
          </p>
        </div>
      </section>

      {/* ========= LO STAFF — l'unica fascia scura della pagina ========= */}
      <section aria-labelledby="titolo-staff" className="su-nero bg-nero text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="occhiello text-rosso-chiaro">Chi la guida</p>
          <h2 id="titolo-staff" className="titolo mt-1 text-[clamp(2rem,9vw,3.5rem)]">
            Lo staff
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-grigio-chiaro">
            Qualche nome torna anche nella rosa: in una società di questa dimensione la stessa persona allena, gioca e
            firma i documenti.
          </p>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {STAFF.map((p) => (
              <li key={`staff-${p.cognome}-${p.nome}`}>
                <SchedaPersona persona={p} formato="estesa" tono="scuro" />
              </li>
            ))}
          </ul>

          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-grigio-chiaro">
            Fonte: staff tesserato sul portale FISR; ruoli confermati dalla società.
          </p>
        </div>
      </section>

      {/* ================= CHI HA LASCIATO ================= */}
      {chiHaLasciato.length > 0 && (
        <section aria-labelledby="titolo-usciti" className="bg-white">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
            <h2 id="titolo-usciti" className="titolo text-[clamp(1.5rem,6vw,2.25rem)]">
              Hanno giocato con noi
            </h2>

            {/* Una riga a testa: né una lapide né un buco. Chi ha smesso di
                giocare qui ha comunque giocato qui, e il portale federale lo
                dice. `usciti()` è l'unica strada per finire in questo elenco,
                come `inRosa()` è l'unica per stare in quello sopra: nessuna
                pagina filtra la rosa a mano, così un nome uscito non può
                ricomparire fra i convocati per distrazione. */}
            <ul className="mt-4 max-w-3xl divide-y divide-riga border-y border-riga">
              {chiHaLasciato.map((p) => (
                <li key={`uscito-${p.cognome}`} className="flex flex-wrap items-baseline gap-x-3 py-3">
                  <span className="titolo text-xl text-nero">
                    {p.nome} {p.cognome}
                  </span>
                  {p.presenze !== null && (
                    <span className="text-[13px] text-grigio">
                      {p.presenze} {p.presenze === 1 ? 'presenza' : 'presenze'} nel {STAGIONE_ROSA}
                    </span>
                  )}
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
      <dt className="order-2 mt-1.5">
        <span className="titolo block text-lg text-nero">{etichetta}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-grigio">{dettaglio}</span>
      </dt>
      <dd className="cifra order-1 text-[clamp(3.25rem,13vw,5rem)] text-rosso-cupo">{cifra}</dd>
    </div>
  )
}

export default Squadra
