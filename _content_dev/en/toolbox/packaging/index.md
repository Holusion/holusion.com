---
title: Media Upload
redirect_from:
  - "/en/transfert-de-m-dias/"
  - "/en/packaging/"
image: /build/img/posts/banner_packaging.jpg
image2x: /build/img/posts/banner_packaging_2x.jpg
abstract: Prepare and upload your contents
rank: 1
menu: toolbox
---

## Introduction

The holusion software is using simple yet extensive rules to classify files and apps.

Any file not following those rules will be automatically rejected. Transfer method is very simple and is explained in the [transfer](#transfer) section.

<center>
  <img alt="mime type error" class="img-responsive" src="/static/img/posts/packaging/remote_error.jpg"/>
  <p>Example : trying to upload a <b>pdf</b></p>
</center>

Supported file formats are:

-  **video** files
  - .mov, .avi, .mp4, .flv, .mkv
- **executables* files
  - without a required extension, of  [mime type](https://fr.wikipedia.org/wiki/Type_MIME) ```application/```
- Archvie folders [respecting those conditions](#archives)
  - .tar.gz (best), .tar, .zip


## Transfer

Once connected to the product, use a web browser to navigate to [http://10.0.0.1:3000](http://10.0.0.1:3000). If it doesn't load, please verify you're well connected to your product. Reboot it if need be.

Use the **"Upload"** bar to find your file and send it.

<center>
  <img alt="upload bar remote holusion" src="/static/img/posts/packaging/upload_bar.jpg"/>
  <p>A successful upload</p>
</center>

## Archives

Archives are the best system to package full apps, often requiring multiple files to work with. For example, Unity apps. However they require slightly more attention than simple files.

Suported formats are : **.tar, .tar.gz, .zip**.

Archive content **mustùù be identified by one of the following methods for the upload to be valid :
(once one element is valid, the following ones will be ignored)

1. have a **package.json** file in root folder with:
    1. a ```start``` field with the exec command.
    2. a ```script:start```  field with the exec command.
    3. a ```bin``` with a single file's path relative to package.json.
    4. a ```main``` field with a single file's path relative to package.json.
3. have only one file in root folder. May also have subfolders.

**file** requirements need to be binaries or scripts with a [shebang](https://fr.wikipedia.org/wiki/Shebang) header.
minimal package.json file :
{% highlight json %}
{
  "name":"my wonderful app",
  "start":"sh myscript.sh"
}
{% endhighlight %}
Holusion is [npm](http://npmjs.org) compatible. fields are either of same use or of different names.

Archives created by those rules can be transfered to any Holusion products.
