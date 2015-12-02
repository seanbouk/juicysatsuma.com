var mean;
var sd;

var best;
var likely;
var worst;

$(document).ready(function()
{
	load();
	update();

	$('.decrement').click(function()
	{
		var target = $("#" + $(this).data("target"));
		target.val() >= 1 ? target.val(target.val()-1) : target.val(0);

		update();
	});

	$('.increment').click(function()
	{
		var target = $("#" + $(this).data("target"));
		target.val(target.val()-(-1));//beautiful filth

		update();
	});

	$('.estimate').on('input', function() {
		update();
	});

	$("#confidence").on('input', function()
	{
		update();
	});

	(function ( $ ) {
	    var filters = $.expr[":"];
	    if ( !filters.focus ) { 
	        filters.focus = function( elem ) {
	           return elem === document.activeElement && ( elem.type || elem.href );
	        };
	    }
	})( jQuery );
});

function update()
{
	cleanNumericalField($("#best"));
	cleanNumericalField($("#likely"));
	cleanNumericalField($("#worst"));

	save();

	$(".confidence").html( (Number($("#confidence").val()) * 100).toFixed(0) );

	calculateMeanAndsd();
	findX();
}

function save()
{
	$.cookie("costingsBest", Number($("#best").val()), { expires: 365*10 });
	$.cookie("costingsLikely", Number($("#likely").val()), { expires: 365*10 });
	$.cookie("costingsWorst", Number($("#worst").val()), { expires: 365*10 });

	$.cookie("costingsConfidence", Number($("#confidence").val()), { expires: 365*10 });
}

function load()
{
	alert
	if($.cookie("costingsBest")) $("#best").val($.cookie("costingsBest"));
	if($.cookie("costingsLikely")) $("#likely").val($.cookie("costingsLikely"));
	if($.cookie("costingsWorst")) $("#worst").val($.cookie("costingsWorst"));

	if($.cookie("costingsConfidence")) $("#confidence").val($.cookie("costingsConfidence"));
}

function cleanNumericalField(targetField)
{
	var caret = targetField.caret();

	//digits dots and dashes only
	targetField.val(targetField.val().replace(/([^0-9\-\.])/g, ""));

	//no dashes after the first character
	targetField.val(targetField.val().replace(/(?!^)-/g, ""));

	//only one dot (no lookbehind in js)
	var dotsArray = targetField.val().split(".");
	if(dotsArray.length > 1)
	{
		dotsArray[0] += ".";
		targetField.val(dotsArray.join(""));
	}

	//dot at the beginning gets a zero in front
	targetField.val(targetField.val().replace(/^\./g, "0."));

	//no zeroes before a number, only one before a dot
	targetField.val(targetField.val().replace(/^0+(?=\d)/g, ""));//+ve
	targetField.val(targetField.val().replace(/^-0+(?=\d)/g, "-"));//-ve

	//leading -.
	targetField.val(targetField.val().replace("-.", "-0."));

	if(targetField.is(":focus")) targetField.caret(caret);

}

function hasFocus(elem) 
{
  return elem === document.activeElement && (elem.type || elem.href);
}

function calculateMeanAndsd()
{
	best = Number($("#best").val());
	likely = Number($("#likely").val());
	worst = Number($("#worst").val());

	mean = (best + likely + worst) / 3;

	sd = Math.sqrt(( Math.pow(best - mean, 2) + Math.pow(likely - mean, 2) + Math.pow(worst - mean, 2))/(3-1));
}

function findX()
{
	var target = Number($("#confidence").val());

	var min = 0.0;
	var max = 3 * worst;//2*worst reliiably gives you up to about 99% chance. 3*worst covers you.

	var test;
	var mid;
	for(var i=0; i<20; i++)
	{
		mid = (min+max)/2;
		test = foldedNormalCDF(mid, mean, sd);
		test < target ? min = mid : max = mid;
	}

	$(".result").html(min.toPrecision(3));
}

function foldedNormalCDF(n, mean, sd)
{
	return normalCDF(n, mean, sd) - normalCDF(-n, mean, sd);
}

function normalCDF(n, mean, sd)
{
	var probability = -1;

	if(sd < 0) 
	{
		alert("The standard deviation must be nonnegative.")
	} 
	else if(sd == 0) 
	{
	    n < mean ? probability = 0 : probability = 1;
	} 
	else 
	{
		var x = (n-mean)/sd;
		var t = 1 / (1 + 0.2316419 * Math.abs(x));
		var d = 0.3989423 * Math.exp(-x*x/2);
		probability = d * t * (0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
		if(x > 0) probability = 1 - probability;
	}

    return probability;
} 