---
title: nano-router connection
abstract: Connect to your product easily using a wireless router
---

This tutorial will allow you to connect a **TP-LINK TL-WR802N** router to your product. 

## Required hardware :


- TP Link nano-router
- ethernet (RJ45) cable
- micro-USB cable

Everything is included in the [nano-router](/en/store/router) package

## Installation

Plug in the router. Connect the ethernet and USB cables to your product

## Configuration

<div class="row">
  <div class="col-12 col-md-6">
    <code>For TL-WR802N routers</code>
    <p>
      Connect to the wifi network using the SSID and password printed on the back of the device
    </p>
    <p>
      Your computer will probably warn you of a <code>limited connectivity</code> connection.
    </p>
  </div>
  <div class="col-12 col-md-6">
    <img class="img-fluid" src="/static/img/documentation/how-to/router_back.jpg" alt="back of a TP-Link router">
  </div>
</div>

<div class="row">
  <div class="col-12 col-md-6">
    <p>
      Open a web browser and navigate to <a href="http://tplinkwifi.net">http://tplinkwifi.net</a> or <a href="http://192.168.0.1">http://192.168.0.1</a>
    </p>
    <p>
      Type in defaults credentials :
      <pre><code>
      Username : admin
      Password : admin
      </code></pre>
    </p>
  </div>
  <div class="col-12 col-md-6">
    <img class="img-fluid" src="/static/img/documentation/how-to/tp-link_1.jpg" alt="a oruter's administration interface">
  </div>
</div>

In the **Operation Mode** tab, select **Access Point**, then **Save**. Confirm the reboot and reconnect if necessary.


## Usage

Once plugged, your product is readily accessible.

### MacOS

access your product using it's dns-sd local hostname :

```
http://irisxx-XX.local
```

replace `irisxx-XX` with your product name and serial number (ie. an Iris 32" numbered 40 will be named `iris32-40`).

### Other OS

You can fetch the direct-access IP of your product using one of the following methods :

In the router's administration interface (http://tplinkwifi.net or http://192.168.0.1). Go to **DHCP > DHCP Clients List** and find your product.
- 
Si on a besoin de son IP, 2 solutions :
<center>
    <img class="img-fluid" src="/static/img/documentation/how-to/tp-link_2.jpg" alt="a router's admin UI"/>
</center>

Use a network scanner, like `nmap`or `avahi-browse` (linux)
