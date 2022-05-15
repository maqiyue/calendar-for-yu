"use strict";

/*
	Squee Powered!
*/

function AudioHistory(  )
{
	this.empty = new Array( 128 );
	for( var i = 0; i < 128; i++ ) this.empty[ i ] = 0;
	
	this.history = [];
	this.suggestedDelay = 10;
}

AudioHistory.prototype = 
{
	getDebugText: function()
	{
		return 'history: ' + this.history.length + ' / suggested delay: ' + this.suggestedDelay.toFixed(1) + 'ms';
	},
	append: function( timestamp, audioData )
	{
		var ad = audioData.slice( 0 );
		//var ad = new AudioData();
		//ad.copyFrom( audioData );
		
		this.history.push({ 'time': timestamp, 'data': ad });
		if( this.history.length > 2 ) {
			var td = 1 + this.history[this.history.length-1].time - this.history[this.history.length-2].time;
			if( td > 200 ) td = 200;
			if( td > this.suggestedDelay  ) {
				this.suggestedDelay = td;
			}
			else {
				this.suggestedDelay-=1;
			}
		}
		this.clean( timestamp - 2000 );
	},
	clean: function( timestamp )
	{
		while( this.history.length > 0 )
		{
			var time = this.history[0].time;
			if( time < timestamp ) {
				this.history.shift();
			}
			else {
				break;
			}
		}
	},
	getForTime: function( timestamp )
	{
		var l = this.history.length;
		if( l == 0 ) return this.empty.slice( 0 );
		if( l == 1 || timestamp <= this.history[ 0 ].time ) return this.history[ 0 ].data.slice(0);
		
		if( timestamp >= this.history[ l-1 ].time ) return this.history[ l-1 ].data.slice(0);
		
		for( var i = 0; i < l-1; i++ )	
		{
			if( timestamp >= this.history[i].time && timestamp < this.history[i+1].time  )
			{
				var t1 = this.history[i].time;
				var t2 = this.history[i+1].time;
				var d1 = this.history[i].data;
				var d2 = this.history[i+1].data;
				
				var p = ( timestamp - t1 ) / ( t2 - t1 );
			  	var mu2 = (1-Math.cos(p*Math.PI))/2;
			  	
			    //return(v1*(1-mu2)+v2*mu2);
				
				var res = d1.slice( 0 );
				for( var i = 0; i < res.length; i++ ) res[ i ] *= 1-mu2;
				//res.copyFrom( d1 );
				//res.multiply( 1-mu2 );
						
				var res2 = d2.slice( 0 );
				for( var i = 0; i < res2.length; i++ ) res2[ i ] *= mu2;
				//res2.copyFrom( d2 );
				//res2.multiply( mu2 );
				
				//res.add( res2 );
				for( var i = 0; i < res.length; i++ ) res[ i ] += res2[i];
				
				return res;
			}
		}
	}
	
};
