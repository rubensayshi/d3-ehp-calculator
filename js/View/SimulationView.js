var SimulationView = Backbone.View.extend({
    events: {
        'change input':              'viewToModel',
        'change input':              'viewToModel',
        'change select':             'viewToModel',
        'change .your_class':        'changeClass',
        'click #item-compare-alert .close': 'closeItemCompareAlert', 
        'click button.reset':        'viewToModel'
    },
    
    itemslots : ['head', 'shoulders', 'chest', 'hands', 'wrist', 'waist', 'legs', 'feet', 'amulet', 'ring1', 'ring2', 'weapon', 'offhand'],

    initialize: function() {
        _.bindAll(this);
        
        updateBreadcrumb("calculator");

        this.template = _.template($('#simulation-template').html());
    },
    
    closeItemCompareAlert : function() {
        if (localStorage) {
            localStorage.setItem('closeItemCompareAlert', true);
        }
    },

    getSelector: function(fieldname) {
        return '.' + fieldname;
    },

    getCharacterSelector: function(fieldname) {
        return '.character ' + this.getSelector(fieldname);
    },

    getItemCompareSelector: function(fieldname) {
        return '.item-compare ' + this.getSelector(fieldname);
    },

    viewToModel: function() {
        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = this.getCharacterSelector(optionName);
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

        this.model.save();
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
                        .addClass(typeof(optionInfo['plain']) != 'undefined' ? 'plain' : '')
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
        
        if (typeof(optionInfo['alternative']) != 'undefined') {
            if (typeof optionInfo['alternative'] == 'boolean') {
                $alt = $col3;
            } else {
                var altamount = typeof(optionInfo['alternative']) == 'object' ? 1 : optionInfo['alternative'];
                
                $alt = $('<strong />').html("+"+altamount+" "+optionInfo['title']+"<br />").appendTo($col3);
                $alt = $('<span />');
            }

            $alt.addClass(optionName + "_alt_ehp");
            
            _.each(['magic_only', 'melee_only', 'ranged_only', 'dodge_only', 'elite_only'], function(x_only) {
                if (typeof(optionInfo[x_only]) != 'undefined') {
                    $alt.addClass(x_only);                        
                }
            });
            
            if ($alt != $col3) {
                $alt.appendTo($col3);
            }
        }
    },
    
    renderOptions: function() {        
        _.each({
            '#base_options tbody':  this.model.base_options,
            '#options tbody':       this.model.options,
            '#extra_options tbody': this.model.extra_options,
            '#shared_options tbody':this.model.shared_options
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
    

    toField: function($fieldObj, selector, fieldName, fieldValue) {
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
    },

    modelToView: function() {
        var alternatives = {};
        
        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = this.getCharacterSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            this.toField($fieldObj, selector, optionName, this.model.get(optionName));
            
            if (typeof(optionInfo['alternative']) != 'undefined') {
                if (typeof optionInfo['alternative'] == 'object') {
                    alternatives[optionName] = [optionInfo['alternative'], true];
                } else if (typeof optionInfo['alternative'] == 'boolean') {
                    alternatives[optionName] = [{/* this should contain stat changes */}, !this.model.get(optionName)];
                    alternatives[optionName][0][optionName] = !this.model.get(optionName);
                } else {
                    alternatives[optionName] = [{/* this should contain stat changes */}, true];
                    alternatives[optionName][0][optionName] = this.model.get(optionName) + optionInfo['alternative'];
                }
            }            
        }, this);
        
        _.each(['life', 'armor', 'armor_reduc', 'resist', 'resist_reduc', 'dodge'], function(buffed_stats_field) {
            var selector = this.getCharacterSelector(buffed_stats_field);
            var $fieldObj = $(selector,  this.el);

            this.toField($fieldObj, selector, buffed_stats_field, this.model.get(buffed_stats_field));
        }, this);

        _.each(['ehp', 'ehp_dodge', 'ehp_melee', 'ehp_dodge_melee', 'ehp_ranged', 'ehp_dodge_ranged', 'ehp_magic', 'ehp_dodge_magic', 'ehp_elite', 'ehp_dodge_elite'], function(ehp_field) {
            var selector = this.getCharacterSelector(ehp_field);
            var $fieldObj = $(selector,  this.el);

            this.toField($fieldObj, selector, ehp_field, this.model.get(ehp_field));
        }, this);
        
        _.each(alternatives, function(alt, alt_field) {
            var alt_stats   = alt[0];
            var reltosource = alt[1];
            var selector    = this.getCharacterSelector(alt_field + "_alt_ehp");
            var alt_model   = this.model.clone();
            
            alt_model.set(alt_stats);

            var alt_ehp_title = 'EHP', alt_ehp_field = 'ehp';

            if($(selector, this.el).hasClass('melee_only')) {
                alt_ehp_title = "EHP melee";
                alt_ehp_field = "ehp_melee";
            } else if($(selector, this.el).hasClass('ranged_only')) {
                alt_ehp_title = "EHP ranged";
                alt_ehp_field = "ehp_ranged";
            } else if($(selector, this.el).hasClass('magic_only')) {
                alt_ehp_title = "EHP magic";
                alt_ehp_field = "ehp_magic";
            } else if($(selector, this.el).hasClass('dodge_only')) {
                alt_ehp_title = "EHP dodge";
                alt_ehp_field = "ehp_dodge";
            } else if($(selector, this.el).hasClass('elite_only')) {
                alt_ehp_title = "EHP elite";
                alt_ehp_field = "ehp_elite";
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

        newModel = this.model = CharacterList.getModelByClass(classname);
        CharacterList.add(newModel);
        
        this.renderClass();
    },
    
    renderItemCompare : function() {
        _.each(this.itemslots, function(itemslot) {
            var tid          = this.cid + "_" + itemslot;
            
            var $currentItem = $('<div class="current-item span6" />'),
                $newItem     = $('<div class="new-item span6" />'),
                $tabpane     = $('<div class="tab-pane" />')
                                    .attr('id', tid)
                                    .data('itemslot', itemslot)
                                    .append($currentItem)
                                    .append($newItem),
                $tabA        = $('<a />')
                                    .on('click', _.bind(function(e) {
                                        this.doItemCompare(itemslot);
                                        $tabA.tab('show');         
                                        e.preventDefault();
                                    }, this))
                                    .attr('href', "#" + tid)
                                    .html(itemslot),
                $tab         = $('<li />')
                                    .data('itemslot', itemslot)
                                    .append($tabA);

            var curItem = this.model.getItemForSlot(itemslot, this.model.gearbag);
            var newItem = this.model.getItemForSlot(itemslot, this.model.new_gearbag);
           
            (new ItemView({'el': $currentItem, 'model': curItem, 'title': 'Current Item'})).render();
            (new ItemView({'el': $newItem,     'model': newItem, 'title': 'New Item'})).render();

            curItem.on('change', function() { this.doItemCompare(itemslot); }, this);
            newItem.on('change', function() { this.doItemCompare(itemslot); }, this);
            
            $('ul.slot-list', this.el).append($tab);
            $('div.slot-list', this.el).append($tabpane);
        }, this);

        $('ul.slot-list > li:first', this.el).addClass('active');
        $('div.slot-list > div:first', this.el).addClass('active');
        
        this.doItemCompare($('ul.slot-list > li:first', this.el).data('itemslot'));
    },
    
    doItemCompare : function(itemslot) {
        var curItem = this.model.getItemForSlot(itemslot, this.model.gearbag);
        var newItem = this.model.getItemForSlot(itemslot, this.model.new_gearbag);
        
        var compareModel = this.model.clone();

        _.each(curItem.getAllOptions(), function(optionInfo, optionName) {
            compareModel.set(optionName, compareModel.get(optionName) - curItem.get(optionName));
        });
        
        _.each(newItem.getAllOptions(), function(optionInfo, optionName) {
            compareModel.set(optionName, compareModel.get(optionName) + newItem.get(optionName));
        });
        
        compareModel.simulate();
        
        _.each(['ehp', 'ehp_dodge', 'ehp_melee', 'ehp_dodge_melee', 'ehp_ranged', 'ehp_dodge_ranged', 'ehp_magic', 'ehp_dodge_magic', 'ehp_elite', 'ehp_dodge_elite'], function(ehp_field) {
            var selector = this.getItemCompareSelector(ehp_field);
            
            var ehp     = this.model.get(ehp_field);
            var alt_ehp = compareModel.get(ehp_field);
            
            var ehp_change   = alt_ehp - ehp;
            var ehp_change_p = (ehp_change / ehp);

            ehp_change   = (ehp_change   > 0) ? ("+" + this.prepareVal(ehp_change, '', 0))  : this.prepareVal(ehp_change, '', 0);
            ehp_change_p = (ehp_change_p > 0) ? ("+" + this.prepareVal(ehp_change_p, '%'))  : this.prepareVal(ehp_change_p, '%');

            $(selector, this.el).val(ehp_change);
            $(selector + '.percentage', this.el).val(ehp_change_p);
        }, this);
    },
    
    renderClass: function() {
        this.model.on('change', this.modelToView, this);

        this.renderOptions();
        this.modelToView();
        this.renderItemCompare();
        $(".auto_tooltip").tooltip();
        
        updateBreadcrumb("calculator/" + this.model.id);
        
        if (gahandler) {
            gahandler.changeClass(this.model.get('your_class'));
        }
        
    },

    prepareVal: function(val, field, dec) {
        if (field == 'armor_reduc' || field == 'resist_reduc' || field == 'dodge' || field == '%') {
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
            this.renderClass();
        } else {
            this.changeClass();
        }
        
        if (localStorage && localStorage.getItem('closeItemCompareAlert')) {
            $('#item-compare-alert', this.el).hide();
        }

        $("#dodge_ehp_explained").tooltip({
            title: "<strong>keep in mind; dodge is random.</strong><br />" +
                   "In normal EHP calculations it's excluded since if you get unlucky you will have 0 dodges before your health pool is empty!"
        });
    }
});
