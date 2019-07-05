title: Resize LVM on LUKS partition without messing everything up
tags:
  - Linux
  - LVM
  - Encryption
date: 2019-06-10 13:49:27
---


Since forever I run my work computer operating systems on a full-disk-encrypted partition. Currently this is Manjaro Linux. When I set up my current machine I made the following partition scheme:

```
sda                  238,5G  disk
├─sda1                 260M  part  /boot/efi
├─sda2                 128M  part  /boot
└─sda3                 237G  part
  └─tank               237G  crypt
```

Somewhere, I can't even remember when, I read that 128M for `/boot` would be sufficient. And it was for a few years. But kernel images and/or initram disks grew bigger and bigger until I could not upgrade to a newer kernel anymore. The last kernel I ran was Linux 4.16 and the files in `/boot` took around 75M space and so `mhwd-kernel -i linux417` had too little space on the device left.

What I needed to do was to shrink `/dev/sda3`, move it to the end of the SSD and grow `/dev/sda2` as necessary.

But I did not know if this was even possible with my setup. Inside the encrypted partition there is an LVM container with 5 logical volumes including `/`. I pushed it into the future again and again because most of the time I am working in running projects and can not afford to have a non-functioning machine for \<absurd amount of time that you never expect before a hardware near change\>.

But in the end it was relatively easy. I had feared that in the worst case I would have to re-setup my whole machine and restore backups for the data and system partitions. Which then maybe would need endless tweaking until it runs again (No, I never had a hard disk failure or similar, so I never had to actually do anything like that).

So, here are the things I needed to do:

## 1. Backup
List all logcal volumes:
```
# lvs
LV     VG   Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
docker tank -wi-ao----   5,00g                                        
home   tank -wi-ao---- 100,00g                                        
mongo  tank -wi-ao----   1,00g                                        
root   tank -wi-ao----  25,00g                                        
swap   tank -wc-ao----  32,00g
```
For each lv do the following:
```
# lvcreate -s -n <name>snap /dev/tank/<name>
# dd if=/dev/tank/<name>snap of=/path/to/external/storage/<name>.img
```
Where `<name>` must be replaced by the actual names of the lvs. Then I backed up both the `/boot` and the `/boot/efi` partitions, also with `dd`.
Finally I made a backup of the LUKS header for the crypto-partition:
```
# cryptsetup luksHeaderBackup /dev/sda3 --header-backup-file /path/to/external/storage/luks-header.bkp
```

## 2. Boot in a live system from an USB stick and decrypt the device

```
# cryptsetup open /dev/sda3 tank --type luks 
```

## 3. Resize the physical volume
__Note:__ I have free space inside my LVM container. As you can see from the output of `lvs` above I currently use only 143GB out of roughly 238GB. That means I do not have to resize logical volumes _before_ I resize the containing physical volume. If you use all of the available space for logical volumes, look into [`lvresize(8)`](https://jlk.fjfi.cvut.cz/arch/manpages/man/lvresize.8) first: For example in the  [Arch Wiki](https://wiki.archlinux.org/index.php/LVM#Resizing_volumes).

I generously shrank the volume from 238,07G to 236G with:
```
# pvresize --setphysicalvolumesize 236G /dev/mapper/tank
```

## 4. Resize the crypto-device
Find out how many sectors is the current size (note that my crypto-device has the same name like my volume group: `tank`. That could be different in your setup):
```
# cryptsetup status tank
...
sector size:  512
size:  499122176
...
```
In the end I want to add about 1G to the `/boot` partition. That is `1024 * 1024 * 1024 / 512 = 2097152` sectors.
```
# cryptsetup -b 497025024 resize tank
```

## 5. Resize the GUID partition
You see we go from innermost to outermost: LVM -> crypto -> GUID. I use `parted` to resize the partition `/dev/sda3`:
```
# parted
(parted) unit s
(parted) print
...
Number  Begin     End         Size                     Name  Flags
...
3      3100672s  500115455s  497014784s               TANK  lvm
```
These numbers were actually different as I write this blog post in hindsight. The point is that partition number 3 went all the way to the last sector of the disk and I now must calculate where it should end in the future. Because `resizepart` takes not the future size but the future end sector of the partition as argument. So I subtract the same sector count as calculated above for cryptsetup (`2097152`) from the _end sector_ of partition 3 (`500115455`) which gives `498018303`.
```

(parted) resizepart 3 498018303s
```
Now we have free space on the SSD _after_ the main partition. But I want to grow partition 2.

## 6. Reorder partitions and resize partition 2
I did that with GParted instead of a command line tool. Probably there is a way to do it with `gdisk` but `parted` has removed its command to `move` partitions. And because I was in a graphical live system anyway and also read that you could do it with GParted I just went for it.
First I closed the crypto device because GParted would not let me move the partition otherwise:
```
# vgchange -an tank
# cryptsetup close tank
```
Then I opened GParted and right-clicked on the crypto partition. I chose "Change size|Move" and moved the free space after the partition before it. Then I opend the same dialog for the `/boot` partition and extended it to cover all of the free space. Finally I committed the changes.
