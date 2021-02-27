---
title: Node.js Performance und socket hangup
tags:
  - javascript
  - node.js
  - linux
  - performance
description: Ungewöhnlich viele "socket hang up"-Meldungen. Nicht so viele, dass wir ernsthafte Schwierigkeiten hätten, die auch sichtbar wären, aber, und das ist besonders interessant, es sind wesentlich mehr als bei anderen Webapps, die Java-basiert sind und dieselben Services bei jedem Request anfragen.
lang: de
date: '2016-04-09 18:45:00'
---

In dem Team bei einer großen deutschen Internetfirma, in dem ich gerade arbeite, haben wir ein bisher eher unerklärliches Problem, das in unseren Logfiles aufschlägt.

Wir haben dort eine Express-basierte Webapp, die den Content im Grunde vollständig auf dem Server rendert. Dafür werden unter anderem diverse Microservices angesprochen, d.h. bei jedem Request an die Express-App fragt diese per AJAX mehrere interne, separate Dienste nach Daten und rendert basierend auf deren Antworten den Content, der an den Client gesendet wird.

Das funkioniert auch ziemlich gut, allerdings haben wir in den Logfiles unserer App ungewöhnlich viele "ERROR: socket hang up"-Meldungen. Nicht so viele, dass wir ernsthafte Schwierigkeiten hätten, die auch sichtbar wären, aber, und das ist besonders interessant, es sind wesentlich mehr als bei anderen Webapps, die Java-basiert sind und dieselben Services bei jedem Request anfragen.

Es scheint also primär nichts mit den internen Services zu tun zu haben, sondern mit unserer Node-App. Bisher haben wir nicht so wirklich eine Idee, was es sein könnte. Für die AJAX-calls nutzen wir [Axios](https://github.com/mzabriskie/axios) und definieren damit auch ein Timeout, das bei 60ms liegt. Das kann es allerdings nicht sein, denn dann sähen wir timeout-Errors und nicht Socket-hang-ups. 

Also habe ich mal das Internet danach durchforstet, was diese Socket-hangups bei Node erzeugen könnte. Dabei bin ich auf einen interessanten [Blogpost](http://www.murvinlai.com/remote-http-request.html) gestoßen. Dort wird beschrieben, dass solche Fehler zwar auch von der Remote-Seite kommen können, aber eben auch von den Limitierungen des Systems, auf dem der Node-Server läuft. Es gibt ein Limit für die Zahl der gleichzeitig offenen Files, wobei dieses Limit pro Login=User gilt. Der Standardwert ist 1024. Ein Socket ist wie alles auf unixoiden Systemen eine Datei. Ein User (in dem Fall der User, dem der Node-Prozess gehört), kann also maximal 1024 Dateien gleichzeitig öffnen.

Das wäre auf jeden Fall mal ein Ansatz. Der Verfasser des erwähnten Blogartikels empfiehlt ein Limit von 10240, also das Zehnfache. Außerdem sollte der maxSockets-Wert des http.Agents von Node auf eine Zahl knapp unter dem ulimit gesetzt werden. Nodes Standard für maxSockets ist (mittlerweile) `Infinity`, aber bei uns ist es derzeit auf 25 gesetzt. Ich muss noch mal nachforschen, was der Grund für dieses Limit war. 

Ohne dass ich weiß, wie unsere Java-Apps funktionieren oder konfiguriert sind, gefällt mir der Gedanke, dass unsere Node.js-App ankommende Anfragen so schnell verarbeitet und dementsprechend oft parallel die Services anspricht, dass es an Systemlimits stößt, die von den Java-Kreuzern nie tangiert werden.

Schauen wir mal.
