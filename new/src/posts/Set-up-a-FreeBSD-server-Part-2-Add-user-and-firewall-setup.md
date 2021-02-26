---
title: 'Set up a FreeBSD server - Part 2: Add user and firewall setup'
tags:
  - FreeBSD
  - Server
  - Tutorial
  - Firewall
date: '2018-06-21 18:14:14'
---


[Last time](/blog/2018/06/Set-up-a-FreeBSD-server-on-DigitalOcean-with-jails-Part-1/) I stopped when my new droplet was initialized. Next, I will do some initial setup work like adding a user, properly configuring SSH access and adding a firewall.

I added my SSH public key to the droplet when I created it, so I can now login by typing:

{% code %}
~ $ ssh -l root <droplet-ip>
{% endcode %}

and then providing my passphrase.

### User setup

First, I will update existing packages. (Sidenote: Since the DO-droplets are not the most heavy-lifting machines, at least in my version, I will install everything as precompiled packages instead of using ports.)

{% code %}
root@pioneer-3:~ # pkg upgrade
Updating FreeBSD repository catalogue...
Fetching meta.txz: 100%    944 B   0.9kB/s    00:01
Fetching packagesite.txz: 100%    6 MiB   6.4MB/s    00:01
Processing entries: 100%
FreeBSD repository update completed. 31140 packages processed.
All repositories are up to date.
New version of pkg detected; it needs to be installed first.
The following 1 package(s) will be affected (of 0 checked):

Installed packages to be UPGRADED:
        pkg: 1.10.1 -> 1.10.5

Number of packages to be upgraded: 1

3 MiB to be downloaded.

Proceed with this action? [y/N]: y
[1/1] Fetching pkg-1.10.5.txz: 100%    3 MiB   3.0MB/s    00:01
Checking integrity... done (0 conflicting)
[1/1] Upgrading pkg from 1.10.1 to 1.10.5...
Extracting pkg-1.10.5: 100%
Updating FreeBSD repository catalogue...
FreeBSD repository is up to date.
All repositories are up to date.
Checking for upgrades (42 candidates): 100%
Processing candidates (42 candidates): 100%
The following 47 package(s) will be affected (of 0 checked):

New packages to be INSTALLED:
        py27-asn1crypto: 0.22.0
        oniguruma: 6.8.1
        e2fsprogs-libuuid: 1.44.2
        e2fsprogs-libblkid: 1.44.2
        e2fsprogs-libss: 1.44.2

Installed packages to be UPGRADED:
        sudo: 1.8.20p2_2 -> 1.8.22
        rsync: 3.1.2_7 -> 3.1.3
        readline: 7.0.3 -> 7.0.3_1
        python27: 2.7.13_6 -> 2.7.15
        py27-yaml: 3.11_2 -> 3.12
        py27-urllib3: 1.21.1 -> 1.22
        py27-six: 1.10.0 -> 1.11.0
        py27-setuptools: 36.0.1 -> 39.0.1
        py27-serial: 3.2.1 -> 3.4
        py27-requests: 2.18.1 -> 2.18.4
        py27-pytz: 2016.10,1 -> 2018.3,1
        py27-pysocks: 1.6.7 -> 1.6.8
        py27-pycparser: 2.10 -> 2.18
        py27-pyasn1: 0.2.2 -> 0.4.2
        py27-openssl: 16.2.0 -> 17.5.0_1
        py27-jsonpointer: 1.9 -> 1.9_1
        py27-jsonpatch: 1.9 -> 1.21
        py27-ipaddress: 1.0.18 -> 1.0.19
        py27-idna: 2.5 -> 2.6
        py27-cryptography: 1.7.2 -> 2.1.4
        py27-cloud-init: 0.7.6 -> 0.7.6_1
        py27-chardet: 3.0.3 -> 3.0.4
        py27-cffi: 1.7.0 -> 1.11.2
        py27-certifi: 2017.4.17 -> 2018.1.18
        py27-boto: 2.47.0 -> 2.48.0
        py27-Jinja2: 2.9.5 -> 2.10
        py27-Babel: 2.3.4 -> 2.5.1
        libnghttp2: 1.23.1 -> 1.31.1
        libiconv: 1.14_10 -> 1.14_11
        libffi: 3.2.1 -> 3.2.1_2
        jq: 1.5 -> 1.5_3
        indexinfo: 0.2.6 -> 0.3.1
        e2fsprogs: 1.43.4 -> 1.44.2
        curl: 7.54.1 -> 7.60.0
        ca_root_nss: 3.31 -> 3.37.3

Installed packages to be REINSTALLED:
        py27-prettytable-0.7.2_2 (direct dependency changed: py27-setuptools)
        py27-oauth-1.0.1_2 (direct dependency changed: py27-setuptools)
        py27-markdown-2.6.8 (direct dependency changed: py27-setuptools)
        py27-enum34-1.1.6 (direct dependency changed: py27-setuptools)
        py27-configobj-5.0.6_1 (direct dependency changed: py27-six)
        py27-cheetah-2.4.4_1 (direct dependency changed: py27-setuptools)
        py27-MarkupSafe-1.0 (direct dependency changed: py27-setuptools)

Number of packages to be installed: 5
Number of packages to be upgraded: 35
Number of packages to be reinstalled: 7

The process will require 2 MiB more space.
24 MiB to be downloaded.

Proceed with this action? [y/N]:y
.
.
.
root@pioneer-3:~ #
{% endcode %}

Now I can add my non-privileged user (aptly named "tobi"):

{% code %}
root@pioneer-3:~ # adduser
Username: tobi
Full name: Tobias Barth
Uid (Leave empty for default):
Login group [tobi]:
Login group is tobi. Invite tobi into other groups? []: wheel
Login class [default]:
Shell (sh csh tcsh nologin) [sh]:
Home directory [/home/tobi]:
Home directory permissions (Leave empty for default):
Use password-based authentication? [yes]:
Use an empty password? (yes/no) [no]:
Use a random password? (yes/no) [no]:
Enter password:
Enter password again:
Lock out the account after creation? [no]:
Username   : tobi
Password   : *****
Full Name  : Tobias Barth
Uid        : 1002
Class      :
Groups     : tobi wheel
Home       : /home/tobi
Home Mode  :
Shell      : /bin/sh
Locked     : no
OK? (yes/no): yes
adduser: INFO: Successfully added (tobi) to the user database.
Add another user? (yes/no): no
Goodbye!
{% endcode %}

Notably, I added my new user to the group "wheel" to enable the use of "sudo" for this user. To make that work, I have to edit the file `/usr/local/etc/sudoers`. This is not done directly, but with help from the command `visudo`:

{% code %}
root@pioneer-3:~ # visudo
{% endcode %}

Now, uncomment the line

{% code %}
%wheel ALL=(ALL) ALL
{% endcode %}

### SSH-Configuration

At this point, I can login per SSH as the user "tobi" with my password. That is a step in the right direction (I want to disable root logins), but not ideal. Authentication with public/private key pairs is more secure than using a password. So I will configure that. My public key is already on the server, but within the home directory of root. I can just copy it over to my home folder:

{% code %}
root@pioneer-3:~ # su tobi
[tobi@pioneer-3 ~]$ cd
[tobi@pioneer-3 ~]$ mkdir .ssh
[tobi@pioneer-3 ~]$ chmod 700 .ssh
[tobi@pioneer-3 ~]$ sudo cp /root/authorized_keys .ssh
[tobi@pioneer-3 ~]$ sudo chown tobi:tobi .ssh/authorized_keys
{% endcode %}

I can now login with my SSH-Key and a passphrase as the unprivileged user "tobi". Next, I edit the SSH config in `/etc/ssh/sshd_config`

I change it so that it contains the following lines and values:

{% code %}
PasswordAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
{% endcode %}

With this root is excluded from remote and users can only authenticate with a key.

I have sneaked in a different shell prompt and not only that – it's an entire different shell: ZSH. I installed it with `pkg install zsh` and then made it the default shell for both, the root user and the user "tobi". Changing the shell is as easy as:

{% code %}
chsh -s zsh
{% endcode %}

while "being" the user I want to change. Alternatively, I can append the username to the command. Additionally I provided an absolute basic `.zshrc` configuration file for both users:

{% code %}
# Lines configured by zsh-newuser-install
setopt appendhistory autocd extendedglob nomatch notify
unsetopt beep
# End of lines configured by zsh-newuser-install
autoload -Uz promptinit compinit
compinit
promptinit
prompt redhat

alias l="ls -al"
{% endcode %}

### Conclusion

This post is already long enough and firewall configuration is a complete new topic. So I will end just here and continue in part 3 of this series.
