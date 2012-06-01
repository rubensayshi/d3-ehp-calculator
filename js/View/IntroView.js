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
        
        CharacterList.each(function(character) {
            $('<button />')
                .addClass('btn btn-inverse')
                .append($('<i />').addClass('icon-user icon-white'))
                .append($('<span />').css('padding-left', '15px').html(character.get('description')))
                .css({'cursor':     'pointer',
                      'min-width':  '30%',
                      'margin-top': '5px',
                      'text-align': 'left'
                })
                .click(_.bind(function() {
                    this.mainView.changeView(function(contentEl, mainView) { return new SimulationView({'el': contentEl, 'mainView': mainView, 'model': character}); });
                }, this))
                .appendTo($('<li />').appendTo($charlist));
        }, this);
    }
});