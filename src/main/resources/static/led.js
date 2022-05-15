
function led( color, x, y, w, h )
{
	this.colorErase = 'black';
	this.colorLow = 'black';
	this.colorHigh = 'black';
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
 
led.prototype = {
	unrender: function(ctx )
	{
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
		ctx.fillRect( this.x-1, this.y-1, this.w+2, this.h+2 );
		ctx.globalCompositeOperation = 'source-over';
	},
	render: function( ctx, stroke  ) 
	{
		ctx.beginPath();
		if( stroke ) {
     		if( this.w2 <= 1 || this.h2 <= 1 ) return;
			ctx.strokeStyle = this.colorLow;
			ctx.strokeRect( this.x+0.5, this.y+0.5, this.w-1, this.h-1 );
		}
		else {
			ctx.fillStyle = this.colorLow;
			ctx.fillRect( this.x, this.y, this.w, this.h );
		}
	},
	renderHigh: function( ctx, stroke  ) 
	{
		ctx.beginPath();
		if( stroke ) {
     		if( this.w2 <= 1 || this.h2 <= 1 ) return;
			ctx.strokeStyle = this.colorHigh;
			ctx.strokeRect( this.x+0.5, this.y+0.5, this.w-1, this.h-1 );
		}
		else {
			ctx.fillStyle = this.colorHigh;
			ctx.fillRect( this.x, this.y, this.w, this.h );
		}
	}
};

function led2( color, x, y, w, h )
{
	if( w < 0.1 ) w = 0.1;
	if( h < 0.1 ) h = 0.1;
	this.colorErase = 'black';
	this.colorLow = 'black';
	this.colorHigh = 'black';
	this.x = x + w / 2;
	this.y = y + h / 2;
	this.w = w;
	this.h = h;
	this.w2 = w/2;
	this.h2 = h/2;
	this.r = Math.min( w, h ) / 2;
}
 
led2.prototype = {
	unrender: function(ctx)
	{
     	//ctx.scale( this.w/this.h, this.h );
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
		ctx.ellipse( this.x, this.y, this.w2 + 1, this.h2 + 1, 0, 0, Math.PI * 2 );
		//ctx.arc( this.x, this.y, this.r + 1, 0, Math.PI * 2 );
 		ctx.closePath();
 		ctx.fill();
		ctx.globalCompositeOperation = 'source-over';
     	//ctx.scale( 1, 1 );
	},
	render: function( ctx, stroke ) 
	{
     	//ctx.scale( this.w/this.h, this.h );
     	if( this.w2 <= 0.5 || this.h2 <= 0.5 ) return;
		ctx.beginPath();
		ctx.fillStyle = this.colorLow;
		ctx.strokeStyle = this.colorLow;
		ctx.ellipse( this.x, this.y, this.w2-0.5, this.h2-0.5, 0, 0, Math.PI * 2 );
		//ctx.arc( this.x, this.y, this.r , 0, Math.PI * 2 );
 		ctx.closePath();
 		if( stroke ) ctx.stroke();
		else ctx.fill();
     	//ctx.scale( 1, 1 );
		//console.log( this.x, this.y, this.width, this.height );
	},
	renderHigh: function( ctx, stroke ) 
	{
     	//ctx.scale( this.w/this.h, this.h );
		ctx.beginPath();
		ctx.fillStyle = this.colorHigh;
		ctx.strokeStyle = this.colorHigh;
		ctx.ellipse( this.x, this.y, this.w2-0.5, this.h2-0.5, 0, 0, Math.PI * 2 );
		//ctx.arc( this.x, this.y, this.r , 0, Math.PI * 2 );
 		ctx.closePath();
 		if( stroke ) ctx.stroke();
		else ctx.fill();
     	//ctx.scale( 1, 1 );
		//console.log( this.x, this.y, this.w, this.h );
	}
};


function led3( color, x, y, w, h )
{
	this.colorErase = 'black';
	this.colorLow = 'black';
	this.colorHigh = 'black';
	this.x = x + w / 2;
	this.y = y + h / 2;
	this.w = w;
	this.h = h;
	this.r = Math.min( w, h ) / 2;
	
	this.points = [
					/*{ x, y, dx, dy }*/
					[this.x, this.y - this.r, 0, -1 ],
					[this.x - this.r, this.y + this.r, -1, 1 ],
					[this.x + this.r, this.y + this.r,  1, 1 ]
					];
}
 
led3.prototype = {
	unrender: function(ctx)
	{
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
		/* /
		ctx.arc( this.x, this.y, this.r + 1, 0, Math.PI * 2 );
		/* */
		var pt = this.points[ 0 ];
		ctx.moveTo( pt[0] + pt[2], pt[1] + pt[3] );
		for( var i = 1; i < this.points.length; i++ ) {
			pt = this.points[ i ];
			ctx.lineTo( pt[0] + pt[2], pt[1] + pt[3] );
		}
 		ctx.closePath();
 		ctx.fill();
		ctx.globalCompositeOperation = 'source-over';
	},
	render: function( ctx, stroke ) 
	{
		/* /
		ctx.arc( this.x, this.y, this.r , 0, Math.PI * 2 );
		/* */
		var pt = this.points[ 0 ];
		if( stroke ) {
			ctx.strokeStyle = this.colorLow;
			ctx.beginPath();
			ctx.moveTo(  pt[0] - pt[2]/2, pt[1] - pt[3]/2 );
			for( var i = 1; i < this.points.length; i++ ) {
				pt = this.points[ i ];
				ctx.lineTo( pt[0] - pt[2]/2, pt[1] - pt[3] /2);
			}
	 		ctx.closePath();
	 		ctx.stroke();
		}
		else {
			ctx.fillStyle = this.colorLow;
			ctx.beginPath();
			ctx.moveTo(  pt[0], pt[1] );
			for( var i = 1; i < this.points.length; i++ ) {
				pt = this.points[ i ];
				ctx.lineTo( pt[0], pt[1] );
			}
	 		ctx.closePath();
	 		ctx.fill();
	 	}
		//console.log( this.x, this.y, this.width, this.height );
	},
	renderHigh: function( ctx, stroke ) 
	{
		var pt = this.points[ 0 ];
		if( stroke ) {
			ctx.strokeStyle = this.colorHigh;
			ctx.beginPath();
			ctx.moveTo(  pt[0] - pt[2]/2, pt[1] - pt[3]/2 );
			for( var i = 1; i < this.points.length; i++ ) {
				pt = this.points[ i ];
				ctx.lineTo( pt[0] - pt[2]/2, pt[1] - pt[3]/2 );
			}
	 		ctx.closePath();
	 		ctx.stroke();
		}
		else {
			ctx.fillStyle = this.colorHigh;
			ctx.beginPath();
			ctx.moveTo(  pt[0], pt[1] );
			for( var i = 1; i < this.points.length; i++ ) {
				pt = this.points[ i ];
				ctx.lineTo( pt[0], pt[1] );
			}
	 		ctx.closePath();
	 		ctx.fill();
	 	}
	 	
		/* /
		ctx.beginPath();
		ctx.fillStyle = this.colorHigh;
		ctx.strokeStyle = this.colorHigh;
		ctx.arc( this.x, this.y, this.r , 0, Math.PI * 2 );
		var pt = this.points[ 0 ];
		ctx.moveTo( pt[0], pt[1] );
		for( var i = 1; i < this.points.length; i++ ) {
			pt = this.points[ i ];
			ctx.lineTo( pt[0], pt[1] );
		}
 		ctx.closePath();
 		if( stroke ) ctx.stroke();
		else ctx.fill();
		//console.log( this.x, this.y, this.w, this.h );
		/*  */
	}
};
