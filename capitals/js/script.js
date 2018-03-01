

$(document).ready(function()
{
    $(".lowerCaseButton").click(testLower);
    $(".upperCaseButton").click(testUpper);


    updateQuestion();
});

function updateQuestion()
{
    $(".questionLeft").html(randomCharacter() + randomCharacter());
    $(".questionMain").html(randomCharacter());
    $(".questionRight").html(randomCharacter() + randomCharacter());

    $(".lowerCaseButton").removeClass("right");
    $(".lowerCaseButton").removeClass("wrong");
    $(".upperCaseButton").removeClass("right");
    $(".upperCaseButton").removeClass("wrong");
}

function randomCharacter()
{
    return Math.random() < 0.5 ? String.fromCharCode(Math.floor(Math.random()*26+65)) : String.fromCharCode(Math.floor(Math.random()*26+97))
}

function testLower()
{
    test(97);
}

function testUpper()
{
    test(65);
}

function test(a)
{
    var charCode = $(".questionMain").html().charCodeAt(0);
    if (charCode >= a && charCode < a+26)
    {
        updateHistory("green");
        updateQuestion();
    }
    else
    {
        updateHistory("red");

        //i'm sorry. this is awful
        $(".lowerCaseButton").addClass(a == 65 ? "right" : "wrong");
        $(".upperCaseButton").addClass(a == 65 ? "wrong" : "right");
    }
}

function updateHistory(col)
{
    $(".history").append("<img src=\"images/" + col + ".gif\" />");
}