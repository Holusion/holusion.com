---
title: Natron
image: /build/img/posts/banner_natron.jpg
image2x: /build/img/posts/banner_natron_2x.jpg
abstract: Creating holographic videos by using the free creation software "Natron"
menu: content
rank: 5
---

Natron is a free video creation and editing software, that is really efficient and under public license. It can be used on MacOSX, Windows and Linux.

We can use it to create a video that can be displayed in hologram.

## Installation

1. Follow the installation instructions for [Windows, MacOSX and Linux](http://natron.fr/download/).
2. Download the project file for the [prism](/static/files/natron_prism.zip) or the [focus](/static/files/natron_focus.zip)

Open the downloaded project.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/natron_open.jpg" alt="natron openning screen">
  <span><b>"Prism" project once opened</b></span>
</center>

## Use

### Overview

The given project file contains many transformations (in orange) and masks (in blue) set up to produce the final hologram. It was made with default settings to realize the final hologram without technical knowledge in video editing.

The principal elements in the "Node Graph" part that will be used :

- **Viewer3** : Intermediary view that permits to place the source video
- **Viewer1** : Final result view
- **Position** : Settings for the size and the positionning of the source video

### Import a video
The first step is to import a video. You have to create a new *Node* in the "Node graph" part. Just drag and drop a video in this zone.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/natron_node_graph.png" alt="Node graph">
  <span><b>The "Node Graph" zone</b></span>
</center>

You can also right click, choose **Reader** in the section **image** (Shortcut : *R*), or use the default shortcut **R**.

It creates a "Reader node". You must link it to the 'position' node in order to place the video correctly.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/node_linking.gif" alt="reader node">
  <span><b>Create a link between 2 nodes</b></span>
</center>

### Optimize the rendering

Some settings are necessary to have the best render. These settings are to be made on the **transform Nodes** of the scene. Either manually in the preview, or in the "Nodes" configuration tool for more precision.

Activate the **Transform** node by clicking twice on it. A positionning and scaling icon should appear in the **Viewer2**.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/node_resize.jpg" alt="resize a node">
  <span><b>Scale the object for it doesn't go out of the black triangle.</b></span>
</center>
Use the **Viewer2** to better see the outlines. Your video must entirely be in the black part. Do not hesitate to play the video to verify that the object doesn't go out during the whole animation.

<div class="row">
  <div class="col-md-6"><center>
    <img class="img-responsive" src="/static/img/posts/natron/move_transform.png" alt="natron preview for transformations">
    <span><b>Click on the center of the cross to move it, or on the circle to scale it</b></span>
  </center></div>
  <div class="col-md-6"><center>
    <img class="img-responsive" src="/static/img/posts/natron/transform_properties.png" alt="transformations properties">
    <span><b>Use the X, Y translate function to move it, or Scale to scale it</b></span>
  </center></div>
</div>

Once you are happy with the positionning, you can see the final result by clicking on **Viewer1**.

### Render the hologram

<div class="row">
  <div class="col-md-6" style="text-align:justify">
  <p>
    Now you just need to export your holographic video. In the <b>Properties</b> zone, find the element <b>WritePNG</b>, or <b>WriteVideo</b> and then click <b>Render</b>.
  </p>
  <ul>
    <li>
      <b>WritePNG</b> creates a sequence of picture numbered files frame-<1-500>.png that you will encode with any video editing software. It is the more flexible way to export your work
    </li>
    <li>
        <b>WriteVideo</b> will directly encode the video for you. The codecs that Natron uses are sometimes unstable, it is generally safer to use a second software that encodes better.
      </li>
  </ul>
  <p> To sum up, WritePNG is preferable, unless you don't have access to any editing software.</p>
  <p>
    The rendering can take up to 10 min for a video, depending on the computer that you use.<br>
    You can then <a href="/fr/toolbox/packaging">transfere</a> the video on your product.
  </p>
  <a class="button" href="/fr/toolbox/packaging">Media transfert guide</a>
  </div>
  <div class="col-md-6">
      <img class="img-responsive" src="/static/img/posts/natron/render_node.png" alt="render node properties"></img>
      <center><span><b>Properties of the "render node"</b></span></center>
  </div>
</div>
