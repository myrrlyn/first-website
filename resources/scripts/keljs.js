/* === elderscroll.js ===
 * Generates a prototype Elder Scroll.
 * Currently non-interactive.
 * Written by myrrlyn+numinit
 * Commissioned by Michael Kirkbride
 */

/// <summar>
/// Execution wrapper for use with Navigate()
/// </summary>
function KelJS()
{
    //  KelJS should only be used by Navigate(), so feed a magic string to the main function
    //  Custom uses should call WriteElderScroll directly, and pass their own destination
    WriteElderScroll("article#keljs-article");
}

/// <summary>
/// Execution wrapper capable of being used as a general callback
/// </summary>
/// <param name="$Target" type="string">
/// CSS-selector string jQuery can use to determine load destination
/// </param>
function WriteElderScroll($Target)
{
    //  DOM node into which the Scroll is written
    var ScrollCase = $($Target);

    //  Dimensions namespace - must be inside the function as access to the target DOM
    //  node is required for proper sizing.
    var Dimensions = {};
    //  Size of cells
    Dimensions.Scalar = 50;
    //  Columns
    Dimensions.Width = ScrollCase.innerWidth() / Dimensions.Scalar;
    //  Rows
    Dimensions.Height = ScrollCase.innerHeight() / Dimensions.Scalar;
    //  Cells
    Dimensions.Length = Dimensions.Width * Dimensions.Height;
    //  Domain of the scrambling algorithm.
    //  log_b_(x) = log_k_(x) / log_k_(b)
    Dimensions.Domain = Math.pow(2, Math.ceil(Math.log(Dimensions.Length) / Math.log(2)));

    //  Scroll arrays - one with low entropy, one with high
    var ScrollInit = (function CreateScroll()
    {
        var Scroll = [];
        for (var ScrollIndex = 0; ScrollIndex < Dimensions.Length; ScrollIndex++)
        {
            Scroll.push((ScrollIndex < Glyphs.Count) ? (Glyphs.WeightSet[ScrollIndex]) : (Glyphs.Resolve(Glyphs.Seed())));
        }
        return Scroll;
    })();
    var ScrollFinal = (function ScrambleScroll()
    {
        var Scroll = [];
        //  The scrambler uses values in [0..Dimension.Domain), not [0..Dimensions.Length)
        var ScrambleStep = Glyphs.Seed(Dimensions.Domain);
        var Scrambler = function ($Step)
        {
            return (((5 * $Step) + 1) % Dimensions.Domain);
        };
        //  Track successful shuffle steps - [Dimensions.Length..Dimensions.Domain) are invalid
        var ValidHits = 0;
        while (ValidHits < Dimensions.Length)
        {
            if (ScrambleStep < Dimensions.Length)
            {
                Scroll.push(ScrollInit[ScrambleStep]);
            }
            Scrambler(ScrambleStep);
        }
        return Scroll;
    })();

    //  SCROLL CONSTRUCTION METHODS  \\

    //  Remove any pre-existing content
    ScrollCase.empty();
    //  Construct the outer foundation
    ScrollCase.append('<table id="ScrollTable" class="keljs"><tbody></tbody></table>');
    //  Count the cells printed
    var IndexCell = 0;
    //  Construct the inner foundation
    for (var IndexRow = 0; IndexRow < Dimensions.Height; IndexRow++)
    {
        //  Row with numeric identifier
        $('#ScrollTable tbody').append('<tr class="row-' + IndexRow + '"></tr>');
        for (var IndexCol = 0; IndexCol < Dimensions.Width; IndexCol++)
        {
            //  Cell with numeric identifiers
            $('#ScrollTable tr').append('<td class=col-"' + IndexCol + '" id=cell-"' + IndexCell + '"></td>');
            ++IndexCell;
        }
    }
    //  Fill the table with ScrollFinal
    for (var IndexFill = 0; IndexFill < Dimensions.Length; IndexFill++)
    {
        var $GlyphNum = ScrollFinal[IndexFill];
        var $GlyphChar = 'G' + ($Glyph < 10) ? '0' : '';
        $('#cell-' + IndexFill).append($GlyphChar + $GlyphNum).addClass('glyph-' + $GlyphNum);
    }
};

//  Glyphs namespace - can be outside the main function as it is invariate.
var Glyphs = {};
//  Number of Glyphs - unnecessary, but a habit from construction of this program
//  in languages more stringent about array sizing. And magic numbers are always
//  good to avoid.
Glyphs.Count = 35;
//  Relative frequencies of each Glyph, gathered from an in-game scroll image.
//  We may very well add Markov analysis in the future, but for now frequency
//  distribution is all we have.
Glyphs.WeightSet =
[
    15, 13, 19, 10, 06, 12, 07,
    12, 22, 24, 18, 10, 10, 22,
    17, 09, 15, 04, 39, 19, 10,
    24, 29, 09, 13, 23, 15, 09,
    09, 10, 07, 15, 04, 08, 04
];
//  Sum of WeightSet[@] indices. Individual Glyph probability is
//  WeightSet[$G] / NetWeight
Glyphs.NetWeight = (function SumWeights()
{
    var WeightCounter = 0;
    for (var WeightIndex = 0; WeightIndex < Glyphs.Count; WeightIndex++)
    {
        WeightCounter += Glyphs.WeightSet[WeightIndex];
    }
    return WeightCounter;
})();
/// <summary>
/// Glyph-domain RNG - create an integer in [0..NetWeight)
/// </summary>
Glyphs.Seed = function ()
{
    return Math.floor(Math.random() * Glyphs.NetWeight);
};
/// <summary>
/// Resolves a [0..NetWeight) integer to a valid Glyph
/// </summary>
/// <param name="$GlyphNumber" type="Number" integer="true">
/// A number within [0..NetWeight) to be resolved into a Glyph index
Glyphs.Resolve = function ($GlyphNumber)
{
    //  Walk the WeightSet array until we include $GlyphNumber
    for (var GlyphIndex = 0; GlyphIndex < Glyphs.Count; GlyphIndex++)
    {
        //  Subtract the current Glyph's weight from the input seed
        $GlyphNumber -= Glyphs.WeightSet[GlyphIndex];
        //  Eventually, a Glyph's weight index will drive the input seed below zero, which
        //  gives us a Glyph value.
        if ($GlyphNumber < 0)
        {
            //  Glyphs are [1..35], not [0..35), so add one before returning
            return ++GlyphIndex;
        }
    }
};
