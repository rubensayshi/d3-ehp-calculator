var MainView = Backbone.View.extend({
    currentView : null,
    
    initialize: function() {
        _.bindAll(this);

        this.changeView(function(contentEl, mainView) { return new IntroView({'el': contentEl, 'mainView': mainView}); });
    },
    
    getContentEl: function() {
        return $('<div />').appendTo($('#content', this.el));
    },
    
    changeView: function(newView) {
        if (typeof newView == 'function') {
            newView = newView(this.getContentEl(), this);
        }

        if (this.currentView) {
            this.currentView.remove();
        }
                        
        this.currentView = newView;
        this.currentView.mainView = this;
                
        this.currentView.render();
    },
});