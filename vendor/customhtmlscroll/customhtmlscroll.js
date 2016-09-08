/*
 * Custom stylable HTML scrollbar library
 * Copyright (C) 2014  David Maes
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * davidmaes@outlook.com
 */

var addCustomHTMLScroll = function( element )
{
	var customScroll = CustomHTMLScroll( element );
	customScroll.setup();
};

function CustomHTMLScroll( content )
{
	var scroll = {};

	var parent = null;
	var scrollPane = null;
	var scrollBar = null;

	var viewportHeight = 0;
	var scrollPaneHeight = 0;
	var scrollBarHeight = 0;

	var scrollTopMax = 0;
	var scrollBarMargins = 4;

	var startY = 0;
	var scrollSpeed = 30;
	var scrolling = false;

	scroll.setup = setup;
	function setup()
	{
		setupScrollPane();
		setContentProperties();
		wrapContent();

		calculateProperties();

		setupScrollBar();
		setupScrollEvents();
	}

	function setupScrollPane()
	{
		parent = content.parentNode;

		scrollPane = addElement( parent, "div");
		scrollPane.className = "scrollPane";
		scrollPane.style.position = "relative";

		parent.insertBefore( scrollPane, content );
	}

	function setContentProperties()
	{
		content.style.overflowY = "hidden";
	}

	function wrapContent()
	{
		scrollPane.appendChild( content );
	}

	function calculateProperties()
	{
		viewportHeight = content.offsetHeight;
		scrollPaneHeight = scrollPane.offsetHeight;
		scrollTopMax = content.scrollHeight - viewportHeight;
		scrollBarHeight = calculateScrollbarHeight();
	}

	function calculateScrollbarHeight()
	{
		var perunage = viewportHeight / content.scrollHeight;

		return viewportHeight * perunage - scrollBarMargins * 2;
	}

	function setupScrollBar()
	{
		scrollBar = addElement( scrollPane, "div" );
		scrollBar.className = "scrollBar";
		scrollBar.style.position="absolute";

		scrollBar.style.left = content.offsetWidth - scrollBar.offsetWidth - scrollBarMargins + "px";
		scrollBar.style.top = scrollBarMargins + "px";
		scrollBar.style.height = scrollBarHeight + "px";
		scrollBar.style.opacity = 0;
	}

	function setupScrollEvents()
	{
		scrollPane.addEventListener( "mouseover", onShowScrollBar );
		scrollPane.addEventListener( "mouseout", onHideScrollBar );
		scrollPane.addEventListener( "wheel", onWheel );
		content.addEventListener( "touchstart", onTouchStart );
		content.addEventListener( "touchmove", onTouchMove );
		content.addEventListener( "touchend", onTouchEnd );
		scrollBar.addEventListener( "mousedown", onStartDrag );
	}

	function onShowScrollBar()
	{
		scrollBar.style.opacity = 1;
	}

	function onHideScrollBar()
	{
		if( !scrolling )
			scrollBar.style.opacity = 0;
	}

	function onWheel( e )
	{
		var delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;
		content.scrollTop += delta;

		adjustScrollBarToContent();

		e.preventDefault();
	}

	function adjustScrollBarToContent()
	{
		var height = content.scrollHeight - viewportHeight;
		var perunage = content.scrollTop / height;
		var top =  scrollBarMargins + ( scrollPaneHeight - scrollBarMargins * 3 - scrollBarHeight ) * perunage;

		scrollBar.style.top = top + "px";
	}

	function onTouchStart( e )
	{
		var touch = e.changedTouches[0];
		startY = parseFloat( touch.clientY );

		onShowScrollBar();

		e.preventDefault();
	}

	function onTouchMove( e )
	{
		var touch = e.changedTouches[0];

		content.scrollTop -= parseFloat( touch.clientY ) - startY;
		startY = parseFloat( touch.clientY );

		adjustScrollBarToContent();

		e.preventDefault();
	}

	function onTouchEnd( e )
	{
		onHideScrollBar();
	}

	function onStartDrag( e )
	{
		startY = e.clientY;

		setNodeSelectable( content, false );

		document.addEventListener( "mousemove", onDrag );
		document.addEventListener( "mouseup", onStopDrag );
	}

	function onDrag( e )
	{
		scrolling = true;

		var top = parseFloat( scrollBar.style.top ) + e.clientY - startY;

		top = Math.max( top, scrollBarMargins );
		top = Math.min( top, scrollPaneHeight - scrollBarHeight - scrollBarMargins * 2 );

		scrollBar.style.top = top + "px";
		startY = e.clientY;

		adjustContentToScollBar();
	}

	function onStopDrag( e )
	{
		scrolling = false;

		setNodeSelectable( content, true );

		document.removeEventListener( "mousemove", onDrag );
		document.removeEventListener( "mouseup", onStopDrag );
	}

	function getPropertiesAreValid()
	{
		if( scrollPaneHeight < contentHeight )
			return true;
		else
			return false;
	}

	function adjustContentToScollBar()
	{
		var perunage = parseFloat( scrollBar.style.top ) / ( scrollPaneHeight - scrollBarHeight - scrollBarMargins * 2 );

		var top = perunage * scrollTopMax;

		content.scrollTop = top;
	}

	function addElement( parent, element )
	{
		var child = document.createElement( element );

		parent.appendChild( child );

		return child;
	}

	function setNodeSelectable( node, value )
	{
	    if( node.nodeType != 1 )
	    	return;

	    if( value )
	    	node.removeAttribute("unselectable");
	    else
	    	node.setAttribute("unselectable", "on");

	    var children = node.childNodes;

	    for( var i = 0; i < children.length; i++ )
	       	setNodeSelectable( children[i], value );
	}


	return scroll;
}			
