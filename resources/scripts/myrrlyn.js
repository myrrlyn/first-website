/* === myrrlyn.js ===
 * Houses site-specific scripts such as AJAX pseudonavigation
 * Written by myrrlyn
 * Powered by jQuery
 */

//#region Bugfixes

//  IEMobile10 Viewport glitch
if (navigator.userAgent.match(/IEMobile\/10\.0/))
{
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(document.createTextNode("@-ms-viewport { width: auto !important; }"));
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

//#endregion
