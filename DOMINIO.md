# Portare `hockeypesaro.it` sul sito nuovo

Il sito nuovo è già online e funzionante qui:
**https://jobalessiourbinati-ui.github.io/hockey-pesaro/**

Manca un solo passaggio per farlo rispondere su `hockeypesaro.it`, e **lo devi
fare tu**: cambiare due righe nel pannello DNS di Aruba. Non posso farlo io —
richiede di entrare nel tuo account, e agli accessi non ci vado mai.

Sotto c'è tutto, nell'ordine. Sono cinque minuti.

---

## Dove siamo adesso, misurato

| cosa | valore |
|---|---|
| `hockeypesaro.it` punta a | `89.46.110.50` — l'hosting Aruba con WordPress |
| chi gestisce il DNS | Aruba (`dns.technorail.com`, `dns2.technorail.com`, `dns3.arubadns.net`, `dns4.arubadns.cz`) |
| il sito nuovo vive su | `jobalessiourbinati-ui.github.io/hockey-pesaro/` |

---

## Passo 1 — il backup del vecchio, prima di toccare qualsiasi cosa

Anche se «nessuno sa che esiste», **il backup si fa lo stesso**: costa dieci
minuti e ti salva se fra un mese serve una foto o un testo che non abbiamo
copiato.

Dal pannello Aruba, nella sezione dell'hosting:
1. esporta il **database** MySQL del sito;
2. scarica la cartella dei file via FTP (o dal gestore file), in particolare
   `wp-content/uploads/`, dove stanno tutte le immagini;
3. metti tutto in una cartella con la data nel nome, su un disco che non sia
   solo il computer.

Nota: il materiale che serviva al sito nuovo **l'ho già copiato** in
`rilievo/` — le 25 immagini, i 6 PDF, i testi delle pagine, le schermate del
sito com'era. Quello è già al sicuro nel repository.

---

## Passo 2 — le due righe nel DNS di Aruba

Entra in `admin.aruba.it` → il dominio `hockeypesaro.it` → **Gestione DNS**
(a volte si chiama «DNS e Server Name»).

### Togli i record che puntano all'hosting vecchio
Il record **A** di `hockeypesaro.it` che oggi vale `89.46.110.50`, e il record
di `www` se punta lì.

### Metti questi

**Quattro record A** per il dominio nudo (`hockeypesaro.it`, a volte scritto
`@`). Sono gli indirizzi ufficiali di GitHub Pages, e servono tutti e quattro:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Un record CNAME** per `www`:

```
www   CNAME   jobalessiourbinati-ui.github.io.
```

(il punto finale ci va, se il pannello lo accetta)

⚠️ Non toccare i record **MX**: sono la posta di `info@hockeypesaro.it` e
`c.carbonari@hockeypesaro.it`. Se li togli, la posta smette di arrivare.
Cambiano solo A e CNAME, che riguardano il sito.

---

## Passo 3 — dimmelo, e attivo il resto

Appena hai cambiato il DNS scrivimi «fatto il DNS». Da lì faccio io, in un
comando:

1. aggiungo il file `public/CNAME` con dentro `hockeypesaro.it`;
2. cambio il percorso di base del sito da `/hockey-pesaro/` a `/` (oggi il
   sito vive in un sottopercorso: senza questo passaggio i collegamenti si
   romperebbero);
3. dico a GitHub qual è il dominio e **accendo il certificato HTTPS**, che è
   gratuito e automatico.

**Perché non l'ho già fatto:** appena si imposta il dominio su GitHub, la
pagina `jobalessiourbinati-ui.github.io/hockey-pesaro/` smette di rispondere e
manda a `hockeypesaro.it`. Se il DNS non è ancora cambiato, il risultato è un
sito che non si apre da nessuna parte. Quindi si fa **dopo** il DNS, mai prima.

---

## Passo 4 — spegnere WordPress, per ultimo

Quando `hockeypesaro.it` mostra il sito nuovo e l'hai guardato dal telefono,
allora si può disdire o svuotare l'hosting Aruba. **Per ultimo**, non prima:
finché il DNS non è propagato ovunque — può volerci fino a 24 ore — qualcuno
potrebbe ancora finire sul vecchio, ed è meglio che trovi il vecchio sito
piuttosto che una pagina di errore.

L'hosting resta comunque necessario per la **posta**, se le caselle
`@hockeypesaro.it` sono su Aruba. Prima di disdire qualcosa, controlla quello.

---

## Cosa cambia per te, dopo

Niente pannello, niente aggiornamenti di WordPress, niente plugin da
aggiornare. Il sito si modifica da qui, e ogni modifica va online da sola in
meno di un minuto. I risultati del campionato si aggiornano da soli ogni ora
dal portale federale. Le notizie dai social partiranno appena aprirai la
pratica con Meta, che è descritta in `AGGIORNAMENTO.md`.
