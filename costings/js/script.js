var mean;
var sd;

var best;
var likely;
var worst;

function update()
{
	calculateMeanAndsd();
	findX();
}

function calculateMeanAndsd()
{
	alert("aslkdj");

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

	$("#result").val(min);
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

$("#confidence").change(function(){
    alert($(this).val());
});