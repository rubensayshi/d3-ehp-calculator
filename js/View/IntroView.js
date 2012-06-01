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
        
        $charlist = $('.character-list', this.el);
        
        charlist.each(function(character) {
            character = charlist.getModelByClass(character.get('your_class'), character);
            
            $('<li />')
                .append($('<a>')
                            .html(character.get('your_class'))
                            .click(_.bind(function() {
                                console.log(character);
                                this.mainView.changeView(function(contentEl, mainView) { return new SimulationView({'el': contentEl, 'mainView': mainView, 'model': character}); });
                            }, this))
                )
                .appendTo($charlist);
        }, this);
    }
});