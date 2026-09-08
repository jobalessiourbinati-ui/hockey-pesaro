/**
 * ===========================================================================
 * ATTIVA IL DOMINIO — da lanciare SOLO dopo aver cambiato il DNS su Aruba
 * ===========================================================================
 * Il sito vive su `jobalessiourbinati-ui.github.io/hockey-pesaro/` finché
 * `hockeypesaro.it` non punta a GitHub. Questo script fa il passaggio in un
 * colpo, quando il DNS è pronto:
 *
 *   1. controlla che il DNS punti DAVVERO agli indirizzi di GitHub Pages —
 *      e se non è così **si ferma**, perché il passo successivo spegnerebbe
 *      l'indirizzo che oggi funziona senza accenderne un altro;
 *   2. scrive `public/CNAME` con il dominio: è il file che dice a GitHub qual
 *      è l'indirizzo del sito;
 *   3. porta il percorso di base da `/hockey-pesaro/` a `/` nel workflow di
 *      pubblicazione (sotto un dominio proprio il sito sta nella radice);
 *   4. dice a GitHub il dominio e accende HTTPS.
 *
 * Perché tutto questo non si può fare prima: appena GitHub sa del dominio,
 * l'indirizzo `github.io` smette di rispondere e rimanda a `hockeypesaro.it`.
 * Se il DNS non è ancora cambiato, il sito non si apre da nessuna parte.
 *
 *   node scripts/attiva-dominio.mjs            (controlla e basta)
 *   node scripts/attiva-dominio.mjs --scrivi   (controlla e attiva)
 * ===========================================================================
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { Resolver } from 'node:dns/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOMINIO = 'hockeypesaro.it'
const REPO = 'jobalessiourbinati-ui/hockey-pesaro'
/** Gli indirizzi di GitHub Pages. Se cambiano, GitHub lo scrive nella sua
 *  documentazione: qui restano fissi apposta, per accorgersene. */
const INDIRIZZI_PAGES = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153']

function resolve(...pezzi) {
  return join(...pezzi)
}

const scrivi = process.argv.includes('--scrivi')

console.log(`Dominio: ${DOMINIO}`)

/* 1 · il DNS punta a GitHub? */
/* Si interrogano server pubblici e non quello di sistema: su alcune reti il
   resolver locale rifiuta la connessione, e soprattutto conserva in cache il
   vecchio indirizzo — cioè risponderebbe «punta ad Aruba» anche a DNS già
   cambiato, facendo credere che il passaggio non sia riuscito. */
const risolutore = new Resolver({ timeout: 5000, tries: 2 })
risolutore.setServers(['8.8.8.8', '1.1.1.1'])
let indirizzi = []
try {
  indirizzi = await risolutore.resolve4(DOMINIO)
} catch (e) {
  console.error(`  ✗ il dominio non risolve: ${e.code ?? e.message}`)
  process.exit(1)
}
const puntaAGitHub = indirizzi.some((i) => INDIRIZZI_PAGES.includes(i))
console.log(`  DNS attuale: ${indirizzi.join(', ')}`)

if (!puntaAGitHub) {
  console.error(`
  ✗ IL DNS NON È ANCORA CAMBIATO.

    Il dominio punta a ${indirizzi.join(', ')}, non a GitHub Pages.
    Serve, nel pannello DNS di Aruba (admin.aruba.it → hockeypesaro.it →
    Gestione DNS), quattro record A con questi valori:

      ${INDIRIZZI_PAGES.join('\n      ')}

    e un CNAME  www → jobalessiourbinati-ui.github.io.
    ⚠ I record MX non si toccano: sono la posta @hockeypesaro.it.

    I passi per esteso stanno in DOMINIO.md. Dopo il cambio possono servire
    fino a 24 ore perché si propaghi: rilancia questo comando finché non
    dice che è a posto.`)
  process.exit(2)
}

console.log('  ✓ il DNS punta a GitHub Pages')
if (!scrivi) {
  console.log('\n  Tutto pronto. Rilancia con --scrivi per attivare.')
  process.exit(0)
}

/* 2 · il file CNAME */
const percorsoCname = join(RADICE, 'public', 'CNAME')
writeFileSync(percorsoCname, `${DOMINIO}\n`)
console.log(`  ✓ scritto public/CNAME`)

/* 3 · il percorso di base torna alla radice */
const percorsoWorkflow = join(RADICE, '.github', 'workflows', 'pubblica.yml')
const workflow = readFileSync(percorsoWorkflow, 'utf8')
if (workflow.includes('BASE_URL: /hockey-pesaro/')) {
  writeFileSync(percorsoWorkflow, workflow.replace('BASE_URL: /hockey-pesaro/', 'BASE_URL: /'))
  console.log('  ✓ percorso di base portato a /')
} else {
  console.log('  · percorso di base già a /')
}

/* 4 · GitHub: dominio e HTTPS */
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', cwd: RADICE })
try {
  gh(['api', '-X', 'PUT', `repos/${REPO}/pages`, '-f', `cname=${DOMINIO}`, '-F', 'https_enforced=true'])
  console.log(`  ✓ dominio e HTTPS impostati su GitHub`)
} catch (e) {
  console.error(`  ✗ GitHub ha rifiutato: ${String(e.stderr ?? e.message).slice(0, 200)}`)
  console.error('    (il certificato può metterci qualche minuto: riprova fra poco)')
}

console.log(`
  Fatto. Ora: commit e push, poi il sito risponde su https://${DOMINIO}
  Il certificato HTTPS può richiedere fino a un'ora la prima volta.`)
