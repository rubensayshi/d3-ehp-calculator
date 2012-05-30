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
    }
    
    var reset = function() {
        keepAlive();
        timer = setInterval(keepAlive, 10/*sec*/ * 1000/*milisec*/);
    };
    
    $(window).on('unload', function() {
        exit();     
    });
    
    return {
        changeClass: changeClass
    };
})();