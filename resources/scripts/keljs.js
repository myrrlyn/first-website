/* === elderscroll.js ===
 * Generates a prototype Elder Scroll.
 * Currently non-interactive.
 * Written by myrrlyn+numinit
 * Commissioned by Michael Kirkbride
 */

//  The Navigate() callback.
function KelJS()
{
    /// <summary>
    /// Execution wrapper for use inside Navigate
    /// KelJS() should only be called by Navigate or similar callback-employing functions.
    /// The values defined here are created in the context of the local site structure and
    /// likely would be invalid outside this context. Custom uses of this script should
    /// call WriteElderScroll directly and pass arguments of their own directly to it.
    /// </sumary>

    //  DOM-related information of Scroll display
    var KelData =
    {
        Scalar: 50,
        Width: $("article#keljs-article").innerWidth(),
        Height: window.innerHeight - $("header").innerHeight() - $("nav#topbar").innerHeight()
    };
    //  JavaScript /really/ does not like having object elements depend on sibling
    //  elements, so these need to be discrete and then packaged after their creation.
    // |—————————|—————————|—————————|—————————|—————————|—————————|—————————|—————————| \\
    var KelWidth  = Math.ceil(KelData.Width  / KelData.Scalar);
    var KelHeight = Math.ceil(KelData.Height / KelData.Height);
    var KelLength = KelWidth * KelHeight;
    var KelDomain = Math.pow(2, Math.ceil(Math.log(KelLength) / Math.log(2)));

    //  Properly-constructed object of Scroll sizing information
    var KelFormat =
    {
        Width:  KelWidth,
        Height: KelHeight,
        Length: KelLength,
        Domain: KelDomain
    }
    DebugPrint(KelFormat);
    var BrowserScroll = WriteElderScroll(KelFormat);
    DebugPrint(BrowserScroll);

    //  Begin construction of the Scroll HTML

}

var WriteElderScroll = function ($KelDimensions)
{
    /// <summary>
    /// Creates and returns an Elder Scroll object
    /// </summary>
    /// <param name="$KelData" type="Object">
    /// Four child integers: Width, Height, and Length in cell counts, and Domain as
    /// 2**i such that Length <= Domain
    /// </param>
    /// <returns type="Object">
    /// An object containing a string and two arrays: a timestamp, an array of the
    /// actual scroll, and an array of the generated Glyph frequency data.
    /// </returns>

    //  Returned Scroll
    var ScrollCase =
    {
        Timestamp: new Date().toISOString(),
        Scroll: [],
        Stats: []
    };

    //  The Stats array must be created with all required elements present and
    //  initialized to zero, since values are added to it by incrementing elements.
    ScrollCase.Stats = (function ()
    {
        var StatsArray = new Array(Glyphs.Count);
        for (var Index = 0; Index < StatsArray.length; ++Index)
        {
            StatsArray[Index] = 0;
        }
        return StatsArray;
    })();

    //  Create the ordered ScrollCase.Scroll array
    for (var ScrollIndex = 0; ScrollIndex < $KelDimensions.Length; ++ScrollIndex)
    {
        //  Ensure that each Glyph is present at least once, if there is enough space.
        //  Once satisfied, seed the Scroll with weighted-random Glyph values.
        var GenGlyph = Glyphs.Resolve
        ( (ScrollIndex < Glyphs.Count)
        ? (Glyphs.Weights[ScrollIndex] - 1)
        : (Glyphs.Seed())
        );
        //  Push the entire Glyph object to the Scroll array
        ScrollCase.Scroll.push(GenGlyph);
        //  Push -only the ID- to the Stats array
        ++ScrollCase.Stats[GenGlyph.Number];

    }
    //  Reorder the created array
    ScrollCase.Scroll = Reorder(ScrollCase.Scroll, $KelDimensions.Domain);

    //  And we're done
    return ScrollCase;
};

//  Glyphs namespace
var Glyphs = {};
//  Number of Glyphs in the alphabet - Magic numbers are from the devil.
Glyphs.Count = 35;
//  Relative frequencies of each Glyph, gathered from an in-game scroll image. We
//  may very well add Markov analysis in the future in addition to statistical data
//  but for now frequency is all we have collected.
Glyphs.Weights =
[
    15, 13, 19, 10, 06, 12,
    07, 12, 22, 24, 18, 10,
    10, 22, 17, 09, 15, 04,
    39, 19, 10, 24, 29, 09,
    13, 23, 15, 09, 09, 10,
    07, 15, 04, 08, 04
];
//  Total weight. Individual Glyph probability is Glyphs.Weights[Glyph] / NetWeight
Glyphs.NetWeight = (function SumWeights()
{
    var Counter = 0;
    for (var Index = 0; Index < Glyphs.Count; ++Index)
    {
        Counter += Glyphs.Weights[Index];
    }
    return Counter;
})();
Glyphs.Seed = function ()
{
    /// <summary>
    /// Generates a random integer in [0..Glyphs.NetWeight)
    /// Use with Glyphs.Resolve to create Glyph items.
    /// </summary>

    return Math.floor(Math.random() * Glyphs.NetWeight);
};
Glyphs.Resolve = function ($GlyphSeed)
{
    /// <summary>
    /// Generates a Glyph object consisting of a formatted string and raw integer.
    /// </summary>
    /// <param name="$GlyphSeed" type="number" integer="true">
    /// A number in [0..Glyphs.NetWeight) to be used in creating a Glyph object.
    /// </param>
    /// <returns type="Object">
    /// A Glyph object of format { Name: string, Number: integer }
    /// </returns>

    //  Construct the basis of the returned Glyph object.
    var NewGlyph =
    {
        /// <var>
        /// The display name of the Glyph object
        /// </var>
        Name: "",
        /// <var>
        /// The raw integer ID of the Glyph object
        /// </var>
        Number: 0
    };

    //  Walk the Glyphs.Weights array until we have included the input parameter
    for (var GlyphIndex = 0; GlyphIndex < Glyphs.Count; ++GlyphIndex)
    {
        //  Subtract the current Glyph's weight from the input parameter
        $GlyphSeed -= Glyphs.Weights[GlyphIndex];
        //  When the input parameter becomes negative, we have surpassed it in the weight
        //  walk, and the Glyph index that accomplished this tells us the resultant Glyph.
        //  Due to how Math.random() functions, the input parameter will ALWAYS be smaller
        //  than NetWeight, so this conditional will always eventually be satisfied.
        if ($GlyphSeed < 0)
        {
            //  Adds a 0 as padding if the index is in [0..8] so the output will be 0[0..9]
            //  The name of the Glyph is in [1..35], but the number is still in [0..35)
            NewGlyph.Name = 'G' + (GlyphIndex < 9 ? "0" : "") + ++GlyphIndex;
            NewGlyph.Number = GlyphIndex;
            return NewGlyph;
        }
    }
};

function Reorder($Array, $Domain)
{
    /// <summary>
    /// Performs a pseudorandom shuffle on an array and returns the new array in place.
    /// </summary>
    /// <param name="$Array">
    /// The array to be reordered. Element types are unimportant.
    /// </param>
    /// <param name="$Domain" type="Number" integer="true">
    /// This must be a power of 2 greater than or equal to $Array.length
    /// </param>
    /// <returns type="Array">
    /// The original input array, but scrambled following a pseudorandom algorithm.
    /// </returns>

    //  The shuffling algorithm
    var Stepper = function ($Step) { return (((5 * $Step) + 1) % $Domain); }
    //  The counter for Stepper - it can be any integer in [0..$Domain), but
    //  restricting it to [0..Glyphs.NetWeight) is just convenient.
    var Step = Glyphs.Seed();
    //  The reordered version of the input array.
    var ReorderedArray = [];
    //  The counter for successful reorder events
    var Counter = 0;
    while (Counter < $Array.length)
    {
        //  A reorder event can only be executed if the current step is within the bounds
        //  of the input array, otherwise actual data is lost and garbage added.
        if (Step < $Array.length)
        {
            //  Cons a pseudorandomly-fetched element to the return array.
            ReorderedArray.push($Array[Step]);
            ++Counter;
        }
        //  The algorithm must cycle whether or not the cons succeeded.
        Step = Stepper(Step);
    }
    return ReorderedArray;
};

//  Visual Studio references to other scripts in the project
/// <reference path="/resources/libraries/jquery/jquery-2.1.1.js" />
/// <reference path="/resources/libraries/bootstrap/javascripts/bootstrap.js" />
/// <reference path="/resources/scripts/myrrlyn.js" />
