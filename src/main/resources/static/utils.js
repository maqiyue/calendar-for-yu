
function fixFilename (str) {
	/*
	if( !str.match(/%[\dA-Z]{2}/g) ) {
	 	return str.replace(/%/g, '%25').replace(/#/g, '%23');
	}*/
	return str;
};

function rgbToHsl(r, g, b, factor){
	r /= factor, 
	g /= factor, 
	b /= factor;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max == min){
		h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv (r, g, b, factor) {
    var rr, gg, bb,
        r = r / factor,
        g = g / factor,
        b = b / factor,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [
        h, //Math.round(h * 360),
        s, //Math.round(s * 100),
        v  //Math.round(v * 100)
    ];
}

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
}

function backgroundScale( elem  )
{
	this.elem = elem;
	
	this.size = '';
	this.url = '';
	this.hasImage = false;
	this.width = 1;
	this.height = 1;
	this.scale = 1;
	this.displayWidth = 1;
	this.displayHeight = 1;
	this.screenWidth = window.innerWidth;
	this.screenHeight = window.innerHeight;
	
	this.gettingSize = false; // avoid duplicate requests
	
	this.setElement = function( elem )
	{
		this.elem = elem;
		
		//this.getSize();
	}
	
	this.getSizeIndication = function()
	{
		if( !this.elem ) return '';
		return this.elem.style.backgroundSize;
	}
	
	this.getImageUrl = function()
	{
		if( !this.elem ) return '';
		return this.elem.style.backgroundImage.replace( /^.*?url\((['"])?(.*?)\1\).*$/gi, '$2');
	}
	
	this.calculateDisplaySize = function()
	{
		var w, h;
		var rs = this.screenWidth / this.screenHeight;
		var ri = this.width / this.height;
		if( this.size == 'cover' ) 
		{
			if( rs > ri ) {
				w = this.screenWidth;
				h = this.height * ( this.screenWidth / this.width );
			}
			else {
				h = this.screenHeight;
				w = this.width * ( this.screenHeight / this.height );
			}
		}
		else if( this.size == 'contain' )
		{
			if( rs < ri ) {
				w = this.screenWidth;
				h = this.height * ( this.screenWidth / this.width );
			}
			else {
				h = this.screenHeight;
				w = this.width * ( this.screenHeight / this.height );
			}
		}
		else {
			w = this.screenWidth;
			h = this.screenHeight;
		}
		this.scale = ( w / this.width );
		this.displayWidth = w;
		this.displayHeight = h;
	}
	
	this.getSize = function( cb )
	{
		try {
			if( !this.elem ) {
				if( cb ) cb();
				return '';
			}
			
				
			var self = this;
			if( this.gettingSize ) {
				if( cb ) cb();
				// add to request queue
				return;
			}
			
			var sz = this.getSizeIndication();
			var url = this.getImageUrl();
			if( this.size == sz && this.url == url ) {
				setTimeout( function() { cb({ width: self.width, height: self.height }); }, 1 );
				return;
			}
			this.gettingSize = true;
			
		  	var img = new Image(),width, height;

	    	img.onerror = function () {
	    		self.hasImage = false;
			    self.width = width = window.innerWidth;
			    self.height = height = window.innerHeight;
				self.size = sz;
				self.url = url;
				self.calculateDisplaySize();
				self.gettingSize = false;
			   	if( cb ) cb({ width: width, height: height });
	    	}
		  	img.onload = function () {
	    		self.hasImage = true;
			    self.width = width = this.width;
			    self.height = height = this.height;
				self.size = sz;
				self.url = url;
				self.calculateDisplaySize();
				self.gettingSize = false;
			   	if( cb ) cb({ width: width, height: height });
			}
			// extract image source from css using one, simple regex
			// src should be set AFTER onload handler
			img.src = url;
		}
		catch( ex ) {
			console.error( ex );
			//alert( 'exception: '  );
		}
	}
	this.getSize();
}
