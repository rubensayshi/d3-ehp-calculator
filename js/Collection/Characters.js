var Characters = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("Characters"),
    model: function(attrs, options) {
        if (getClassInfo(attrs.your_class)) {
            modelclass = getClassInfo(attrs.your_class)[0];
        }

        return new modelclass(attrs, options);
    },

    getModelByClass: function(classname, attr) {
        if (getClassInfo(classname)) {
            modelclass = getClassInfo(classname)[0];
        } else {
            // we should have some proper error here I think ...
            alert("you somehow selected a class which we do not recognise [" + classname + "]. \nApplication will now crash, we will refresh the page for you ;).");
            window.location.reload(true);
            return;
        }

        model = new modelclass(attr);

        return model;
    }
});