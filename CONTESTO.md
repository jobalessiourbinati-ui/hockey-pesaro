# Amatori Hockey Pesaro — cosa sappiamo, e da dove

Sito nuovo per una società **reale**: si applica il regime delle aziende vere
(`studio-3d/CLAUDE.md` §14). Nessun dato inventato, nessun numero di comodo,
nessun nome messo lì per riempire. Se un blocco chiede una prova che non
abbiamo, **cambia il blocco**.

Rilievo del **07–08/09/2026**. Il committente, Alessio Urbinati, **gioca in
prima squadra**: è una fonte diretta, e le cose che dice lui valgono più di
quelle che trovo io in rete — ma vanno segnate come sue.

---

## 1 · L'incarico, alla lettera

> «dobbiamo realizzare il sito per la squadra di hockey dell'Amatori Hockey
> Pesaro dove gioco anche io. Io vorrei che noi togliamo WordPress e mettiamo
> il codice puro che poi gestiremo da qui su Claude Code. Ci deve essere la
> sezione giocatori divisa per squadra per la Serie B, poi le altre squadre
> più piccole saranno tutte assieme. Ci saranno le news ecc… proprio come è
> già ora, però le news dovranno apparire in automatico quando saranno
> pubblicate su Facebook e Instagram. Prendi dai social sia Facebook che
> Instagram quanti più dati possibile per realizzare un ottimo prodotto, mi
> raccomando la parte mobile.»

Quattro cose, in ordine di rischio: via WordPress; giocatori per squadra;
news automatiche dai social; mobile.

---

## 2 · ⚠️ Le credenziali — la prima cosa da fare, e non la faccio io

Il committente ha mandato in chat lo **screenshot di un foglio con le
password vere**: pannello WordPress, due caselle di posta, PayPal, Google,
Flyeralarm, Instagram, più IBAN, P.IVA e codice fiscale della società.

**Io non le uso e non le trascrivo da nessuna parte.** Gli accessi li fa il
committente, sempre, anche quando sarebbe più comodo il contrario.

**Da fare, appena possibile:** cambiare tutte quelle password — a partire da
posta e PayPal, che sono le due che aprono le altre — e accendere la verifica
in due passaggi dove esiste. Un'immagine passata in chat è una password che
ha già viaggiato.

---

## 3 · Il sito di oggi, misurato

`https://www.hockeypesaro.it` · WordPress 7.1 su **Aruba** (`aruba-proxy`,
89.46.110.50) · tema con `style.css` proprio.

**Il contenuto è piccolo**, e per noi è una buona notizia:

| cosa | quanto |
|---|---|
| pagine | 5 — Home, Storia, Prima squadra, Giovanili, Eventi |
| articoli | 4 — due del 20/01/2025, due del 04/11/2024 |
| categorie | 8 — Risultati Serie B, Under 13, Under 17, Serie B Coppa Italia… |
| media | 31 file: 25 immagini, 6 PDF |
| utenti | Christian Carbonari, Daniela Ferreyra, `wp_7657978` |

**Le pagine sono già HTML e CSS scritti a mano**, incollati dentro
WordPress: variabili `--red`, `--surface`, `--font-head`, griglie, media
query. Non è un tema da smontare: è codice nostro che va portato in un
progetto vero. Questo abbassa molto il costo della migrazione.

**Quattro difetti del sito attuale, verificati:**

1. **La pagina STORIA mostra il contenuto delle GIOVANILI.** Titolo del
   documento «Le Giovanili», stesse cinque categorie. La storia vera esiste,
   ma sta dentro un PDF (§5) e in fondo alla pagina «Prima squadra».
2. **La prima squadra non ha giocatori**: staff «Da inserire», riquadri
   Atleti e Campionato vuoti, galleria con «Foto 1 … Foto 6» al posto delle
   foto.
3. **La P.IVA nel piede è finta**: `6545454554545`. Quella vera, dallo stesso
   foglio del committente, è `02689960413` (C.F. 92054780413).
4. **Le giovanili non hanno nemmeno un nome**: cinque schede di descrizione e
   gallerie segnaposto.

---

## 4 · I social — cosa c'è, e cosa si può leggere davvero

- **Facebook**: `facebook.com/amatorihockeypesaro` — pagina ufficiale,
  confermata anche dal Comune di Pesaro. Il contenuto **non è leggibile senza
  login**: anche la versione leggera risponde col muro d'accesso. Restano
  indicizzati alcuni video di partite (Prato, Montecchio in semifinale di
  Coppa Italia, Scandiano).
- **Instagram**: `instagram.com/amatori_hockey_pesaro_asd` — esiste, e senza
  login non si vede **niente**: né biografia, né numero di post, né foto.
- **YouTube e TikTok**: nessun canale della società. Le dirette dell'hockey
  pista passano dal canale federale FISR.

### Le news automatiche: come si fanno per davvero

Non esiste un modo legittimo di «prendere i post» da fuori. Serve l'API di
Meta, con l'account della società:

- **Instagram** vuole un account *Business* o *Creator*, un'app su
  developers.facebook.com, i permessi `instagram_business_basic` e la
  **revisione dell'app** da parte di Meta. Poi si leggono `caption`,
  `media_url`, `permalink`, `timestamp`.
- **Facebook** vuole `GET /page-id/feed`, un *Page Access Token* di lunga
  durata e i permessi delle Pagine. Il token dura finché nessuno cambia
  password o revoca l'app, e scade dopo ~90 giorni di inattività.
- **Il `media_url` di Instagram scade**: le immagini vanno copiate su di noi
  quando arrivano, non linkate.

Cioè: **la parte automatica non è codice, è una pratica**, e va aperta dal
committente con l'account della società. Il codice nostro è la metà facile.
L'alternativa senza pratica sono i servizi terzi (Behold, EmbedSocial): un
riquadro incollato, che non diventa contenuto nostro e costa un abbonamento.

---

## 5 · I sei PDF — la miniera

Erano nella libreria media, invisibili dal sito. Dentro c'è quasi tutto ciò
che manca alle pagine. Testo estratto con pdf.js (i font incorporati hanno una
codifica propria: leggere gli stream a mano dà lettere mescolate).

**`AHP-La-Storia.pdf`** — 10 pagine, 1946→2024:

- **Skating Club Pesaro, 1946**, nell'Italia del dopoguerra. Presidente
  storico **Corrado Amori**; **Enzo Boiani**, produttore di pattini usati a
  livello internazionale e costruttore della pista di **Viale Trieste**;
  dirigenti **Gaetano Ginepro, Giorgio Baioni, Giancarlo Pagnini, Galeazzo
  Boattini**; sostegno di **Morbidelli** (forni) e **Italcomma**.
- **2016**: nasce l'**Amatori Hockey Pesaro** sulle ceneri dello Skating Club,
  con il presidente **Edgar Vincent Barberi**.
- **Il risultato più prestigioso**: stagione **2020-21**, finale della Coppa
  Nazionale di Serie B a Forte dei Marmi contro l'**Engas Vercelli**, dopo
  aver dominato il girone, superato il **Prato** nei quarti e il **Montecchio
  Precalcino** in semifinale. In squadra **Daniele Uva** (Molfetta), **Andrea
  Lucchi** e **Davide Ferri** (Modena), i **fratelli Barberi**.
- **La stagione 2023-24**: spazio ai pesaresi **Alessio Urbinati** (il
  committente), **Filippo Roberti**, **Nicholas Ridolfi**, con i veterani
  **Pierluigi Morri**, **Edgar** e **Antonino Barberi**; il vicentino
  **Alessandro Zanazzo** e **Jonathan Dal Santo**.
- **Under 11 2023-24**: prime **finali nazionali** della storia del club,
  **quarto posto** nella classifica Coppa FISR.
- **Under 17**: **Jordan Boniolo** e **Gianluca Gasparini** superano le
  selezioni del **Promote**, fra i 10 migliori Under 17 di Emilia-Romagna e
  Marche.
- **2024-25**: arriva **Simone Carnevali**, ex Serie A (Modena, Vercelli,
  Scandiano; allenatore a Bassano e Scandiano), alla guida di prima squadra e
  Under 19. Confermato il portiere colombiano **Juan Giraldo**, anche
  preparatore dei portieri.
- **Oltre 4.000 km di trasferte** in una stagione per le giovanili, con due
  partite in un giorno per contenere i costi.

**`AHP-Pesaro-in-Pista-24-27.pdf`** — il progetto triennale «UNIRE, CRESCERE,
VINCERE»: raddoppio dei tesserati, bandi per la **Pista Mare** di Viale
Trieste e il **Pala Borgo**, sede fissa e ufficio, **Memorial Perry** e
**Trofeo Boattini**, servizio di pulmino per le famiglie, progetti nelle
scuole primarie. Contiene anche **la mappa degli allenatori per categoria**:
Galli (Mini e U11), un nuovo allenatore (U13, U15), **Carnevali** (U17, U19 e
Serie B), e i nomi **Roberti, Barberi, Giraldo, Stefano Piermaria**.

**`AHP-Marketing.pdf`** — strategia 2024-27. Una riga che ci riguarda: *«Il
sito web sarà il nostro hub digitale, un portale moderno e aggiornato»*.

**`Partite-2425-271124.pdf`** (e il gemello) — calendario partite 2024-25.
**`calendario-memorial.pdf`** — 2 pagine, solo immagini: da guardare.

---

## 6 · Dalla stampa locale, con la fonte

- **20/04/2026** — gara Scandianese-Pesaro rinviata per guasto al pullman
  (hockeyitalia21.com).
- **07/03/2025** — Scandianese-Pesaro 5-4, gol di Barberi su rigore (Il Resto
  del Carlino).
- **04/01/2025** — inizio campionato a Correggio; **Carnevali
  allenatore-giocatore**, arrivo di **Stefano Scutece**, in rosa Edgar
  Barberi, Pierluigi Morri, il portiere Giraldo (Il Resto del Carlino).
- **21/11/2024** — Modena-Pesaro 3-2, gol di Barberi.
- **01/03/2022** — Pesaro-Correggio 10-3; citati Carnevali, Barberi, Dal
  Santo, **Mirko Campana**, **Dall'Osto**, Zanazzo, Ridolfi.
- **Registro CONI**: legale rappresentante **Edgar Vincent Barberi**.

---

## 7 · Cosa NON sappiamo — e quindi non si scrive

- **La rosa vera della stagione in corso**: numeri di maglia, ruoli, date di
  nascita, foto. I nomi del §5 e del §6 vengono da un PDF del 2024 e da
  articoli: sono **storia**, non la rosa di oggi. Un elenco «giocatori» va
  chiesto al committente.
- **I nomi delle giovanili**: nessuno, da nessuna fonte. E sono **minori**:
  servono le liberatorie dei genitori prima di pubblicare nomi e foto (§9).
- **Lo staff attuale al completo**, il presidente in carica oggi, i dirigenti
  di categoria.
- **Gli orari degli allenamenti**, la quota di iscrizione, il numero dei
  tesserati.
- **Il campo di casa**: il sito nomina sia «Pista al mare Pesaro» sia il
  «Palazzetto dello Sport», il PDF nomina il **Pala Borgo**. Quale sia quello
  vero della stagione lo dice il committente.
- **Gli sponsor**: nel sito c'è solo un banner «Arqa Group».

---

## 8 · La direzione tecnica

**Stack**, lo stesso di casa: React 19 + Vite 8 + TypeScript 6 + Tailwind 4.
Niente WordPress, niente PHP, niente database. Il contenuto sta in file
TypeScript e JSON dentro il repository: si modifica da Claude Code, come ha
chiesto il committente, e ogni modifica è un commit con una data e un perché.

**Le news dai social**: un piccolo lavoro schedulato (una funzione che gira
ogni ora) chiama le API di Meta, scarica i post nuovi, **si copia le
immagini**, e li scrive in un file JSON che il sito legge. Se Meta va giù o
il token scade, il sito continua a mostrare gli ultimi post salvati invece di
un buco. Finché la pratica non è aperta, la stessa pagina legge un file
scritto a mano: la struttura non cambia.

**Il mobile prima**: il committente lo ha chiesto due volte, e la maggior
parte di chi apre il sito di una squadra lo fa dal telefono, in palazzetto o
sul divano. Si progetta a 390 px e si sale, non il contrario.

---

## 9 · Le regole di questo cantiere

1. **Nessun dato inventato.** Vale il §13 di `studio-3d/CLAUDE.md`: niente
   numeri di tesserati, palmarès, medie o «oltre X anni» che non abbiano una
   fonte scritta qui dentro.
2. **I minori non si pubblicano senza liberatoria.** Le giovanili sono
   ragazzi dagli 8 ai 19 anni: nomi, cognomi, foto e date di nascita si
   pubblicano solo con il consenso scritto di chi esercita la responsabilità
   genitoriale, e il sito deve poterli togliere in un minuto. Finché non c'è,
   le giovanili si raccontano **senza nomi**: numeri di squadra, risultati,
   foto di gruppo di spalle o in campo lungo.
3. **Le credenziali non si toccano** (§2).
4. **Le foto altrui non si prendono.** Le immagini della stampa locale sono
   dei giornali. Si usano le nostre.
5. **Ogni pagina dichiara la fonte di ciò che afferma** quando è un fatto
   storico: il PDF della società, un articolo, il registro CONI.

---

## 10 · La federazione, il campionato, il campo — con le fonti

**FISR — Federazione Italiana Sport Rotellistici**, sezione hockey pista.
Codice di affiliazione della società: **3947**. Scheda federale: Via dei
Girasoli 14, 61122 Pesaro; PEC `amatoripesaro@pec.it`.

**Serie B**: terzo livello nazionale, sotto A1 e A2. Nel 2025-26 erano **37
squadre in sei gironi**, andata e ritorno, spareggi e Final Six per due
promozioni in A2.

**Il girone 2025-26 — Girone B, sette squadre**: Amatori Pesaro, Pico
Mirandola A, Pico Mirandola B, Correggio Hockey, RH Scandiano, Rotellistica
Scandianese, Amatori Modena. Risultati recenti reperiti: 18-3 con Scandiano,
9-4 con Pico Mirandola B, 6-1 con Amatori Modena. **La stagione 2026-27 è
appena cominciata e il girone non è ancora pubblicato.**

**Il campo.** «Pista al mare» è la **Pista di pattinaggio di Viale Trieste**,
comunale, **scoperta**, usata da maggio a settembre — la stessa pista che
costruì Enzo Boiani. Per l'inverno un dirigente parla di «una pista al chiuso
di Borgo Santa Maria», ma il registro degli impianti del Comune non conferma
quale sia: il **PalaBorgo** non elenca l'hockey fra gli sport. **Da chiedere
al committente**: è l'unico che sa dove si gioca davvero d'inverno.

**Nelle Marche l'Amatori Pesaro risulta l'unica società di hockey su pista.**
È un fatto che vale come titolo, e ha una fonte: il registro FISR.

### Calendario e risultati in automatico: si può, ma è fragile

Non esiste nessuna API pubblica. Il portale federale carica frammenti di
HTML via AJAX da un fornitore esterno, e i comunicati ufficiali sono **PDF**.
L'unica strada praticabile è leggere l'HTML di un aggregatore non ufficiale
(`hockeypista.info/squadre/amatori-pesaro/`), con i PDF federali come fonte
di verità. Quindi: si fa, una volta a settimana, **e il sito deve reggere
quando salta** — ultimo dato buono in pagina e una riga che dice quando è
stato aggiornato. Mai una tabella vuota.

### ⚠️ Un'incoerenza da chiarire

Sul foglio del committente la **P.IVA** è `02689960413` e il **C.F.**
`92054780413`. Il registro CONI riporta `92054780413`. Per una associazione
sportiva dilettantistica è normale che i due numeri siano diversi, ma prima
di stamparli nel piede del sito **vanno confermati dal commercialista o dal
presidente**: oggi il sito ne mostra uno inventato, e il rimedio non è
sostituirlo con un altro che non abbiamo verificato.
