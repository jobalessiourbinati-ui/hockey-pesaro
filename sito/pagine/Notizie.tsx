/*
 * SEGNAPOSTO — questa pagina la scrive un altro agente.
 *
 * Esiste solo perché la rotta /notizie/ è già registrata in
 * `sito/rotte.ts` e in `vite.config.ts`: senza questo file il build non
 * compila e nemmeno la home si costruisce. Va sostituito per intero, non
 * modificato — e finché c'è, dice la verità invece di mostrare una pagina
 * vuota che sembra rotta.
 */
export function Notizie() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
      <p className="occhiello text-rosso-cupo">In lavorazione</p>
      <h1 className="titolo mt-2 text-[clamp(2.5rem,11vw,4.5rem)]">La pagina notizie</h1>
      <p className="mt-6 max-w-xl text-[17px] leading-relaxed">
        Questa pagina è in costruzione. Nel frattempo la{' '}
        <a className="font-semibold underline underline-offset-4" href="/">
          home
        </a>{' '}
        raccoglie le informazioni già verificate.
      </p>
    </section>
  )
}
