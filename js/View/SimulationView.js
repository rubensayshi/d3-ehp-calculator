var SimulationView = Backbone.View.extend({
    events: {
        'change input':              'viewToModel',
        'change input':              'viewToModel',
        'change select':             'viewToModel',
        'change .your_class':        'changeClass',
        'click #item-compare-alert .close': 'closeItemCompareAlert',
        'click button.reset':        'viewToModel',
        'click button.equip-new-item': 'equipNewItem'
    },


    itemslots : ['head', 'shoulders', 'chest', 'hands', 'wrist', 'waist', 'legs', 'feet', 'amulet', 'ring1', 'ring2', 'weapon', 'offhand'],
    activeitemslot : null,

    initialize: function() {
        _.bindAll(this);

        updateBreadcrumb("calculator");

        this.template = _.template($('#simulation-template').html());
        this.result_row_template = _.template($('#result-row-template').html());
        this.itemcompare_result_row_template = _.template($('#itemcompare-result-row-template').html());

        this.options.settings.on('change display_as', this.modelToView);
    },

    closeItemCompareAlert : function() {
        if (localStorage) {
            localStorage.setItem('closeItemCompareAlert', true);
        }
    },

    getActiveItemSlot: function() {
        return $('ul.slot-list li.active').data('itemslot');
    },

    equipNewItem: function() {
        var itemSlot = this.getActiveItemSlot();
        var curItem = this.model.getItemForSlot(itemSlot, this.model.gearbag);
        var newItem = this.model.getItemForSlot(itemSlot, this.model.new_gearbag);
        var model = this.model;

        // modify this if you modify the item compare view
        var statsMapping = [
            'extra_str',
            'extra_dex',
            'extra_int',
            'base_vit',
            'base_armor',
            'base_resist',
            'base_dodge',
            'extra_life',
            'base_melee_reduc',
            'base_ranged_reduc',
            'base_elite_reduc',
            'block_chance',
            'min_block_value',
            'max_block_value'
        ];

        _.each(statsMapping, function(optionName) {
            model.set(optionName, model.get(optionName) - curItem.get(optionName) + newItem.get(optionName));
        })

        model.set('base_str', model.get('base_str') + model.get('extra_str'));
        model.set('base_armor', model.get('base_armor') + model.get('extra_armor') + model.get('extra_str') * 1);
        model.set('extra_str', 0);
        model.set('extra_armor', 0); // not used anywhere at the time of committing this code

        model.set('base_int', model.get('base_int') + model.get('extra_int'));
        model.set('base_resist', model.get('base_resist') + model.get('extra_resist') + model.get('extra_int') * 0.1);
        model.set('extra_int', 0);
        model.set('extra_resist', 0); // not used anywhere at the time of committing this code

        model.set('base_dodge', model.get('base_dodge') + model.getDodgeFromExtraDex());
        model.set('base_dex', model.get('base_dex') + model.get('extra_dex'));
        model.set('extra_dex', 0);

        model.simulate();

        curItem.overwriteStatsWith(newItem);
        newItem.reset();
    },

    validateNewItemEquippable: function(itemSlot) {
        var newItem = this.model.getItemForSlot(itemSlot, this.model.new_gearbag);
        var $tabPane = $('.tab-pane').filter(function() { return $.data(this, "itemslot") == itemSlot; });
        if (newItem.hasNonDefaultValues()) {
            $('button.equip-new-item', $tabPane).removeAttr('disabled');
        }
        else {
            $('button.equip-new-item', $tabPane).attr('disabled', true);
        }
    },

    getSelector: function(fieldname) {
        return '.' + fieldname;
    },

    getCharacterSelector: function(fieldname) {
        return '.character ' + this.getSelector(fieldname);
    },

    getStatWeightSelector: function(fieldname) {
        return '.statweight ' + this.getSelector(fieldname);
    },

    getItemCompareSelector: function(fieldname) {
        return '.item-compare ' + this.getSelector(fieldname);
    },

    viewToModel: function() {
        var props = {};

        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = this.getCharacterSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                // --
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                props[optionName] = !!$fieldObj.prop('checked');
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text' && !$fieldObj.prop('readonly')) {
                var val = $fieldObj.val();
                    val = $fieldObj.hasClass('plain') ? val : normalizeFloat(val, optionName);

                props[optionName] = val;
            } else if ($fieldObj.is('select') && !$fieldObj.prop('readonly')) {
                props[optionName] = $fieldObj.val();
            }
        }, this);

        this.model.set(props);

        this.model.save();
    },

    renderStatWeightRow: function($parent, optionInfo, optionName) {
        optionInfo['title'] = optionInfo['title'] || "[" + optionName + "]";
        optionInfo['alt']   = optionInfo['alt']   || "";

        var altamount = typeof(optionInfo['alternative']) == 'object' ? optionInfo['alternative'][0] : optionInfo['alternative'];

        var $row, $col1, $col2, $col3, $col4, $input, $alt;
        $row = $('<tr />')
                .addClass(optionName + "_alt_ehp")
                .appendTo($parent);
        $col1 = $('<th />')
                .html("+"+altamount+" "+optionInfo['title']+"<br />")
                .attr('title', optionInfo['alt'])
                .appendTo($row);
        $col2 = $('<td />')
                .appendTo($row);
        $col3 = $('<td />')
                .appendTo($row);
        $col4 = $('<td />')
                .appendTo($row);

        _.each(alttypes, function(title, resulttype) {
            if (typeof(optionInfo[resulttype + '_only']) != 'undefined') {
                $row.addClass(resulttype + '_only');
            }
        }, this);

        $('<span />').addClass('statweight_ehp').appendTo($col2);
        $('<span />').addClass('statweight_viteq').appendTo($col3);
        $('<span />').addClass('statweight_percentage').appendTo($col4);


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

        if (optionInfo['disabled']) {
            $input.attr('disabled', true);
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
            if (typeof optionInfo['alternative'] != 'boolean') {
                var altamount = typeof(optionInfo['alternative']) == 'object' ? optionInfo['alternative'][0] : optionInfo['alternative'];
                $col3.append($('<strong />').html("+"+altamount+" "+optionInfo['title']));
            }

            $altinfo = $('<i class="pull-right" />').appendTo($col3);
                       $('<br />').appendTo($col3);
            $alt     = $('<span />').appendTo($col3);

            $alt.addClass(optionName + "_alt_ehp");
            $alt.addClass("alt_ehp");


            _.each(alttypes, function(title, resulttype) {
                var x_prop  = resulttype + '_only';
                var x_title = title + ' only';

                if (typeof(optionInfo[x_prop]) != 'undefined') {
                    $altinfo.html(x_title);
                    $alt.addClass(x_prop);
                }
            }, this);

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

        var $parent = $('#statweight tbody', this.el);
        _.each(['base_str', 'base_dex', 'base_int', 'base_vit', 'base_armor', 'base_resist', 'extra_life', 'base_melee_reduc', 'base_ranged_reduc', 'block_chance', 'avg_block_value'], function(optionName) {
            this.renderStatWeightRow($parent, this.model.base_options[optionName], optionName);
        }, this);
    },


    toField: function($fieldObj, fieldName, fieldValue) {
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
        var vit_model = this.model.clone();
        vit_model.set('base_vit', vit_model.get('base_vit')+1);
        var vit_ehp = vit_model.get('ehp_base') - this.model.get('ehp_base');

        var alternatives = {};

        _.each(this.model.getAllOptions(), function(optionInfo, optionName) {
            var selector = this.getCharacterSelector(optionName);
            var $fieldObj = $(selector,  this.el);

            this.toField($fieldObj, optionName, this.model.get(optionName));

            if (typeof(optionInfo['alternative']) != 'undefined') {
                if (typeof optionInfo['alternative'] == 'object') {
                    alternatives[optionName] = [optionInfo['alternative'][1], true];
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

            this.toField($fieldObj, buffed_stats_field, this.model.get(buffed_stats_field));
        }, this);

        _.each(resulttypes, function(resulttype) {
            _.each(['', 'd', 'b', 'bnd'], function(alternative) {
                var ehp_field = 'ehp_'+resulttype+ (alternative ? '_' + alternative : '');

                var $fieldObj = $(this.getCharacterSelector(ehp_field),  this.el);
                this.toField($fieldObj, ehp_field, this.model.get(ehp_field));
            }, this);
        }, this);

        _.each(alternatives, function(alt, alt_field) {
            var alt_stats     = alt[0];
            var reltosource   = alt[1];
            var statweightsel = this.getStatWeightSelector(alt_field + "_alt_ehp");
            var charactersel  = this.getCharacterSelector(alt_field + "_alt_ehp");
            var alt_model     = this.model.clone();

            alt_model.set(alt_stats);

            var alt_ehp_field = 'ehp_base';

            _.each(alttypes, function(title, resulttype) {
                if($(charactersel, this.el).hasClass(resulttype + '_only')) {
                    alt_ehp_field = 'ehp_' + resulttype;
                }
            }, this);

            var ehp     = this.model.get(alt_ehp_field);
            var alt_ehp = alt_model.get(alt_ehp_field);

            var ehp_change   = alt_ehp - ehp;
            var ehp_change_p = (ehp_change / (reltosource ? ehp : alt_ehp));
            var viteq        = ehp_change / vit_ehp;


            ehp_change   = (ehp_change   > 0) ? ("+" + this.prepareVal(ehp_change, '', 0))  : this.prepareVal(ehp_change, '', 0);
            ehp_change_p = (ehp_change_p > 0) ? ("+" + this.prepareVal(ehp_change_p, '%'))  : this.prepareVal(ehp_change_p, '%');
            viteq        = (viteq > 0)        ? ("+" + this.prepareVal(viteq, '', 2))       : this.prepareVal(viteq);

            var $fixedchange = this.options.settings.get('display_as') == Settings.DISPLAY_AS_EHP ?
                        $('<em />').html(ehp_change + " EHP") :
                        $('<em />').html(viteq + " VITeq");

            $(charactersel, this.el).html("");
            $(charactersel, this.el).append(
                                        $fixedchange,
                                        $('<em />').html(ehp_change_p)
                                    );

            $('.statweight_ehp',        $(statweightsel, this.el)).html(ehp_change);
            $('.statweight_viteq',      $(statweightsel, this.el)).html(viteq);
            $('.statweight_percentage', $(statweightsel, this.el)).html(ehp_change_p);


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
                                        this.activeitemslot = itemslot;
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
            (new ItemView({'el': $newItem,     'model': newItem, 'title': 'New Item', 'isNewItem': true})).render();

            $('.title', $newItem).append('<button class="btn equip-new-item btn-primary btn-mini pull-right"><i class="icon-chevron-left icon-white"></i> Equip</button>');

            curItem.on('change', function() { this.doItemCompare(itemslot); }, this);
            newItem.on('change', function() { this.doItemCompare(itemslot); }, this);

            newItem.on('change', function() { this.validateNewItemEquippable(itemslot); }, this);

            $('ul.slot-list', this.el).append($tab);
            $('div.slot-list', this.el).append($tabpane);

            this.validateNewItemEquippable(itemslot);
        }, this);

        $('ul.slot-list > li:first', this.el).addClass('active');
        $('div.slot-list > div:first', this.el).addClass('active');

        _.each(resulttypes, function(resulttype) {
            var title = 'EHP ' + (resulttype == 'base' ? '' : resulttype);
            $(this.itemcompare_result_row_template({'key': resulttype, 'title': title, 'type': 'ehp'})).appendTo($('#item-compare-ehp table.results tbody', this.el));
        }, this);

        _.each(resulttypes, function(resulttype) {
            var title = 'VITeq ' + (resulttype == 'base' ? '' : resulttype);
            $(this.itemcompare_result_row_template({'key': resulttype, 'title': title, 'type': 'viteq'})).appendTo($('#item-compare-viteq table.results tbody', this.el));
        }, this);


        this.activeitemslot = $('ul.slot-list > li:first', this.el).data('itemslot');
        this.doItemCompare();
        this.model.on('change', _.bind(function() { this.doItemCompare(); }, this));
    },

    doItemCompare : function(itemslot) {
        itemslot = itemslot || this.activeitemslot;

        var vit_model = this.model.clone();
        vit_model.set('base_vit', vit_model.get('base_vit')+1);
        var vit_ehp = vit_model.get('ehp_base') - this.model.get('ehp_base');

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

        _.each(resulttypes, function(resulttype) {
            _.each(['', 'd', 'b', 'bnd'], function(alternative) {
                var ehp_field   = 'ehp_'+resulttype+ (alternative ? '_' + alternative : ''),
                    viteq_field = 'viteq_'+resulttype+ (alternative ? '_' + alternative : ''),
                    $fieldObj   = null;

                var viteq = this.model.get(ehp_field) / vit_ehp;

                // set the EHP field
                $fieldObj = $(this.getCharacterSelector(ehp_field),  this.el);
                this.toField($fieldObj, ehp_field, this.model.get(ehp_field));

                // set the VITeq field
                $fieldObj = $(this.getCharacterSelector(viteq_field),  this.el);
                this.toField($fieldObj, viteq_field, viteq);
            }, this);
        }, this);

        _.each(resulttypes, function(resulttype) {
            _.each(['', 'd', 'b', 'bnd'], function(alternative) {
                var ehp_field      = 'ehp_'+resulttype+ (alternative ? '_' + alternative : ''),
                    viteq_field    = 'viteq_'+resulttype+ (alternative ? '_' + alternative : ''),
                    ehp_selector   = this.getItemCompareSelector(ehp_field),
                    viteq_selector = this.getItemCompareSelector(viteq_field);

            var ehp     = this.model.get(ehp_field);
            var alt_ehp = compareModel.get(ehp_field);

            var ehp_change   = alt_ehp - ehp;
            var ehp_change_p = (ehp_change / ehp);
            var viteq        = ehp_change / vit_ehp;;

            ehp_change   = (ehp_change   > 0) ? ("+" + this.prepareVal(ehp_change, '', 0))  : this.prepareVal(ehp_change, '', 0);
            ehp_change_p = (ehp_change_p > 0) ? ("+" + this.prepareVal(ehp_change_p, '%'))  : this.prepareVal(ehp_change_p, '%');
            viteq        = (viteq > 0)        ? ("+" + this.prepareVal(viteq, '', 2))       : this.prepareVal(viteq);

            $(ehp_selector, this.el).val(ehp_change);
            $(ehp_selector + '.percentage', this.el).val(ehp_change_p);

            $(viteq_selector, this.el).val(viteq);
            $(viteq_selector + '.percentage', this.el).val(ehp_change_p);
            }, this);
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
        _.each(resulttypes, function(resulttype) {
            var title = 'EHP ' + (resulttype == 'base' ? '' : resulttype);
            $(this.result_row_template({'key': resulttype, 'title': title})).appendTo($('.character table.results tbody', this.el));
        }, this);

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
