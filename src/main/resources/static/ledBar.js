
function ledBar( type, side, ledCount, x, y, width, height )
{
	this.type = type; // 0 = blocks, 1 =circles
	this.side = side; // 0 = left, 1 == right
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.margin = 2;
	//console.log( x, y, width, height );
	this.colors = [];
	this.ledCount = ledCount;
	this.leds = [];
				
	this.opts = {
		hueStart : 60,
		hueEnd : 120,
		saturationStart: 1,
		saturationEnd: 1,
		lightnessStart: 0.5,
		lightnessEnd: 0.5,
		opacityLed : 0,
		opacityPeak : 0,
		dropRate: 100,
		orientation: ORIENT_BOTTOM,
		backgroundColor:'black'
	};
	
	this.value = 0;
	this.valueHigh = 0;
	
	var h = (this.height+this.margin) / this.ledCount;
	for( var i = 0; i < this.ledCount; i++ ) {
		this.leds[i] = ledFactory.create( this.type, this.x, this.y + i * h, this.width, h-this.margin, this.opts.orientation );
	}
}

ledBar.prototype = {
	setPosition: function( x, y, width, height )
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		var h = (this.height+this.margin) / this.ledCount;
		for( var i = 0; i < this.ledCount; i++ ) {
			this.leds[i] = ledFactory.create( this.type, x, this.y +(this.ledCount-1-i) * h, width, h-this.margin, this.opts.orientation );
		}
		
	},
	repositionForOrientation: function()
	{
		var o = this.opts.orientation;
		if( o == ORIENT_EDGE_VERT && this.side == 1 ) {
			o = ORIENT_MID_VERT;
		}
		else if( o == ORIENT_MID_VERT && this.side == 1 ) {
			o = ORIENT_EDGE_VERT;
		}
		
		switch( o ) {
			case ORIENT_TOP:
				var h = (this.height+this.margin) / this.ledCount;
				for( var i = 0; i < this.ledCount; i++ ) {
					this.leds[i] = ledFactory.create( this.type, this.x, this.y +(this.ledCount-1-i) * h, this.width, h-this.margin, o );
				}
				break;
				
			case ORIENT_BOTTOM:
				var h = (this.height+this.margin) / this.ledCount;
				for( var i = 0; i < this.ledCount; i++ ) {
					this.leds[i] = ledFactory.create( this.type, this.x, this.y + (i) * h, this.width, h-this.margin, o );
				}
				break;
				
			case ORIENT_LEFT:
				var w = (this.width+this.margin) / this.ledCount;
				for( var i = 0; i < this.ledCount; i++ ) {
					this.leds[i] = ledFactory.create( this.type, this.x +(this.ledCount-1-i) * w, this.y, w-this.margin, this.height, o );
				}
				break;
				
			case ORIENT_RIGHT:
				var w = (this.width+this.margin) / this.ledCount;
				for( var i = 0; i < this.ledCount; i++ ) {
					this.leds[i] = ledFactory.create( this.type, this.x + (i) * w , this.y, w-this.margin, this.height, o );
					//ledFactory.create( this.type, this.x +(this.ledCount-1-i) * w, this.y, w-this.margin, this.height, o );
				}
				break;
				
			case ORIENT_EDGE_VERT:
				var w = (this.width+this.margin) / this.ledCount;
				for( var i = 0; i < this.ledCount; i++ ) {
					this.leds[i] = ledFactory.create( this.type, this.x +(this.ledCount-1-i) * w, this.y, w-this.margin, this.height, o );
				}
				break;
				
			case ORIENT_MID_VERT:
				var w = (this.width+this.margin) / this.ledCount;
				for( var i = 0; i < this.ledCount; i++ ) {
					this.leds[i] = ledFactory.create( this.type, this.x + (i) * w, this.y, w-this.margin, this.height, o );
				}
				break;
		}
	},
	setOpts: function( opts, percColor )
	{
		this.opts = opts; 
		this.percColor = percColor;
		this.repositionForOrientation();
		
		// correct hue values 
		//while( this.opts.hueEnd < this.opts.hueStart ) {
		//	this.opts.hueEnd += 360;
		//}
		while( this.opts.hueEnd - this.opts.hueStart > 180 ) {
			this.opts.hueEnd -= 360;
		}
		while( this.opts.hueEnd - this.opts.hueStart < -180 ) {
			this.opts.hueEnd += 360;
		}
		while( this.opts.hueEnd < 0 ) {
			this.opts.hueEnd += 360;
			this.opts.hueStart += 360;
		}
		
		//while( this.opts.hueEnd2 < this.opts.hueStart2 ) {
//			this.opts.hueEnd2 += 360;
		//}
		while( this.opts.hueEnd2 - this.opts.hueStart2 > 180 ) {
			this.opts.hueEnd2 -= 360;
		}
		while( this.opts.hueEnd2 - this.opts.hueStart2 < -180 ) {
			this.opts.hueEnd2 += 360;
		}
		while( this.opts.hueEnd2 < 0 ) {
			this.opts.hueEnd2 += 360;
			this.opts.hueStart2 += 360;
		}
		
		if( percColor > 0 ) {
			
			while( this.opts.hueStart2 - this.opts.hueStart > 180 ) {
				this.opts.hueStart2 -= 360;
				this.opts.hueEnd2 -= 360;
			}
			
			while( this.opts.hueStart2 - this.opts.hueStart < -180 ) {
				this.opts.hueStart2 += 360;
				this.opts.hueEnd2 += 360;
			}
			
			//if( this.opts.hueEnd2 - this.opts.hueEnd > 180 ) {
			//	this.opts.hueEnd2 -= 360;
			//}
			
			//if( this.opts.hueEnd2 - this.opts.hueEnd < -180 ) {
			//	this.opts.hueEnd2 += 360;
			//}
		}
		 
		
		// always spread with largest at bottom / there is probably a better algo for this but too lazy to find it
		var max = this.ledCount;
		for( var i = 0; i < max; i++ ) {
			var h = this.opts.hueStart + (this.opts.hueEnd - this.opts.hueStart) * ( i / (max-1) );
			var s = (this.opts.saturationStart + (this.opts.saturationEnd - this.opts.saturationStart) * ( i / (max-1) ));
			var l = (this.opts.lightnessStart + (this.opts.lightnessEnd - this.opts.lightnessStart) * ( i / (max-1) ));
			
			var h2 = this.opts.hueStart2 + (this.opts.hueEnd2 - this.opts.hueStart2) * ( i / (max-1) );
			var s2 = (this.opts.saturationStart2 + (this.opts.saturationEnd2 - this.opts.saturationStart2) * ( i / (max-1) ));
			var l2 = (this.opts.lightnessStart2 + (this.opts.lightnessEnd2 - this.opts.lightnessStart2) * ( i / (max-1) ));
			
			
			h = h + ( h2 - h ) * percColor;
			s = s + ( s2 - s ) * percColor;
			l = l + ( l2 - l ) * percColor;
			
			while( h < 0 ) h += 360;
			
			var ol = 1 * this.opts.opacityLed;
			var oh = 1 * this.opts.opacityPeak;
			
			var rgb = hsvToRgb( h/360, s, l * l );
			//console.log( 'h:' + h + 's:' + s + 'l:' + l + ' rgba(' + rgb[0] + ', ' + rgb[1] + ',' + rgb[2] + ', ' + oh + ')' );
			
			this.leds[this.ledCount-1-i].colorLow = 'rgba(' + rgb[0] + ', ' + rgb[1] + ',' + rgb[2] + ', ' + ol + ')';
			this.leds[this.ledCount-1-i].colorHigh ='rgba(' + rgb[0] + ', ' + rgb[1] + ',' + rgb[2] + ', ' + oh + ')';
			//this.leds[this.ledCount-1-i].colorLow = 'hsla(' + h + ', ' + s + '%,' + l + '%, ' + ol + ')';
			//this.leds[this.ledCount-1-i].colorHigh ='hsla(' + h + ', ' + s + '%,' + l + '%, ' + oh + ')';
			this.leds[this.ledCount-1-i].colorErase = this.opts.backgroundColor;
		}
	},
	updateHue: function( byDeg )
	{
		var percColor = this.percColor;
		// always spread with largest at bottom / there is probably a better algo for this but too lazy to find it
		var max = this.ledCount;
		for( var i = 0; i < max; i++ ) {
			var p = i / (max-1);
			var h = this.opts.hueStart + (this.opts.hueEnd - this.opts.hueStart) * p;
			var s = (this.opts.saturationStart + (this.opts.saturationEnd - this.opts.saturationStart) * p);
			var l = (this.opts.lightnessStart + (this.opts.lightnessEnd - this.opts.lightnessStart) * p);
			
			var h2 = this.opts.hueStart2 + (this.opts.hueEnd2 - this.opts.hueStart2) * p;
			var s2 = (this.opts.saturationStart2 + (this.opts.saturationEnd2 - this.opts.saturationStart2) * p);
			var l2 = (this.opts.lightnessStart2 + (this.opts.lightnessEnd2 - this.opts.lightnessStart2) * p);
			
			h += byDeg;
			h2 += byDeg;
			
			h = h + ( h2 - h ) * percColor;
			s = s + ( s2 - s ) * percColor;
			l = l + ( l2 - l ) * percColor;
			
			while( h < 0 ) h += 360;
			while( h > 360 ) h -= 360;
			
			var ol = 1 * this.opts.opacityLed;
			var oh = 1 * this.opts.opacityPeak;
			
			var rgb = hsvToRgb( h/360, s, l * l );
			//console.error( 'h:' + h + ' s:' + s + ' l:' + l + ' rgba(' + rgb[0] + ', ' + rgb[1] + ',' + rgb[2] + ', ' + oh + ')' );
			
			this.leds[this.ledCount-1-i].colorLow = 'rgba(' + rgb[0] + ', ' + rgb[1] + ',' + rgb[2] + ', ' + ol + ')';
			this.leds[this.ledCount-1-i].colorHigh ='rgba(' + rgb[0] + ', ' + rgb[1] + ',' + rgb[2] + ', ' + oh + ')';
			//this.leds[this.ledCount-1-i].colorLow = 'hsla(' + h + ', ' + s + '%,' + l + '%, ' + ol + ')';
			//this.leds[this.ledCount-1-i].colorHigh ='hsla(' + h + ', ' + s + '%,' + l + '%, ' + oh + ')';
			this.leds[this.ledCount-1-i].colorErase = this.opts.backgroundColor;
		}
	},
	refresh: function( ctx, stroke )
	{
		//ctx.globalCompositeOperation = 'destination-out';
		//ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
		//ctx.strokeStyle = 'rgba( 255, 255, 255, 1 )';
		//ctx.fillRect( this.x-1, this.y-1, this.width+1, this.height+1 );
		//ctx.globalCompositeOperation = 'source-over';
		
		//this.value = 0;
		var top = Math.max(0,Math.min(this.ledCount,Math.floor(this.value*this.ledCount)));;
		for( var i = 0; i < this.ledCount; i++ ) {
			if( i < top ) {
				this.leds[this.ledCount - 1 -i].unrender( ctx, stroke );
				this.leds[this.ledCount - 1 -i].render( ctx, stroke );	
			}
			else {
				this.leds[this.ledCount - 1 -i].unrender( ctx, stroke );	
			}
		}
	},
	update: function( ctx, stroke, timeDiff, newValue )
	{
		newValue = Math.max( 0, Math.min( 1, newValue ) );
		
		var ov = this.value;
		var nv = newValue;
		this.value = nv;
		
		var ovh = this.valueHigh;
		var nvh = this.valueHigh;
		nvh -= timeDiff / this.ledCount / this.opts.dropRate;
		if( nvh < nv ) {
			nvh = nv;
		}
		this.valueHigh = nvh;
		
		var oldValueHighTop = Math.max(0,Math.min(this.ledCount-1,Math.floor(ovh*this.ledCount)));
		var newValueHighTop = Math.max(0,Math.min(this.ledCount-1,Math.floor(nvh*this.ledCount)));
		
		var oldTop = Math.max(0,Math.min(this.ledCount,Math.floor(ov*this.ledCount)));
		var newTop = Math.max(0,Math.min(this.ledCount,Math.floor(nv*this.ledCount)));
		
		var min = Math.min( oldTop, newTop );
		var max = Math.max( oldTop, newTop );

		if( oldValueHighTop >= 0 && oldValueHighTop < this.ledCount ) this.leds[this.ledCount - 1 - oldValueHighTop].unrender( ctx , stroke);
			
		if( newTop > oldTop ) {
			for( var i = min; i < max; i++ ) {
				this.leds[this.ledCount - 1 -i].render( ctx, stroke );
			}
		}
		else if( newTop < oldTop ){
			for( var i = min; i < max; i++ ) {
				this.leds[this.ledCount - 1 -i].unrender( ctx, stroke );
			}
		}
		
		if( newValueHighTop >= 0 && newValueHighTop < this.ledCount ) this.leds[this.ledCount - 1 - newValueHighTop].renderHigh( ctx, stroke );
		
		// 0 1 2 3 4 5 6 7 8 9 10 - value
		//   0 1 2 3 4 5 6 7 8 9  - index value
		//			   -
		//		   -   
		
		//this.refresh( ctx );
		//for( var i = 0; i < this.ledCount; i++ ) {
		//	var on = i/this.ledCount < newValue;
		//	if( on ) 
		//		this.leds[i].render( ctx );
		//}
	}
}