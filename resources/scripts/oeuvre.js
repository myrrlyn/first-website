/* === oeuvre.js ===
 * Governs the library
 * Written by myrrlyn
 * Powered by jQuery
 */

//#region Loading

function Oeuvre()
{
    DebugPrint("Oeuvre function called");
    //  Handle index manipulation
    $('aside.oeuvre h2.category').addClass('closed').click(function ()
    {
        $(this).addClass('active');
        $(this).toggleClass('closed open');
        $('aside.oeuvre h2.active + ol').slideToggle();
        $(this).removeClass('active');
    });
    //  Handle click selections
    $(OeuvreIndex.Selector).click(function Loader()
    {
        var $Type = $(this).attr('data-type');
        var $File = $(this).attr('data-file');
        DebugPrint($Type + "/" + $File);
        OeuvreLoader($Type + "/" + $File + ".html");
    });
};

var OeuvreLoader = function ($Oeuvre)
{
    $(OeuvreIndex.Target).parent().load(OeuvreIndex.Bin + $Oeuvre);
};

var OeuvreIndex =
{
    Bin: "/resources/documents/oeuvre/",
    Selector: "aside.oeuvre li",
    Target: "article.oeuvre"
};

//#endregion
