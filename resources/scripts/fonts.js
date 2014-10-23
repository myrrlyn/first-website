/* === fonts.js ===
 * Governs the rendering of fonts on the TES Font Resources page
 * Written by myrrlyn
 * Powered by jQuery
 */

function FontsPage()
{
    DebugPrint("FontsPage function called");
    $(FontKit.List.Parent).addClass('parent');
    DebugPrint("Parents of List: " + FontKit.List.Parent);
    $(FontKit.List.Child).addClass('child');
    DebugPrint("Children of List: " + FontKit.List.Child);
    //  Format display table
    for (var idx = 0; idx < Cells.length; idx++)
    {
        DebugPrint("Cell class: " + Cells[idx][1]);
        for (var idy = 0; idy < Cells[idx][0].length; idy++)
        {
            //  Nested arrays require tricks to access properly.
            $(Cells[idx][0][idy]).addClass(Cells[idx][1]);
            DebugPrint("Cell: " + Cells[idx][0][idy]);
        }
    }
    $(FontKit.List.Parent).click(function ShowFont()
    {
        DebugPrint("Font click event!");
        var $SelectedFont = $('#' + this.id).attr('data-font');
        DebugPrint('data-font attribute: ' + $SelectedFont);
        ChangeFont($SelectedFont);
    });
    $('dt.parent').click(function ToggleResource()
    {
        $(this).addClass('slide-toggle');
        $('dt.parent.slide-toggle + dd.child').slideToggle('1000');
        $(this).removeClass('slide-toggle');
    });
};
function ChangeFont($NewFont)
{
    DebugPrint("Font Changed!");
    for (var idx = 0; idx < FontKit.Display.Font.length; idx++)
    {
        //  Strip all font classes
        for (var idy = 0; idy < FontKit.Fonts.length; idy++)
        {
            $(FontKit.Display.Font[idx]).removeClass(FontKit.Fonts[idy]);
        }
        //  Add new class
        $(FontKit.Display.Font[idx]).addClass(FontKit.Fonts[ResolveFont($NewFont)]);
    }
};

var FontKit =
{
    List:
    {
        All: 'aside dl dt, aside dl dd',
        Parent: 'aside dl dt',
        Child: 'aside dl dd'
    },
    Display:
    {
        All: 'article table td',
        Plain:
        [
            'article table td:nth-child(1)',
            'article table td:nth-child(3)',
            'article table td:nth-child(5)'
        ],
        Font:
        [
            'article table td:nth-child(2)',
            'article table td:nth-child(4)',
            'article table td:nth-child(6)'
        ],
        Caps:
        [
            'article table td:nth-child(1)',
            'article table td:nth-child(2)'
        ]
    },
    Fonts:
    [
        "dunmeris",
        "dunmeris-worn",
        "dunmeris-script",
        "dunmeris-script-worn",
        "dunmeris-cyber",
        "dovah",
        "dwemeris",
        "falmeris",
        "inconsolata",
        "magnus",
        "planewalker",
        "roboto",
        "sb-gaelic",
        "sb-hand",
        "sb-illegible",
        "sr-sym"
    ]
};
var Cells =
[
    [FontKit.Display.Plain, 'plain'],
    [FontKit.Display.Font, 'font'],
    [FontKit.Display.Caps, 'uppercase']
];
function ResolveFont($FontString)
{
    var $FontIndex;
    switch ($FontString)
    {
        case "Dunmeris-Plain":
            $FontIndex = 0;
            break;
        case "Dunmeris-Plain-Worn":
            $FontIndex = 1;
            break;
        case "Dunmeris-Script":
            $FontIndex = 2;
            break;
        case "Dunmeris-Script-Worn":
            $FontIndex = 3;
            break;
        case "Dunmeris-Cyber":
            $FontIndex = 4;
            break;
        case "Dovah":
            $FontIndex = 5;
            break;
        case "Dwemeris":
            $FontIndex = 6;
            break;
        case "Falmeris":
            $FontIndex = 7;
            break;
        case "Inconsolata":
            $FontIndex = 8;
            break;
        case "Mage-Script":
            $FontIndex = 9;
            break;
        case "Planewalker":
            $FontIndex = 10;
            break;
        case "Roboto":
            $FontIndex = 11;
            break;
        case "Skyrim-Books-Gaelic":
            $FontIndex = 12;
            break;
        case "Skyrim-Books-Handwriting":
            $FontIndex = 13;
            break;
        case "Skyrim-Books-Illegible":
            $FontIndex = 14;
            break;
        case "Skyrim-Symbols":
            $FontIndex = 15;
            break;
    }
    return $FontIndex;
};
