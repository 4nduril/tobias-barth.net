---
title: jQuerys scrollTop() und border-box
tags:
  - jQuery
  - scrollTop
categories:
  - Web-Stuff
description: Der Fehler, den der Kunde berichtete, beruhte darauf, dass das ursprünglich verwendete `$(document).scrollTop()` nicht im IE8 funktionierte und nachdem er dies durch das funktionierende `$('html').scrollTop()` ersetzt hatte, lief es nicht mehr in Webkit-Browsern.
lang: de
date: '2013-01-28 22:01:00'
---

**Das Folgende betrifft soweit ich sehe nur jQuery &lt; 1.8.**

Letzte Woche habe ich den ersten Kandidaten für den irrsten Bug in diesem Jahr gefunden.

Der Fehler, den der Kunde berichtete, beruhte darauf, dass das ursprünglich verwendete `$(document).scrollTop()` nicht im IE8 funktionierte und nachdem er dies durch das funktionierende `$('html').scrollTop()` ersetzt hatte, lief es nicht mehr in Webkit-Browsern.

Die Lösung dafür war relativ schnell gefunden: Ich ersetzte einfach in dem betreffenden Script den einen `scrollTop()`-Aufruf durch den Ausdruck `($(document).scrollTop() || $('html').scrollTop())`. Damit war der Drops gelutscht und jeder Browser konnte sich aussuchen, was ihm passte (bzw. was nicht gleich 0 war, da der Code nur beim Scrollen zur Anwendung kam, reichte das aus).

Aber was war die Ursache? Nach viel Ausprobieren blieb mir nichts übrig als in die jQuery-Source zu schauen und mir anzusehen, wie jQuery.scrollTop() definiert ist. Für das verwendete jQuery 1.6.4 sieht das so aus:

```javascript
// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
  var method = "scroll" + name;

  jQuery.fn[ method ] = function( val ) {
    var elem, win;

    if ( val === undefined ) {
      elem = this[ 0 ];

      if ( !elem ) {
        return null;
      }

      win = getWindow( elem );

      // Return the scroll offset
      return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
      jQuery.support.boxModel &amp;&amp; win.document.documentElement[ method ] ||
      win.document.body[ method ] :
      elem[ method ];
    }

    // Set the scroll offset

    // Interessiert uns hier nicht
  };
});
```

Der Fall des IE8 sollte mit der Zeile abgedeckt werden, die mit `jQuery.support.boxModel` beginnt. Diese Eigenschaft dient eigentlich dazu, zu überprüfen, ob das W3C-Box-Modell vom Browser unterstützt wird. Das Problem ist, in diesem Fall gibt sie `false` zurück, obwohl das Dokument in Ordnung ist und der Browser sich im Standardmodus befindet. Warum? Also nachsehen, wie `jQuery.support.boxModel` gesetzt wird:

```javascript
// Figure out if the W3C box model works as expected
div.style.width = div.style.paddingLeft = "1px";
support.boxModel = div.offsetWidth === 2;
```

Es wird ein Test-Div erzeugt, dem verschiedene Eigenschaften zugewiesen und das dann an den `body` angehängt wird. Da das Element hier einen Pixel breit ist und außerdem ein Padding von einem Pixel erhält, sollte `offsetWidth`, das die Gesamtbreite enthält, 2px zurückgeben.

Tut es aber nicht.

Der Grund dafür ist, dass ich im CSS `box-sizing: border-box;` gesetzt habe. Das ist eigentlich eine prima Sache, denn dadurch sind Elemente, denen man eine bestimmte Breite zuweist, auch wirklich so breit &ndash; egal ob sie Innenabstände oder Rahmen enthalten. Aber in diesem Fall passiert dann folgendes: Wir geben einem Element den linken Innenabstand 1px und sagen dann, dass das gesamte Element, mit Innenabständen und Rahmen, 1px breit sein soll. Das bedeutet, für den eigentlichen Inhalt ist kein Platz mehr, was egal ist, weil das Element sowieso keinen Inhalt hat und nur zum Testen da ist. Aber das bedeutet auch, dass `offsetWidth` nun auch 1 enthält, das ist schließlich die Gesamtbreite des Elements. Damit schlägt der Test `div.offsetWidth === 2` natürlich fehl, und `scrollTop()` gibt nicht mehr `window.document.documentElement.scrollTop` zurück, sondern 0.

Darauf muss man erstmal kommen

Ab jQuery 1.8 besteht das Problem nicht mehr, weil dann nicht mehr auf Box-Model-Support getestet wird bzw. dieser Test nicht mehr in `scrollTop()` abgerufen wird.

Warum Webkit übrigens `$('html').scrollTop()` nicht versteht, ist mir noch nicht so ganz klar.
