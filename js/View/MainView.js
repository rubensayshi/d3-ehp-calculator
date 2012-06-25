/*
 * ADPREF is version string which we use to store disabling of ads in localcache
 * when we want to enforce ads to everyone agian we can change this
 */
var ADPREF = "AD_20120619",
    ADPREF_STATE_FIRSTVIEW  = 1,
    ADPREF_STATE_SECONDVIEW = 2,
    ADPREF_STATE_DISABLED   = 3;
    
var MainView = Backbone.View.extend({
    events: {
        'click button.manage_chars': 'manageChars'  
    },
    currentView : null,
    first: true,
    
    initialize: function() {
        _.bindAll(this);
        
        var re    = new RegExp("^#calculator/(.+)"),
            match = re.exec(window.location.hash);
        
        if (match && match[1]) {
            
            var charFromUrl = CharacterList.get(match[1]);
            
            if (charFromUrl) {
                return this.changeView(function(contentEl, mainView, settings) { return new SimulationView({'el': contentEl, 'mainView': mainView, 'model': charFromUrl, 'settings': settings}); });
            }
        }

        this.setupSettings();
        this.setupAdPref();

        return this.changeView(function(contentEl, mainView, settings) { return new IntroView({'el': contentEl, 'mainView': mainView, 'settings': settings}); });
    },
    
    setupSettings: function() {
        var settings = this.options.settings;
        
        var setSelected = function(sel) {
            var sel = sel || settings.get('display_as');
                        
            $('li:not(#display_as_'+sel+') input', $('#settings')).attr('checked', false);
            $('li#display_as_'+sel+' input', $('#settings')).attr('checked', true);
        };
        
        $('#display_as_EHP', this.el).click(function(e) {
            e.preventDefault();
            settings.set('display_as', Settings.DISPLAY_AS_EHP);
            
            setSelected();
        });
        
        $('#display_as_VITeq', this.el).click(function(e) {
            e.preventDefault();            
            settings.set('display_as', Settings.DISPLAY_AS_VITEQ);
            
            setSelected();
        });
        
        setSelected();
        
    },
    
    setupAdPref: function() {
        if (!localStorage) {
            return;
        }
        
        var state = localStorage.getItem(ADPREF);
            state = state || ADPREF_STATE_FIRSTVIEW;

        if (state == ADPREF_STATE_FIRSTVIEW) {
            
            _gaq.push(['_trackEvent', 'ads', 'firstview', ADPREF]);
            localStorage.setItem(ADPREF, ADPREF_STATE_SECONDVIEW);
            
            $('#adcontainer').show();
            $('#adcontainer').append($('<div class="alert" />').html("Returning visitors can disable the ads."));
            
        } else if (state == ADPREF_STATE_SECONDVIEW) {
            
            _gaq.push(['_trackEvent', 'ads', 'secondview', ADPREF]);
            
            $('#adcontainer').show();
            $('#adcontainer').append(
                 $('<div class="alert" />')
                     .html("As a returning visitor you can now disable the ads.")
                     .append(
                         $('<div style="text-align: right;"><br /></div>').append(
                         $('<button class="btn" />')
                             .html("I don't like ads")
                             .click(function() {
                                 if (confirm("This will remove the ad block for a (long) while, you sure :( ?")) {
                                     _gaq.push(['_trackEvent', 'ads', 'disable', ADPREF]);
                                     localStorage.setItem(ADPREF, ADPREF_STATE_DISABLED);
                                     $('#adcontainer').hide(300);
                                 }
                              })
                         )
                )
            );
            
        } else {
            
            _gaq.push(['_trackEvent', 'ads', 'disabled', ADPREF]);
            
            $('#adcontainer').hide();
        }
    },
    
    getContentEl: function() {
        return $('<div />').appendTo($('#content', this.el));
    },
    
    manageChars: function() {
        return this.changeView(function(contentEl, mainView, settings) { return new IntroView({'el': contentEl, 'mainView': mainView, 'settings': settings}); });
    },
    
    changeView: function(currentView) {
        var viewEl;
        var contentEl = $('#content', this.el);
        var oldView = this.currentView;
        
        if (typeof currentView == 'function') {
            viewEl = this.getContentEl();
            currentView = currentView(viewEl, this, this.options.settings);
        }
        
        this.currentView = currentView;
        currentView.mainView = this;

        fade          = 500;
        displayCp     = true;
        displayUpdate = true;
        displayBugs   = true;
        
        if (this.first) {
            this.first = false;
            fade = 0;
        }
                        
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
    }
});