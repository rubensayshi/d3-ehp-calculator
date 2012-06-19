var _gaq       = _gaq || [];
var DEBUGGA    = false;
var scriptname = DEBUGGA ? '/u/ga_debug.js' : '/ga.js';

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com' + scriptname;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();