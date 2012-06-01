var MainView = Backbone.View.extend({
    currentView : null,
    
    initialize: function() {
        _.bindAll(this);

        this.changeView(function(contentEl, mainView) { return new SimulationView({'el': contentEl, 'mainView': mainView}); });
    },
    
    getContentEl: function() {
        return $('#content', this.el);
    },
    
    changeView: function(newView) {
        if (typeof newView == 'function') {
            newView = newView(this.getContentEl(), this);
        }
        
        console.log(newView);

        this.currentView = newView;
        newView.mainView = this;
        
        this.getContentEl().empty();
        
        newView.render();
    },
});