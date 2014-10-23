/* === myrrlyn.js ===
 * Houses site-specific scripts such as AJAX pseudonavigation
 * Written by myrrlyn
 * Powered by jQuery
 */

//  Direct Execution
$(document).ready(function ()
{
    //  Execute default page load
    DebugPrint("Attempting initial pageload: " + SiteMap.Pages.DEFAULT[0]);
    Navigate(SiteMap.Pages.DEFAULT);
    //  Await user navigation
    //  For some reason, jQueryNavigate cannot be defined in global scope and still
    //  operate successfully.
    $('a.myrr-page-loader').click(function jQueryNavigate()
    {
        /// <summary>
        /// This method can only be called by a jQuery event, as it requires a valid 'this'
        /// object. Specifically, it should only be called by elements that have both a
        /// valid class (myrr-*-loader) and an id to identify the files to request.
        /// </summary>
        DebugPrint("CLICK EVENT");
        var $ClickedID = this.id;
        DebugPrint("ID of clicked element: " + $ClickedID);
        $Selector = $('a#' + $ClickedID).attr('data-myrrPage');
        DebugPrint("data-myrrPage of clicked element: " + $Selector);
        $PageResult = NameResolve($Selector);
        DebugPrint("SiteMap.Pages object: " + $PageResult);
        Navigate($PageResult);
    });
});

//#region Navigation

//  Resource and display information
var SiteMap =
{
    //  Directory of all pages to load
    Bin: "/resources/documents/",
    //  Elements that can request pageloads
    Loaders:
    [
        "a.myrr-doc-loader",
        "a.myrr-page-loader"
    ],
    //  List of file/function tuples for AJAX loading
    Pages:
    {
        //  Default display page
        DEFAULT: ["fonts", FontsPage],
        //  About Me
        About: ["about", AboutMe],
        //  Font display page
        Fonts: ["fonts", FontsPage],
        //  Frontpage
        Home: ["home", HomePage],
        //  Elder Scroll
        KelJS: ["keljs", KelJS],
        //  Collected Works
        Oeuvre:
        {
            //  Index
            Head:        ["oeuvre", IndexOeuvre],
            Metaphysics: ["oeuvre/metaphysics", IndexMetaphysics],
            Orcpocrypha: ["oeuvre/orcpocrypha", IndexOrcpocrypha],
            Stories:     ["oeuvre/stories", IndexStories]
        },
        //  36 Lessons of Vivec
        Sermons: ["36-lessons", Sermons]
    },
    //  Elements into which pages are loaded
    Wrappers:
    {
        //  Article-specific block (main content)
        Article: "div#myrr-article-wrapper",
        //  Aside-specific block (sidebar)
        Aside: "div#myrr-aside-wrapper",
        //  Content block (holds both articles and asides)
        Main:    "div#myrr-content-wrapper"
    }
};
function Navigate($Page)
{
    /// <summary>
    /// Performs AJAX loading of the specified pages into the main document.
    /// </summary>
    /// <param name="$Page" type="Array">
    /// Tuple of ["name", callback()] containing the AJAX file and callback function.
    /// </param>
    $FilePath = SiteMap.Bin + $Page[0] + ".html ";
    DebugPrint("File Path: " + $FilePath);
    $Function = $Page[1];
    DebugPrint("Function Call: " + $Function);
    //  Pull article and aside elements from document
    $Article  = $FilePath + "article";
    $Aside    = $FilePath + "aside";
    DebugPrint("Article: " + $Article);
    DebugPrint("Aside:   " + $Aside);
    //  Load the aside first, since it is smaller.
    $(SiteMap.Wrappers.Aside).load($Aside);
    //  $(SiteMap.Wrappers.Aside).load($Aside);
    //  Load the article second, since it is larger, and fire the $Function argument as
    //  a callback. This must always be done on the second AJAX request, even if the
    //  section order is reversed, since all text must be delivered before the scripts
    //  will execute properly. Wrapping our $Function in a setTimeout() call also serves
    //  to detach execution of the callback function from the call stack, allowing
    //  asynchronous processing of script and HTML. It's a good thing and magic. You
    //  don't need to try to understand it, and I certainly don't.
    DebugPrint("Navigation attempted: " + $Page[0]);
    $(SiteMap.Wrappers.Article).load($Article, function () { NavCallback($Function); });
};
function NavCallback($Function)
{
    DebugPrint("Load complete!");
    setTimeout($Function(), 0);
    DebugPrint("Callback executed!");
};
function NameResolve($DataAttr)
{
    /// <summary>
    /// Matches an input string (from the data-myrrPage element) against legal values
    /// and returns a reference to the [file, function] tuple governing the AJAX
    /// behavior of the specified document request.
    /// </summary>
    /// <param name="$DataAttr" type="String">
    /// The raw string to be matched against elements of SiteMap.Pages. Typically
    /// retrieved from the data-myrrPage attribute of a navigation element.
    /// </param>
    /// <returns type="Array">
    /// ["filename", function()]
    /// </returns>
    var $Resolve
    switch ($DataAttr)
    {
        case "About":
            $Resolve = SiteMap.Pages.About;
            break;
        case "Fonts":
            $Resolve = SiteMap.Pages.Fonts;
            break;
        case "Home":
            $Resolve = SiteMap.Pages.Home;
            break;
        case "KelJS":
            $Resolve = SiteMap.Pages.KelJS;
            break;
        case "Oeuvre":
            $Resolve = SiteMap.Pages.Oeuvre.Head;
            break;
        case "Metaphysics":
            $Resolve = SiteMap.Pages.Oeuvre.Metaphysics;
            break;
        case "Orcpocrypha":
            $Resolve = SiteMap.Pages.Oeuvre.Orcpocrypha;
            break;
        case "Stories":
            $Resolve = SiteMap.Pages.Oeuvre.Stories;
            break;
        case "Sermons":
            $Resolve = SiteMap.Pages.Sermons;
            break;
        default:
            $Resolve = SiteMap.Pages.DEFAULT;
    }
    return $Resolve;
};
//#endregion

function AboutMe() { DebugPrint("AboutMe function called"); }
function HomePage() { DebugPrint("HomePage function called"); }
function KelJS() { DebugPrint("KelJS function called"); }
function IndexOeuvre() { DebugPrint("IndexOeuvre function called"); }
function IndexMetaphysics() { DebugPrint("IndexOeuvre function called"); }
function IndexOrcpocrypha() { DebugPrint("IndexOeuvre function called"); }
function IndexStories() { DebugPrint("IndexOeuvre function called"); }
function Sermons() { DebugPrint("36 Sermons function called"); }

//#region Bugfixes

//  IEMobile10 Viewport glitch
if (navigator.userAgent.match(/IEMobile\/10\.0/))
{
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(document.createTextNode("@-ms-viewport { width: auto !important; }"));
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

//#endregion

//  Toggles verbosity of debugging-specific console.log() calls
var $DEBUGSTATUS = true;
var $ALERTSTATUS = false;
function DebugPrint($DEBUGINFO)
{
    /// <summary>
    /// If global variable $DEBUGSTATUS is true, this prints to console whatever it is
    /// passed. If $DEBUGSTATUS is false, it is mute.
    /// </summary>
    /// <param name="$DEBUGINFO">
    /// The information to be logged to console for debugging purposes.
    /// </param>
    if ($DEBUGSTATUS) console.log($DEBUGINFO);
    if ($ALERTSTATUS) alert($DEBUGINFO);
};
