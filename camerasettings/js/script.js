var ZOOM = "zoom";
var LIGHT = "light";

$(window).load(function()
{	
	

	$(".light").css("display", "none");

	$(".zoomTab").click(function()
	{
		setTab("block", "none");
		$.cookie('cameraSelectedTab', ZOOM, { expires: 365*10 });//TODO move this to save cookies
	});

	$(".lightTab").click(function()
	{
		setTab("none", "block");
		$.cookie('cameraSelectedTab', LIGHT, { expires: 365*10 });//TODO move this to save cookies

		//hacky. solves light tab items not scrolling when there are no cookies.
		setSelectedSetting($(".exposureValues"), $(".exposureValues > .selected").data("value"));
		setSelectedSetting($(".apertureValues"), $(".apertureValues > .selected").data("value"));
		setSelectedSetting($(".iSOValues"), $(".iSOValues > .selected").data("value"));
		setSelectedSetting($(".fStopValues"), $(".fStopValues > .selected").data("value"));


	});



	$(".zoomButton").click(function()
	{
		$($(this).data("target")).css("display", "block");
		setSelectedSetting( 
			$($(this).data("target") + " > .zoomSetting > .settingValues"), 
			$($(this).data("target")).find(".zoomSetting > .settingValues > .selected").data("value") 
		);
	});

	$(".modal").click(function()
	{
		$(this).css("display", "none");

		refreshZoomTab();
	}).children().click(function(e) 
	{
	  return false;
	});


	$(".settingValue").click(function()
	{
		if(!$(this).hasClass("notSelectable"))
		{
			setSelectedSetting($(this).parent(), $(this).data("value"));
		}

		saveCookies();

		refreshLightTab();//this gets called unnessesarily on zoom tab change
	});

	$(".settingButton").click(function()
	{
		toggleLock($(this));

		saveCookies();
		refreshInstructions();
	});


	loadCookies();
	refreshZoomTab();
	refreshInstructions();
	reviseSource();
});

function loadCookies()
{
	//TODO these need replacing with jquery each
	//TODO catch bollocks cookie data

	//tab
	if($.cookie('cameraSelectedTab'))
	{
		if($.cookie('cameraSelectedTab') == ZOOM)
		{
			setTab("block", "none");
		}
		else
		{
			setTab("none", "block");
		}
	}

	//zoom
	var focalLengthValue = $(".focalLengthValues > .selected").data("value");
	if($.cookie("cameraZoomFocalLength")) focalLengthValue = $.cookie("cameraZoomFocalLength");
	setSelectedSetting($(".focalLengthModal > .zoomSetting > .settingValues"), focalLengthValue);
	
	var cropValue = $(".cropValues > .selected").data("value");
	if($.cookie("cameraZoomCrop")) cropValue = $.cookie("cameraZoomCrop");
	setSelectedSetting($(".cropModal > .zoomSetting > .settingValues"), cropValue);

	var aspectRatioValue =  $(".aspectRatioValues > .selected").data("value");
	if($.cookie("cameraZoomAspectRatio")) aspectRatioValue = $.cookie("cameraZoomAspectRatio");
	setSelectedSetting($(".aspectRatioModal > .zoomSetting > .settingValues"), aspectRatioValue);

	//light
	var exposureValue = $(".exposureValues > .selected").data("value");
	if($.cookie("cameraLightExposure")) exposureValue = $.cookie("cameraLightExposure");
	setSelectedSetting($(".exposureValues"), exposureValue);

	var apertureValue = $(".apertureValues > .selected").data("value");
	if($.cookie("cameraLightAperture")) apertureValue = $.cookie("cameraLightAperture");
	setSelectedSetting($(".apertureValues"), apertureValue);

	var iSOValue = $(".iSOValues > .selected").data("value");
	if($.cookie("cameraLightISO")) iSOValue = $.cookie("cameraLightISO");
	setSelectedSetting($(".iSOValues"), iSOValue);

	var fStopValue = $(".fStopValues > .selected").data("value");
	if($.cookie("cameraLightFStop")) fStopValue = $.cookie("cameraLightFStop");
	setSelectedSetting($(".fStopValues"), fStopValue);

	//light locks
	if($.cookie("cameraLightExposureLock")) if($.cookie("cameraLightExposureLock") == "true") toggleLock($(".exposure > .settingButton"));
	if($.cookie("cameraLightApertureLock")) if($.cookie("cameraLightApertureLock") == "true") toggleLock($(".aperture > .settingButton"));
	if($.cookie("cameraLightISOLock")) if($.cookie("cameraLightISOLock") == "true") toggleLock($(".ISO > .settingButton"));
}

function saveCookies()
{
	$.cookie('cameraZoomFocalLength', $(".focalLengthValues > .selected").data("value"), { expires: 365*10 });
	$.cookie('cameraZoomCrop', $(".cropValues > .selected").data("value"), { expires: 365*10 });
	$.cookie('cameraZoomAspectRatio', $(".aspectRatioValues > .selected").data("value"), { expires: 365*10 });

	$.cookie('cameraLightExposure', $(".exposureValues > .selected").data("value"), { expires: 365*10 });
	$.cookie('cameraLightAperture', $(".apertureValues > .selected").data("value"), { expires: 365*10 });
	$.cookie('cameraLightISO', $(".iSOValues > .selected").data("value"), { expires: 365*10 });
	$.cookie('cameraLightFStop', $(".fStopValues > .selected").data("value"), { expires: 365*10 });

	$.cookie('cameraLightExposureLock', $(".exposure > .locked").length == 1, { expires: 365*10 });
	$.cookie('cameraLightApertureLock', $(".aperture > .locked").length == 1, { expires: 365*10 });
	$.cookie('cameraLightISOLock', $(".ISO > .locked").length == 1, { expires: 365*10 });
}

function setTab(zoom, light)
{
	$(".zoom").css("display", zoom);
	$(".light").css("display", light);

	//filthy filth
	if(zoom == "block") 
	{	
		$(".zoomTab").addClass("selected");
		$(".lightTab").removeClass("selected");
	}

	if(light == "block")
	{
		$(".lightTab").addClass("selected");
		$(".zoomTab").removeClass("selected");
	}
}

function setSelectedSetting(settingValues, value)
{

	settingValues.children().removeClass("prev");
	settingValues.children().removeClass("selected");
	settingValues.children().removeClass("next");

	var mySetting = settingValues.find("[data-value='" + value + "']");
	console.trace(value + ", " + mySetting.length);

	mySetting.prev().addClass("prev");
	mySetting.addClass("selected");
	mySetting.next().addClass("next");

	var scrollTo = mySetting.prev().offset().left + mySetting.parent().scrollLeft() - mySetting.parent().offset().left;
	//mySetting.parent().scrollLeft(scrollTo);
	mySetting.parent().animate({scrollLeft: scrollTo}, 50, "swing");
}

function refreshZoomTab()
{
	$(".zoomButton").each(function()
	{
		$(this).find(".valString").text( $($(this).data("target")).find(".zoomSetting > .settingValues > .selected").text() );
	});

	var eFL = $(".focalLengthValues > .selected").data("value") * $(".cropValues > .selected").data("value");
	var fOVDiag = 2 * Math.atan(Math.sqrt(36*36+24*24) / (2 * eFL)) * 180/Math.PI;

	//if vertical is 1, horizontal is the aspect ratio
	var ratioDiag = Math.sqrt( 1 + $(".aspectRatioValues > .selected").data("value") * $(".aspectRatioValues > .selected").data("value") );
	var fOVVert = fOVDiag / ratioDiag;
	var fOVHoriz = $(".aspectRatioValues > .selected").data("value") * fOVVert;

	$(".diagonalResult > #integer").text(Math.floor(fOVDiag));
	$(".diagonalResult > #decimal").text( fOVDiag.toString().substring(fOVDiag.toString().indexOf("."), fOVDiag.toString().indexOf(".")+4) );

	$(".verticalResult > #integer").text(Math.floor(fOVVert));
	$(".verticalResult > #decimal").text( fOVVert.toString().substring(fOVVert.toString().indexOf("."), fOVVert.toString().indexOf(".")+4) );

	$(".horizontalResult > #integer").text(Math.floor(fOVHoriz));
	$(".horizontalResult > #decimal").text( fOVHoriz.toString().substring(fOVHoriz.toString().indexOf("."), fOVHoriz.toString().indexOf(".")+4) );

	$(".viewFinder").width(195 * $(".aspectRatioValues > .selected").data("value") + "px");//magic number - $(".viewFinder").height() is sometimes wrong shortly after page load

	//the moon is 0.528333 degrees across (on avergage)
	//the orion image should be 100 times the size - about 50 degrees across, instead of 0.5
	var moonSize = $(".viewFinder").width() / (fOVHoriz / 0.528333);
	//
	if(moonSize > 10)
	{
		$(".moon").css("display", "block");
		$(".orion").css("display", "none");
	}
	else
	{
		$(".moon").css("display", "none");
		$(".orion").css("display", "block");
	}
	//
	$(".moon").width(moonSize + "px");
	$(".moon").height(moonSize + "px");
	$(".moon").css("margin-left", ($(".viewFinder").width() - $(".moon").width())/2 + "px" );
	$(".moon").css("margin-top", (195 - $(".moon").height())/2 + "px" );//magic number - $(".viewFinder").height() is sometimes wrong shortly after page load
	//
	$(".orion").width(100 * moonSize + "px");
	$(".orion").height(100 * moonSize + "px");
	$(".orion").css("margin-left", ($(".viewFinder").width() - $(".orion").width())/2 + "px" );
	$(".orion").css("margin-top", (195 - $(".orion").height())/2 + "px" );//magic number - $(".viewFinder").height() is sometimes wrong shortly after page load
}

function refreshLightTab()
{

	switch($(".settingButton.locked").length)
	{
		case 0:
			$.cookie('cameraLightReading',
				getLightReading(),
				{ expires: 365*10 }
			);

			console.trace(getLightReading());
			reviseSource();
			break;
		case 1:
			if($(".exposure > .locked").length == 1)
			{
				reviseISO();
				reviseAperture();
			}
			else if($(".aperture > .locked").length == 1)
			{
				reviseExposure();
				reviseISO();
			}
			else
			{
				reviseAperture();
				reviseExposure();
			}
			break;
			break;
		case 2:
			if($(".exposure > .locked").length == 0)
			{
				reviseExposure();
			}
			else if($(".aperture > .locked").length == 0)
			{
				reviseAperture();
			}
			else
			{
				reviseISO();
			}
			break;
		case 3:
			alert("ERROR. buttons should be locked")
			break;
		default:
			alert("ERROR. $('.settingButton.locked').length = " + $(".settingButton.locked").length);
			break;
	}

	saveCookies();
}

function reviseSource()
{
	$(".settingResult").removeClass("selected")

	$(".settingResult").each(function()
	{
		if($(this).data("cap") > getLightReading())
		{
			$(this).addClass("selected");
			return false;
		}
	});
}

function reviseExposure()
{
	if($.cookie('cameraLightReading') > getLightReading())
	{
		var prevReading;
		while($.cookie('cameraLightReading') > getLightReading())
		{
			prevReading = getLightReading();
			if($(".exposureValues > .selected").next().data("value"))
			{
				setSelectedSetting($(".exposureValues"), $(".exposureValues > .selected").next().data("value"));
			}
			else
			{
				break;
			}
		}

		if($.cookie('cameraLightReading') - prevReading < getLightReading() - $.cookie('cameraLightReading')) 
			setSelectedSetting($(".exposureValues"), $(".exposureValues > .selected").prev().data("value"));
	}
	else
	{
		var prevReading;
		while($.cookie('cameraLightReading') < getLightReading())
		{
			prevReading = getLightReading();
			if($(".exposureValues > .selected").prev().data("value"))
			{
				setSelectedSetting($(".exposureValues"), $(".exposureValues > .selected").prev().data("value"));
			}
			else
			{
				break;
			}
		}

		if(prevReading - $.cookie('cameraLightReading') < $.cookie('cameraLightReading') - getLightReading()) 
			setSelectedSetting($(".exposureValues"), $(".exposureValues > .selected").next().data("value"));
	}
}

function reviseAperture()
{
	if($.cookie('cameraLightReading') > getLightReading())
	{
		var prevReading;
		while($.cookie('cameraLightReading') > getLightReading())
		{
			prevReading = getLightReading();
			if($(".apertureValues > .selected").prev().data("value"))
			{
				setSelectedSetting($(".apertureValues"), $(".apertureValues > .selected").prev().data("value"));
			}
			else
			{
				break;
			}
		}

		if($.cookie('cameraLightReading') - prevReading < getLightReading() - $.cookie('cameraLightReading')) 
			setSelectedSetting($(".apertureValues"), $(".apertureValues > .selected").next().data("value"));
	}
	else
	{
		var prevReading;
		while($.cookie('cameraLightReading') < getLightReading())
		{
			prevReading = getLightReading();
			if($(".apertureValues > .selected").next().data("value"))
			{
				setSelectedSetting($(".apertureValues"), $(".apertureValues > .selected").next().data("value"));
			}
			else
			{
				break;
			}
		}

		if(prevReading - $.cookie('cameraLightReading') < $.cookie('cameraLightReading') - getLightReading()) 
			setSelectedSetting($(".apertureValues"), $(".apertureValues > .selected").prev().data("value"));
	}
}

function reviseISO()
{
	if($.cookie('cameraLightReading') > getLightReading())
	{
		var prevReading;
		while($.cookie('cameraLightReading') > getLightReading())
		{
			prevReading = getLightReading();
			if($(".iSOValues > .selected").next().data("value"))
			{
				setSelectedSetting($(".iSOValues"), $(".iSOValues > .selected").next().data("value"));
			}
			else
			{
				break;
			}
		}

		if($.cookie('cameraLightReading') - prevReading < getLightReading() - $.cookie('cameraLightReading')) 
			setSelectedSetting($(".iSOValues"), $(".iSOValues > .selected").prev().data("value"));
	}
	else
	{
		var prevReading;
		while($.cookie('cameraLightReading') < getLightReading())
		{
			prevReading = getLightReading();
			if($(".iSOValues > .selected").prev().data("value"))
			{
				setSelectedSetting($(".iSOValues"), $(".iSOValues > .selected").prev().data("value"));
			}
			else
			{
				break;
			}
		}

		if(prevReading - $.cookie('cameraLightReading') < $.cookie('cameraLightReading') - getLightReading()) 
			setSelectedSetting($(".iSOValues"), $(".iSOValues > .selected").next().data("value"));
	}
}

function getLightReading()
{
	return $(".exposureValues > .selected").data("value") * 
				$(".apertureValues > .selected").data("value") * 
				$(".iSOValues > .selected").data("value") / 
				Math.pow(2, $(".fStopValues > .selected").data("value"));
}

function refreshInstructions()
{
	var lockCount = $(".settingButton.locked").length;
	$(".setupInstruction").css("display", "none");
	$(".engagedInstruction").css("display", "none");
	$(".lockedInstruction").css("display", "none");

	if(lockCount == 0)
	{
		$(".setupInstruction").css("display", "block");
	}
	else if(lockCount == 3)
	{
		$(".lockedInstruction").css("display", "block");
	}
	else
	{
		$(".engagedInstruction").css("display", "block");
	}
}

function toggleLock(lock)
{
	lock.toggleClass("unlocked");
	lock.toggleClass("locked");
}