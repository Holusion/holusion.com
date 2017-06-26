---
title: playlist control
image: /static/img/posts/media-player/header2.png
abstract: Use the Holusion API to control your hologram
rank: 1
menu: toolbox
---
<div class="row">
  <div class="col-lg-6 col-md-12"><img class="img-responsive" src="/static/img/posts/media-player/header2.png"></div>
  <div class="col-lg-6 col-md-12">
  <p>Holusion is giving a free public API on each of its products. It permits to control the activation, desactivation, to add or delete medias, and to play the medias.
  </p><p>
  By default, this API can be used via the web interface that allows <a href="/en/packaging">transfere medias</a>, but it can also be used through external applications.
  </p>
  <p>
  Thanks to the API, we can create and use complex content managing methods. The following functions are available :
  </p>
  <ul>
  <li>Add / Delete a media</li>
  <li>Instantly play a media</li>
  <li>Recovery of the system's infos (name, version...)</li>
  <li> etc...</li>
  </ul>
  </div>
</div>


## Setup

Before starting anything, you must be connected to the product. They are configurated to emit a Wi-Fi network by default :

    SSID : <product>-<serial number>
    Clé  : holusionadmin

If you have a custom installation, the access method to the product have been given at the purchase. In this document, we will use for example the default IP `10.0.0.1` to access the product.

If the Wi-Fi doesn't work, is too slow, or if the product isn't equiped, you can connect it with an ethernet cable :

- On your [local network](/en/toolbox/packaging/net-discovery)
- Directly on your [work station](/en/toolbox/packaging/local-dhcp)

In the case of the demountable products (focus, iris...), make sure to connect at least one screen to the computer. The administration service doesn't start if there is no display.

## Discover

The API has a complete interactive guide at this adress : `http://10.0.0.1/doc`. The requests can be tested directly on the product.

The *routes* are grouped in 5 categories :
<center>
<img class="img-responsive" src="/static/img/posts/media-player/list.png" alt="routes groups">
</center>

To show how this interface is working, we will first use the routes of the group `playlist`. Click on the corresponding line to display the possible operations.

<center>
  <img class="img-responsive" src="/static/img/posts/media-player/playlist_routes.png" alt="routes groups">
</center>

We will use the first available route, wich permits to display the playlist's elements.

<div class="row">
  <div class="col-md-6 col-sm-12">
    <p>
    The detail of the `[GET] /playlist`.
    </p>
    <img class="img-responsive" src="/static/img/posts/media-player/route_details.png" alt="route details">
  </div>
  <div class="col-md-6 col-sm-12">
    <p>
    An example of answer by clicking on **Try it out!**
    </p>
    <img class="img-responsive" src="/static/img/posts/media-player/route_response.png" alt="route details">
  </div>
</div>

This request produces a **JSON** array that is listing the different available medias IDs.

We can use it in a very simple application. For example, with Python (example for Python v2.x):

    import requests
    requests.get("http://10.0.0.1/playlist").text

Returns the same text sequence than the example of the guide.

**Caution** : The presented requests really have an impact on the product. If you try `[DELETE] /medias/{name}`, the targeted media will be definitely deleted from your product.


## First application

In order to handle the API, we will develop our first Python application.

**Note** : All the modern environments are providing similar librairies to the close syntax .

We will use the `requests` librairy, that will permit to access the API.

    #!/usr/bin/env python
    import requests
    # we recover the available medias :
    medias = requests.get("http://10.0.0.1/playlist").json()
    print(medias[0].get("name"))


The general idea is that by using standard requests and by using the answers given by the guide, we can easily and quickly create a complete interface that permits to interact with the holograms.

## Go further

{% include_relative exemples.html %}
