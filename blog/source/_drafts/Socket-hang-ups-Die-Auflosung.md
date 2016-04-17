title: 'Socket hang ups: Die Auflösung'
date: 2016-04-17 21:44:34
tags:
  - javascript
  - node.js
  - linux
  - performance
  - axios
---

Vor ein paar Tagen habe ich von einem [Problem mit unerklärlichen Socket hang ups](/blog/2016/04/node-js-performance-socket-hangup/) in unserer Node.JS-Anwendung geschrieben. Wir haben die Ursache endlich gefunden.

Nach vielem Probieren und Drehen an den verschiedensten Parametern änderte sich immer noch nichts. Schließlich habe ich mit einem anderen Team gesprochen, dass ich vermute, dass das Problem nicht in unserer App liegt, sondern möglicherweise bei den Services, die wir anfragen. Inbesondere bei einem, der Daten über aktuelle A/B-Tests bereitstellt, und bei dem der Großteil der socket hang ups entsteht.

Wenn es an dem Service liegt, dann müssten andere Teams, deren Apps dieselben Services nutzen, ebenfalls Fehler sehen. Da sie das anscheinend nicht tun, habe ich gefragt, wie ihre Calls ablaufen, und ob sie Fehler dieser Calls loggen. 
