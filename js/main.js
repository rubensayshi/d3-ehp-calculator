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

var getClassInfo = function(shortname) {
    return (classlist[shortname]) ? modelclass = classlist[shortname] : [];
};

var getModelForClass = function(classname, forceNew) {
    var use_storage = false && !!localStorage;
    var storage_key = 'previous_' + VERSION + '_' + classname;
    var modelclass,
        model;

    if (getClassInfo(classname)) {
        modelclass = getClassInfo(classname)[0];
    } else {
        // we should have some proper error here I think ...
        alert("you somehow selected a class which we do not recognise [" + classname + "]. \nApplication will now crash, we will refresh the page for you ;).");
        window.location.reload(true);
        return;
    }

    if (!forceNew && use_storage && localStorage.getItem(storage_key)) {
        model = new modelclass(JSON.parse(localStorage.getItem(storage_key)));
    } else {
        model = new modelclass();
    }

    if (use_storage) {
        model.on('change', function(model) {
            localStorage.setItem(storage_key, JSON.stringify(model));
        }, model);
    }

    return model;
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
    
var mainView = new MainView({'el': $(".container")});