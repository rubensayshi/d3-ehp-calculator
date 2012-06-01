/*
 * version string is used to store data in localcache
 * when the code is changed in such a way that the cached data has become invalid
 * we can update the version string to invalidate the old cache
 */
var VERSION = "b2412f9da4fb434e9ac8e87fbbc49bdc604ad23e";

var classlist = {
    'br': [Barbarian,   'Barbarian'],
    //'dh': [DemonHunter, 'Demon Hunter'],
    'mn': [Monk,        'Monk'],
    'wd': [WitchDoctor, 'Witch Doctor'],
    'wz': [Wizard,      'Wizard']
};

var charlist = new Characters();
charlist.fetch();

console.log(charlist);

var getClassInfo = function(shortname) {
    return (classlist[shortname]) ? modelclass = classlist[shortname] : [];
};

var updateBreadcrumb = function(breadcrumb) {
    window.location.hash = breadcrumb;
};

var generateSelector = function(fieldname) {
    return "." + fieldname;
};

var normalizeFloat = function(value, optionName, alertOnError) {
    var res = parseFloat(value);

    if (isNaN(res) || (res != value && res == parseInt(value))) {
        if (alertOnError) {
            alert("We failed to properly parse the valueue for [" + optionName + "]");
        
            return 0;
        } else {                  
            return normalizeFloat(value.replace(",", "."), optionName, true);
        }
    }
    
    return res;
}
    
var mainView = new MainView({'el': $("#container")});