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
		}
	});

	//select swatch
	$('.swatch').mousedown(function()
	{
		$('.swatch').removeClass("selected");
		$(this).addClass("selected");

		$('#picker').colpickSetColor(rgb2hex( $(this).css('background-color')));

		$.cookie('selected', $(this).attr('id'), { expires: 365*10 });
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

		$('#picker').colpickSetColor(rgb2hex( $('.selected').css('background-color')));
	}
	else
	{
		$('#picker').colpickSetColor("FFFFFF");
	}
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
	var r = rgb.r/255;
	var g = rgb.g/255;
	var b = rgb.b/255;

	var kd;
	var wd;
	var cd;
	var md;
	var yd;

	if (r == 0 && g==0 && b==0)
	{
		kd = 1;
		wd = cd = md = yd = 0;
	}
	else
	{
		var k = 1 - Math.max(r, g, b);
		var w = Math.min(r, g, b);

		var c = (1-r-k)/(1-k);
		var m = (1-g-k)/(1-k);
		var y = (1-b-k)/(1-k);

		var kn = k / (k + w + c + m + y);
		var wn = w / (k + w + c + m + y);
		var cn = c / (k + w + c + m + y);
		var mn = m / (k + w + c + m + y);
		var yn = y / (k + w + c + m + y);

		var kv = kn / Math.max(k, w, c, m, y);
		var wv = wn / Math.max(k, w, c, m, y);
		var cv = cn / Math.max(k, w, c, m, y);
		var mv = mn / Math.max(k, w, c, m, y);
		var yv = yn / Math.max(k, w, c, m, y);

		kd = Math.pow(kv, 1/3);
		wd = Math.pow(wv, 1/3);
		cd = Math.pow(cv, 1/3);
		md = Math.pow(mv, 1/3);
		yd = Math.pow(yv, 1/3);
	}

	resizePaint($('#black'), kd);
	resizePaint($('#white'), wd);
	resizePaint($('#cyan'), cd);
	resizePaint($('#magenta'), md);
	resizePaint($('#yellow'), yd);
}

function resizePaint(colour, size)
{
	colour.css('width', size*120);//magic number on size
	colour.css('height', size*120);
	colour.css('margin-top', (1-size)*60);
	colour.css('margin-bottom', (1-size)*60);
}