var prevTime;

$(document).ready(function()
{
    var date = new Date();
    prevTime = date.getTime();

    $(".lowerCaseButton").click(testLower);
    $(".upperCaseButton").click(testUpper);

    $(document).keydown
    (
        function(e) 
        {
            switch(e.which) 
            {
                case 37: //left
                testLower();
                break;

                case 39: //right
                testUpper();
                break;
            }

            e.preventDefault();
        }
    );


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
    if(!$(".lowerCaseButton").hasClass("wrong")) test(97);
}

function testUpper()
{
    if(!$(".upperCaseButton").hasClass("wrong")) test(65);
}

function test(a)
{
    var date = new Date();
    var d = date.getTime() - prevTime;
    prevTime = date.getTime();

    var charCode = $(".questionMain").html().charCodeAt(0);
    if (charCode >= a && charCode < a+26)
    {
        if (!$("button").hasClass("wrong")) d < 5000 ? updateHistory("green") :  updateHistory("amber");
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