
function wallpaper( opts, onInit, onRender, onResize, onApplyGeneralProperties, onApplyUserProperties, onAudioData, onPause )
{
	this.log = typeof log !== 'undefined' ? log : null;
	this.timer = typeof timer !== 'undefined' ? timer : null;
	
	this.canvas = null;
	this.context = null;
	this.fpsLabel = null;
	
	this.noAudioDelay = null;
	
	this.settings = {
		hideFps: true,
		hideTimer: true,
		hideLog: true,
		targetFrameRate: 60, /* frames per second */
		estimateFrameRenderDuration: 2, /* in milliseconds */
		canvasScaling: 1
	};
	this.generalSettings = {};
	this.userSettings = {};
	this.audioData = [];
	this.audioDataPrevious = new Array( 128 );
	for( var i = 0; i < 128; i++)
	{
		this.audioDataPrevious[ i ] = 0;
	}
	
	if( typeof opts === 'object' ) {
		for( var i in opts )
		{
			if( opts.hasOwnProperty(i) && this.settings.hasOwnProperty(i) ) {
				this.settings[i] = opts[i];
			}
		}
	}

	this.frameIntervalCheck = 1000/this.settings.targetFrameRate;// - this.settings.estimateFrameRenderDuration;

	this.onInit = onInit;
	this.onRender = onRender;
	this.onResize = onResize;
	this.onPause = onPause;
	this.onApplyGeneralProperties = onApplyGeneralProperties;
	this.onApplyUserProperties = onApplyUserProperties;
	this.onAudioData = onAudioData;
	
	this.init();
	this.hideLog();
	this.gotSettings = false;
}

wallpaper.prototype = {
	init: function()
	{
		var self = this;
		
		this.createFpsLabel();
		
		if( this.settings.hideFps && this.fpsLabel ) {
			this.hideFps();
		}
		if( this.settings.hideTimer && this.timer ) {
			this.hideTimer();
		}
		if( this.settings.hideLog && this.log ) {
			this.hideLog();
		}

		this.canvas = document.getElementById('canvas');
		this.canvas.style.transformOrigin = '0 0';
		if( this.settings.canvasScaling != 1 ) {
			this.canvas.style.transform = 'scale(' + (this.settings.canvasScaling+0.01) +' )'; //adding a bit in case of rounding errors that cause white lines on edge
		}
		
		this.context = this.canvas.getContext('2d');
		//this.context.translate(0.5, 0.5);

		this.ticks = 0;
		this.lastFrame = performance.now();
		this.nextFrame = performance.now();
		this.fpsTimer = performance.now();
		
		//this.isPaused = false;
		//this.animationLoopTimeout = null;

		this.refreshAll();
		
		if( this.onInit ) {
			try {
				this.onInit( this );
			}
			catch( ex ) {
				console.error( ex.message );
				//if( this.log ) this.log.append( ex );
			}
		}
		
		this.noAudioDelay = new delayed( function() {
			console.error( 'Not receiving audio from Wallpaper Engine' );
		}, 10000 );

		var self = this;
		window.addEventListener('resize', function () { self.onWindowResize(); } );
		window.requestAnimationFrame( function() { self.animationLoop(); } );

		window.wallpaperPropertyListener = {
			applyUserProperties: function( properties ) {self.applyUserProperties( properties );},
			applyGeneralProperties: function( properties ) {self.applyGeneralProperties( properties );},
			setPaused: function(isPaused) { self.setPaused( isPaused ); }
		};
		
	    this.registerAudioListener();
	},
	registerAudioListener: function()
	{
		var self = this;
		if( window.wallpaperRegisterAudioListener ) {
			//console.log( 'registerAudioListener' );
			window.wallpaperRegisterAudioListener(function(data) { self.noAudioDelay.trigger(); self.onAudioDataReceived( data ); });
			this.noAudioDelay.trigger(); 
		}
		else {
			console.error( 'can\'t register audio listener' );
		}
	},
	createFpsLabel: function() 
	{
		var self = this;
		this.fpsLabel = document.createElement( 'div' );
	
		this.fpsLabel.style.position = 'fixed';
		this.fpsLabel.style.top = 0;
		this.fpsLabel.style.left= 0;
		this.fpsLabel.style.background = 'rgba( 0, 0, 0, 196 )';
		this.fpsLabel.style.color = 'white';
		this.fpsLabel.style.zIndex = '1000';
		this.fpsLabel.style.visibility = 'visible';
		
		var bodyCheckTimeout = function()
		{
			if( document.body && document.body.appendChild ) {
				document.body.appendChild( self.fpsLabel );
			}
			else {
				setTimeout( function(){ bodyCheckTimeout(); }, 100 );
			}
		};
		setTimeout( function(){ bodyCheckTimeout(); }, 100 );
		
	},
	setTargetFramerate: function( fps )
	{
		this.settings.targetFrameRate = fps;// - this.settings.estimateFrameRenderDuration;
		this.frameIntervalCheck = 1000/this.settings.targetFrameRate;// - this.settings.estimateFrameRenderDuration;
	},
	setPaused: function( isPaused )
	{
		this.isPaused = isPaused;
		if( this.onPause ) {
			try {
				this.onPause( this, isPaused );
			}
			catch( ex ) {
				console.error( ex.message );
			}
		}
		//console.error( 'setPaused: ' + ( isPaused ? 'true' : 'false' ) );
		/*if( isPaused )
		{
			// clear render loop timeout
			if( this.animationLoopTimeout ) {
				clearTimeout(this.animationLoopTimeout);
				this.animationLoopTimeout = null;
			}
		}
		else
		{
			// start render loop timeout
			if( !this.animationLoopTimeout ) {
				this.nextFrame = performance.now(); // set next frame to now, to avoid a burst of frame rendering
				this.animationLoop();
				//setTimeout( function() { self.animationLoop(); } ,this.nextFrame - now2 - 1  )
			}
		}*/
	},
	onWindowResize: function()
	{
		this.refreshAll();
		if( this.onResize ) {
			try {
				this.onResize( this );
			}
			catch( ex ) {
				console.error( ex.message );
			}
		}

	},
	onAudioDataReceived: function( data )
	{
		//console.log( data[1] +' '+ data[65] );
		for( var i = 0; i < data.length; i++ ) {
			if( isNaN(data[i]) || !isFinite( data[i]) ) {
				//if( this.log ) { 
				//	this.log.append( 'data['+i+']: ' + data[i] );
				//}
				data[i] = 0;
			}
			else {
				data[i] = Math.pow(data[i]+1,1)-1;
			}
		}
		
		this.audioData = data;
		data = this.processAudioData( data );
		if( this.onAudioData ) {
			try {
				this.onAudioData( this, data );
			}
			catch( ex ) {
				console.error( ex.message );
			}
		}
		this.hideLog();
	},
	processAudioData: function( data )
	{
		for( var i = 0; i < data.length; i++ )
		{
			this.audioDataPrevious[ i ] = this.audioDataPrevious[ i ] * 0.90 + data[ i ] * 0.1; 
			
			data[ i ] = Math.max( 0, data[ i ] - this.audioDataPrevious[ i ] * Math.min( 1, data[ i ] ) * 0.33 );
		}
		return data;		
		
	},
	applyGeneralProperties: function( properties )
	{
		//this.hideLog();
		for( var i in properties ) {
			if( properties.hasOwnProperty( i ) ) {
			//	this.generalSettings[i] = properties[i];
			}
		}
		if(  properties.fps ) {
			var val =  1*properties.fps;
			this.setTargetFramerate( val );
		}
		
		this.registerAudioListener();
		
		if( this.onApplyGeneralProperties ) {
			try {
				this.onApplyGeneralProperties( this, properties );
			} 
			catch( ex ) {
				console.error( ex.message );
			}
		}

	},
	applyUserProperties: function( properties )
	{
		//this.hideLog();
		for( var i in properties ) {
			if( properties.hasOwnProperty( i ) ) {
				//this.userSettings[i] = properties[i];
			}
		}
		
		this.registerAudioListener();
		this.gotSettings = true;
		
		if( this.onApplyUserProperties ) { 
			try {
				this.onApplyUserProperties( this, properties );
			}
			catch( ex ) {
				console.error( ex.message );
			}
		}

	},
	refreshAll: function()
	{
		this.width = this.canvas.width = window.innerWidth/this.settings.canvasScaling;
		this.height = this.canvas.height = window.innerHeight/this.settings.canvasScaling;
	},
	animationLoop: function()
	{ 
		var self = this;
		
		var now = performance.now();
		var timeStep = now - this.lastFrame; // time since last frame

		//window.requestAnimationFrame( function() { self.animationLoop(); } );
		if( !this.gotSettings || now < this.nextFrame ) { // skip frame until timeStep ( in milliseconds ) has passed
			this.animationLoopTimeout = setTimeout( function() { self.animationLoop(); } , this.nextFrame - now - 1 );
			return;
		}
		
		
		if( this.timer ) this.timer.start("wallpaper::animationLoop");
		this.lastFrame = now;
		this.nextFrame = Math.floor( now / this.frameIntervalCheck ) * this.frameIntervalCheck + this.frameIntervalCheck;
		//if( this.nextFrame < this.lastFrame ) {
			 // avoid next frame falling behind due to slow rendering and causing a burst of frames to be rendered
//			this.nextFrame = now + this.frameIntervalCheck;
		//}
		this.nextFrame--;
		this.ticks++;

		if( this.timer ) this.timer.start("wallpaper::onRender");
		if( this.onRender ) {
			try {
				this.onRender( this, timeStep, this.ticks );
			}
			catch( ex ) {
				console.error( ex.message );
			}
		}
		if( this.timer ) this.timer.stop("wallpaper::onRender");
		
		this.updateFps();
		
		var now2 = performance.now();
		this.renderTimeLastTime = now2-now; // time it took to render
		if( this.timer ) this.timer.stop("wallpaper::animationLoop");
		this.animationLoopTimeout = setTimeout( function() { self.animationLoop(); } ,this.nextFrame - now2 - 1  );

	},
	updateFps: function()
	{
		if( !this.fpsLabel ) return;
		
		var now = performance.now();
		this.frames++;
		if( now - this.fpsTimer > 1000 ) {		
			var frames = this.frames;
			this.fpsLabel.innerHTML = frames + ' fps / ' + this.renderTimeLastTime + ' ms last frame / ' + this.ticks + ' ticks';
			this.fpsTimer = now;
			this.frames = 0;
		}
	},
	showFps: function() { this.fpsLabel.style.display = 'block'; },
	hideFps: function() { this.fpsLabel.style.display = 'none'; },
	showLog: function() { this.log.htmlElement.style.display = 'block'; },
	hideLog: function() { this.log.htmlElement.style.display = 'none'; },
	showTimer: function() { this.timer.htmlElement.style.display = 'block'; },
	hideTimer: function() { this.timer.htmlElement.style.display = 'none'; }
};

// fake audio data if needed
if( false && !window.wallpaperRegisterAudioListener ) {
	var _wallpaperAudioInterval = null;
    window.wallpaperRegisterAudioListener = function( callback ) {
		if( callback !== null ) {
			if( _wallpaperAudioInterval ) {
				clearInterval( _wallpaperAudioInterval );
				_wallpaperAudioInterval = null;
			}
			var cnt = 0;
			_wallpaperAudioInterval = setInterval( function() {
				cnt++;
				var data = [];
				for( var i = 0; i < 64; i++ ){
					var v = 1 + Math.sin( ( i * 14 + cnt*1 )* Math.PI / 180 ) ; // limit range but still allow it to go above 1 to test clamping
					data[i] = v;
					data[i+64]= v;
				}
				callback( data );
			}, 33 );
		}
	};
}

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function loadProjectJson()
{
	loadJSON( './project.json', 
				function( data )
				{ 
					if( window.wallpaperPropertyListener && window.wallpaperPropertyListener.applyUserProperties )
					{
						window.wallpaperPropertyListener.applyUserProperties( data.general.properties );
					}
				},
				function(xhr){
					console.error( xhr );
				});
		
}

// load project settings
//loadProjectJson();



		

