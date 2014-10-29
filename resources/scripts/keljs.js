/* === elderscroll.js ===
 * Generates a prototype Elder Scroll.
 * Currently non-interactive.
 * Written by myrrlyn+numinit
 * Commissioned by Michael Kirkbride
 */

//  The Navigation callback
function KelJS()
{
    //  Wipe the table's destination.
    DebugPrint("Wiping the wrapper");
    $('div#myrr-article-wrapper').empty();
    //  Construct the table's outer skeleton.
    DebugPrint("Building foundations");
    (function ()
    {
        $('div#myrr-article-wrapper').append('<table id="ScrollTable"><tbody></tbody></table>');
    })();
    //  Cell counter
    var IdxCell = 0;
    //  Construct the table's inner skeleton.
    DebugPrint("Building internals");
    for (var IdxRow = 0; IdxRow < Dimensions.Height; IdxRow++)
    {
        $('table#ScrollTable tbody').append('<tr class="' + IdxRow + '"></tr>');
    }
    //  Initial array, containing 1-35 in the top and random in the rest
    var ScrollOrdered = [];
    //  Fully scrambled array
    var ScrollShuffled = [];
    //  The walker for our scrambling function
    var ScrambleStep = Math.floor(Math.random() * Dimensions.Domain);
    //  Constructing the ordered array...
    for (var SoIdx = 0; SoIdx < Dimensions.Length; SoIdx++)
    {
        if (SoIdx < Glyphs.Count)
        {
            ScrollOrdered.push(Glyphs.WeightSet[SoIdx]);
        }
        else
        {
            ScrollOrdered.push(Glyphs.Resolve(Glyphs.Seed()));
        }
    }
    //  Constructing the final array. A while loop is required because not all
    //  passes inside Dimensions.Domain will return a valid array index inside
    //  Dimensions.Length
    var ShuffleCount = 0;
    while (ShuffleCount < Dimensions.Length)
    {
        //  Test to see if the next random index is valid. If so, push and count,
        //  If not, try try again.
        if (ScrambleStep < Dimensions.Length)
        {
            ScrollShuffled.push(ScrollOrdered[ScrambleStep]);
            ++ShuffleCount;
        }
        //  Get the next random index
        ScrambleStep = Scramble(ScrambleStep);
    }
    //  Push array to document
    for (var ScrIdx = 0; ScrIdx < Dimensions.Length; ScrIdx++)
    {
        var $Glyph = ScrollShuffled[ScrIdx];
        $("td#cell-" + ScrIdx).append($Glyph).addClass('glyph-' + $Glyph);
    }
};
// |—————————|—————————|—————————|—————————|—————————|—————————|—————————|—————————|

//  Scroll Wrapper
//  This needs to be hoisted since it's present in multiple namespace objects.
//  This is the SELECTOR, not the node object. Wrap in $() to resolve.
var ScrollWrapper = 'div#myrr-article-wrapper';

//  Dimensions namespace
var Dimensions = {};

//  Size of generated cells
Dimensions.Scalar = 50;

//  Height of the Scroll array
Dimensions.Height = Math.floor($(ScrollWrapper).innerWidth() / Dimensions.Scalar);

//  Width of the Scroll array
Dimensions.Width  = Math.floor($(ScrollWrapper).innerWidth() / Dimensions.Scalar);

//  Number of cells in the Scroll array
Dimensions.Length = Dimensions.Height * Dimensions.Width;

//  Magic trick with logarithms: log_b_(x) = log_k_(x) / log_k_(b) for any base k
//  JavaScript only provides one logarithm method, log_e_() or ln(), and we need
//  log_2_(Dimensions.Length). Thus, magic.
Dimensions.Domain = Math.pow(2, Math.ceil(Math.log(Dimensions.Length) / Math.log(2)));

//  Glyph Alphabet namespace
var Glyphs = {};

//  There are 35 glyphs. Remember kids, magic numbers are from the devil.
//  Incidentally, this is just shorthand for Glyphs.WeightSet.length, since unlike
//  the stricter languages in which I've also written this, JavaScript arrays don't
//  require any special priming vis-a-vis size.
Glyphs.Count = 35;

//  Weights harvested from source material. Weighted random > full random for
//  language constructs
Glyphs.WeightSet =
[
    12, 06, 11, 10, 04, 08, 07,
    07, 16, 17, 06, 04, 03, 20,
    10, 06, 06, 02, 26, 12, 05,
    12, 18, 04, 06, 13, 07, 03,
    04, 03, 01, 05, 01, 01, 01
];

//  The sum of WeightSet[@]. Probability of Glyph $G is WeightSet[$G] / NetWeight
Glyphs.NetWeight = (function SumWeightSet()
{
    var WeightTracker = 0;
    for (var WsIdx = 0; WsIdx < Glyphs.Count; WsIdx++)
    {
        WeightTracker += Glyphs.WeightSet[WsIdx];
    }
    return WeightTracker;
})();

//  Generates a random integer in [0..NetWeight)
Glyphs.Seed = function ()
{
    return Math.floor(Math.random() * Glyphs.NetWeight)
};

//  Transforms a Glyphs.Seed() return-integer into a valid Glyph
Glyphs.Resolve = function ($GlyphNumber)
{
    //  The Glyph ([0..Glyphs.Count)) to be found
    var $Glyph;
    //  The domain of checked values
    var ResolutionTracker = 0;
    //  Each pass through the loop adds a Glyph's weight to the ResolutionTracker
    //  counter, and when that counter surpasses the value of the input number, the loop
    //  exits. The last value of the loop index represents the Glyph containing the
    //  number passed to this method. Boundary numbers are awarded to the high Glyph.
    //  I.e, if WeightSet[0] = 10, Resolve(10) returns 1, not 0.
    for ($Glyph = 0; $Glyph < Glyphs.Count; $Glyph++)
    {
        ResolutionTracker += Glyphs.WeightSet[$Glyph];
        if ($GlyphNumber < ResolutionTracker)
        {
            //  Glyphs are presented as [1..Glyphs.Count], not [0..Glyphs.Count)
            return "G" + ++$Glyph;
        }
    }
};

//  Pseudorandom shuffling function.
var Scramble = function ($Step)
{
    return ((5 * $Step) + 1) % Dimensions.Domain;
};
