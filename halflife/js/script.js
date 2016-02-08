var n0;
var nT;
var t;
var halflife;
var n1;
var tN;
var nTN;
var nN;
var tNN;

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

function hasTouchKeyboard() 
{
  try{ document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
}

function update()
{
	if(!hasTouchKeyboard())
	{
		cleanNumericalField($("#N0"));
		cleanNumericalField($("#NT"));
		cleanNumericalField($("#T"));
		cleanNumericalField($("#NN"));
		cleanNumericalField($("#TN"));
	}

	save();

	calculateHalfLife();
	calculateNAtNewTime();
	calculateTimeForNewValue();
}

function save()
{
	$.cookie("halfLifeN0", Number($("#N0").val()), { expires: 365*10 });
	$.cookie("halfLifeNT", Number($("#NT").val()), { expires: 365*10 });
	$.cookie("halfLifeT", Number($("#T").val()), { expires: 365*10 });
	$.cookie("halfLifeNN", Number($("#NN").val()), { expires: 365*10 });
	$.cookie("halfLifeTN", Number($("#TN").val()), { expires: 365*10 });
}

function load()
{
	if($.cookie("halfLifeN0")) $("#N0").val($.cookie("halfLifeN0"));
	if($.cookie("halfLifeNT")) $("#NT").val($.cookie("halfLifeNT"));
	if($.cookie("halfLifeT")) $("#T").val($.cookie("halfLifeT"));
	if($.cookie("halfLifeNN")) $("#NN").val($.cookie("halfLifeNN"));
	if($.cookie("halfLifeTN")) $("#TN").val($.cookie("halfLifeTN"));
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

function calculateHalfLife()
{
	n0 = Number($("#N0").val());
	nT = Number($("#NT").val());
	t = Number($("#T").val());

	halflife = (t * Math.log(2)) / Math.log(n0/nT);
	$("#halfLife").html(halflife.toPrecision(3));
}

function calculateNAtNewTime()
{
	tN = Number($("#TN").val());

	nTN = n0 / Math.pow(2, tN/halflife);
	$("#NTN").html(nTN.toPrecision(3));
}

function calculateTimeForNewValue()
{
	nN = Number($("#NN").val());

	tNN = halflife * Math.log(n0/nN)/Math.log(2);
	$("#TNN").html(tNN.toPrecision(3));
}