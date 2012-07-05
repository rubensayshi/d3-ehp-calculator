var ItemView = Backbone.View.extend({
    title: '-',
    events: {
        'change input': 'viewToModel',
        'click .btn.reset': 'reset'
    },

    initialize: function() {
        _.bindAll(this);

        this.template = _.template($('#item-template').html());
    },
    
    getSelector: function(fieldname) {
        return "." + fieldname;
    },

    reset: function() {
        this.model.reset();
    },

    viewToModel: function() {
        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = this.getSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                // --
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                this.model.set(optionName, !!$fieldObj.prop('checked'));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text' && !$fieldObj.prop('readonly')) {
                var val = $fieldObj.val();
                    val = $fieldObj.hasClass('plain') ? val : normalizeFloat(val, optionName);
                
                this.model.set(optionName, val);
            } else if ($fieldObj.is('select') && !$fieldObj.prop('readonly')) {
                this.model.set(optionName, $fieldObj.val());
            }
        }, this);
        
        if (this.model.collection) {
            this.model.save();
        }
    },
    
    renderOptionRow: function($parent, optionInfo, optionName) {
        optionInfo['type']  = optionInfo['type']  || 'checkbox';
        optionInfo['title'] = optionInfo['title'] || "[" + optionName + "]";
        
        var $row, $col1, $col2, $col3, $input, $alt;
        
        $row = $('<tr />')
                    .appendTo($parent);
        $col1 = $('<th />')
                    .append($('<span />').html(optionInfo['title']))
                    .appendTo($row);
        $col2 = $('<td />')
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
                        .addClass(typeof(optionInfo['plain']) != 'undefined' ? 'plain' : '')
                        .addClass(optionName);
        }
        
        if (optionInfo['disabled']) {
            $input.attr('disabled', true);
        }
        
        $input.appendTo($col2);
    },
    
    renderOptions: function() {        
        _.each({
            '#base_options tbody':       this.model.base_options
        }, function(options, parent) {
            var $parent = $(parent, this.el);
            
            if (!$parent) {
                return;
            }
            
            $parent.empty();
            
            _.each(options, function(optionInfo, optionName) { 
                this.renderOptionRow($parent, optionInfo, optionName); 
            }, this);
        }, this);
    },

    modelToView: function() {
        var toField = _.bind(function($fieldObj, selector, fieldName, fieldValue) {
            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                $fieldObj.html(this.prepareVal(fieldValue, fieldName));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                $fieldObj.prop('checked', !!fieldValue);
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text') {
                fieldValue = $fieldObj.hasClass('plain') ? fieldValue : this.prepareVal(fieldValue, fieldName);
                
                $fieldObj.val(fieldValue);
            } else if ($fieldObj.is('select')) {
                $fieldObj.val(fieldValue);
            }
        }, this);
        
        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = this.getSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            toField($fieldObj, selector, optionName, this.model.get(optionName));
        }, this);
    },
    
    renderItem: function() {
        this.model.on('change', this.modelToView, this);
        
        this.renderOptions();
        this.modelToView();
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
        if (!this.model) {
            this.model = new Item();
        }
        
        $(this.template()).appendTo($(this.el));
        $('.title span', this.el).html(this.options.title);
        if (this.options.isNewItem) {
            $('.title', this.el).append('<button class="btn reset btn-primary btn-mini pull-right"><i class="icon-refresh icon-white"></i> Reset</button>');
        }

        this.renderItem();
    }
});
