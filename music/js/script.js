var context
var audioBuffer;
var sourceNode;
var analyser;
var javascriptNode;
var array;

var ctx;

var gradient;

var pinch = 10;

$(document).ready(function()
{
    navigator.getUserMedia = 
    (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );

	context = new AudioContext();

	ctx = $("#canvas").get()[0].getContext("2d");

	gradient = ctx.createLinearGradient(0,0,0,300);
    gradient.addColorStop(1,'#000000');
    gradient.addColorStop(0.75,'#ff0000');
    gradient.addColorStop(0.25,'#ffff00');
    gradient.addColorStop(0,'#ffffff');

    setupAudioNodes();
    //loadSound("audio/Nothing Else Matters - solo piano, Scott D. Davis.mp3");
    //loadSound("audio/Game of Stylophone.mp3");
    //loadSound("audio/test-tone-middle-c.mp3");
    //loadSound("audio/middle-C HD.mp3");
    //loadSound("audio/20Hz to 20kHz.mp3");
    //loadSound("audio/Stairway to heaven.mp3");

    $(".octave").load("octave.html");
});


function setupAudioNodes() 
{

    if (navigator.getUserMedia) 
    {
        navigator.getUserMedia
        (
            {video: false, audio: true},

            // success callback
            function(stream) 
            {
                /*/ initialize nodes
                context = new (window.AudioContext || window.webkitAudioContext)();
                source = context.createMediaStreamSource(stream);

                // setup a analyzer
                analyser = context.createAnalyser();
                analyser.smoothingTimeConstant = 0.3;
                analyser.fftSize = 4096;//sample rate (ie, 44100) / this = the frequency gap between each value - 10.7666015625

                // create a buffer source node
                sourceNode = context.createBufferSource();
                sourceNode.connect(analyser);
                analyser.connect(javascriptNode);

                sourceNode.connect(context.destination);*/

                context = new (window.AudioContext || window.webkitAudioContext)();
                context.sampleRate = 192000;
                source = context.createMediaStreamSource(stream);
                analyser = context.createAnalyser();

                // set node properties and connect
                analyser.smoothingTimeConstant = 0.5;
                analyser.fftSize = 4096;//sample rate (ie, 44100) / this = the frequency gap between each value - 10.7666015625
                spectrum = new Uint8Array(analyser.frequencyBinCount);
                source.connect(analyser);

                // setup a javascript node
                javascriptNode = context.createScriptProcessor(2048, 1, 1);
                // connect to destination, else it isn't called
                javascriptNode.connect(context.destination);

                // when the javascript node is called
                // we use information from the analyzer node
                // to draw the volume
                javascriptNode.onaudioprocess = function() 
                {

                // get the average for the first channel
                array =  new Uint8Array(analyser.frequencyBinCount);
                //console.log(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);

                // clear the current state
                ctx.clearRect(0, 0, 480, 240);

                // set the fill style
                ctx.fillStyle=gradient;
                drawSpectrum(array);

                }

            },

            // error callback
            function(e) 
            {
                console.log(e);
                alert("ERROR: see console");
            }
        );
    } 
    else
    {
        alert("!navigator.getUserMedia");
    }


    /*
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // when the javascript node is called
	// we use information from the analyzer node
	// to draw the volume
	javascriptNode.onaudioprocess = function() 
	{

	    // get the average for the first channel
	    array =  new Uint8Array(analyser.frequencyBinCount);
        //console.log(analyser.frequencyBinCount);
	    analyser.getByteFrequencyData(array);

	    // clear the current state
	    ctx.clearRect(0, 0, 480, 240);

	    // set the fill style
	    ctx.fillStyle=gradient;
	    drawSpectrum(array);

	}*/
}

// load the specified sound
function loadSound(url) 
{
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() 
    {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) 
        {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);
    }
    request.send();
}

function playSound(buffer) 
{
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}

// log if an error occurs
function onError(e) 
{
    console.log(e);
}

function drawSpectrum(array) 
{
    /*for ( var i = 0; i < (array.length); i++ ){
        var value = array[i];

        ctx.fillRect(i*2,250-value,1,250);
    }*/

    $('.spectra').each(function (index, value)
    { 
        var value = getFrequencyValue($(this).parent().data("m") * $(this).parent().parent().data("c"));
        //$(this).height((value-(100-100/pinch))*pinch + "%");
        $(this).width(Math.pow(value/100, pinch)*100 + "%");
    });
};

function getFrequencyValue(frequency) 
{
  var nyquist = context.sampleRate/2;
  //console.log(context.sampleRate);
  var index = Math.round(frequency/nyquist * array.length);
  return array[index] / 2.55;
}