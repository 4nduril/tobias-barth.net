---
title: Einfache Foto-Upload-App mit Node.js
tags:
  - javascript
  - expressjs
  - apps
categories:
  - Web-Stuff
description: Wir stellen einen WLAN-Router auf, mit dem sich alle verbinden. Er braucht keinen Internet-Uplink. Die Projektleiterin startet einen Node.js-Webserver auf ihrem Macbook, der eine Seite mit einem Webformular ausliefert, das nichts anderes tut, als einen Datei-Upload zu ermöglichen. Der Server speichert die hochgeladenen Files auf dem Laptop und das wars.
lang: de
date: '2017-05-30 19:08:00'
---

Meine Frau brauchte für ein Projekt mit Kindern eine einfache Möglichkeit, Fotos von Smartphones auf ihren Laptop zu laden. Es gibt viele Methoden das zu machen: Bluetooth, USB, SD-Karten-Austausch, und natürlich die üblichen Internet-Lösungen wie Dropbox.

Bei 20 Zehn- bis Vierzehnjährigen sind 1-zu-1-Verbindungen mit Bluetooth oder Kabel nicht so richtig praktisch. Internetbasierte Lösungen waren aus verschiedenen Gründen ebenfalls nicht das Richtige. Also habe ich angeboten, eine kleine Eigenbau-Lösung zu basteln.

Das Konzept: Wir stellen einen WLAN-Router auf, mit dem sich alle verbinden. Er braucht keinen Internet-Uplink. Die Projektleiterin startet einen Node.js-Webserver auf ihrem Macbook, der eine Seite mit einem Webformular ausliefert, das nichts anderes tut, als einen Datei-Upload zu ermöglichen. Der Server speichert die hochgeladenen Files auf dem Laptop und das wars.

### Schritt 0: Init

    $ mkdir -p upload-app/server && cd upload-app

Wir initialisieren das Projekt und installieren das erste Paket:

    $ yarn init -y
    $ yarn add express

### Schritt 1: Der Server

Als erstes erstellen wir die Datei `server/index.js`:

```javascript
// index.js
const express = require('express')
const app = express()

// Für CSS und ggfs. JS
app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  res.send('Hello\n')
})

app.listen(3000, err => {
  if (err) throw err
  console.log('Listening on port 3000')
})
```

Sehr schön. Um uns das Entwicklerleben leichter zu machen, installieren wir uns `nodemon` und starten dann per npm-Script den Server:

    $ yarn add -D nodemon

```json
// package.json
{
  "name": "upload-app",
  "version": "1.0.0",
  "scripts": {
    "start": "nodemon ./server/index.js"
  },
  …
}
```

    $ npm start
    Listening on port 3000

### Schritt 2: Die Startseite

Bisher antwortet unser Server nur mit dem String `'Hello'`. Wir ändern das mit einem schicken Low-Budget-Template. Wir erstellen die Datei `server/templates.js` mit folgendem Inhalt:

```javascript
// server/templates.js
const pageHeader = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Du und die Kamera – KKS</title>
  </head>
  <body>
    <div class="wrapper">
`

const pageFooter = `    </div>
    <script src="/upload.js" />
  </body>
</html>
`

const homepage = () => `${pageHeader}
      <form action="/upload" method="post" enctype="multipart/form-data">
        <h1>Du und die Kamera</h1>
        <label for="upload">Bild auswählen</label>
        <input id="upload" type="file" name="datei" accept="image/*" />
        <button type="submit">Hochladen</button>
      </form>
${pageFooter}
`

module.exports = {
  homepage,
}
```

Wir exportieren also eine Funktion, die ein Template-Literal zurückgibt. Wir hätten Header und Footer auch direkt integrieren können, aber wir brauchen sie später noch für eine zweite Seite.

In `server/index.js` nutzen wir jetzt die `homepage`-Funktion:

```javascript
// server/index.js
const { homepage } = require('./templates.js')

app.get('/', (req, res) => {
  res.send(homepage())
})
```

Wir haben jetzt ein Formular mit einem File-Upload-Input auf unserer Website. Es sieht noch ein bisschen unspektakulär aus. Werfen wir etwas CSS dagegen! Wir erstellen die Datei `server/static/style.css`:

```css
/* server/static/style.css */
* {
  font-family: sans-serif;
  box-sizing: border-box;
}

img {
  max-width: 100%;
}

.wrapper > form {
  display: flex;
  width: 20em;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  flex-wrap: wrap;
}

#upload {
  display: none;
}

[for='upload'] {
  display: block;
  width: 18em;
  padding: 1em;
  margin-top: 1em;
  margin-bottom: 2em;
  border-radius: 0.2em;
  text-align: center;
  color: white;
  background-color: deepskyblue;
  font-weight: bold;
}
```

Besser. _Anmerkung:_ Ich blende hier das eigentliche Input-Element aus und nutze die Tatsache, dass man auch auf dass zugehörige Label-Element klicken kann, um den Datei-Auswahl-Dialog zu öffnen. Diese Idee habe ich mir aus dem MDN abgeguckt: [Using a label element to trigger a hidden file input element](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications#Using_a_label_element_to_trigger_a_hidden_file_input_element). Das hat den Vorteil, dass man das hässliche Browser-gestylte File-Input los ist und in Ruhe einfach das Label stylen kann.

### Schritt 3: Datei-Uploads annehmen

Jetzt sollten wir dafür sorgen, dass der `/upload` Pfad auch in der Express-App definiert ist und die hochgeladenen Files gespeichtert werden.

Wir benutzen dafür `multiparty`:

    $ yarn add multiparty

und passen zuerst unseren Server an:

```javascript
// in server/index.js
const handleUpload = require('./handleUpload.js')

app.post('/upload', handleUpload)
```

Die Datei `server/handleUpload.js` müssen wir natürlich auch schreiben:

```javascript
// server/handleUpload.js
const Form = require('multiparty').Form
const { uploadOptions } = require('./config.js')
const { successPage } = require('./templates.js')

module.exports = function handleUpload(req, res) {
  const form = new Form(uploadOptions)
  form.on('file', (name, file) => {
    req.filename = file.originalFilename
  })
  form.on('error', () => {})
  form.on('close', () => res.send(successPage(req.filename)))
  form.parse(req)
}
```

Die Instanzen von `multiparty.Form` sind Event-Emitter. `.parse` verabeitet die Anfrage vom Browser, in der die hochgeladene Datei enthalten ist. Das `file`-Event wird emittiert, wenn eine Datei aus dem Request fertig verarbeitet ist. Hier nutzen wir die Gelegenheit um den Original-Dateinamen im Request-Objekt zwischen zu speichern.

Die Dokumentation von multiparty rät dringend, einen Error-Listener zu registrieren, auch wenn man nichts mit dem Fehler macht. Ansonsten crasht nämlich die App bei allem, was multiparty als Error ansieht.

Schließlich senden wir eine Erfolgsmeldung an den Browser zurück, wenn der Request fertig verarbeitet ist. Diese `successPage` ist wieder eine Template-Funktion, die wir genau wie die Homepage in `server/templates.js` definieren:

```javascript
// in server/templates.js

const successPage = filename => `${pageHeader}
      <p>Du hast "${filename}" erfolgreich hochgeladen.</p>
${pageFooter}
`

module.exports = {
  homepage,
  successPage,
}
```

Hier nutzen wir den im Request-Objekt gespeicherten Dateinamen, um der Nutzerin im Browser nochmal anzuzeigen, was sie hochgeladen hat.

Haben alle bemerkt, dass es noch ein Detail in `handleUpload.js` zu besprechen gibt? `config.js`, richtig.

Der Bequemlichkeit halber legen wir die Datei `server/config.js` an, und exportieren von dort ein paar Dinge:

```javascript
// server/config.js
const path = require('path')

const uploadDir = path.join(process.cwd(), 'upload-app')

module.exports = {
  port: process.env.NODE_ENV === 'production' ? 80 : 3000,
  uploadDir,
  uploadOptions: {
    uploadDir,
  },
}
```

Bisher geben wir `multiparty` nur eine Option mit, aber eventuell ändert sich das auch einmal und dann haben wir schon ein ganzes Config-Objekt dafür. Außerdem wollen wir in der Lage sein, im Produktions-Modus den allgemein gültigen HTTP-Port zu nutzen anstatt 3000. Das `uploadDir` exportieren wir gleich mit, um es bei App-Start anzulegen und zusammen mit der "Listening …"-Meldung anzuzeigen. So weiß derjenige, der den Server startet, auch direkt, wo er nach den hochgeladenen Dateien schauen muss. Wir haben es hier so eingerichtet, dass dieses Verzeichnis innerhalb des Ordners erzeugt wird, aus dem die App gestartet wird. Das ganze wird von unserem Server so genutzt:

```javascript
// in server/index.js
const fs = require('fs')
const { port, uploadDir } = require('./config.js')

try {
  fs.mkdirSync(uploadDir)
} catch (e) {
  // Wenn das Verzeichnis schon existiert, machen wir einfach weiter.
  // Bei jedem anderen Fehler lassen wir crashen.
  if (e.code !== 'EEXIST') throw e
}
app.listen(port, err => {
  if (err) throw err
  console.log(`
Listening on port ${port}
Using directory "${uploadDir}" for uploads
  `)
})
```

Damit sind wir eigentlich fertig. Wir haben eine Website, man kann dort eine Bild-Datei hochladen, sie landet in unserem Upload-Ordner und man bekommt eine Bestätigung nach dem Hochladen.

### Schritt 4: Es geht besser

Es bleibt allerdings die Frage offen: Woher wissen denn alle Beteiligten, was sie in die Adresszeile ihres Smartphone-Browsers eingeben müssen, um zu unserer schicken Upload-App zu kommen?

Per default lauscht Express auf allen zugewiesenen IP-Adressen. Wenn wir wüssten, welche IP der Computer, auf dem der Server läuft, vom WLAN-Accesspoint bekommen hat, könnten wir das allen sagen. Wir wollen die Kursleiterin aber nicht dazu verdonnern in ihren Netzwerkeinstellungen irgendwo in den Untiefen des Computers danach zu suchen. Es wäre doch schon mal viel netter, wenn wir die richtige (also erreichbare) IP einfach direkt beim App-Start im Terminal ausgeben. Dann könnte zumindest die Kursleiterin allen die Addresse sagen.

Ok, los gehts. Wir brauchen eine IP-Adresse, die nicht intern ist (intern wäre z.B. 127.0.0.1, die zeigt immer auf den Rechner, auf dem sie angefragt wird). Dann stellen wir sicher, dass der Server auf dieser Adresse lauscht und zeigen sie im Terminal an:

```javascript
// in server/config.js
const os = require('os')

const getMachineIp = () => {
  const ifs = os.networkInterfaces()
  return (
    Object.keys(ifs)
      // Accumulate all address objects from all interfaces in one array
      .reduce((flattened, iface) => [...flattened, ...ifs[iface]], [])
      // Only external addresses
      .filter(address => !address.internal)
      // Only v4 addresses (easier to type in a browser)
      // And take only the first one
      .filter(address => address.family === 'IPv4')[0].address
  )
}

module.exports = {
  port: process.env.NODE_ENV === 'production' ? 80 : 3000,
  uploadDir,
  uploadOptions: {
    uploadDir,
  },
  serverIp: getMachineIp(),
}
```

Ich empfehle jedem mal auf dem eigenen Rechner die Node.js REPL zu starten und dort `os.networkInterfaces()` aufzurufen, um einen Eindruck zu bekommen, mit was für Daten wir hier arbeiten.

Als nächstes bauen wir das in den Server ein:

```javascript
// in server/index.js
const { port, serverIp, uploadDir } = require('./config.js');

if (serverIp) {
  try {
    fs.mkdirSync(uploadDir);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
  app.listen(port, serverIp, (err) => {
    if (err) throw err;
    console.log(`
  Listening on ${serverIp}:${port}
  Using directory "${uploadDir}" for uploads
      `);
    });
  });
} else {
  throw Error('No public v4 IP found!');
}
```

Wir können jetzt zwar unsere Website nicht mehr mit `localhost:3000` aufrufen, aber das wäre ja eh nur auf dem Computer gegangen, auf dem der Server läuft. Viel wichtiger ist, dass die Kinder sie von außen erreichen.

Jetzt könnte die Kursleiterin also die richtige IP-Adresse sehen und sie z.B. an die Tafel schreiben. Oder in ein Dokument tippen und das mit dem Beamer an die Wand werfen. Moment. Ein Beamer? Ein Dokument? Wir können die IP auch gleich zusätzlich auf der Upload-Webseite anzeigen. Dazu müssen wir sie bloß unserer Template-Funktion übergeben:

```javascript
// in server/templates.js
const homepage = ({ address, listenPort }) => `${pageHeader}
      <form action="/upload" method="post" enctype="multipart/form-data">
        <h1>Du und die Kamera</h1>
        <p>Die Adresse ist: ${address}${
  listenPort === 80 ? '' : `:${listenPort}`
}</p>
        <label for="upload">Bild auswählen</label>
        <input id="upload" type="file" name="datei" accept="image/*" />
        <button type="submit">Hochladen</button>
      </form>
${pageFooter}
`
```

```javascript
// in server/index.js

const homepageOpts = {
  address: serverIp,
  listenPort: port,
}

app.get('/', (req, res) => {
  res.send(homepage(homepageOpts))
})
```

### Schritt 5: Und noch besser

IP-Adressen sind trotzdem ganz schön nervig einzutippen, erst recht auf einem Smartphone. Also machen wir noch eine Verbesserung: Einen QR-Code!

    $ yarn add qrcode

Wir erzeugen jetzt beim App-Start einmalig aus der IP-Adresse und dem Port einen URL, den wir als QR-Code in Form eines Image-Data-URI encodieren. Das spart uns das abspeichern, auslesen und aufräumen einer richtigen Bild-Datei. Der Data-URI wird bei App-Start erzeugt und im RAM gehalten bis der Prozess beendet wird. Und wir können ihn einfach bei jedem Request an die Template-Funktion weiterreichen, von der er direkt in das HTML injiziert wird. Sollte aus irgendeinem Grund das Erzeugen fehlschlagen, ist uns das egal, denn die IP wird als Fallback auch noch angezeigt.

```javascript
// in server/index.js
const qrcode = require('qrcode')

app.get('/', (req, res) => {
  homepageOpts.qr = app.locals.qr
  res.send(homepage(homepageOpts))
})

if (serverIp) {
  try {
    fs.mkdirSync(uploadDir)
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
  }
  const location = `${serverIp}${port === '80' ? '' : `:${port}`}`
  qrcode.toDataURI(`http://${location}`, { scale: 8 }, (error, uri) => {
    app.locals.qr = uri
    app.listen(port, serverIp, err => {
      if (err) throw err
      // eslint-disable-next-line no-console
      console.log(`
  Listening on ${serverIp}:${port}
  Using directory "${uploadDir}" for uploads
      `)
    })
  })
} else {
  throw Error('No public v4 IP found!')
}
```

```javascript
// in server/templates.js
const homepage = ({ address, listenPort, qr }) => `${pageHeader}
        <form action="/upload" method="post" enctype="multipart/form-data">
          <h1>Du und die Kamera</h1>
          <p>Die Adresse ist: ${address}${
  listenPort === 80 ? '' : `:${listenPort}`
}</p>
          ${qr ? `<p><img src="${qr}" /></p>` : ''}
          <label for="upload">Bild auswählen</label>
          <input id="upload" type="file" name="datei" accept="image/*" />
          <button type="submit">Hochladen</button>
        </form>
  ${pageFooter}
  `
```

So, jetzt sind wir aber wirklich fertig. Übrigens ganz ohne Client-Side-Javascript. Wir brauchten gerade mal zwei Dependencies: `express` und `multiparty`. Eine dritte, `qrcode`, um den Bequemlichkeitsfaktor noch zu erhöhen. Das ganze läuft unter Node.js 6.9.5, ohne Babel, ohne Webpack, ohne React, sogar ganz ohne externe Templating-Engine.

Was noch schön wäre, weil wir ja das File-Input-Element kaputtgemacht haben, mit ein bisschen Browser-Javascript das zum Upload ausgewählte Bild anzuzeigen. Entweder als schnöden Dateinamen oder sogar als Thumbnail. Ideen dazu gibt es [hier](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications).

Außerdem wollen wir eher ungern die Kursleiterin dazu zwingen, sich Node.js zu installieren, `npm install` zu machen und so weiter. Daher bietet sich ein Packager wie `pkg` von zeit an.
