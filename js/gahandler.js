var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32071149-1']);

var gahandler = (function() {
    var classname = '/_none/';
    var timer;
    
    var keepAlive = function() {
        _gaq.push(['_trackEvent', classname, 'keepalive']);
    };
    
    var exit = function() {
        _gaq.push(['_trackPageview', '/exit/']);
    };
    
    var changeClass = function(_classname) {
        classname = _classname;

        _gaq.push(['_trackPageview', '/' + classname + '/']);
        
        reset();
    };
    
    var logVersion = function(v) {
        _gaq.push(['_trackEvent', 'VERSION', v]);
    };
    
    var reset = function() {
        keepAlive();
        timer = setInterval(keepAlive, 10/*sec*/ * 1000/*milisec*/);
    };
    
    $(window).on('unload', function() {
        exit();     
    });
    
    return {
        logVersion:  logVersion,
        changeClass: changeClass
    };
})();

window.onerror = function(message, file, line) { 
    var formattedmessage = '[' + file + ' (' + line + ')] ' + message; 
    _gaq.push(['_trackEvent', 'Exceptions', VERSION, formattedmessage, null, true]);
 };