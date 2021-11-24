---
title: Set up a FreeBSD server on DigitalOcean with jails – Part 1
tags:
  - FreeBSD
  - Server
  - Tutorial
description: I have a few Droplets running on DigitalOcean (DO) for small puposes like Dropbox-replacement, private Git repositories and so on. Now I want to move my website and so, my webserver from another hoster to DO.
date: '2018-06-13 16:01:56'
---

I have a few Droplets running on DigitalOcean (DO) for small puposes like Dropbox-replacement, private Git repositories and so on. Now I want to move my website and so, my webserver from another hoster to DO. Also, in the (middle) long run, I want to set up my own mail server which will handle all email for my domain. Besides that I am thinking of running my own DNS server—maybe just a resolver for my own computers or even a real server which handles request to my domain.

So, much to do. I will use this enterprise to learn and document for myself primarily. If it is of any help to others, even better.

Let's start. I go to my DO account and add a new Droplet. After logging in I click on "Create" and choose "Droplets". I am prompted to choose an image. I will have FreeBSD, version "11.1 x64 ZFS". Next is choosing a size. I go with the smallest (and cheapest) size because I can resize it later if I need to. So "1GB RAM, 1 vCPU, 25GB disk, 1TB transfer" it is. I skip backups and block storage for now and change the datacenter location to Frankfurt, Germany because that's nearest to where I live. Under "Select additional options" I select IPv6. Don't ask. Do. Finally I need to choose an SSH-Key to preload the Droplet with. Here I can just select my previously generated (on my own computer!) and uploaded public key. If you don't have one, generate it on your machine (see "man ssh-keygen") and upload it via the "New SSH key" button.

The very last thing to do is to enter a name. I'll go with pioneer-3 for now. Hit create.

After a few seconds the Droplet is ready. In my dashboard I switch it off for now.
