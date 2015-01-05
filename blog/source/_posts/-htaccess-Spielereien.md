title: .htaccess-Spielereien
tags:
  - htaccess
  - server-config
categories:
  - Web-Stuff
date: 2011-12-04 13:47:00
---

Mit .htaccess-Dateien kann man den Zugang zu den einzelnen Dateien oder Dokumenten auf seinem (Apache-)Webserver sehr bequem regeln. Es lassen sich zum Beispiel einzelne Verzeichnisse nur für Nutzer mit einer bestimmten IP freigeben. Oder man kann Passwörter für den Zugang vergeben. Vor ein paar Tagen habe ich herausgefunden, dass man mit ihnen auch wunderbar beliebige andere Servervariablen abfragen kann.

Mit dem Modul [mod_setenvif](https://httpd.apache.org/docs/2.2/mod/mod_setenvif.html) nämlich lassen sich mit Hilfe der zwei Direktiven _BrowserMatch_ und _SetEnvIf_ (und deren Varianten, denen Groß- und Kleinschreibung egal ist) Umgebungsvariablen abfragen und davon abhängig den Zugang zu Ressourcen regeln.

Ich habe das benutzt, um folgendes zu tun. Ein PHP-Dokument bindet mit `require` eine HTML-Datei ein und zwar abhängig vom Rückgabewert eines If-Statements:

{% code lang:php %}
    if (…) { require "eingebunden.html";}
{% endcode %}

Auch wenn ich den Namen der HTML-Datei so wähle, dass er schwer erraten werden kann, möchte ich sichergehen, dass niemand einfach die Adresse der Datei in den Browser eingeben und so ihren Inhalt anzeigen kann. Das geht jetzt ziemlich einfach, indem ich eine .htaccess-Datei in das Verzeichnis lege, in dem sich die fragliche HTML-Datei befindet und sie mit diesem Inhalt versehe:

{% code lang:apacheconf %}
    SetEnvIf Request_URI "eingebunden\.html$" verboten
    Deny from env=verboten
{% endcode %}

Mit der SetEnvIf-Direktive setze ich eine Variable namens &bdquo;verboten&ldquo; genau dann wenn der <abbr title="Uniform Resource Identifier">URI</abbr>-String, den der Browser als Request gesendet hat, mit dem regulären Ausdruck `"eingebunden\.html$"` übereinstimmt. Als nächstes sage ich dem Server, dass er Anfragen, für die er diese Variable erzeugt hat, ablehnen soll. Versucht man jetzt die HTML-Datei direkt im Browser aufzurufen, ist das einzige, was man sieht, ein 403.

[![Flattr this](http://kritikant.de/media/blogs/kritikant/flattr-badge-large.png "Flattr this")](http://flattr.com/thing/449791/-htaccess-Spielereien)
