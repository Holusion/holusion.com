---
title: "Contactless Control"
redirect_from: "/en/contr-le-sans-contact/"
image: /build/img/posts/banner_contactless.jpg
image2x: /build/img/posts/banner_contactless_2x.jpg
abstract: Empower your product with contactless technologies
rank: 2
menu: toolbox
---


## Introduction

Contactless technologies (NFC/RFID) are supported on our products by two means :

- Direct access via [pcsclite](https://pcsclite.alioth.debian.org/ccid.html).
- Managed via product administration.

This service allow you to control your product playlist with NFC tags.

Holusion advises the use of [ccid compliant readers](https://pcsclite.alioth.debian.org/ccid.html#readers)


## Contactless control

Product configuration to use contactless readers takes only a few seconds.

**Set Up :**

- Connect yourself to your product's administration interface
- Plug in your NFC reader through the back panel USB

**Usage :**

When placing a card in range from the reader, the admin interface will display it's unique ID ("Options" tab).

<center><img class="img-fluid" alt="holusion contactless tag recognition" src="/static/img/posts/contactless/card_id.gif"/></center>

Once copied this ID can be added to a media's configuration panel by clicking on it's <span class="glyphicon glyphicon-plus"></span> icon.

<center><img class="img-fluid" alt="holusion contactless tag recognition" src="/static/img/posts/contactless/remote_config.jpg"/></center>

**Note** : "nfc" must be written in lower case. Don't forget to click on <span class="glyphicon glyphicon-floppy-saved"></span> to save changes.

**How it works**

When a card is on the reader :
- medias assigned to its tag are enabled
- All other medias are disabled

When no card is detected :

- Videos having no associated tag are enabled
- Videos having a nfc tag are disabled

To stop NFC tracking, just delete the config line using the <span class="glyphicon glyphicon-minus"></span> icon on conf panel and save changes.
