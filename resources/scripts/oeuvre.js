/* === oeuvre.js ===
 * Governs the library
 * Written by myrrlyn
 * Powered by jQuery
 */

//#region Loading

function Oeuvre()
{
    DebugPrint("Oeuvre function called");
    $(OeuvreIndex.Selector).click(function Loader()
    {
        var $Type = $(this).attr('data-type');
        var $File = $(this).attr('data-file');
        DebugPrint($Type + "/" + $File);
        $(OeuvreIndex.Target).load(OeuvreIndex.Bin + $Type + "/" + $File + ".html");
    });
};

var OeuvreIndex =
{
    Bin: "/resources/documents/oeuvre/",
    Selector: "aside.oeuvre li",
    Target: "article.oeuvre"
};

//#endregion

//#region Sidebar



//#endregion
