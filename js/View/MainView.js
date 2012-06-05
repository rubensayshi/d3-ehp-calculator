var MainView = Backbone.View.extend({
    events: {
        'click button.manage_chars': 'manageChars'  
    },
    currentView : null,
    
    initialize: function() {
        _.bindAll(this);
        
        var re    = new RegExp("^#calculator/(.+)"),
            match = re.exec(window.location.hash);
        
        if (match && match[1]) {
            
            var charFromUrl = CharacterList.get(match[1]);
            
            if (charFromUrl) {
                return this.changeView(function(contentEl, mainView) { return new SimulationView({'el': contentEl, 'mainView': mainView, 'model': charFromUrl}); });
            }
        }

        return this.changeView(function(contentEl, mainView) { return new IntroView({'el': contentEl, 'mainView': mainView}); });
    },
    
    getContentEl: function() {
        return $('<div />').appendTo($('#content', this.el));
    },
    
    manageChars: function() {
        return this.changeView(function(contentEl, mainView) { return new IntroView({'el': contentEl, 'mainView': mainView}); });
    },
    
    changeView: function(currentView) {
        var viewEl;
        var contentEl = $('#content', this.el);
        var oldView = this.currentView;
        
        if (typeof currentView == 'function') {
            viewEl = this.getContentEl();
            currentView = currentView(viewEl, this);
        }
        
        this.currentView = currentView;
        currentView.mainView = this;

        fade          = 500;
        displayCp     = true;
        displayUpdate = true;
        displayBugs   = true;
                
        if (this.currentView instanceof IntroView) {
            displayCp   = false;
            displayBugs = false;
        }
        
        displayCp     ? $(".cp", this.el).show(fade)                : $(".cp", this.el).hide(fade);
        displayUpdate ? $(".latest-update", this.el).show(fade)     : $(".latest-update", this.el).hide(fade);
        displayBugs   ? $(".bugs-and-features", this.el).show(fade) : $(".bugs-and-features", this.el).hide(fade);
        
        $(contentEl)
            .queue(function() {
                if (oldView) {
                    $(this).animate({'opacity': 0}, fade/2).dequeue();
                } else {
                    $(contentEl).dequeue();
                }
            })
            .queue(function() {
                if (oldView) {
                    oldView.remove();
                }
                
                currentView.render();
                $(contentEl).dequeue();
            })
            .queue(function() {
                $(this).animate({'opacity': 1}, fade/2).dequeue();
            });
    },
});