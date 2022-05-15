var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var custom_hours = "2";
var custom_minutes = "00";
var custom_month = "April";
var custom_day = "16";
var custom_year = "2077";
var system_toggle = false;
//invokes functions as soon as window loads
window.onload = function(){
	time();
	ampm();
	date();
	setInterval(function(){
		time();
		ampm();
		date();
	}, 5000);
};


//gets current time and changes html to reflect it
function time(){
	if (system_toggle){
		var date = new Date(),
			hours = date.getHours(),
			minutes = date.getMinutes(),

		//make clock a 12 hour clock instead of 24 hour clock
		hours = (hours > 12) ? (hours - 12) : hours;
		hours = (hours === 0) ? 12 : hours;

		minutes = addZero(minutes);
		//changes the html to match results
		document.getElementsByClassName('hours')[0].innerHTML = hours;
		document.getElementsByClassName('minutes')[0].innerHTML = minutes;
	}
	else{
		document.getElementsByClassName('hours')[0].innerHTML = custom_hours;
		document.getElementsByClassName('minutes')[0].innerHTML = custom_minutes;
	}
}

//turns single digit numbers to two digit numbers by placing a zero in front
function addZero (val){
	return (val <= 9) ? ("0" + val) : val;
}

//lights up either am or pm on clock
function ampm(){
	var date = new Date(),
		hours_ampm = date.getHours(),
		am = document.getElementsByClassName("am")[0].classList,
		pm = document.getElementsByClassName("pm")[0].classList;
	
		
		(hours_ampm >= 12) ? pm.add("light-on") : am.add("light-on");
		(hours_ampm >= 12) ? am.remove("light-on") : pm.remove("light-on");
}
function date(){
	if (system_toggle){
		var date = new Date(),
			day = date.getDate(),
			month = date.getMonth(),
			year = date.getFullYear();
	
		document.getElementsByClassName("month")[0].innerHTML = months[month];
		document.getElementsByClassName("year")[0].innerHTML = year;
		document.getElementsByClassName("day")[0].innerHTML = day;
	}
	else{
		document.getElementsByClassName("month")[0].innerHTML = custom_month;
		document.getElementsByClassName("year")[0].innerHTML = custom_year;
		document.getElementsByClassName("day")[0].innerHTML = custom_day;
	}
}


function ClockSettingsProxy (){
	var perspective = 300;
	var x = 350;
	var y = 320;
	var z = 12;
	var scale = 0.9;

	this.applyUserProperties = function ( p ){
		var clockElement = document.getElementsByClassName('all')[0];
		if (p.ui_clock_offsety)
			clockElement.style.top = ""+p.ui_clock_offsety.value+"%";
		if (p.ui_clock_offsetx)
			clockElement.style.left = ""+p.ui_clock_offsetx.value+"%";
		if (p.ui_clock_transparency){
			clockElement.style.opacity = ""+p.ui_clock_transparency.value/100;
		}
		if (p.ui_clock_color){
			var color = p.ui_clock_color.value.split(' ');
            color = color.map(function(c) {
                return Math.ceil(c * 255);
            });
			document.getElementsByClassName('date')[0].style.color = "rgb("+color+')';
			document.getElementsByClassName('date')[0].style.textShadow = '3px 0px rgba('+color+',0.05), 0 0 2px rgba('+color+',0.05)';
			var light_onElements = document.getElementsByClassName('light-on');
			for (var i = 0;i<light_onElements.length;++i){
				light_onElements[i].style.color = "rgb("+color+')';
				light_onElements[i].style.textShadow = '4px 0px rgba('+color+',0.3), 0 0 10px rgba('+color+',1)';
			}
		}
		if (p.ui_clock_system_toggle)
			system_toggle = p.ui_clock_system_toggle.value;
		if (p.ui_clock_hours)
			custom_hours = p.ui_clock_hours.value;
		if (p.ui_clock_minutes)
			custom_minutes = p.ui_clock_minutes.value;
		if (p.ui_clock_year)
			custom_year = p.ui_clock_year.value;
		if (p.ui_clock_month)
			custom_month = p.ui_clock_month.value;
		if (p.ui_clock_day)
			custom_day = p.ui_clock_day.value;

		if (p.ui_clock_perspective)
			perspective = p.ui_clock_perspective.value;
		if (p.ui_clock_rotationx)
			x = p.ui_clock_rotationx.value;
		if (p.ui_clock_rotationy)
			y = p.ui_clock_rotationy.value;
		if (p.ui_clock_rotationz)
			z = p.ui_clock_rotationz.value;
		if (p.ui_clock_scale)
			scale = p.ui_clock_scale.value;

		clockElement.style.transform = 'perspective('+perspective+'px) rotateX('+x+'deg) rotateY('+y+'deg) rotateZ('+z+'deg) scale('+scale/100+')'

		// if (p.ui_clock_rotationx){
		// 	var transforms = clockElement.style.transform.split(/[()]+/);
		// 	clockElement.style.transform = 'perspective('+transforms[1]+') rotateX('+p.ui_clock_rotationx.value+'deg) rotateY('+transforms[5]+') rotateZ('+transforms[7]+') scale('+transforms[9]+')';
		// }
	}
}