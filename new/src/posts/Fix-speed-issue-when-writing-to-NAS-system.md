---
title: Fix speed issue when writing to NAS system
tags:
  - freebsd
  - nas
  - network
date: '2019-05-03 11:36:54'
---


I just fixed an issue with my FreeBSD home server. It is set up as a file server for Mac (AFP) and Linux Clients (NFS). My local network is Gigabit-based sothe limitating factor on read/write speeds should be the hard disk drives in the server.

The server has a Core i3-6100T CPU @ 3.20GHz, 8GB RAM, a ZFS setup with two mirror vdevs each consisting of two disks connected to the board via SATA3. And of course the onboard Gbit NIC (Realtek).

I know very well that write speed was at around 50–60MB/sec, which I would expect. But lately, it dropped amazingly to ~1MB/sec. And I just couldn't think of, why. I suspected the cable, the AFP, the RAM anything.

What I didn't suspect — until today, that is — was the network interface. But I had time today for some googling and even if I didn't found the solution directly, I stumbled across something related to the output of `ifconfig`. So I hacked that into the console and stared at it.

```
re0: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> metric 0 mtu 1500
        options=8209b<RXCSUM,TXCSUM,VLAN_MTU,VLAN_HWTAGGING,VLAN_HWCSUM,WOL_MAGIC,LINKSTATE>
        ether 4c:cc:6a:b3:3c:f5
        hwaddr 4c:cc:6a:b3:3c:f5
        inet6 fd23:16:7:7::1 prefixlen 64
        inet6 fe80::4ecc:6aff:feb3:3cf5%re0 prefixlen 64 scopeid 0x1
        inet 192.168.10.118 netmask 0xffffff00 broadcast 192.168.10.255
        nd6 options=21<PERFORMNUD,AUTO_LINKLOCAL>
        media: Ethernet autoselect (10baseT/UTP <full-duplex>)
        status: active
```

Do you spot it? 

```
        media: Ethernet autoselect (10baseT/UTP <full-duplex>)
```

Well, that is … unfortunate. The output of `ifconfig -m re0` gave me:

```
	supported media:
			media autoselect mediaopt flowcontrol
			media autoselect
			media 1000baseT mediaopt full-duplex,flowcontrol,master
			media 1000baseT mediaopt full-duplex,flowcontrol
			media 1000baseT mediaopt full-duplex,master
			media 1000baseT mediaopt full-duplex
			media 100baseTX mediaopt full-duplex,flowcontrol
			media 100baseTX mediaopt full-duplex
			media 100baseTX
			media 10baseT/UTP mediaopt full-duplex,flowcontrol
			media 10baseT/UTP mediaopt full-duplex
			media 10baseT/UTP
			media none
```

So I ran `sudo ifconfig re0 media 1000baseTX mediaopt full-duplex` and it worked. After that I also ran `sudo ifconfig re0 media autoselect` which also set the media type to 1000baseT full-duplex. I have no idea why the system did that wrong (or when) but I will monitor what happens after the next reboot. Maybe I have to do some configuration but maybe it was just an hickup.

Speeds are up to 60MB/sec again.
