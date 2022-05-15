function change_banner_width(animation_delay, animation_duration){
	var text_size = document.getElementsByClassName('inner_banner')[0].firstElementChild.innerHTML.length;
	var textWidth = text_size*25/18.5;
	var endWidth = textWidth+animation_delay;
	document.getElementsByClassName('inner_banner')[0].firstElementChild.style.width = ''+endWidth*100/0.75+'%';
	document.getElementsByClassName('inner_banner')[1].firstElementChild.style.width = ''+endWidth*100/12.3+'%';
	document.getElementsByClassName('inner_banner')[2].firstElementChild.style.width = ''+endWidth*100/2.35+'%';
	document.getElementsByClassName('inner_banner')[0].firstElementChild.animate([{transform: 'translateX('+15.4*100/endWidth+'%)'}, {transform: 'translateX(-100%)'}], {duration: animation_duration, iterations: Infinity});
	document.getElementsByClassName('inner_banner')[1].firstElementChild.animate([{transform: 'translateX('+14.65*100/endWidth+'%)'}, {transform: 'translateX('+(endWidth+0.75)*-100/endWidth+'%)'}], {duration: animation_duration, iterations: Infinity});
	document.getElementsByClassName('inner_banner')[2].firstElementChild.animate([{transform: 'translateX('+2.35*100/endWidth+'%)'}, {transform: 'translateX('+(endWidth+13.05)*-100/endWidth+'%)'}], {duration: animation_duration, iterations: Infinity});
}

function BannerSettingsProxy (){
    var animation_duration = 10000;
    var animation_delay = 0.0;

	this.applyUserProperties = function ( p ){
		var bannerElement = document.getElementById('banner');
		if (p.ui_banner_offsetx)
			bannerElement.style.left = ""+p.ui_banner_offsetx.value+"%";
		if (p.ui_banner_offsety)
			bannerElement.style.top = ""+p.ui_banner_offsety.value+"%";
		if (p.ui_banner_text_color){
			var color = p.ui_banner_text_color.value.split(' ');
            color = color.map(function(c) {
                return Math.ceil(c * 255);
            });
            var elements = document.querySelectorAll('#banner div');
            for (var i = 0;i<elements.length;++i){
                elements[i].style.setProperty('--text-color', 'rgb('+color+')');
                elements[i].style.setProperty('--display-pixels', 'rgba('+color+',0.2)');
            }
        }
        if (p.ui_banner_scale){
            bannerElement.style.transform = 'scale('+p.ui_banner_scale.value/100+')';
        }
        if (p.ui_banner_animation_duration){
            animation_duration = p.ui_banner_animation_duration.value*1000;
        }
        if (p.ui_banner_animation_delay){
            animation_delay = p.ui_banner_animation_delay.value*1;
        }
        if (p.ui_banner_text){
            var text = p.ui_banner_text.value;
            document.getElementsByClassName('inner_banner')[0].firstElementChild.innerHTML = text;
            document.getElementsByClassName('inner_banner')[1].firstElementChild.innerHTML = text;
            document.getElementsByClassName('inner_banner')[2].firstElementChild.innerHTML = text;
        }
        if (p.ui_banner_visibility){
            bannerElement.style.display = (p.ui_banner_visibility.value)? 'inline':'none';
        }
        if (p.ui_banner_text_size){
            var elements = document.querySelectorAll('#banner div span');
            for (var i = 0;i<elements.length;++i){
                elements[i].style.fontSize = ''+p.ui_banner_text_size.value+'rem';
            }
        }
        if (p.ui_banner_text_top_padding){
            var elements = document.querySelectorAll('#banner div span');
            for (var i = 0;i<elements.length;++i){
                elements[i].style.marginTop = ''+p.ui_banner_text_top_padding.value+'rem';
            }
        }
        change_banner_width(animation_delay, animation_duration);

       
	}
}