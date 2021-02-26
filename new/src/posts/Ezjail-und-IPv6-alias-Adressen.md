---
title: Ezjail und IPv6 alias Adressen
tags:
  - freebsd
  - server
  - jails
  - ipv6
categories:
  - Server-Administration
date: '2017-07-01 11:39:12'
---

Ich habe vor Kurzem begonnen Jails in FreeBSD zu nutzen und auszuprobieren. Mein Digitalocean-Droplet läuft unter FreeBSD 11 und DO gibt mir eine public v4 IP-Adresse und ein `/124` v6 Präfix. Für meinen privaten Kram interessiert mich IPv4 nicht, daher habe ich 16 öffentliche IPs, mit denen ich spielen kann.

Das heißt, ich brauche kein NAT sondern kann den Jails direkt public IPs zuweisen, die ich als Aliases auf das Interface lege.

Bisher habe ich mit `ezjail` zwei Jails eingrichtet: `git` und `backup`. DO weißt dem Interface automatisch die v6-IP mit der Endziffer `1` zu. In meiner `rc.conf` steht entsprechend für die beiden Jail-IPs:

{% code %}
ifconfig_vtnet0_alias1="inet6 xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxx2 prefixlen 64"
ifconfig_vtnet0_alias2="inet6 xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxx3 prefixlen 64"
cloned_interfaces="lo1"
ezjail_enable="YES"
{% endcode %}

Heute musste ich das Droplet powercyclen und beim Boot kam nur der `git`-Jail hoch. Ich probierte, den zweiten selbst zu starten:

	# ezjail-admin start backup

Das gab diesen Fehler aus:

	ifconfig: ioctl (SIOCAIFADDR): Invalid argument)

Erst wusste ich damit nichts anzufangen. Dann fiel mir auf, dass in der Zeile davor der Befehl stand, der versucht wurde auszuführen:

	/usr/sbin/ifconfig vtnet0 inet6 <adresse>/128 alias

Hoppala. `ezjail` versuchte selbst einen Alias anzulegen, obwohl schon einer existiert. Tatsächlich habe ich dann nochmal selbst den `ifconfig` Befehl getestet, geht tatsächlich nicht.

Ist auch klar: Mit dieser IP war bereits ein Alias definiert _mit der Präfixlänge 64_. Hier wurde versucht ein Alias für dieselbe IP anzulegen, _aber mit der Präfixlänge 128_, was natürlich nicht geht.

Ein Blick in die `ezjail`-Config-files für die beiden Jails zeigt, dass ich bei dem `git`-Jail die IP so konfiguriert habe:

	export jail_git_ip="xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxx2"

Bei dem `backup`-Jail brauchte ich aber wegen eines Dienstes darin ein Loopback-Interface, das ich in der `rc.conf` oben als `lo1` angelegt habe. Also muss ich dem Jail zwei Interfaces mit IPs übergeben und das mache ich so:

	export jail_git_ip="lo1|127.0.0.3,vtnet0|xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxx3"

Offenbar führt die fehlende Präfixlängenangabe hier dazu, dass `ezjail` (oder `ifconfig`) sie auf 128 setzt. Also änderte ich die Zeile zu: 

	export jail_git_ip="lo1|127.0.0.3,vtnet0|xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxx3/64"

Und schon läuft es.

