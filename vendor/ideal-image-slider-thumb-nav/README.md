# Ideal Image Slider - Thumb Navigation Extension

Adds thumb navigation to the Ideal Image Slider.

## Requirements

* [Ideal Image Slider](https://github.com/gilbitron/Ideal-Image-Slider) v1.2.0+

## Usage

The `iis-thumb-nav.js` must be included after `ideal-image-slider.js` and `iis-thumb-nav.css` after `ideal-image-slider.css`.

```html
<script src="ideal-image-slider.js"></script>
<script src="extensions/bullet-nav/iis-thumb-nav.js"></script>
<script>
var slider = new IdealImageSlider.Slider('#slider');
slider.addThumbNav();
slider.start();
</script>
```
