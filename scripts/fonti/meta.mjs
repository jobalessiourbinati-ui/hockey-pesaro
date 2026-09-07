/*
 * ===========================================================================
 * META — le notizie da Instagram e Facebook
 * ===========================================================================
 * Non esiste un modo legittimo di «prendere i post» da fuori: senza login né
 * Instagram né la Pagina mostrano niente. Serve l'API di Meta, con l'account
 * della società. Cioè: la parte difficile non è questo file, è la pratica.
 * `AGGIORNAMENTO.md` la spiega passo per passo.
 *
 * ⚠️ LE CHIAVI STANNO SOLO NELLE VARIABILI D'AMBIENTE — mai in un file del
 * repository, mai in un commit, e MAI stampate: né a schermo, né dentro un
 * messaggio d'errore, né nel log di GitHub Actions, che è pubblico se il
 * repository è pubblico. Ogni stringa che esce da qui passa da `pulisci()`.
 *
 * ⚠️ IL `media_url` DI INSTAGRAM SCADE (poche ore). Le immagini si scaricano
 * subito e diventano nostre: `public/media/notizie/<id>.webp`. Un link a
 * Instagram in pagina è una foto rotta fra una settimana.
 *
 * Se i token mancano — ed è il caso di oggi, 08/09/2026, perché la pratica
 * con Meta non è ancora aperta — questo modulo NON fallisce: dice che salta
 * i social e restituisce zero voci. Il sito continua a funzionare.
 * ===========================================================================
 */

import { mkdir, access, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { constants } from 'node:fs'

/** Cartella dove finiscono le immagini scaricate, relativa alla radice del progetto. */
export const CARTELLA_MEDIA = join('public', 'media', 'notizie')
/** Il percorso con cui il sito le richiede. */
const URL_MEDIA = '/media/notizie'

const VERSIONE = process.env.META_API_VERSION || 'v23.0'
/*
 * Due strade portano ai post di Instagram, e la scelta la fa la pratica:
 *   - «Instagram API with Instagram Login» → graph.instagram.com,
 *     permesso `instagram_business_basic` (è quella descritta in AGGIORNAMENTO.md);
 *   - «Instagram API with Facebook Login» → graph.facebook.com,
 *     permessi `instagram_basic` + `pages_show_list`.
 * Il codice è lo stesso: cambia l'host, e lo si dice con una variabile.
 */
const HOST_IG = process.env.IG_API_HOST || 'graph.instagram.com'
const HOST_FB = process.env.FB_API_HOST || 'graph.facebook.com'

const LIMITE = Number(process.env.META_LIMITE || 25)

/* ------------------------------------------------------------- segretezza */

const segreti = () => [process.env.IG_TOKEN, process.env.FB_TOKEN].filter((s) => s && s.length > 6)

/**
 * Toglie da una stringa qualunque cosa somigli a una chiave, prima che finisca
 * a schermo. Due reti: i token che conosciamo, e il parametro `access_token`
 * comunque scritto. Non è paranoia — gli errori di Graph rimandano indietro
 * l'URL della richiesta, token compreso.
 */
export function pulisci(s) {
  let out = String(s ?? '')
  for (const t of segreti()) out = out.split(t).join('«token nascosto»')
  out = out.replace(/access_token=[^&\s"']+/gi, 'access_token=«token nascosto»')
  return out
}

/** Le variabili d'ambiente, e basta. Nessun file, nessun default, nessun valore scritto qui. */
export function chiavi() {
  const igUserId = process.env.IG_USER_ID?.trim() || null
  const igToken = process.env.IG_TOKEN?.trim() || null
  const fbPageId = process.env.FB_PAGE_ID?.trim() || null
  const fbToken = process.env.FB_TOKEN?.trim() || null
  return {
    instagram: igUserId && igToken ? { id: igUserId, token: igToken } : null,
    facebook: fbPageId && fbToken ? { id: fbPageId, token: fbToken } : null,
    mancanti: [
      !igUserId && 'IG_USER_ID',
      !igToken && 'IG_TOKEN',
      !fbPageId && 'FB_PAGE_ID',
      !fbToken && 'FB_TOKEN',
    ].filter(Boolean),
  }
}

/* ------------------------------------------------------------------ rete */

async function chiediJson(url, { tentativi = 3, timeoutMs = 20000 } = {}) {
  let ultimo
  for (let i = 1; i <= tentativi; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
      const corpo = await r.json().catch(() => null)
      if (!r.ok || corpo?.error) {
        const e = corpo?.error
        // Il messaggio di Graph passa da pulisci() prima di diventare un Error.
        throw new Error(
          pulisci(
            e
              ? `Graph ${r.status}: ${e.message} (type ${e.type}, code ${e.code}${
                  e.error_subcode ? `/${e.error_subcode}` : ''
                })`
              : `HTTP ${r.status} ${r.statusText}`,
          ),
        )
      }
      return corpo
    } catch (err) {
      ultimo = new Error(pulisci(err.message || String(err)))
      // 190 = token scaduto o revocato: riprovare non serve a niente.
      if (/code 190/.test(ultimo.message)) break
      if (i < tentativi) await new Promise((ok) => setTimeout(ok, 1500 * i))
    }
  }
  throw ultimo
}

/* --------------------------------------------------------------- immagini */

const nomeFile = (id) => `${String(id).replace(/[^A-Za-z0-9_-]/g, '_')}.webp`

const esiste = (p) =>
  access(p, constants.F_OK).then(
    () => true,
    () => false,
  )

/**
 * Scarica un'immagine e la salva ridimensionata. Se il file c'è già non la
 * riscarica: l'aggiornamento gira ogni ora, e i post vecchi non cambiano.
 * Se qualcosa va storto restituisce null — una notizia senza foto è meglio
 * di un aggiornamento che si ferma.
 */
export async function salvaImmagine(url, id, { radice = process.cwd(), log = () => {} } = {}) {
  if (!url) return null
  const relativo = `${URL_MEDIA}/${nomeFile(id)}`
  const assoluto = join(radice, CARTELLA_MEDIA, nomeFile(id))
  if (await esiste(assoluto)) return relativo

  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const dati = Buffer.from(await r.arrayBuffer())
    const { default: sharp } = await import('sharp')
    await mkdir(dirname(assoluto), { recursive: true })
    const fuori = await sharp(dati)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    await writeFile(assoluto, fuori)
    log(`      immagine salvata: ${relativo} (${Math.round(fuori.length / 1024)} KB)`)
    return relativo
  } catch (e) {
    log(`      ⚠️  immagine non salvata per ${id}: ${pulisci(e.message)}`)
    return null
  }
}

/* --------------------------------------------------------------- sorgenti */

const CAMPI_IG = 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url'
const CAMPI_FB = 'id,message,created_time,permalink_url,full_picture'

async function daInstagram({ id, token }, opzioni) {
  const url = `https://${HOST_IG}/${VERSIONE}/${encodeURIComponent(id)}/media?fields=${CAMPI_IG}&limit=${LIMITE}&access_token=${encodeURIComponent(token)}`
  const risposta = await chiediJson(url)
  const post = Array.isArray(risposta?.data) ? risposta.data : []
  const voci = []
  for (const p of post) {
    // Per un video il media_url è il filmato: la copertina è thumbnail_url.
    const sorgente = p.media_type === 'VIDEO' ? p.thumbnail_url || p.media_url : p.media_url
    const chiave = `ig_${p.id}`
    voci.push({
      id: chiave,
      fonte: 'instagram',
      data: p.timestamp ? new Date(p.timestamp).toISOString() : null,
      testo: (p.caption || '').trim(),
      immagine: await salvaImmagine(sorgente, chiave, opzioni),
      link: p.permalink || null,
    })
  }
  return voci
}

async function daFacebook({ id, token }, opzioni) {
  const url = `https://${HOST_FB}/${VERSIONE}/${encodeURIComponent(id)}/feed?fields=${CAMPI_FB}&limit=${LIMITE}&access_token=${encodeURIComponent(token)}`
  const risposta = await chiediJson(url)
  const post = Array.isArray(risposta?.data) ? risposta.data : []
  const voci = []
  for (const p of post) {
    const chiave = `fb_${String(p.id).replace(/[^A-Za-z0-9_-]/g, '_')}`
    voci.push({
      id: chiave,
      fonte: 'facebook',
      data: p.created_time ? new Date(p.created_time).toISOString() : null,
      testo: (p.message || '').trim(),
      immagine: await salvaImmagine(p.full_picture, chiave, opzioni),
      link: p.permalink_url || null,
    })
  }
  return voci
}

/**
 * Legge i due social. Non lancia mai per colpa di un token che manca: in quel
 * caso torna `saltato: true` e il chiamante lascia `dati/notizie.json` com'è.
 * Se invece un token c'è ma l'API risponde male, l'errore è nel risultato:
 * il chiamante decide se è il caso di far fallire l'automazione.
 */
export async function leggiSocial({ radice = process.cwd(), log = console.log } = {}) {
  const k = chiavi()
  const esito = { voci: [], saltato: [], errori: [] }

  if (!k.instagram && !k.facebook) {
    log('   ⏭️  Instagram e Facebook: saltati — nessun token configurato.')
    log(`      mancano: ${k.mancanti.join(', ')}`)
    log('      È previsto: la pratica con Meta non è ancora aperta. Vedi AGGIORNAMENTO.md.')
    log('      dati/notizie.json resta com’è: il sito continua a funzionare.')
    esito.saltato.push('instagram', 'facebook')
    return esito
  }

  for (const [nome, conf, fn] of [
    ['instagram', k.instagram, daInstagram],
    ['facebook', k.facebook, daFacebook],
  ]) {
    if (!conf) {
      log(`   ⏭️  ${nome}: saltato — manca ${k.mancanti.filter((m) => m.startsWith(nome === 'instagram' ? 'IG' : 'FB')).join(' e ')}.`)
      esito.saltato.push(nome)
      continue
    }
    try {
      const voci = await fn(conf, { radice, log })
      log(`   ✅ ${nome}: ${voci.length} post letti.`)
      esito.voci.push(...voci)
    } catch (e) {
      // pulisci() è già passato dentro chiediJson, ma non si stampa mai niente
      // di Meta senza rifarlo: costa nulla e la seconda rete ha salvato progetti.
      log(`   ⚠️  ${nome}: ${pulisci(e.message)}`)
      log(`      dati/notizie.json non perde niente: le voci già salvate restano.`)
      esito.errori.push({ fonte: nome, messaggio: pulisci(e.message) })
    }
  }
  return esito
}
