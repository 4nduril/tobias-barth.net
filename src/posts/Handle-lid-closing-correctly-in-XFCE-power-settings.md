---
title: Handle lid closing correctly in XFCE power settings
tags:
  - linux
  - power-management
  - xfce
  - suspend-hibernate
description: I always had problems with the power management settings on my laptop. It's running Manjaro Linux (Arch derivate). Regardless of what I set in the XFCE power settings, the actions that should happen on lid closing didn't work as expected.
date: '2019-05-21 15:55:25'
---


This is mainly just a note for my future self. I always had problems with the power management settings on my laptop. It's running Manjaro Linux (Arch derivate). Regardless of what I set in the XFCE power settings, the actions that should happen on lid closing didn't work as expected. I wanted that the machine does a suspend-to-RAM when I close the lid and the power cable is plugged in. And when it is not plugged in I wanted the machine to suspend-to-disk (hibernate). 

On some point I just disabled everything in `/etc/systemd/logind.conf` (set it to ignore lid actions) and lived with the fact.

Today on Googling™ I came across two things: First a mention of the file `~/.config/xfce4/xconf/xfce-perchannel-xml/xfce4-power-manager.xml`. There, all the settings you can set in the graphical power settings tool are saved as XML. Second: A forum post (https://bbs.archlinux.org/viewtopic.php?pid=1690134#p1690134) that points to the fact that in this XML file there is a setting you can't set graphical: "logind-handle-lid-switch". Which is set to `true` for reasons that are beyond me.

Probably you can do all sorts of things with `acpid` and/or systemd to control the actions on lid-close and lid-open. But you can also just issue:

```bash
xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/logind-handle-lid-switch -s false
```

on the shell and then your settings in XFCEs power settings are used by the system and work. Of course I also set the content in `logind.conf` back to default.
