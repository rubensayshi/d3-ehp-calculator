var MainView = Backbone.View.extend({
    currentView : null,
    
    initialize: function() {
        _.bindAll(this);
        
        this.currentView = new IntroView({'el': $('#content', this.el)});
        
        this.render();
    },

    render: function() {
        this.currentView.render();
    }
});