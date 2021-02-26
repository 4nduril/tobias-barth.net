---
title: Vererbung von viewport-percentage lengths in Chrome
tags:
  - Chrome
  - Chrome-Bugs
  - Bugs
  - viewport-relative-lengths
categories:
  - Web-Stuff
description: Ich stolperte neulich über ein Problem mit viewport-relativen Längen in CSS.

date: '2013-06-05 16:59:00'
---

Ich stolperte neulich über ein Problem mit [viewport-relativen Längen](http://www.w3.org/TR/css3-values/#viewport-relative-lengths) in CSS. Die Situation war konkret folgende:

Ich hatte eine ungeordnete Liste, deren Elemente je ein `<div>` enthielten, in dem sich wiederum ein `<a>` befand:

{% code lang:html %}
<ul>
  <li>
    <div><a href="#">Test</a></div>
  </li>
</ul>
{% endcode %}

Zuerst ein Beispiel, wie es funktionieren sollte. Die `<li>`-Elemente sollen eine definierte Höhe haben und die `<div>`s sollten genauso hoch sein. Das CSS dazu:

{% code lang:css %}
* { margin:0; padding:0; }
ul { list-style-type:none; }
li {
  background:blue;
  height:10em; 
}
div {
  background:red;
  height:100%; /* Genau so hoch wie sein Container */
}
{% endcode %}

[Hier ist ein JS-Fiddle dazu](http://jsfiddle.net/PgTZ2/2/). Wie erwartet bedeckt das rote `<div>` das gesamte Listenelement. Ruhig auch mal in verschiedenen Browsern ansehen.

Jetzt geben wir dem `<li>`-Element aber eine vom Viewport abhängige Größe:

{% code lang:css %}
li {
  height:30vw; /* Die Höhe soll 30 Prozent der Breite des Viewports betragen */
}
{% endcode %}

[Hier die geänderte Demo](http://jsfiddle.net/PgTZ2/3/).

Im Firefox sieht es immer noch genau so aus wie vorher. Das würde man (ich) auch erwarten. Schließlich hat das Listenelement eine definierte Größe und ich sage, dass sein direktes Kindelement 100% dieser Größe haben soll. Sieht man sich das Ergebnis in Chrome an, zeigt sich aber ein anderes Bild.

Das `<li>` hat zwar die richtige Größe, aber das `<div>` ist nur so hoch, wie es sein Inhalt (eine Textzeile) erfordert. Sogar im IE9 wird es korrekt (wie im FF) dargestellt. Opera unterstützt derzeit keine viewport-related lengths, aber da auch dort [demnächst ein Webkit rendert](http://business.opera.com/press/releases/general/opera-gears-up-at-300-million-users), wird es sich wohl auch nur mittelmäßig zum Guten ändern.

Anscheinend muss man derzeit also entweder für Chrome in solchen Fällen auch jedem Kindelement die `v*`-Größe zuweisen, oder mit anderen Längeneinheiten arbeiten. Schade.
