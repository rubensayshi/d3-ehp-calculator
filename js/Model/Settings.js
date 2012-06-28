var DISPLAY_AS_EHP   = 'EHP',
    DISPLAY_AS_VITEQ = 'VITeq';

var Settings = Backbone.Model.extend({
    defaults : {
        display_as: DISPLAY_AS_EHP
    },
    
    initialize: function () {
        this.on('change', _.bind(this.save, this));
    }
}, {
    DISPLAY_AS_EHP   : DISPLAY_AS_EHP,
    DISPLAY_AS_VITEQ : DISPLAY_AS_VITEQ
});