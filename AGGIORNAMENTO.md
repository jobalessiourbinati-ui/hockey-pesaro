# L'aggiornamento automatico del sito

Questa è la guida per far apparire da sole, sul sito, le notizie che la
società pubblica su **Instagram** e **Facebook**, e i risultati del
campionato dalla **federazione**.

È scritta per chi non ha mai aperto `developers.facebook.com`. Se una frase
sembra ovvia, è perché deve esserlo: qui non si può sbagliare in silenzio.

**La cosa da sapere prima di tutte le altre:** la parte della federazione
**funziona già adesso, senza fare niente**. Quella dei social no, e non
perché manchi il codice — il codice è scritto e provato — ma perché serve una
**pratica** con Meta, che può aprire solo la società con i propri account.
Finché non è aperta, il sito continua a funzionare: mostra il campionato e
non mostra i social. Nessuna pagina rotta, nessun buco.

---

## Cosa fa, in due righe

Ogni ora un programma si sveglia da solo su GitHub, chiede a Instagram e
Facebook se ci sono post nuovi, chiede alla federazione i risultati, e scrive
due file che il sito legge. Se una delle due fonti non risponde, **tiene
quello che aveva** e lo dice. Non cancella mai niente per un errore.

Il comando, se lo si vuole lanciare a mano dal computer, è uno solo:

```
npm run aggiorna
```

---

## ⚠️ Prima di cominciare: le password

Nella chat è passato lo screenshot di un foglio con le password vere della
società. **Vanno cambiate**, a partire dalla posta e da PayPal.

Questo va fatto **prima** di creare i token di Facebook e Instagram, non
dopo. Motivo pratico: quando si cambia la password di Facebook, **tutti i
token smettono di funzionare** e vanno rifatti da capo. Farlo nell'ordine
sbagliato vuol dire fare due volte lo stesso lavoro.

Ordine giusto:

1. cambia le password e accendi la verifica in due passaggi;
2. **poi** segui i passi qui sotto.

---

## Chi deve farlo

Una persona sola, che sia **amministratore della Pagina Facebook** della
società. Serve anche l'accesso all'account Instagram
`@amatori_hockey_pesaro_asd`. Se l'amministratore della Pagina è qualcun
altro, va fatto insieme a lui: nessuno di questi passi si può fare da fuori.

---

## Passo 1 · L'account Instagram deve diventare «Business»

Un account Instagram normale non ha nessuna API: i suoi post non si possono
leggere da un programma, e non è una questione di permessi, non esiste
proprio. Serve un account **Business** (aziendale). È gratis, si cambia in un
minuto, e si può tornare indietro quando si vuole.

Dall'**app Instagram**, con l'account della società:

1. apri il profilo, poi il menù in alto a destra (le tre righe);
2. **Impostazioni e privacy**;
3. cerca **Tipo di account e strumenti**;
4. tocca **Passa a un account professionale**;
5. scegli una categoria (per esempio *Squadra sportiva*);
6. quando chiede se è un account **Business** o **Creator**, scegli
   **Business** (in italiano: *Azienda*).

Alla fine il profilo è uguale a prima. Cambia solo che ora esistono le
statistiche — e l'API.

---

## Passo 2 · Instagram e la Pagina Facebook devono essere collegati

Questo è il passo che salta più spesso, e senza di lui il resto non funziona.

Sempre dall'app Instagram:

1. **Modifica profilo**;
2. cerca la voce **Pagina** (o *Collega una Pagina Facebook*);
3. scegli la Pagina **Amatori Hockey Pesaro**
   (`facebook.com/amatorihockeypesaro`).

**Come si controlla che sia andata bene:** apri
[business.facebook.com](https://business.facebook.com) → **Impostazioni** →
**Account Instagram**. L'account della società deve comparire lì, con
accanto la Pagina. Se non compare, il collegamento non c'è, e i passi dopo
falliranno senza spiegare perché.

---

## Passo 3 · L'app su developers.facebook.com

«App» qui non vuol dire un'applicazione da scaricare. È solo una **scheda**
che dice a Meta: *questo sito ha il permesso di leggere i nostri post*.

1. vai su [developers.facebook.com](https://developers.facebook.com) e
   accedi con l'account Facebook **personale** che amministra la Pagina
   (non esiste un login «della Pagina»);
2. la prima volta ti chiede di registrarti come sviluppatore: accetta,
   è gratis, e chiede un numero di telefono per la verifica;
3. in alto a destra: **Le mie app** → **Crea un'app**;
4. quando chiede **cosa vuoi che faccia la tua app**, scegli l'opzione che
   parla di **Instagram** / *accedere ai dati di Instagram*. Se quella voce
   non c'è, scegli **Altro** e poi tipo **Azienda** (*Business*);
5. dai un nome che si riconosca: `Sito Amatori Hockey Pesaro`;
6. come **account business** collega quello della società, se te lo chiede.

Ora sei nella **Dashboard** dell'app. Segnati da qualche parte l'**ID
dell'app**: non è un segreto, ma serve.

---

## Passo 4 · I permessi da chiedere

Nella Dashboard, aggiungi i prodotti e chiedi i permessi. Sono quattro nomi
in inglese; qui c'è cosa vuol dire ognuno.

| Permesso | A cosa serve davvero |
|---|---|
| `instagram_business_basic` | leggere i post di Instagram: didascalia, foto, data, link |
| `pages_show_list` | sapere quali Pagine amministri |
| `pages_read_engagement` | leggere i post della Pagina Facebook |
| `pages_manage_metadata` | richiesto insieme ai due sopra per le Pagine |

Non chiedere niente di più. Ogni permesso in più è una domanda in più a cui
rispondere nella revisione, e un motivo in più per farsela rifiutare. Questo
sito **legge e basta**: non pubblica, non cancella, non risponde ai
messaggi.

---

## Passo 5 · La revisione di Meta — cosa aspettarsi

Questa è la parte che non dipende da noi, ed è giusto saperlo prima.

**Finché l'app è in «sviluppo»** (è lo stato in cui nasce), i permessi
funzionano **già**, ma solo per le persone che hanno un ruolo nell'app:
amministratore, sviluppatore, tester. Siccome noi leggiamo *i nostri
stessi* account, spesso **il sito comincia a funzionare subito**, prima di
qualunque revisione. Vale la pena provare a questo punto: se le notizie
appaiono, sei già a posto per un po'.

**Per rendere l'app «in diretta» (Live)** e non dipendere da quello stato,
Meta chiede la **revisione dell'app** (*App Review*). In pratica:

- si compila un modulo per **ogni** permesso, spiegando a cosa serve;
- va allegato di solito un **video dello schermo** che mostra il sito che
  usa quel dato (basta la pagina delle news con i post che compaiono);
- serve l'**URL della privacy policy** del sito: una pagina che dica quali
  dati si leggono e perché. Va scritta, non si può saltare;
- può essere richiesta la **verifica dell'azienda** (*Business
  Verification*): Meta chiede documenti che dimostrino che l'associazione
  esiste — visura, codice fiscale, un'utenza intestata. Per una ASD è la
  parte più lenta, perché i documenti vanno cercati.

**Quanto ci vuole:** Meta non promette nessuna data. Nell'esperienza comune
si va da qualche giorno a qualche settimana, e un rifiuto con richiesta di
chiarimenti è normale — si corregge e si rimanda. **Non è tempo di lavoro
nostro: è tempo di attesa.** Il sito nel frattempo funziona.

---

## Passo 6 · I due numeri e i due token

Servono quattro cose. Due sono numeri pubblici, due sono segreti.

### Lo strumento: il Graph API Explorer

Vai su
[developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer).
È una pagina dove si fanno domande a Meta e si vede la risposta. In alto a
destra scegli la tua app, poi **Generate Access Token** e accetta i permessi
del Passo 4.

Il token che compare lì **dura un'ora**. Non è quello buono: serve solo per
i prossimi tre passaggi.

### a) L'id della Pagina, e il token della Pagina

Nella barra dell'Explorer scrivi:

```
me/accounts
```

e premi **Submit**. Ti risponde con l'elenco delle Pagine che amministri.
Trova **Amatori Hockey Pesaro** e prendi:

- `id` → è il tuo **`FB_PAGE_ID`** (un numero lungo, non è un segreto);
- `access_token` → è il **token della Pagina**, e **questo è un segreto**.

### b) L'id di Instagram

Sempre nell'Explorer, scrivi (mettendo il numero trovato sopra al posto di
`ID-DELLA-PAGINA`):

```
ID-DELLA-PAGINA?fields=instagram_business_account
```

La risposta contiene un `id`: quello è il tuo **`IG_USER_ID`**.

Se invece risponde vuoto o con un errore, vuol dire che il **Passo 2** non è
andato a buon fine: Instagram e la Pagina non sono collegati. Torna indietro
e rifallo.

### c) Il token di lunga durata — il passaggio che quasi tutti saltano

Il token che hai in mano scade fra un'ora. Ne serve uno che duri. Si fa
scambiandolo, una volta sola.

Apri nel browser questo indirizzo, sostituendo le tre parti in MAIUSCOLO:

```
https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=ID-APP&client_secret=SEGRETO-APP&fb_exchange_token=TOKEN-DA-UN-ORA
```

- **ID-APP** e **SEGRETO-APP** stanno nella Dashboard dell'app, sotto
  *Impostazioni → Di base*. Il segreto è nascosto: c'è un pulsante *Mostra*.
- **TOKEN-DA-UN-ORA** è quello dell'Explorer.

La risposta contiene un `access_token` nuovo: **quello dura circa 60
giorni**. Ora rifai il punto **a)** (`me/accounts`) usando *questo* token, e
il token della Pagina che ottieni **non scade più** — finché nessuno cambia
la password di Facebook, toglie l'amministrazione della Pagina o revoca
l'app. Quello è il tuo **`FB_TOKEN`**.

Per Instagram, `IG_TOKEN` si ottiene allo stesso modo dal flusso di
Instagram; se stai usando la strada via Pagina Facebook, va bene lo stesso
token della Pagina, e in quel caso nelle impostazioni va aggiunta la riga
`IG_API_HOST=graph.facebook.com` (vedi `.env.example`).

### Come si controlla che un token sia quello giusto

Vai su
[developers.facebook.com/tools/debug/accesstoken](https://developers.facebook.com/tools/debug/accesstoken),
incolla il token e premi **Debug**. Guarda due righe:

- **Scadenza (Expires)**: deve dire **Mai** (*Never*). Se dice una data fra
  un'ora, hai preso quello sbagliato;
- **Tipo (Type)**: deve dire **Page**, non *User*.

---

## Passo 7 · Dove si incollano — e dove NON si incollano mai

### ❌ Mai nel codice

Un token scritto dentro un file del progetto finisce su GitHub, e da lì
chiunque può leggerlo e pubblicare al posto della società. **Non si
sistema cancellandolo**: resta nella storia di git per sempre. L'unico
rimedio è revocarlo e rifarlo.

Vale anche per: messaggi in chat, email, appunti condivisi, screenshot.

### ✅ Nei Secrets di GitHub

1. apri il repository del sito su GitHub;
2. **Settings** (in alto, non quello del tuo profilo);
3. nel menù a sinistra: **Secrets and variables** → **Actions**;
4. pulsante **New repository secret**;
5. crea questi quattro, uno alla volta, con questi nomi **esatti** —
   maiuscole comprese:

| Nome | Cosa incollare |
|---|---|
| `IG_USER_ID` | l'id di Instagram (Passo 6b) |
| `IG_TOKEN` | il token di Instagram |
| `FB_PAGE_ID` | l'id della Pagina (Passo 6a) |
| `FB_TOKEN` | il token della Pagina di lunga durata (Passo 6c) |

Dopo averli salvati **non si rileggono più**: GitHub li nasconde anche a te.
È giusto così. Se ne serve uno, si rifà.

### ✅ Sul proprio computer, per provare

Solo se vuoi lanciare `npm run aggiorna` dal tuo portatile: copia il file
`.env.example` in un file chiamato `.env` e riempi lì i valori. Il file
`.env` è già escluso dal repository: non parte nei commit.

### Come si controlla che sia andata bene

Su GitHub: scheda **Actions** → **Aggiorna news e campionato** → pulsante
**Run workflow**. Parte subito, e in un paio di minuti il registro dice cosa
ha letto. Se le notizie compaiono, hai finito.

---

## Quando i token scadono

Succederà. Un token della Pagina smette di funzionare quando:

- si cambia la password di Facebook;
- si toglie il ruolo di amministratore alla persona che l'ha creato;
- qualcuno revoca l'app da *Impostazioni → App e siti web*;
- Meta ritira la versione dell'API che stiamo usando.

**Come te ne accorgi — senza doverci pensare:** l'aggiornamento automatico
**fallisce** e GitHub ti manda **una mail**. Nel registro trovi scritto
`Meta ha rifiutato un token che è configurato`. Non è un guasto del sito: il
sito continua a mostrare le notizie già salvate. È solo che da quel momento
non ne arrivano di nuove.

**Cosa fare:** rifai il **Passo 6c**, e riscrivi il Secret `FB_TOKEN` (e
`IG_TOKEN`) con il valore nuovo. Dieci minuti.

Un consiglio: mettiti un promemoria **due mesi prima** di ogni cambio
password della Pagina. Non è il token che va ricordato, è l'ordine delle
cose.

---

## Quando qualcosa non va: i quattro esiti

L'aggiornamento finisce sempre con un numero, e quel numero dice cosa fare.

| Numero | Cosa vuol dire | Cosa fare |
|---|---|---|
| **0** | tutto bene, o social saltati perché i token non ci sono ancora | niente |
| **1** | **il portale federale è cambiato**: la pagina non ha più i pezzi che il programma cercava | va sistemato il programma (`scripts/fonti/fisr.mjs`). **I dati vecchi restano sul sito**: non è stato scritto niente di sbagliato |
| **2** | il portale federale non risponde da più di due giorni | se dura, va segnalato alla FISR |
| **3** | un token c'è ma Meta lo rifiuta | vedi *Quando i token scadono* qui sopra |

La regola che sta sotto a tutte: **meglio un dato di ieri con scritto che è
di ieri, che un dato di oggi sbagliato.** Sul sito di una squadra vera i
risultati li leggono le persone che quelle partite le hanno giocate.

---

## Cosa funziona GIÀ, senza niente di tutto questo

Questa parte non ha bisogno di token, di app, di revisioni e di attese. **È
accesa da adesso.**

Il programma legge il portale della **FISR** — la federazione — e ne ricava,
da solo, ogni ora:

- **il girone** in cui è iscritto l'Amatori Pesaro, senza che nessuno lo
  scriva a mano: lo trova cercando la squadra dentro il calendario;
- **tutte le partite del girone**, con data, ora e le due squadre;
- **i risultati**, appena la federazione li pubblica;
- **la classifica**, appena il campionato comincia;
- **una notizia per ogni partita giocata** dal Pesaro, con il punteggio.

Quello che ha letto oggi, 8 settembre 2026, è già nel file
`dati/classifica.json`:

> **Serie B — Girone D.** Amatori Pesaro con Amatori Modena, Hockey Pico
> Mirandola, Hockey Scandiano, Minimotor Correggio e Rotellistica
> Scandianese. **30 partite** nel girone, di cui **10 del Pesaro**. Si
> comincia il **10 gennaio 2027** a Scandiano, contro la Rotellistica
> Scandianese.

La classifica invece è vuota, ed è giusto così: **il campionato non è ancora
cominciato**, e la federazione non pubblica una classifica che non esiste. Il
sito deve dire *«il campionato comincia il 10 gennaio»*, non mostrare una
tabella di zeri.

### Una cosa da sapere su questa parte

Il portale federale **non ha un'API**. Non c'è nessun accordo, nessuna
documentazione, nessuna promessa: il programma legge la pagina web come la
leggerebbe una persona. Il giorno in cui la federazione cambia il sito,
questo smette di funzionare — ed è previsto.

Per questo il programma, prima di scrivere qualunque cosa, **controlla di
riconoscere la pagina**. Se non la riconosce non scrive niente, tiene i dati
di prima, e fa arrivare la mail. Non c'è nessuno scenario in cui il sito
mostra un risultato sbagliato perché la federazione ha cambiato pagina.

**Una volta all'anno** va cambiata una riga sola: il codice della stagione
nuova. Sta in `scripts/fonti/fisr.mjs`, in cima, e si chiama `IDC` — oggi
`'2026/27': 1894`. Insieme va aggiornato l'id della squadra
(`SQUADRA_PESARO`), perché la federazione lo rifà a ogni stagione. Se
l'aggiornamento fallisce dicendo *«l'Amatori Pesaro non compare in nessun
girone»*, è esattamente questo: è cominciata la stagione nuova.

---

## I file, in breve

| File | Cos'è |
|---|---|
| `scripts/aggiorna.mjs` | il comando: `npm run aggiorna` |
| `scripts/fonti/meta.mjs` | legge Instagram e Facebook, e si copia le immagini |
| `scripts/fonti/fisr.mjs` | legge il portale federale |
| `dati/notizie.json` | le ultime 30 notizie — le legge il sito |
| `dati/classifica.json` | girone, partite, risultati, classifica |
| `public/media/notizie/` | le immagini scaricate dai social, nostre |
| `.github/workflows/aggiorna.yml` | l'orologio: ogni ora, da solo |
| `.env.example` | i nomi delle chiavi, **senza nessun valore** |

Le immagini si scaricano e si tengono perché **il link di Instagram scade**:
un post che oggi ha la foto, fra una settimana avrebbe un riquadro rotto. Le
copie sono ridotte a 1200 pixel di larghezza e salvate in `.webp`, che sul
telefono pesa un terzo di un JPEG.

---

## Una nota sul repository

Il file `.gitignore` del progetto esclude tutto quello che comincia per
`.env.` — quindi esclude anche `.env.example`, che invece **deve** stare nel
repository perché non contiene nessun valore. Va aggiunta una riga:

```
!.env.example
```

Se `.env.example` non si vede su GitHub, è questo il motivo.
