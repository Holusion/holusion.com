/*
 * Ideal Image Slider: Thumb Navigation Extension v1.0.0
 *
 * By Four Labs
 * https://fourlabs.co.uk
 *
 * Copyright (C) 2016 Four Labs
 */

function iisThumbNav(IIS) {
	"use strict";

	var _updateActiveThumb = function(slider, activeIndex) {
		var thumbs = slider._attributes.thumbNav.querySelectorAll('a');
		if (!thumbs) return;

		Array.prototype.forEach.call(thumbs, function(thumb, i) {
			IIS._removeClass(thumb, 'iis-thumb-active');
			thumb.setAttribute('aria-selected', 'false');
			if (i === activeIndex) {
				IIS._addClass(thumb, 'iis-thumb-active');
				thumb.setAttribute('aria-selected', 'true');
			}
		}.bind(this));
	};

	IIS.Slider.prototype.addThumbNav = function() {
		IIS._addClass(this._attributes.container, 'iis-has-thumb-nav');

		// Create thumb nav
		var thumbNav = document.createElement('div');
		IIS._addClass(thumbNav, 'iis-thumb-nav');
		thumbNav.setAttribute('role', 'tablist');

		// Create thumbs
		Array.prototype.forEach.call(this._attributes.slides, function(slide, i) {
			var thumb = document.createElement('a');
			thumb.innerHTML = i + 1;
			thumb.setAttribute('role', 'tab');
			thumb.style.backgroundImage = 'url('+slide.getAttribute('data-src')+')';

			thumb.onclick = ()=> {
				//if (IIS._hasClass(this._attributes.container, this.settings.classes.animating)) return false;
				this.stop();
				this.gotoSlide(i + 1);
			};

			thumbNav.appendChild(thumb);
		}.bind(this));

		this._attributes.thumbNav = thumbNav;
		this._attributes.container.appendChild(thumbNav);
		_updateActiveThumb(this, 0);

		// Hook up to afterChange events
		var origAfterChange = this.settings.afterChange;
		var afterChange = function() {
			var slides = this._attributes.slides,
				index = slides.indexOf(this._attributes.currentSlide);
			_updateActiveThumb(this, index);
			return origAfterChange();
		}.bind(this);
		this.settings.afterChange = afterChange;
	};

	return IIS;

};
