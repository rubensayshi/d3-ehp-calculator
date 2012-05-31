var SimulationView = Backbone.View.extend({
    events: {
        'change input':          'viewToModel',
        'change .input_select':  'viewToModel',
        'change .your_class':    'changeClass',
        'click button.reset':    'viewToModel',
        'click button.new_char': 'inputNewChar'
    },

    initialize: function() {
        _.bindAll(this);

        this.template = _.template($('#simulation-template').html());

        this.class_templates = {
            "br": _.template($('#simulation-br-template').html()),
            "dh": _.template($('#simulation-not-available-template').html()),
            "mn": _.template($('#simulation-mn-template').html()),
            "wd": _.template($('#simulation-wd-template').html()),
            "wz": _.template($('#simulation-wz-template').html())
        };
    },

    viewToModel: function() {
        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = generateSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                // --
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                this.model.set(optionName, !!$fieldObj.prop('checked'));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text' && !$fieldObj.prop('readonly')) {
                this.model.set(optionName, normalizeFloat($fieldObj.val(), optionName));
            } else if ($fieldObj.is('select') && !$fieldObj.prop('readonly')) {
                this.model.set(optionName, $fieldObj.val());
            }
        }, this);
    },
    
    renderOptions: function() {
        _.each({
            '#base_options tbody':  this.model.base_options,
            '#options tbody':       this.model.options,
            '#extra_options tbody': this.model.extra_options
        }, function(options, parent) {
            var $parent = $(parent);
            
            $parent.empty();
            
            _.each(options, function(optionInfo, optionName) {
                optionInfo['type']    = optionInfo['type']  || 'checkbox';
                optionInfo['title'  ] = optionInfo['title'] || "[" + optionName + "]";
                
                var $row, $col1, $col2, $col3, $input;
                
                if (optionInfo['type'] == 'checkbox') {
                    $input = $('<input type="checkbox" />')
                                .addClass(optionName);
                } else if (optionInfo['type'] == 'select') {
                    seloptions = optionInfo['options'] || {};
                    
                    if (typeof seloptions == 'function') {
                        seloptions = seloptions();
                    }
                    
                    $input = $('<select />')
                                .addClass(optionName);
                    
                    _.each(seloptions, function(val, key) {
                       $input.append($('<option />').val(key).html(val)); 
                    });
                } else if (optionInfo['type'] == 'text') {
                    $input = $('<input type="text" />')
                                .addClass(optionName);
                }
                
                $row = $('<tr />')
                            .appendTo($parent);
                $col1 = $('<th />')
                            .html(optionInfo['title'])
                            .appendTo($row);
                $col2 = $('<td />')
                            .append($input)
                            .appendTo($row);
                $col3 = $('<td />')
                            .appendTo($row);
            });
        });
    },

    modelToView: function() {
        var alternatives = {};
        
        var toField = _.bind(function($fieldObj, selector, fieldName, fieldValue) {
            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                $fieldObj.html(this.prepareVal(fieldValue, fieldName));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                $fieldObj.prop('checked', !!fieldValue);
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text') {
                $fieldObj.val(this.prepareVal(fieldValue, fieldName));
            } else if ($fieldObj.is('select')) {
                $fieldObj.val(fieldValue);
            }
        }, this);
        
        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = generateSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            toField($fieldObj, selector, optionName, this.model.get(optionName));
            
            if (optionInfo['alternative'] !== undefined) {
                if (typeof optionInfo['alternative'] == 'boolean') {
                    alternatives[optionName] = [{/* this should contain stat changes */}, !this.model.get(optionName)];
                    alternatives[optionName][0][optionName] = !this.model.get(optionName);
                } else {
                    alternatives[optionName] = [{/* this should contain stat changes */}, true];
                    alternatives[optionName][0][optionName] = this.model.get(optionName) + optionInfo['alternative'];
                }
            }            
        }, this);
        
        _.each(['life', 'armor', 'resist'], function(buffed_stats_field) {
            var selector = generateSelector(buffed_stats_field);
            var $fieldObj = $(selector,  this.el);

            toField($fieldObj, selector, buffed_stats_field, this.model.get(buffed_stats_field));
        }, this);
        
        _.each(['ehp', 'ehp_dodge', 'ehp_melee', 'ehp_dodge_melee', 'ehp_ranged', 'ehp_dodge_ranged', 'ehp_magic', 'ehp_dodge_magic'], function(ehp_field) {
            var selector = generateSelector(ehp_field);
            var $fieldObj = $(selector,  this.el);

            toField($fieldObj, selector, ehp_field, this.model.get(ehp_field));
        }, this);
        
        _.each(alternatives, function(alt, alt_field) {
            var alt_stats   = alt[0];
            var reltosource = alt[1];
            var selector    = "." + alt_field +  "_alt_ehp";
            var alt_model   = this.model.clone();
            
            alt_model.set(alt_stats);

            var alt_ehp_title = 'EHP', alt_ehp_field = 'ehp';
            
            if($(selector, this.el).hasClass('melee_only')) {
                alt_ehp_title = "EHP melee";
                alt_ehp_field = "ehp_melee";
            } else if($(selector, this.el).hasClass('magic_only')) {
                alt_ehp_title = "EHP magic";
                alt_ehp_field = "ehp_magic";
            }
            
            var ehp     = this.model.get(alt_ehp_field);
            var alt_ehp = alt_model.get(alt_ehp_field);
            
            var ehp_change   = alt_ehp - ehp;
            var ehp_change_p = (ehp_change / (reltosource ? ehp : alt_ehp));

            ehp_change   = (ehp_change   > 0) ? ("+" + this.prepareVal(ehp_change, '', 0))  : this.prepareVal(ehp_change, '', 0);
            ehp_change_p = (ehp_change_p > 0) ? ("+" + this.prepareVal(ehp_change_p, '%'))  : this.prepareVal(ehp_change_p, '%');
            
            var html = "" + ehp_change + " " + alt_ehp_title + "; " + ehp_change_p;
            
            $(selector, this.el).html(html);
        }, this);
    },

    changeClass: function() {
        classname = $('.your_class', this.el).val();

        this.model = getModelForClass(classname);
        this.model.on('change', this.modelToView, this);

        this.renderOptions();
        this.modelToView();
        $(".auto_tooltip").tooltip();
        
        if (gahandler) {
            gahandler.changeClass(classname)
        }
    },
    
    inputNewChar: function() {
        this.mainView.changeView(function(contentEl, mainView) { return new InputView({'el': contentEl, 'mainView': mainView}); });
    },

    prepareVal: function(val, field, dec) {
        if (field == 'armor_reduc' || field == 'resist_reduc' || field == '%') {
            dec = dec != undefined ? dec : 2;
            
            val *= 100;
            val = this.roundNumber(val, dec);
            val = ""+val+"%";
            
            return val;
        } else {
            dec = dec != undefined ? dec : 2;
            return this.roundNumber(val, dec);
        }
    },

    roundNumber: function(num, dec) {
        return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
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

        $(".auto_tooltip").tooltip();
        $("#dodge_ehp_explained").tooltip({
            title: "<strong>keep in mind; dodge is random.</strong><br />" +
                   "In normal EHP calculations it's excluded since if you get unlucky you will have 0 dodges before your health pool is empty!"
        });

        this.changeClass();
    }
});