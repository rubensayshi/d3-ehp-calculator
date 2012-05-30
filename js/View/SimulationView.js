var SimulationView = Backbone.View.extend({
    el: $('#ehp'),

    events: {
        'change input':       'viewToModel',
        'change .input_select': 'viewToModel',
        'change .your_class': 'changeClass',
        'click button.reset': 'viewToModel'
    },

    fieldMap: {
        '.your_class':      'your_class',
        '.level':           'level',
        '.extra_life':      'extra_life',
        '.base_vit':        'base_vit',
        '.base_dex':        'base_dex',
        '.base_int':        'base_int',
        '.base_armor':      'base_armor',
        '.base_resist':     'base_resist',
        '.base_dodge':      'base_dodge',
        '.base_melee_reduc': 'base_melee_reduc',
        '.base_ranged_reduc':'base_ranged_reduc',

        // BARBARIAN
        '.toughasnails':    'toughasnails',
        '.nervesofsteel':   'nervesofsteel',
        '.warcry':          'warcry',
        '.warcry_armor':    'warcry_armor',
        '.warcry_resist':   'warcry_resist',
        '.warcry_dodge':    'warcry_dodge',
        '.warcry_life':     'warcry_life',
        '.threat_shout':    'threat_shout',
        '.superstition':    'superstition',

        // WIZARD
        '.energy_armor':    'energy_armor',
        '.prismatic':       'prismatic',
        '.blur':            'blur',
        '.glass_cannon':    'glass_cannon',
        '.archon':          'archon',

        // MONK
        '.resolve':                   'resolve',
        '.seize_the_initiative':      'seize_the_initiative',
        '.the_guardians_path':        'the_guardians_path',
        '.mantra_of_evasion':         'mantra_of_evasion',
        '.mantra_of_evasion_armor':   'mantra_of_evasion_armor',
        '.mantra_of_healing_time':    'mantra_of_healing_time',
        '.mantra_of_healing_heavenly':'mantra_of_healing_heavenly',
        '.deadly_reach_keen_eye':     'deadly_reach_keen_eye',
        '.crippling_wave_concussion': 'crippling_wave_concussion',
        '.fists_of_thunder_flash':    'fists_of_thunder_flash',
        
        // WITCH DOCTOR
        '.jungle_fortitude':      'jungle_fortitude',
        '.gruesome_feast':        'gruesome_feast',
        '.bad_medicine':          'bad_medicine',
        '.soul_harvest':          'soul_harvest',
        '.zombie_dogs_life_link': 'zombie_dogs_life_link',
        '.horrify_frightening_aspect': 'horrify_frightening_aspect',

        '.moblevel':        'moblevel',

        '.life':            'life',
        '.armor':           'armor',
        '.resist':          'resist',
        '.dodge':           'dodge',
        '.armor_reduc':     'armor_reduc',
        '.resist_reduc':    'resist_reduc',

        '.ehp':             'ehp',
        '.ehp_dodge':       'ehp_dodge',
        '.ehp_melee':       'ehp_melee',
        '.ehp_dodge_melee': 'ehp_dodge_melee',
        '.ehp_ranged':      'ehp_ranged',
        '.ehp_dodge_ranged':'ehp_dodge_ranged',
        '.ehp_magic':       'ehp_magic',
        '.ehp_dodge_magic': 'ehp_dodge_magic'
    },

    classFields: [
        'toughasnails',
        'nervesofsteel',
        'warcry',
        'warcry_armor',
        'warcry_resist',
        'warcry_dodge',
        'warcry_life',
        'threat_shout',
        'superstition',
        'energy_armor',
        'prismatic',
        'blur',
        'glass_cannon',
        'archon',
        'resolve',
        'seize_the_initiative',
        'the_guardians_path',
        'mantra_of_evasion',
        'mantra_of_evasion_armor',
        'mantra_of_healing_time',
        'mantra_of_healing_heavenly',
        'deadly_reach_keen_eye',
        'crippling_wave_concussion',
        'fists_of_thunder_flash'
    ],

    initialize: function() {
        _.bindAll(this, 'render', 'modelToView', 'viewToModel', 'changeClass');

        this.template = _.template($('#simulation-template').html());

        this.class_templates = {
            "br": _.template($('#simulation-br-template').html()),
            "dh": _.template($('#simulation-not-available-template').html()),
            "mn": _.template($('#simulation-mn-template').html()),
            "wd": _.template($('#simulation-wd-template').html()),
            "wz": _.template($('#simulation-wz-template').html())
        };

        this.render();
        this.changeClass();
    },

    viewToModel: function() {
        _.each(this.fieldMap, function(field, selector) {
            var $fieldObj = $(selector,  this.el);

            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                // --
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                this.model.set(field, !!$fieldObj.prop('checked'));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text' && !$fieldObj.prop('readonly')) {
                    var val = $fieldObj.val();
                    
                    var normalizeFloat = function(val, alertOnError) {
                        var res = parseFloat(val);
   
                        if (isNaN(res) || (res != val && res == parseInt(val))) {
                            if (alertOnError) {
                                alert("We failed to properly parse the value for [" + field + "]");
                            
                            return 0;
                        } else {                  
                            return normalizeFloat(val.replace(",", "."), true);
                        }
                    }
                    
                    return res;
                };

                val = normalizeFloat(val);
                
                this.model.set(field, parseFloat($fieldObj.val()));
            } else if ($fieldObj.is('select') && !$fieldObj.prop('readonly')) {
                this.model.set(field, $fieldObj.val());
            }
        }, this);
    },

    modelToView: function() {
        $(this.el).find('.class_options').remove();
        $(this.el).find('#options').after($(this.class_templates[this.model.get('your_class')]()));

        _.each(this.fieldMap, function(field, selector) {
            var $fieldObj = $(selector,  this.el);

            if ($fieldObj.is('span') || $fieldObj.is('td')) {
                $fieldObj.html(this.prepareVal(this.model.get(field), field));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'checkbox') {
                $fieldObj.prop('checked', !!this.model.get(field));
            } else if ($fieldObj.is('input') && $fieldObj.prop('type') == 'text') {
                $fieldObj.val(this.prepareVal(this.model.get(field), field));
            } else if ($fieldObj.is('select')) {
                $fieldObj.val(this.model.get(field));
            }
        }, this);
        
        var alt_booleans = this.classFields;
        var alt_stats = {
            base_armor:      10,
            base_vit:        1,
            base_resist:     1,
        };
        
        var alternatives = {};
        _.each(alt_booleans, function(alt_field) {
            alternatives[alt_field] = [{/* this should contain stat changes */}, !this.model.get(alt_field)];
            // set the stat change
            alternatives[alt_field][0][alt_field] = !this.model.get(alt_field);
        }, this);
        _.each(alt_stats, function(alt_val, alt_field) {
            alternatives[alt_field] = [{/* this should contain stat changes */}, true];
            // set the stat change
            alternatives[alt_field][0][alt_field] = this.model.get(alt_field) + alt_val;
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

    changeClass: function(event) {
        classname = $('.your_class', this.el).val();

        this.model = getModelForClass(classname);
        this.model.on('change', this.modelToView, this);

        this.modelToView();
        $(".auto_tooltip").tooltip();
        
        if (gahandler) {
            gahandler.changeClass(classname)
        }
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
    }
});