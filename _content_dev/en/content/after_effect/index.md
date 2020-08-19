---
title: After Effect
image: img/posts/banner_after_effect.jpg

abstract: After Effect project to simplify the content making.
rank: 10
menu: content
---

<style>
.product-span{
  font-weight:bold;
}
</style>
<script src="/static/js/product_switcher.js"></script>

<div class="row">
<div class="col-md-6">
<div align="center" class="embed-responsive embed-responsive-16by9">
<video controls="" class="embed-responsive-item" height="270px" muted="" preload="auto" poster="/static/img/posts/after-effect/logo_large.jpg">
<source src="/static/video/after-effect.mp4" />
<img alt="" src="/static/img/posts/after-effect/logo_large.jpg" /></video>
</div>
</div>
<div class="col-md-6">
<p>
  Adobe After Effects is a digital visual effects, motion graphics, and compositing application developed by Adobe Systems
  and used in the post-production process of film-making and television production.
  <b>Holusion</b> provide a completely configured framework for your projects.
</p>

<p>
  This tutorial will guide you to create the best content for your Holusion product.
</p>

<p><center><a class="button" href="/static/files/Templates_after_effect.zip">Download</a></center></p>
<p>
  For those who want to understand the way holographic effects are made, the <a href="#internals">last section</a> of this page will guide you through the entire process of holographic videomaking.
</p>
</div>
</div>


# Get Started

This tutorial's files are tested compatible with **After Effect** CS6 onwards. They are made to simplify video compositing for Holusion's products.

To begin, please open the After Effect project corresponding to your product of choice : **Prism** or **Focus**.

Projects are very similar to each other. They contains 2 compositions : **"Input"** and **"Render"**. We will use them in this tutorial.

To customize this guide, you can choose your target product in the list below.



## Product Choice

<div class="row">
<div class="col-lg-4 col-5" style="text-align:right;padding-right:0px;">
<p>
<button class="btn btn-secondary product-button" onclick="changeProduct(this.innerHTML)" >Prism</button>
</p>
<p>
<button id="btnProductDefault" class="btn btn-primary product-button" onclick="changeProduct(this.innerHTML)" >Focus</button>
</p>
</div>
<div class="col-5 col-lg-4">
<img class="product-show img-fluid" height="100px" title="Prisme" src="/static/img/products/prisme.jpg"/>
<img class="product-show img-fluid" height="100px" title="Focus" src="/static/img/products/focus.jpg"/>
</div>
</div>



## Insert content

Open the **"Input"** composition.

A colored frame indicates the final image's format. Anything beyond this frame will be cut during the render process. This frame will automatically be hidden on your output.

<center><img class="img-fluid" src="/static/img/posts/after-effect/layouts_input_compared.jpg"/></center>

Later instructions will be customized for the <span class="product-span">Focus</span> ([change it](#product-choice)).



## Step by Step


### 1. Insert File

In the left column, right click and select ```Import > File``` (shortcut Ctrl+I). Import your content source and drag it into the **"Input"** composition.

*Note : Source content can be an image, an image sequence, a video or any after effect - supported format.*


### 2. Customize composition

<div class="row">
<div class="col-sm-6">
Composition's duration must be changed in order to match your content's.
Right click on the <b>"Input"</b> composition and select <b>Settings</b> then change the duration of the composition.
</div>
<div class="col-md-3 offset-sm-1 col-sm-4 col-6 offset-xs-3">
<img src="/static/img/posts/after-effect/settings.jpg" class="img-fluid magnify"/>
</div>
</div>
Do the same with the **"Render"** composition.

Using contextual menu, you can change your content's position, size, rotation, etc...
You should ensure your content is using the most possible space as it will generally provide the best holographic effect.
Please keep in mind that everything beyond the red Frame will be cut at render time.


### 3. Render

In the *render* tab, rich click on the already-created element.
Right click on it and select ```Duplicate```.

Change the output file to some place you like. Encoding options have been set to default options that should be OK most of the time.

<div class="row">
<div class="col-md-6 offset-md-3">
<img class="img-fluid magnify" src="/static/img/posts/after-effect/duplicate_render.jpg"/>
</div>
</div>

The video is ready to be sent to your product.

# Improving

If you are a beginner on After Effect or it is your first time making content for an Holusion product, please consider doing the [tutorial](#get-started) first.

## Image

Content consisting of objects / subjects moving over a black background produces the best holographic effect.
Example on the right will not look as good as the left one when in hologram.

<div class="row">
<div class="col-sm-6 offset-sm-3">
<img class="img-fluid center-block" src="/static/img/posts/after-effect/background_example.jpg"/>

</div>
</div>

Colorful objects will always be more eye-catching while dark objects are going to look shadowed / Transparent. Black  will be totally invisible.

If you have to display a black  or very dark object, one option would be to make a white overlay around it to make it visible. Keep in mind though that it's not optimal and always prefer the use of bright colors when possible.

# Internals

## Image setup : Internals

Each product have a specific image format. Select your product to see the associated layout.

<button class="btn btn-secondary product-button" onclick="changeProduct(this.innerHTML)" >Prism</button>
<button class="btn btn-primary product-button" onclick="changeProduct(this.innerHTML)" >Focus</button>

one have to take 2 steps to make an image "holographic" :


<p>Flip images. As if seen through a mirror.</p>
<div><img height="150px" src="/static/img/posts/after-effect/mirror.jpg" />


<p>Place the content to be on the right on-screen location.
</p>


<img class="magnify product-show" height="150px" title="Prisme" src="/static/img/posts/after-effect/sample_prisme.jpg"/>
<img class="magnify product-show" height="150px" title="Focus" src="/static/img/posts/after-effect/sample_focus.jpg"/>

<p>Example setup : <span class="product-span">Prism</span>.</p>

<p>Resolution :
<strong>
<span class="product-show" title="Prism">1280x1024</span>
<span class="product-show" title="Focus">1920x2160</span>
</strong>
</p>


<b>Warning</b> : Take care to use the correct resolution for each product.

<ul>
<li>Prism : 1280 x 1024 </li>
<li>Focus : 1920 x 2160 </li>
</ul>
