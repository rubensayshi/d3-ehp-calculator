var InputView = SimulationView.extend({
    events: {
        'change .your_class':       'changeClass',
        'click button.back':        'backToIntro',
        'click button.create-char': 'createCharacter'
    },
    
    initialize: function() {
        _.bindAll(this);
        
        updateBreadcrumb("input-char");

        console.log($('#input-template'));
        
        this.template = _.template($('#input-template').html());
    },
    
    backToIntro : function() {
        this.mainView.changeView(function(contentEl, mainView) { return new IntroView({'el': contentEl, 'mainView': mainView}); });
    },
    
    createCharacter : function() {
        var newModel = this.model;
        
        this.viewToModel();
        
        newModel.rebase();
                
        this.mainView.changeView(function(contentEl, mainView) { return new SimulationView({'el': contentEl, 'mainView': mainView, 'model': newModel}); });
    },
    
    renderOptionRow: function($parent, optionInfo, optionName) {
        optionInfo['type']  = optionInfo['type']  || 'checkbox';
        optionInfo['title'] = optionInfo['title'] || "[" + optionName + "]";
        optionInfo['alt']   = optionInfo['alt']   || "";
        
        var $row, $col1, $col2, $col3, $input, $alt;
        
        $row = $('<tr />')
                    .appendTo($parent);
        $col1 = $('<th />')
                    .append($('<span />').html(optionInfo['title']).attr('title', optionInfo['alt']))
                    .appendTo($row);
        $col2 = $('<td />')
                    .appendTo($row);
        $col3 = $('<td />')
                    .appendTo($row);
        
        if (optionInfo['type'] == 'checkbox') {
            $input = $('<input type="checkbox" />')
                        .addClass(optionName);
        } else if (optionInfo['type'] == 'select') {
            seloptions = optionInfo['options'] || {};
            
            if (typeof seloptions == 'function') {
                seloptions = seloptions();
            }
            
            $input = $('<select />')
                        .addClass('form-inline input-medium')
                        .addClass(optionName);
            
            _.each(seloptions, function(val, key) {
               $input.append($('<option />').val(key).html(val)); 
            });
        } else if (optionInfo['type'] == 'text') {
            $input = $('<input type="text" />')
                        .addClass('form-inline input-medium')
                        .addClass(optionName);
        }
        
        $input.appendTo($col2);
        
        if (typeof(optionInfo['tip']) != 'undefined') {
            $('<span />')
                .attr('title', optionInfo['tip'])
                .addClass('label label-info')
                .html("?")
                .appendTo($col2)
                .tooltip();
        }
    },

    changeClass: function() {
        classname = $('.your_class', this.el).val();

        this.model = getModelForClass(classname);
        
        this.renderOptions();
        this.modelToView();
        $(".auto_tooltip").tooltip();
        
        if (gahandler) {
            gahandler.changeClass(classname);
        }
    },
    
    render: function() {
        $(this.template()).appendTo($(this.el));

        var $classSelect = $('.your_class', this.el);
        $classSelect.children().remove();

        _.each(classlist, function(info, shortname) {
            $('<option />').val(shortname).html(info[1]).appendTo($classSelect);
        }, this);

        if (this.model) {
            $classSelect.val(this.model.get('your_class'));
        }

        $("#dodge_ehp_explained").tooltip({
            title: "<strong>keep in mind; dodge is random.</strong><br />" +
                   "In normal EHP calculations it's excluded since if you get unlucky you will have 0 dodges before your health pool is empty!"
        });

        this.changeClass();
    }
});