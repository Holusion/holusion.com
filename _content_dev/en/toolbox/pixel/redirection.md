---
title: Redirect your Pixel
image: img/posts/dns_redirect/header.jpg

abstract: Use your own domain name to distribute your pixel videos.
rank: 2
menu: toolbox
---

## Introduction

It's easy -and free- to make your own domain provide direct access to your videos. In this example we will make users visiting `pixel.example-domain.com` be redirected internally to holusion's videos normally found in https://pixel.holusion.com/example/view

You can set this up for your own account by replacing *example* and *example-domain* with your account name and domain name.

<div class="row">
  <div class="col-md-3 offset-md-3 col-sm-6">
    <img class="img-fluid" src="/static/img/posts/dns_redirect/redirect_holusion.png" alt="Original content URL">
    <p align="center">Without redirect</p>
  </div>
  <div class="col-md-3 col-sm-6">
    <img class="img-fluid" src="/static/img/posts/dns_redirect/redirect_example.png" alt="Redirected URL">
    <p align="center">With Redirect</p>
  </div>
</div>

### Setting up your CNAME

Personnal playlist "view" for any account can be accessible at :

`your-name.pixel.holusion.com`

We will make your CNAME internally point to this address. Head to your DNS provider's configuration Zone to make the following changes. Screenshots are taken from OVH's interface, but any Host should have similar features.

#### Configuring the DNS

*If you don't have access to your domain's configuration, please contact your network admin*


**Warning :** Modifying any used domain name can make your website inaccessible. Ask for advice if unsure.

<div class="row">  
  <div class="col-md-6">
    <img class="img-fluid" alt="dns zone add entry" src="/static/img/posts/dns_redirect/dns_zone.png">
  </div>
  <div class="col-md-6">
    <p>You need to set up a <b>CNAME</b> invisible redirect from your domain to <code>example.pixel.holusion.com</code> (replace "example" with your account name).
    </p>
    <p>in your DNS admin page, click "Add an entry".</p>
  </div>
</div>

<div class="row">  
  <div class="col-md-6">
    <p>The <b>CNAME</b> must point from your chosen domain to <code>example.pixel.holusion.com.</code></p>
    <p><b>Attention : </b>It must have a trailing  "<code>.</code>", or it will point relatively to the domain (<code>example.pixel.holusion.com.example.com</code>)</p>
    <p> The textual representation of this entry is :</p>
    <code>pixel IN CNAME example.pixel.holusion.com.</code>

    <p>"pixel" here is the chosen subdomain of example.com we want to use.</p>
    <p>DNS entries can have up to 24 hours of propagation time. You can verify the redirection with a DNS explorer like <a  href="https://en.wikipedia.org/wiki/Dig_(command)">dig</a>.</p>
  </div>
  <div class="col-md-6">
    <img class="img-fluid" alt="dns zone edit CNAME" src="/static/img/posts/dns_redirect/dns_create.png">
  </div>
</div>

<p>Example :</p>
{% highlight shell%}
$ dig pixel.example.com
{% endhighlight %}
{% highlight shell%}
;; ANSWER SECTION:
pixel.example.com. 3600 IN	CNAME	example.pixel.holusion.com.
pixel.holusion.com.	86400	IN	A	40.68.84.46
{% endhighlight %}
