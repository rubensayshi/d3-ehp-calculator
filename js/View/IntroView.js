var IntroView = Backbone.View.extend({
    events: {
        'click button.add-character': 'newCharacter',
    },
    
    newCharacter : function() {
        this.mainView.changeView(function(contentEl, mainView) { return new InputView({'el': contentEl, 'mainView': mainView}); });
    },
    
    initialize: function() {
        _.bindAll(this);
        
        updateBreadcrumb("intro");

        this.template = _.template($('#intro-template').html());
    },

    render: function() {
        $(this.template()).appendTo($(this.el));
    }
});