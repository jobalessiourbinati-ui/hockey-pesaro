/*
 * ===========================================================================
 * LA ROSA — dal portale federale FISR, non dai giornali
 * ===========================================================================
 * FONTE PRIMARIA: il portale dei risultati della FISR (hockeypista.fisr.it),
 * che pubblica le rose depositate, le presenze, i gol e lo staff tesserato.
 * È la fonte ufficiale: qui dentro c'è quello che la società ha depositato in
 * federazione, non quello che ha scritto un giornale.
 *
 * Endpoint (POST, con `Referer: http://hockeypista.fisr.it/`):
 *   https://www.server2.sidgad.es/fisr/fisr_stats_1_1634.php
 *   body: idc=1634&tipo_stats=plantillas&site_lang=it
 * `idc` è competizione+stagione (1634 = Serie B 2025/26, 1894 = 2026/27); la
 * squadra è `teamid_4666`. I numeri di maglia NON stanno in quella tabella:
 * vengono dai tabellini delle singole partite (`fisr_gr_<idp>_1.php`), dove
 * ogni evento porta il dorsale di chi lo ha fatto.
 *
 * ⚠️ QUESTA È LA STAGIONE 2025/26, quella appena conclusa. La rosa 2026/27
 * non è ancora depositata — il campionato comincia il 10/01/2027 — e finché
 * non lo è la pagina mostra questa **dicendo di quale stagione è**.
 *
 * ⚠️ SUI MINORI. Tomassini è del 2009 e Gasparini del 2010. Nome e cognome
 * sono già pubblici sul portale federale, ma **una fotografia è un'altra
 * cosa** e vuole la liberatoria di chi esercita la responsabilità
 * genitoriale. Il campo `minore` esiste per non dimenticarlo.
 * ===========================================================================
 */

export type Ruolo = 'portiere' | 'movimento' | 'allenatore' | 'dirigente' | 'proprietario'

export interface Persona {
  readonly nome: string
  readonly cognome: string
  /** Tutti i ruoli: in una società piccola una persona ne ha più d'uno. */
  readonly ruoli: readonly Ruolo[]
  /** Numero di maglia dai tabellini; `null` se non è mai comparso in un evento. */
  readonly numero: number | null
  readonly nato: number | null
  readonly provenienza: string | null
  /** Gol e presenze 2025/26, dal portale federale. */
  readonly gol: number | null
  readonly presenze: number | null
  readonly stato: 'in-rosa' | 'uscito' | 'da-confermare'
  readonly verificato?: string
  readonly minore?: boolean
  readonly nota?: string
  /** Il file in `public/media/rosa/`, quando la società ce lo darà. */
  readonly foto?: string
}

export const FONTE_FEDERALE = 'http://hockeypista.fisr.it'
export const STAGIONE_ROSA = '2025/26'

/**
 * PRIMA SQUADRA — Serie B 2025/26, diciassette tesserati.
 * L'ordine è quello con cui la pagina li mostra: prima chi ha segnato, per
 * gol, poi gli altri. Non è una gerarchia: è una tabella che si legge.
 */
export const PRIMA_SQUADRA: readonly Persona[] = [
  {
    nome: 'Edgar Vincent', cognome: 'Barberi', ruoli: ['movimento', 'allenatore', 'dirigente', 'proprietario'],
    numero: 5, nato: null, provenienza: null, gol: 6, presenze: 8, stato: 'da-confermare',
    verificato: 'ruoli confermati da Alessio Urbinati, 08/09/2026',
    nota: 'Ha fondato la società nel 2016 e la porta avanti: proprietario, dirigente e allenatore. In pista è il miglior marcatore della stagione.',
  },
  {
    nome: 'Jordan', cognome: 'Boniolo', ruoli: ['movimento'], numero: 6, nato: null, provenienza: 'Pesaro',
    gol: 4, presenze: 10, stato: 'da-confermare', minore: true,
    nota: 'Fra i dieci migliori Under 17 di Emilia-Romagna e Marche alle selezioni Promote.',
  },
  { nome: 'Filippo', cognome: 'Roberti', ruoli: ['movimento'], numero: 9, nato: null, provenienza: 'Pesaro', gol: 4, presenze: 6, stato: 'da-confermare' },
  { nome: 'Alessio', cognome: 'Urbinati', ruoli: ['movimento'], numero: 7, nato: null, provenienza: 'Pesaro', gol: 4, presenze: 9, stato: 'da-confermare' },
  { nome: 'Alberto', cognome: 'Pascucci', ruoli: ['movimento'], numero: 11, nato: null, provenienza: null, gol: 3, presenze: 8, stato: 'da-confermare' },
  { nome: 'Nicholas', cognome: 'Ridolfi', ruoli: ['movimento'], numero: 4, nato: null, provenienza: 'Pesaro', gol: 3, presenze: 7, stato: 'da-confermare' },
  {
    nome: 'Juan Camilo', cognome: 'Giraldo Bueno', ruoli: ['portiere'], numero: 81, nato: null, provenienza: 'Colombia',
    gol: 0, presenze: 5, stato: 'uscito', verificato: 'Alessio Urbinati, 08/09/2026',
    nota: 'Portiere colombiano, anche preparatore dei portieri della società. Non fa più parte della squadra.',
  },
  { nome: 'Gianluca', cognome: 'Gasparini', ruoli: ['movimento'], numero: null, nato: 2010, provenienza: 'Pesaro', gol: 0, presenze: 9, stato: 'da-confermare', minore: true },
  { nome: 'Chiara', cognome: 'Galli', ruoli: ['movimento', 'allenatore'], numero: null, nato: null, provenienza: 'Pesaro', gol: 0, presenze: 4, stato: 'da-confermare', nota: 'Allena il settore giovanile e gioca in prima squadra.' },
  { nome: 'Alex', cognome: 'Giusti', ruoli: ['movimento'], numero: null, nato: null, provenienza: null, gol: 0, presenze: 5, stato: 'da-confermare' },
  { nome: 'Pierluigi', cognome: 'Morri', ruoli: ['movimento'], numero: null, nato: null, provenienza: null, gol: 0, presenze: 6, stato: 'da-confermare' },
  { nome: 'Alessandro', cognome: 'Tomassini', ruoli: ['portiere'], numero: null, nato: 2009, provenienza: null, gol: 0, presenze: 6, stato: 'da-confermare', minore: true },
  { nome: 'Lorenzo Mikhael', cognome: 'La Ferla', ruoli: ['movimento'], numero: null, nato: null, provenienza: null, gol: 0, presenze: 4, stato: 'da-confermare' },
  { nome: 'Jason Ray', cognome: 'Jamerson', ruoli: ['movimento'], numero: null, nato: null, provenienza: null, gol: 0, presenze: 2, stato: 'da-confermare' },
  { nome: 'Samuel', cognome: 'Boniolo', ruoli: ['portiere'], numero: null, nato: null, provenienza: 'Pesaro', gol: 0, presenze: 0, stato: 'da-confermare', minore: true },
  { nome: 'Jonathan', cognome: 'Dal Santo', ruoli: ['movimento'], numero: null, nato: null, provenienza: 'Vicenza', gol: 0, presenze: 0, stato: 'da-confermare' },
  { nome: 'Simone', cognome: 'Carnevali', ruoli: ['movimento', 'allenatore'], numero: null, nato: null, provenienza: 'Modena', gol: 0, presenze: 0, stato: 'da-confermare', nota: 'Da giocatore ha militato in Serie A con Modena, Vercelli e Scandiano; ha allenato a Bassano e Scandiano.' },
] as const

/**
 * LO STAFF depositato per il 2025/26. Il capo allenatore è **Escardilla**:
 * Carnevali, che nel 2024/25 guidava la prima squadra, risulta allenatore di
 * terzo livello. È un cambio che il sito attuale non racconta.
 */
export const STAFF: readonly Persona[] = [
  { nome: 'Edoardo Rubien', cognome: 'Escardilla', ruoli: ['allenatore'], numero: null, nato: null, provenienza: null, gol: null, presenze: null, stato: 'da-confermare', nota: 'Allenatore di 1° livello: il capo allenatore depositato in federazione.' },
  { nome: 'Edgar Vincent', cognome: 'Barberi', ruoli: ['allenatore', 'dirigente', 'proprietario'], numero: null, nato: null, provenienza: null, gol: null, presenze: null, stato: 'da-confermare', verificato: 'Alessio Urbinati, 08/09/2026' },
  { nome: 'Simone', cognome: 'Carnevali', ruoli: ['allenatore'], numero: null, nato: null, provenienza: null, gol: null, presenze: null, stato: 'da-confermare', nota: 'Allenatore di 3° livello nel 2025/26.' },
  { nome: 'Andrea Eliseo', cognome: 'Boniolo', ruoli: ['dirigente'], numero: null, nato: null, provenienza: null, gol: null, presenze: null, stato: 'da-confermare' },
] as const

/* ---------------------------------------------------------------------------
 * Le funzioni che usa la pagina. Nessun componente filtra a mano l'elenco
 * grezzo: un nome uscito non deve poter tornare in pagina per distrazione.
 * ------------------------------------------------------------------------- */

export const inRosa = (p: Persona): boolean => p.stato !== 'uscito'
export const usciti = (persone: readonly Persona[]): readonly Persona[] => persone.filter((p) => p.stato === 'uscito')

/** Le iniziali, per il riquadro quando la fotografia non c'è. */
export const iniziali = (p: Persona): string => `${p.nome[0] ?? ''}${p.cognome[0] ?? ''}`.toUpperCase()

/** Come si scrive un ruolo in pagina. */
export const ETICHETTA_RUOLO: Record<Ruolo, string> = {
  portiere: 'portiere',
  movimento: 'giocatore',
  allenatore: 'allenatore',
  dirigente: 'dirigente',
  proprietario: 'proprietario',
}

/** Il miglior marcatore, calcolato: mai scritto a mano. */
export const capocannoniere = (persone: readonly Persona[]): Persona | null =>
  persone.filter(inRosa).reduce<Persona | null>((m, p) => ((p.gol ?? 0) > (m?.gol ?? -1) ? p : m), null)

/** I gol della squadra, sommati dai singoli: nessun totale scritto a mano. */
export const golSquadra = (persone: readonly Persona[]): number =>
  persone.reduce((s, p) => s + (p.gol ?? 0), 0)
