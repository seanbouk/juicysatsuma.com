$(document).ready(function()
{
	//color picker shit
	$('#picker').colpick(
	{
		flat:true,
		layout:'hex',
		submit:0,
		onChange:function(hsb,hex,rgb,el,bySetColor) 
		{
			if(!bySetColor) $('.selected').css('background-color', hex);

			updatePaint(rgb);

			$.cookie($('.selected').attr('id'), hex, { expires: 365*10 });

			ga('send', 'event', 'colpick', 'onchange', 'bySetColor is ' + bySetColor, hex);
		}
	});

	//select swatch
	$('.swatch').click(function()
	{
		$('.swatch').removeClass("selected");
		$(this).addClass("selected");

		$('#picker').colpickSetColor(rgb2hex( $(this).css('background-color')));

		$.cookie('selected', $(this).attr('id'), { expires: 365*10 });

		ga('send', 'event', 'swatch', 'click', 'colour changed', rgb2hex( $(this).css('background-color')));
	});

	//load cookies
	for(var i=0; i<$('.palette').children().length; i++)
	{
		if($.cookie('swatch'+i)) $('#swatch'+i).css( 'background-color', $.cookie('swatch'+i) );
	}

	if($.cookie('selected'))
	{
		$('.swatch').removeClass("selected");
		$('#' + $.cookie('selected')).addClass("selected");
	}
	$('#picker').colpickSetColor(rgb2hex( $('.selected').css('background-color')));
});

var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

function rgb2hex(rgb) 
{
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) 
{
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function updatePaint(rgb)
{	
	//normalise r, g, b
	var r = rgb.r/255;
	var g = rgb.g/255;
	var b = rgb.b/255;

	//convert to cmyk
	var k = 1 - Math.max(r, g, b);
	var w = Math.min(r, g, b);

	var c = (1-r-k);//each of these reduce proportionally to black's increase...
	var m = (1-g-k);
	var y = (1-b-k);//...w/ true cmyk, each would be /(1-k)

	//normalise (v for volume of paint)
	var kv = k / Math.max(k, w, c, m, y);
	var wv = w / Math.max(k, w, c, m, y);
	var cv = c / Math.max(k, w, c, m, y);
	var mv = m / Math.max(k, w, c, m, y);
	var yv = y / Math.max(k, w, c, m, y);

	//diameter of blobs
	var kd = Math.pow(kv, 1/3);
	var wd = Math.pow(wv, 1/3);
	var cd = Math.pow(cv, 1/3);
	var md = Math.pow(mv, 1/3);
	var yd = Math.pow(yv, 1/3);
	var totalVolume = kv + wv + cv + mv + yv;

	//update paint volumes
	$('#blackVolume').html(Math.floor(kv/totalVolume*100) + "%");
	$('#whiteVolume').html(Math.floor(wv/totalVolume*100) + "%");
	$('#cyanVolume').html(Math.floor(cv/totalVolume*100) + "%");
	$('#magentaVolume').html(Math.floor(mv/totalVolume*100) + "%");
	$('#yellowVolume').html(Math.floor(yv/totalVolume*100) + "%");

	//resize paint plobs
	resizePaint($('.black.blob'), kd);
	resizePaint($('.white.blob'), wd);
	resizePaint($('.cyan.blob'), cd);
	resizePaint($('.magenta.blob'), md);
	resizePaint($('.yellow.blob'), yd);

	//resize paint cylinders
	$('.cyan.cylinder').css('width', (Math.round(cv*100/totalVolume) + "%"));
	$('.magenta.cylinder').css('width', (Math.round(mv*100/totalVolume) + "%"));
	$('.yellow.cylinder').css('width', (Math.round(yv*100/totalVolume) + "%"));
	$('.white.cylinder').css('width', (Math.round(wv*100/totalVolume) + "%"));
	$('.black.cylinder').css('width', (Math.round(kv*100/totalVolume) + "%"));
	
	//solves rounding errors in the above
	//removes the last cylinder used, and fills the space by changing the background colour
	if (kv > 0) 
	{
		$('.black.cylinder').css('width', "0%"	);
		$(".cylinderDemo").css('background-color', 'black')
	}
	else if (wv > 0) 
	{
		$('.white.cylinder').css('width', "0%"	);
		$(".cylinderDemo").css('background-color', 'white')
	}
	else if (yv > 0) 
	{
		$('.yellow.cylinder').css('width', "0%"	);
		$(".cylinderDemo").css('background-color', 'yellow')
	}
	else if (mv > 0) 
	{
		$('.magenta.cylinder').css('width', "0%"	);
		$(".cylinderDemo").css('background-color', 'magenta')
	}
	else
	{
		$('.cyan.cylinder').css('width', "0%"	);
		$(".cylinderDemo").css('background-color', 'cyan')
	}

}

function resizePaint(colour, size)
{
	colour.css('width', size*120);//magic number on size
	colour.css('height', size*120);
	colour.css('margin-top', (1-size)*60);
	colour.css('margin-bottom', (1-size)*60);
}