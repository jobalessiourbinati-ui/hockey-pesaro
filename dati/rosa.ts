/*
 * ===========================================================================
 * LA ROSA — quello che si trova in fonti pubbliche, con la fonte accanto
 * ===========================================================================
 * ⚠️ LEGGERE PRIMA DI PUBBLICARE QUALUNQUE NOME.
 *
 * Questo file NON è la rosa della stagione in corso: è **ciò che è stato
 * trovato scritto** su articoli, comunicati e documenti della società. Ogni
 * riga porta la fonte e la stagione a cui quella fonte si riferisce. La rosa
 * vera la conferma la società — finché `confermato` è `false`, il nome può
 * comparire nel sito solo dentro un racconto storico, mai in un elenco
 * intitolato «la squadra di quest'anno».
 *
 * Perché tanta cautela su una cosa che sembra banale: mettere in pagina un
 * giocatore che non c'è più, o dimenticarne uno che c'è, su un sito che
 * leggono i compagni di squadra e i loro genitori, è il tipo di errore che
 * non si perdona a un professionista. E i numeri di maglia non li ha nessuna
 * fonte pubblica: si chiedono.
 *
 * SUI MINORI. Tre dei nomi qui sotto erano minorenni all'epoca dell'articolo
 * (Gasparini 2010, Tomassini 2009, e probabilmente i Boniolo). Il fatto che
 * un giornale li abbia nominati non ci autorizza a metterli sul sito della
 * società: serve la liberatoria di chi esercita la responsabilità
 * genitoriale. Il campo `minoreAllEpoca` esiste per non dimenticarlo.
 * ===========================================================================
 */

export type Ruolo = 'portiere' | 'movimento' | 'allenatore' | 'dirigente'

export interface Persona {
  readonly nome: string
  readonly cognome: string
  readonly ruolo: Ruolo
  /** Numero di maglia: nessuna fonte pubblica lo riporta. Lo dà la società. */
  readonly numero: number | null
  /** Anno di nascita, solo se scritto in una fonte. */
  readonly nato: number | null
  /** Da dove viene, se la fonte lo dice. */
  readonly provenienza: string | null
  /** La stagione a cui si riferisce la fonte, non la stagione in corso. */
  readonly stagione: string
  /** L'indirizzo della pagina in cui il nome è scritto. */
  readonly fonte: string
  /** `true` solo quando la società ha confermato che è in rosa OGGI. */
  readonly confermato: boolean
  /** `true` se all'epoca della fonte era minorenne: serve la liberatoria. */
  readonly minoreAllEpoca?: boolean
  /** Una riga di contesto, dalla fonte. Mai un giudizio nostro. */
  readonly nota?: string
}

const HI21_ROSA =
  'https://hockeyitalia21.com/2025/01/02/lamatori-pesaro-pronta-per-il-campionato-di-serie-b-2024-25-con-il-rinforzo-di-stefano-scutece/'
const CARLINO_INIZIO = 'https://www.ilrestodelcarlino.it/pesaro/sport/hockey-serie-b-inizia-21e8e6ac'
const VIVERE_2022 = 'https://www.viverepesaro.it/2022/09/03/presentate-le-squadre-della-amatori-hockey-pesaro/2100248697/'
const PDF_STORIA = 'rilievo/pdf/AHP-La-Storia.pdf'

/**
 * PRIMA SQUADRA — la formazione presentata per il campionato 2024/25.
 * Fonte principale: l'articolo di hockeyitalia21 del 02/01/2025, che è la
 * presentazione della squadra alla vigilia del campionato. Dodici nomi.
 */
export const PRIMA_SQUADRA_2024_25: readonly Persona[] = [
  { nome: 'Juan', cognome: 'Giraldo', ruolo: 'portiere', numero: null, nato: null, provenienza: 'Colombia', stagione: '2024/25', fonte: HI21_ROSA, confermato: false, nota: '24 anni, portiere colombiano; è anche preparatore dei portieri della società.' },
  { nome: 'Alessandro', cognome: 'Tomassini', ruolo: 'portiere', numero: null, nato: 2009, provenienza: null, stagione: '2024/25', fonte: HI21_ROSA, confermato: false, minoreAllEpoca: true, nota: 'Secondo portiere, classe 2009: esordio in prima squadra a gennaio 2025.' },
  { nome: 'Stefano', cognome: 'Scutece', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Modena', stagione: '2024/25', fonte: HI21_ROSA, confermato: false, nota: 'Il rinforzo della stagione: passato da Amatori Modena, Villa Oro, Scandiano e Lodi.' },
  { nome: 'Edgar', cognome: 'Barberi', ruolo: 'movimento', numero: null, nato: null, provenienza: null, stagione: '2024/25', fonte: HI21_ROSA, confermato: false, nota: 'Giocatore e presidente della società dal 2016.' },
  { nome: 'Pierluigi', cognome: 'Morri', ruolo: 'movimento', numero: null, nato: null, provenienza: null, stagione: '2024/25', fonte: HI21_ROSA, confermato: false },
  { nome: 'Nicholas', cognome: 'Ridolfi', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false },
  { nome: 'Filippo', cognome: 'Roberti', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false },
  { nome: 'Alessio', cognome: 'Urbinati', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false },
  { nome: 'Gianluca', cognome: 'Gasparini', ruolo: 'movimento', numero: null, nato: 2010, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false, minoreAllEpoca: true, nota: 'Fra i migliori 10 Under 17 di Emilia-Romagna e Marche alle selezioni Promote.' },
  { nome: 'Jordan', cognome: 'Boniolo', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false, minoreAllEpoca: true, nota: 'Infortunio al crociato nella stagione 2024/25.' },
  { nome: 'Samuel', cognome: 'Boniolo', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false, minoreAllEpoca: true },
  { nome: 'Chiara', cognome: 'Galli', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Pesaro', stagione: '2024/25', fonte: HI21_ROSA, confermato: false, nota: 'Anche allenatrice del settore giovanile.' },
] as const

/** STAFF — dalle stesse fonti. */
export const STAFF: readonly Persona[] = [
  { nome: 'Simone', cognome: 'Carnevali', ruolo: 'allenatore', numero: null, nato: null, provenienza: 'Modena', stagione: '2024/25', fonte: CARLINO_INIZIO, confermato: false, nota: 'Allenatore di prima squadra e Under 19; da giocatore ha militato in Serie A con Modena, Vercelli e Scandiano, poi allenatore a Bassano e Scandiano.' },
  { nome: 'Edgar Vincent', cognome: 'Barberi', ruolo: 'dirigente', numero: null, nato: null, provenienza: null, stagione: '2016→', fonte: 'https://www.coni.it/it/registro-societa-sportive/', confermato: false, nota: 'Presidente e legale rappresentante nel registro CONI; fondatore della società nel 2016 e allenatore delle giovanili.' },
  { nome: 'Chiara', cognome: 'Galli', ruolo: 'allenatore', numero: null, nato: null, provenienza: null, stagione: '2022→', fonte: VIVERE_2022, confermato: false, nota: 'Allenatrice del settore giovanile.' },
  { nome: 'Attilio', cognome: 'Benoffi', ruolo: 'dirigente', numero: null, nato: null, provenienza: null, stagione: '2024', fonte: CARLINO_INIZIO, confermato: false },
] as const

/**
 * LE VECCHIE GLORIE — chi ha fatto la storia recente, dal PDF della società.
 * Vanno nella pagina STORIA, non nella rosa: sono un racconto, e come tale
 * non hanno bisogno di conferma stagionale.
 */
export const STORIA_GIOCATORI: readonly Persona[] = [
  { nome: 'Daniele', cognome: 'Uva', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Molfetta', stagione: '2020/21', fonte: PDF_STORIA, confermato: false, nota: 'Nella squadra della finale di Coppa Nazionale.' },
  { nome: 'Andrea', cognome: 'Lucchi', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Modena', stagione: '2020/21', fonte: PDF_STORIA, confermato: false, nota: 'Nella squadra della finale di Coppa Nazionale.' },
  { nome: 'Davide', cognome: 'Ferri', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Modena', stagione: '2020/21', fonte: PDF_STORIA, confermato: false, nota: 'Nella squadra della finale di Coppa Nazionale.' },
  { nome: 'Antonino', cognome: 'Barberi', ruolo: 'movimento', numero: null, nato: null, provenienza: null, stagione: '2023/24', fonte: PDF_STORIA, confermato: false },
  { nome: 'Alessandro', cognome: 'Zanazzo', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Vicenza', stagione: '2023/24', fonte: PDF_STORIA, confermato: false },
  { nome: 'Jonathan', cognome: 'Dal Santo', ruolo: 'movimento', numero: null, nato: null, provenienza: 'Vicenza', stagione: '2023/24', fonte: PDF_STORIA, confermato: false },
  { nome: 'Mirko', cognome: 'Campana', ruolo: 'movimento', numero: null, nato: null, provenienza: null, stagione: '2021/22', fonte: 'https://www.ilrestodelcarlino.it/pesaro/sport/amatori-netta-affermazione-42d66011', confermato: false },
] as const

/** Quanti nomi aspettano ancora la conferma della società. */
export const DA_CONFERMARE = [...PRIMA_SQUADRA_2024_25, ...STAFF].filter((p) => !p.confermato).length
