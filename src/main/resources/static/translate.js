
function translate( defaultLang, sourceFile )
{
	this.sourceFile = sourceFile || 'translations.json';
	this.defaultLang = defaultLang || 'en-us';
	this.currentLang = 'en-us';
	this.stringList = {};
	this.stats = {};
	this.loaded = false;
	this.promoElement = null;
	
	this._promoTimeout = null;
	
	this.createPromotionElement();
	this.loadJson();
}

translate.prototype =
{
	createPromotionElement: function()
	{
		this.promoElement = document.createElement('DIV');
		this.promoElement.id = 'translate-promo';
		this.promoElement.innerText = '';
		this.promoElement.style.position = 'fixed';
		this.promoElement.style.top = '10px';
		this.promoElement.style.left = '0';
		this.promoElement.style.right = '0';
		this.promoElement.style.textAlign = 'center';
		this.promoElement.style.background = 'black';
		this.promoElement.style.color = 'white';
		this.promoElement.style.padding = '10px';
		this.promoElement.style.borderTop = '1px solid white';
		this.promoElement.style.borderBottom = '1px solid white';
		this.promoElement.style.fontFamily = 'sans-serif';
		document.body.appendChild( this.promoElement );
		
		var self = this;
		var cb = function(el) {
			self.promoElement.appendChild( el );
		}
		this.getPromoAsElement().then( cb, cb );
	},
	
	loadJson: function()
	{
		var self = this;
		this.stringList = {};
		this.loaded = false;
		this._loadFile( this.sourceFile, function( data ) {
			try {
				data = JSON.parse( data );
				if( data.localization && data.stats ) {
					self.stringList = data.localization;
					self.stats = data.stats;
				}
				else {
					alert( "Failed to load translations.json ");
				}
				self.loaded = true;
			}
			catch( ex ) {
				alert( "Failed to load translation file '"+self.sourceFile+"' : " + ex)
			}
		});
	},
	_loadFile: function(path/*String*/, callback)
	{
	    var request = new XMLHttpRequest();
	    request.open("GET", path, true);
	    request.onload = function(){
		     switch(request.status){
		        case 200:
		        case 0:
		            callback(request.response);
		            break;
		        default:
		            appendLog("Failed to load (" + request.status + ") : " + path);
		            break;
	        }
	    }
	    request.send(null);
	    //return request;
	},
	isReady: function( cb )
	{
		var self = this;
		return new Promise( function( resolve, reject ) {
			var wait = function()
			{
				if( self.loaded ) {
					resolve();
					return;
				}
				setTimeout( wait, 100 );
			}
			wait();
		}).then( cb );				
	},
	setLanguage: function( lang )
	{
		if( lang != this.currentLang ) {
			this.currentLang = lang;
			// update all existing string
			
			var elems = document.getElementsByClassName( 'translation-string' );
			for( var i in elems ) {
				if( !elems.hasOwnProperty( i ) ) 
					continue;
					
				try {
					(function(self,i) {
						var el = elems[ i ];
						var k = el.dataset.tskey;
						self.getString( k ).then( function( str ) {	
							el.innerHTML = str;
						},function( str ) {	
							el.innerHTML = str;
						});
					})(this, i);
				}
				catch( ex ) {}
			}
			var elems = document.getElementsByClassName( 'promo-string' );
			for( var i in elems ) {
				if( !elems.hasOwnProperty( i ) ) 
					continue;
					
				try {
					(function(self,i) {
						var el = elems[ i ];
						
						var cbPromo = function( [str, missing] ) {	
							el.innerHTML = str;
							if( missing ) self.showPromo();
							else self.hidePromo();
						}
						
						self.getPromo().then( cbPromo, cbPromo );
					})(this, i);
				}
				catch( ex ) {}
			}
		}
		
	},
	applyGeneralProperties: function( p ) 
	{
		if( typeof p.language !== 'undefined' ) {
			this.setLanguage( p.language ); 
		}
	},
	getKeyForString: function( str )
	{
		for( var lang in this.stringList ) {
			var stringList = this.stringList[lang];
			for( var k in stringList ) {
				if( stringList[ k ] == str ) {
					return k;
				}
			}
		}
		return false;
	},
	getPromo: function(  ) 
	{
		var self = this;
		return new Promise( function( resolve, reject ) {
			self.isReady( function(){
				var result = '';
				var langArray = {};
				
				var translatedPerc;
				var missingCount;
				
				if( typeof self.stats[ self.currentLang ] !== 'undefined' ) {
					langArray = self.stats[ self.currentLang ];
					if( typeof langArray[ 'translated_perc' ] !== 'undefined' 
					 && typeof langArray[ 'missing_count' ] !== 'undefined' ) {
					 	translatedPerc = langArray[ 'translated_perc' ];
					 	missingCount = langArray[ 'missing_count' ];
					}
				} 
				
				if( typeof missingCount === 'undefined' ) 
					reject( ['[no translation found for: ' + self.currentLang + ']', 1] );
				
				if( typeof self.stats[ self.currentLang ] !== 'undefined' ) {
					langArray = self.stats[ self.currentLang ];
					if( typeof langArray[ 'help_text' ] !== 'undefined' 
					 && langArray[ 'help_text' ].length > 1 ) {
					 	var str = langArray[ 'help_text' ];
					 	str = str.replace( '<%>', '' + translatedPerc + '%').replace( '<#>', '' + missingCount + '');
						resolve( [str, missingCount] );
						return;
					}
				} 
				
				if( typeof self.stats[ self.defaultLang ] !== 'undefined' ) {
					langArray = self.stats[ self.defaultLang ];
					if( typeof langArray[ 'help_text' ] !== 'undefined' 
					 && langArray[ 'help_text' ].length > 1  ) {
					 	var str = langArray[ 'help_text' ];
					 	str = str.replace( '<%>', '' + translatedPerc + '%').replace( '<#>', '' + missingCount + '');
						resolve( [str, missingCount]  );
						return;
					}
				}
				
				// nothing found
				reject( ['[no translation found for: ' + self.currentLang + ']', 1] );
				return;
			});
		});
	},
	getPromoAsElement: function( ) 
	{
		var self = this;
		function wrapResult( str )
		{
			var el = document.createElement('span');
			el.className = 'promo-string';
			el.innerHTML = str;
			return el;
		}
		
		return new Promise( function( resolve, reject ) {
			self.isReady( function(){
				var result = '';
				var langArray = {};
				
				var cbPromo = function( [txt, missing] ) 
				{
					if( missing ) self.showPromo();
					else self.hidePromo();
						
					resolve( wrapResult( txt ) );
					
				}
				self.getPromo().then( cbPromo, cbPromo ) 
				
				// nothing found
				//return reject( str );
				
			});
		});
		
	},
	getStringAsElement: function( key ) 
	{
		var self = this;
		function wrapResult( str, tskey )
		{
			var el = document.createElement('span');
			el.className = 'translation-string';
			el.dataset.tskey = tskey;
			el.innerHTML = str;
			return el;
		}
		
		return new Promise( function( resolve, reject ) {
			self.isReady( function(){
				var result = '';
				var langArray = {};
				
				
				if( typeof self.stringList[ self.currentLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.currentLang ];
					if( typeof langArray[ key ] !== 'undefined' ) {
						resolve( wrapResult( langArray[ key ], key ) );
						return ;
					}
				}
				
				
				if( typeof self.stringList[ self.defaultLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.defaultLang ];
					if( typeof langArray[ key ] !== 'undefined' ) {
						resolve( wrapResult( langArray[ key ], key ) );
						return ;
					}
				}
				
				// nothing found for key, maybe user submitted a text string
				// get key for string, then retry				
				var key2 = self.getKeyForString( key );
				// no key found, then nothing left to do
				if( key2 === false ) {
					reject( wrapResult( '[no translation found for: ' + key + ']', key2 ) );
					return;
				}
				
				if( typeof self.stringList[ self.currentLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.currentLang ];
					if( typeof langArray[ key2 ] !== 'undefined' ) {
						resolve( wrapResult( langArray[ key2 ], key2 ) );
						return ;
					}
				}
				
				
				if( typeof self.stringList[ self.defaultLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.defaultLang ];
					if( typeof langArray[ key2 ] !== 'undefined' ) {
						resolve( wrapResult( langArray[ key2 ], key2 ) );
						return ;
					}
				}
				// nothing found
				reject( wrapResult( '[no translation found for: ' + key + ']', key2 ) );
				//return reject( str );
				
			});
		});
		
	},
	getString: function( key ) 
	{
		var self = this;
		return new Promise( function( resolve, reject ) {
			self.isReady( function(){
				var result = '';
				var langArray = {};
				
				if( typeof self.stringList[ self.currentLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.currentLang ];
					if( typeof langArray[ key ] !== 'undefined' ) {
						resolve( langArray[ key ] );
						return;
					}
				}
				
				
				if( typeof self.stringList[ self.defaultLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.defaultLang ];
					if( typeof langArray[ key ] !== 'undefined' ) {
						resolve( langArray[ key ] );
						return;
					}
				}
				
				// nothing found for key, maybe user submitted a text string
				// get key for string, then retry				
				var key2 = self.getKeyForString( key );
				// no key found, then nothing left to do
				if( key2 === false ) {
					reject( '[no translation found for: ' + key + ']' );
					return;
				}
				
				if( typeof self.stringList[ self.currentLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.currentLang ];
					if( typeof langArray[ key2 ] !== 'undefined' ) {
						resolve( langArray[ key2 ] );
						return;
					}
				}
				
				
				if( typeof self.stringList[ self.defaultLang ] !== 'undefined' ) {
					langArray = self.stringList[ self.defaultLang ];
					if( typeof langArray[ key2 ] !== 'undefined' ) {
						resolve( langArray[ key2 ] );
						return;
					}
				}
				// nothing found
				reject( '[no translation found for: ' + key + ']' );
				return;
			});
		});
	},
	showPromo: function()
	{
		if( this._promoTimeout ) clearTimeout( this._promoTimeout );
		this._promoTimeout = null;
		this.promoElement.style.display = 'block';
		
		var self = this;
		this._promoTimeout = setTimeout( function() { self.hidePromo(); }, 5000 );
		
	},
	hidePromo: function()
	{
		if( this._promoTimeout ) clearTimeout( this._promoTimeout );
		this._promoTimeout = null;
		
		this.promoElement.style.display = 'none';
		
	}
}