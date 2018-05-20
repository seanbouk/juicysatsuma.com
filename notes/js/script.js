var prevTime;
var selectedNote;

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
            if (e.which >= 65 && e.which <= 71) test(e.which);

            e.preventDefault();
        }
    );


    updateQuestion();
});

function updateQuestion()
{
    selectedNote = randomCharacter();
    $(".questionAreaInner ol").children().hide();
    $(".questionAreaInner ol").children().eq(selectedNote).show();

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
    return Math.floor(Math.random()*9);
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

    if ((selectedNote + a) % 7 == 0)
    {
        if (!$("button").hasClass("wrong")) d < 5000 ? updateHistory("green") :  updateHistory("amber");
        updateQuestion();
    }
    else
    {
        updateHistory("red");

        //i'm sorry. this is awful
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