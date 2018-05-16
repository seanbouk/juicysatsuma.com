var prevTime;

$(document).ready(function()
{
    var date = new Date();
    prevTime = date.getTime();

    $(".AButton").click(testA);
    $(".BButton").click(testB);
    $(".CButton").click(testC);
    $(".DButton").click(testD);
    $(".EButton").click(testE);
    $(".FButton").click(testF);
    $(".GButton").click(testG);

    $(document).keydown
    (
        function(e) 
        {
            switch(e.which) 
            {
                case 65: //left
                testLower();
                break;

                case 66: //right
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

    $(".AButton").removeClass("right");
    $(".AButton").removeClass("wrong");
    $(".BButton").removeClass("right");
    $(".BButton").removeClass("wrong");
    $(".CButton").removeClass("right");
    $(".CButton").removeClass("wrong");
    $(".DButton").removeClass("right");
    $(".DButton").removeClass("wrong");
    $(".EButton").removeClass("right");
    $(".EButton").removeClass("wrong");
    $(".FButton").removeClass("right");
    $(".FButton").removeClass("wrong");
    $(".GButton").removeClass("right");
    $(".GButton").removeClass("wrong");
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

function testA()
{
    if(!$(".AButton").hasClass("wrong")) test(65);
}

function testB()
{
    if(!$(".BButton").hasClass("wrong")) test(66);
}

function testC()
{
    if(!$(".CButton").hasClass("wrong")) test(67);
}

function testD()
{
    if(!$(".DButton").hasClass("wrong")) test(68);
}

function testE()
{
    if(!$(".EButton").hasClass("wrong")) test(69);
}

function testF()
{
    if(!$(".FButton").hasClass("wrong")) test(70);
}

function testG()
{
    if(!$(".GButton").hasClass("wrong")) test(71);
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
        $("button").addClass("right");

        switch(a)
        {
            case 65:
                $(".AButton").removeClass("right");
                $(".AButton").addClass("wrong");
                break;
            case 66:
                $(".BButton").removeClass("right");
                $(".BButton").addClass("wrong");
                break;
            case 67:
                $(".CButton").removeClass("right");
                $(".CButton").addClass("wrong");
                break;
            case 68:
                $(".DButton").removeClass("right");
                $(".DButton").addClass("wrong");
                break;
            case 69:
                $(".EButton").removeClass("right");
                $(".EButton").addClass("wrong");
                break;
            case 70:
                $(".FButton").removeClass("right");
                $(".FButton").addClass("wrong");
                break;
            case 71:
                $(".GButton").removeClass("right");
                $(".GButton").addClass("wrong");
                break;
        }
    }
}

function updateHistory(col)
{
    $(".history").append("<img src=\"images/" + col + ".gif\" />");
}