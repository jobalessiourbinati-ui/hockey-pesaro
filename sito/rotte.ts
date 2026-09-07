/*
 * ===========================================================================
 * LE ROTTE — una sola fonte per il menu, per il piede e per il build
 * ===========================================================================
 * Il sito è statico e multipagina: nessun router in pagina, un file HTML per
 * ogni indirizzo. Il rischio di un impianto così è che l'elenco delle pagine
 * finisca scritto in tre posti diversi — il menu, il piede, la configurazione
 * di Vite — e che uno dei tre resti indietro quando se ne aggiunge una.
 *
 * Perciò l'elenco sta qui, una volta sola, e lo leggono tutti e tre:
 * `Testata.tsx` per il menu, `Piede.tsx` per la mappa in fondo, e
 * `vite.config.ts` per registrare gli ingressi di Rollup. Aggiungere una
 * pagina vuol dire aggiungere una riga qui e il suo `index.html`.
 * ===========================================================================
 */

export interface Rotta {
  /** L'indirizzo pubblico, con la barra finale: è così che lo serve Vite. */
  readonly percorso: string
  /** Il file HTML d'ingresso, relativo alla radice del progetto. */
  readonly file: string
  /** Come si chiama nel menu: corto, perché a 390 px lo spazio è quello. */
  readonly etichetta: string
  /** Il <title> della pagina. */
  readonly titolo: string
  /** La <meta name="description">, e la riga sotto la voce nel menu esteso. */
  readonly descrizione: string
}

export const SOCIETA = 'Amatori Hockey Pesaro ASD'

export const ROTTE: readonly Rotta[] = [
  {
    percorso: '/',
    file: 'index.html',
    etichetta: 'Home',
    titolo: 'Amatori Hockey Pesaro — hockey su pista, Serie B',
    descrizione:
      "L'Amatori Hockey Pesaro ASD: hockey su pista in Serie B, settore giovanile dall'Under 11 all'Under 19, sulla pista di Viale Trieste.",
  },
  {
    percorso: '/squadra/',
    file: 'squadra/index.html',
    etichetta: 'Prima squadra',
    titolo: 'Prima squadra — Amatori Hockey Pesaro',
    descrizione: 'La rosa della Serie B depositata in federazione, con presenze e gol della stagione.',
  },
  {
    percorso: '/giovanili/',
    file: 'giovanili/index.html',
    etichetta: 'Giovanili',
    titolo: 'Giovanili — Amatori Hockey Pesaro',
    descrizione: "Cinque categorie dall'Under 11 all'Under 19: come si entra, dove si allenano, chi le segue.",
  },
  {
    percorso: '/storia/',
    file: 'storia/index.html',
    etichetta: 'Storia',
    titolo: 'Storia — dallo Skating Club 1946 a oggi',
    descrizione:
      "Dallo Skating Club Pesaro del 1946 all'Amatori Hockey Pesaro del 2016, fino alla finale di Coppa Nazionale 2020-21.",
  },
  {
    percorso: '/eventi/',
    file: 'eventi/index.html',
    etichetta: 'Eventi',
    titolo: 'Eventi e calendario — Amatori Hockey Pesaro',
    descrizione: 'I tornei della società: il Torneo Città di Pesaro, il Memorial Perry, il Trofeo Boattini.',
  },
  {
    percorso: '/notizie/',
    file: 'notizie/index.html',
    etichetta: 'Notizie',
    titolo: 'Notizie — Amatori Hockey Pesaro',
    descrizione: 'Le notizie dai social della società e i risultati del campionato, partita per partita.',
  },
] as const

/** La rotta di una pagina, cercata per percorso: serve alla Testata per
 *  segnare con `aria-current` la voce su cui siamo davvero. */
export const rottaDi = (percorso: string): Rotta | undefined => ROTTE.find((r) => r.percorso === percorso)

/** Le voci del menu senza la home: in testata la home è il logo, e ripeterla
 *  nel menu è una voce in più da leggere per niente. */
export const VOCI_MENU: readonly Rotta[] = ROTTE.filter((r) => r.percorso !== '/')
