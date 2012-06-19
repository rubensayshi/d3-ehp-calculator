var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32071149-1']);

var gahandler = (function() {
    var classname = '_none';
    var bounce = true;
    
    var keepAlive = function() {
        _gaq.push(['_trackEvent', classname, 'keepalive']);
    };
    
    var exit = function() {
        if (!bounce) {
            _gaq.push(['_trackPageview', '/exit/']);
        }
    };
    
    var noBounce = function() {
        bounce = false;
    };
    
    var logVersion = function(v) {
        _gaq.push(['_trackEvent', 'VERSION', v]);
    };
    
    var reset = function() {
        noBounce();
        keepAlive();
        timer = setInterval(keepAlive, 10/*sec*/ * 1000/*milisec*/);
    };
    
    var changeClass = function(_classname) {
        classname = _classname;

        _gaq.push(['_trackPageview', '/' + classname + '/']);
        
        reset();
    };
    
    var inputPage = function() {
        _gaq.push(['_trackPageview', '/input/']);

        reset();
    };
    
    var introPage = function() {
        _gaq.push(['_trackPageview', '/intro/']);

        reset();
    };
    
    $(window).on('unload', function() {
        exit();     
    });
    
    return {
        noBounce:    noBounce,
        introPage:   introPage,
        inputPage:   inputPage,
        logVersion:  logVersion,
        changeClass: changeClass
    };
})();

window.onerror = function(message, file, line) { 
    var formattedmessage = '[' + file + ' (' + line + ')] ' + message; 
    _gaq.push(['_trackEvent', 'Exceptions', VERSION, formattedmessage, null, true]);
 };