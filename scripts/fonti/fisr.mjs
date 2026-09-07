/*
 * ===========================================================================
 * FISR — campionato, calendario, risultati e classifica
 * ===========================================================================
 * La federazione NON ha un'API. Il portale `hockeypista.fisr.it` carica
 * frammenti di HTML via AJAX da un fornitore spagnolo (sidgad.es). Qui
 * chiediamo gli stessi frammenti e li leggiamo.
 *
 * ⚠️ È HTML DI TERZI: un giorno cambierà, senza preavviso e senza changelog.
 * Per questo ogni lettura comincia con un controllo dei marcatori attesi. Se
 * un marcatore manca, questo modulo LANCIA `ErroreStruttura` e il chiamante
 * NON scrive il file: meglio una classifica di ieri con la sua data che una
 * di oggi sbagliata. La chiusa del ragionamento sta in `AGGIORNAMENTO.md`.
 *
 * Header obbligatori — misurati l'08/09/2026, non teorici:
 *   - `X-Requested-With: XMLHttpRequest`   senza → risponde 200 con 0 byte
 *   - `Referer: https://hockeypista.fisr.it/`  in HTTPS.
 *     Con `http://` (senza la s) risponde 200 con 0 byte: provato.
 * ===========================================================================
 */

const BASE = 'https://www.server2.sidgad.es/fisr'
export const PORTALE = 'https://hockeypista.fisr.it/'

/** Il codice competizione della FISR. Cambia a ogni stagione. */
export const IDC = {
  '2025/26': 1634,
  '2026/27': 1894,
}

/** L'id federale dell'Amatori Pesaro dentro quella competizione. Cambia anche lui. */
export const SQUADRA_PESARO = {
  1634: 4666,
  1894: 5320,
}

/** La stagione che il sito mostra oggi. Si cambia qui, una riga, una volta l'anno. */
export const STAGIONE_CORRENTE = '2026/27'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Accept: 'text/html, */*; q=0.01',
  'Accept-Language': 'it-IT,it;q=0.9',
  'X-Requested-With': 'XMLHttpRequest',
  Referer: PORTALE,
  Origin: 'https://hockeypista.fisr.it',
  'User-Agent': UA,
}

/** Il portale non risponde, o risponde male. Transitorio: si riprova fra un'ora. */
export class ErroreRete extends Error {
  constructor(messaggio, url) {
    super(messaggio)
    this.name = 'ErroreRete'
    this.url = url
  }
}

/** Il portale risponde, ma la pagina non è più quella. NON transitorio: va guardato. */
export class ErroreStruttura extends Error {
  constructor(marcatore, dettaglio, url) {
    super(`marcatore mancante: ${marcatore}${dettaglio ? ` — ${dettaglio}` : ''}`)
    this.name = 'ErroreStruttura'
    this.marcatore = marcatore
    this.url = url
  }
}

/* ------------------------------------------------------------------ rete */

async function scarica(url, body, { tentativi = 3, attesaMs = 1500, timeoutMs = 20000 } = {}) {
  let ultimo
  let vuoteDiFila = 0
  for (let i = 1; i <= tentativi; i++) {
    const stop = AbortSignal.timeout(timeoutMs)
    try {
      const r = await fetch(url, { method: 'POST', headers: HEADERS, body, signal: stop })
      // 404/410: la pagina non esiste più. Non è un intoppo, è un cambio di
      // struttura — riprovare fra un secondo non la fa tornare.
      if (r.status === 404 || r.status === 410) {
        throw new ErroreStruttura(
          `la pagina stessa (HTTP ${r.status})`,
          'endpoint sparito, oppure idc inesistente per questa stagione',
          url,
        )
      }
      if (!r.ok) throw new ErroreRete(`HTTP ${r.status} ${r.statusText}`, url)
      const testo = await r.text()
      if (testo.length === 0) {
        // 200 con 0 byte è la firma degli header rifiutati. Una volta può
        // essere un capriccio; tutte le volte vuol dire che il patto è cambiato.
        vuoteDiFila++
        throw new ErroreRete('risposta vuota (0 byte)', url)
      }
      return testo
    } catch (e) {
      if (e instanceof ErroreStruttura) throw e
      ultimo = e instanceof ErroreRete ? e : new ErroreRete(e.message || String(e), url)
      if (i < tentativi) await new Promise((ok) => setTimeout(ok, attesaMs * i))
    }
  }
  if (vuoteDiFila === tentativi) {
    throw new ErroreStruttura(
      'corpo della risposta',
      `${tentativi} risposte da 0 byte di fila: il portale non accetta più i nostri header (Referer https + X-Requested-With)`,
      url,
    )
  }
  throw ultimo
}

export const urlCalendario = (idc) => `${BASE}/fisr_cal_idc_${idc}_1.php`
export const urlClassifica = (idc) => `${BASE}/fisr_clasif_idc_${idc}_1.php`

export const scaricaCalendario = (idc) =>
  scarica(urlCalendario(idc), `idc=${idc}&tipo_stats=4&site_lang=it`)

export const scaricaClassifica = (idc) => scarica(urlClassifica(idc), `idc=${idc}&site_lang=it`)

/* --------------------------------------------------------------- parsing */

const testo = (html) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Il documento è diviso in fasi (i gironi) da un titolo. Restituisce ogni
 * fase con il pezzo di HTML che le appartiene, cioè fino al titolo dopo.
 */
function estraiFasi(html) {
  const marcatore = /<div class="div_titulo_fase_idc([^"]*)"\s*>([\s\S]*?)<\/div>/g
  const trovati = [...html.matchAll(marcatore)].map((m) => ({
    inizio: m.index,
    classi: m[1].trim(),
    titolo: testo(m[2]),
  }))
  return trovati.map((f, i) => ({
    ...f,
    corpo: html.slice(f.inizio, i + 1 < trovati.length ? trovati[i + 1].inizio : html.length),
  }))
}

/** `20270110` → `2027-01-10`. Restituisce null se la data non è credibile. */
function dataDaGamedate(g) {
  if (!/^\d{8}$/.test(g)) return null
  const anno = Number(g.slice(0, 4))
  const mese = Number(g.slice(4, 6))
  const giorno = Number(g.slice(6, 8))
  if (anno < 2000 || anno > 2100 || mese < 1 || mese > 12 || giorno < 1 || giorno > 31) return null
  return `${g.slice(0, 4)}-${g.slice(4, 6)}-${g.slice(6, 8)}`
}

/** `08/01/2027` → `2027-01-08`. Il portale ha qualche `gamedate` sbagliato: questa è la rete di sicurezza. */
function dataDaTesto(s) {
  const m = /(\d{2})\/(\d{2})\/(\d{4})/.exec(s || '')
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null
}

/**
 * Le partite di una fase. Ogni riga ha gli id delle due squadre nelle classi
 * del `<tr>`, la data in un attributo, i nomi in `nombre_junto_logo` e il
 * risultato in `web_link_td` (che vale « - » finché non si gioca).
 */
function partiteDellaFase(corpo) {
  const righe = [
    ...corpo.matchAll(
      /<tr class="team_(\d+) team_(\d+) team_class"[^>]*gamedate="([^"]*)"[^>]*>([\s\S]*?)<\/tr>/g,
    ),
  ]
  return righe.map((r) => {
    const dentro = r[4]
    const nomi = [...dentro.matchAll(/nombre_junto_logo"\s*>([^<]*)</g)].map((m) => m[1].trim())
    const punteggio = [...dentro.matchAll(/<td class="web_link_td"[^>]*>([\s\S]*?)<\/td>/g)]
      .map((m) => testo(m[1]))
      .map((s) => /^(\d+)\s*-\s*(\d+)$/.exec(s))
      .find(Boolean)
    const ora = (/<td width="45" class="tabla_standard_less"\s*>([^<]*)</.exec(dentro) || [])[1]
    const visibile = (/<td width="75" class="tabla_standard_less"[^>]*>([\s\S]*?)<\/td>/.exec(dentro) || [])[1]
    return {
      data: dataDaGamedate(r[3]) ?? dataDaTesto(testo(visibile ?? '')),
      ora: (ora || '').trim() || null,
      casaId: Number(r[1]),
      ospitiId: Number(r[2]),
      casa: nomi[0] ?? null,
      ospiti: nomi[1] ?? null,
      risultato: punteggio ? [Number(punteggio[1]), Number(punteggio[2])] : null,
    }
  })
}

/**
 * La tabella di classifica dentro una fase. Colonne, nell'ordine che usa il
 * portale: posizione, logo, nome, PTI, GTE, VTE, PTE, PSE, RFT, RST, DIFF, PEN.
 */
function classificaDellaFase(corpo) {
  const tabella = /<table class="tabla_standard[^"]*"[^>]*>([\s\S]*?)<\/table>/.exec(corpo)
  if (!tabella) return null
  const righe = [...tabella[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
  const fuori = []
  for (const r of righe) {
    const celle = [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1])
    if (celle.length < 11) continue
    const posizione = Number(testo(celle[0]))
    if (!Number.isFinite(posizione)) continue
    const nome = (/<div class="no_mobile"\s*>([^<]*)</.exec(celle[2]) || [])[1]
    if (!nome) continue
    const n = (i) => {
      const v = Number(testo(celle[i]))
      return Number.isFinite(v) ? v : null
    }
    fuori.push({
      posizione,
      squadra: nome.trim(),
      punti: n(3),
      giocate: n(4),
      vinte: n(5),
      pareggiate: n(6),
      perse: n(7),
      fatte: n(8),
      subite: n(9),
      differenza: n(10),
      penalita: celle[11] !== undefined && testo(celle[11]) !== '' ? n(11) : 0,
    })
  }
  return fuori.length ? fuori : null
}

/* ------------------------------------------------------------- lettura */

/**
 * Legge il campionato di una stagione e restituisce l'oggetto che finisce in
 * `dati/classifica.json`. Lancia `ErroreStruttura` appena la pagina non è più
 * quella che ci aspettiamo: il chiamante non deve scrivere niente.
 */
export async function leggiCampionato({ idc, squadraId, stagione = STAGIONE_CORRENTE } = {}) {
  const codice = idc ?? IDC[STAGIONE_CORRENTE]
  const noi = squadraId ?? SQUADRA_PESARO[codice]
  if (!noi) throw new Error(`nessun id squadra noto per idc ${codice}: passalo esplicitamente`)

  /* --- 1 · calendario: da qui esce il girone, senza averlo scritto a mano --- */
  const htmlCal = await scaricaCalendario(codice)
  const urlCal = urlCalendario(codice)

  if (!htmlCal.includes('div_titulo_fase_idc')) {
    throw new ErroreStruttura('div_titulo_fase_idc', 'nessun titolo di girone nel calendario', urlCal)
  }
  if (!/team_class/.test(htmlCal)) {
    throw new ErroreStruttura('tr.team_class', 'nessuna riga partita nel calendario', urlCal)
  }
  if (!/nombre_junto_logo/.test(htmlCal)) {
    throw new ErroreStruttura('nombre_junto_logo', 'nessun nome squadra nel calendario', urlCal)
  }

  const fasiCal = estraiFasi(htmlCal)
  const conPartite = fasiCal
    .map((f) => ({ ...f, partite: partiteDellaFase(f.corpo) }))
    .filter((f) => f.partite.length)
  if (!conPartite.length) {
    throw new ErroreStruttura('tr.team_class', 'i titoli ci sono ma nessuna fase contiene partite', urlCal)
  }

  const nostra = conPartite.find((f) => f.partite.some((p) => p.casaId === noi || p.ospitiId === noi))
  if (!nostra) {
    throw new ErroreStruttura(
      `team_${noi}`,
      `l'Amatori Pesaro non compare in nessun girone di idc ${codice}: id squadra cambiato, o iscrizione diversa`,
      urlCal,
    )
  }

  const partite = nostra.partite
    .map((p) => ({ ...p, nostra: p.casaId === noi || p.ospitiId === noi }))
    .sort((a, b) => String(a.data).localeCompare(String(b.data)) || String(a.ora).localeCompare(String(b.ora)))

  const squadre = [...new Set(partite.flatMap((p) => [p.casa, p.ospiti]).filter(Boolean))].sort()
  const nomeNostro =
    partite.find((p) => p.casaId === noi)?.casa ?? partite.find((p) => p.ospitiId === noi)?.ospiti ?? null

  /* --- 2 · classifica: c'è solo quando la stagione è cominciata --- */
  const htmlCla = await scaricaClassifica(codice)
  const urlCla = urlClassifica(codice)

  if (!htmlCla.includes('div_titulo_fase_idc')) {
    throw new ErroreStruttura('div_titulo_fase_idc', 'nessun titolo nella pagina classifica', urlCla)
  }
  if (!/<table class="tabla_standard/.test(htmlCla)) {
    throw new ErroreStruttura('table.tabla_standard', 'nessuna tabella nella pagina classifica', urlCla)
  }
  if (!htmlCla.includes('no_mobile')) {
    throw new ErroreStruttura('div.no_mobile', 'nessun nome squadra nella pagina classifica', urlCla)
  }

  const fasiCla = estraiFasi(htmlCla)
  // Prima per titolo (è così che il portale la pubblica a stagione iniziata),
  // poi per composizione: una tabella che contiene ESATTAMENTE le squadre del
  // nostro girone. Mai la tabella unica di tutta la Serie B, che a stagione
  // non ancora cominciata elenca 38 squadre tutte a zero: sarebbe una
  // classifica finta.
  const chiave = (a) => [...a].map((s) => s.toUpperCase()).sort().join('|')
  const attesa = chiave(squadre)
  let classifica = null
  let doveClassifica = null

  const perTitolo = fasiCla.find((f) => f.titolo === nostra.titolo)
  if (perTitolo) {
    classifica = classificaDellaFase(perTitolo.corpo)
    if (classifica) doveClassifica = `tabella intitolata «${perTitolo.titolo}»`
  }
  if (!classifica) {
    for (const f of fasiCla) {
      const righe = classificaDellaFase(f.corpo)
      if (righe && chiave(righe.map((r) => r.squadra)) === attesa) {
        classifica = righe
        doveClassifica = `composizione del girone, nella fase «${f.titolo}»`
        break
      }
    }
  }

  const disponibile = Boolean(classifica)
  const giocate = partite.filter((p) => p.risultato).length
  if (!disponibile && giocate > 0) {
    // Partite giocate ma nessuna classifica leggibile: qui la pagina è cambiata.
    throw new ErroreStruttura(
      'table.tabla_standard del girone',
      `${giocate} partite hanno un risultato ma la classifica di «${nostra.titolo}» non è leggibile`,
      urlCla,
    )
  }

  return {
    aggiornato: new Date().toISOString(),
    fonte: {
      portale: PORTALE,
      calendario: urlCal,
      classifica: urlCla,
      nota: 'HTML del portale federale, letto da uno script. Non è un’API: può cambiare senza preavviso.',
    },
    stagione,
    idc: codice,
    squadraId: noi,
    squadra: nomeNostro,
    girone: nostra.titolo,
    squadre,
    classificaDisponibile: disponibile,
    classifica: (classifica ?? []).map((r) => ({
      ...r,
      noi: r.squadra.toUpperCase() === String(nomeNostro).toUpperCase(),
    })),
    classificaNota: disponibile
      ? `Letta dalla ${doveClassifica} del portale federale.`
      : 'La FISR non pubblica ancora la classifica di questo girone: il campionato non è cominciato. La pagina deve dirlo, non mostrare una tabella di zeri.',
    partite,
    partiteGiocate: giocate,
  }
}

/**
 * Le partite dell'Amatori Pesaro già giocate, riscritte come voci di notizia.
 * Nessun commento, nessun aggettivo: la data, le due squadre, il punteggio e
 * il link al portale. È un fatto ricopiato, non un pezzo scritto da noi.
 */
export function notizieDaCampionato(campionato) {
  if (!campionato) return []
  return campionato.partite
    .filter((p) => p.nostra && p.risultato && p.data)
    .map((p) => ({
      id: `fisr_${campionato.idc}_${p.data.replace(/-/g, '')}_${p.casaId}_${p.ospitiId}`,
      fonte: 'fisr',
      data: `${p.data}T00:00:00Z`,
      testo: `${campionato.girone} · ${p.casa} ${p.risultato[0]}-${p.risultato[1]} ${p.ospiti}`,
      immagine: null,
      link: PORTALE,
    }))
}
