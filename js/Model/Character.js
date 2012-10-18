var Character = Backbone.Model.extend({
    defaults : {
        description: 'My Character',
        level:        60,
        base_vit:     1000,
        base_dex:     1000,
        base_int:     1000,
        base_str:     1000,
        base_armor:   4000,
        base_resist:  200,
        base_dodge:   10,
        extra_life:   13,
        base_melee_reduc:   0,
        base_ranged_reduc:  0,
        block_chance:    0,
        min_block_value: 0,
        max_block_value: 0,
        incoming_hit: 70000,

        melee:        false,

        moblevel:     63,

        extra_vit:    0,
        extra_dex:    0,
        extra_int:    0,
        extra_str:    0,
        extra_armor:  0,
        extra_resist: 0,

        vit:          null,
        dex:          null,
        life:         null,
        armor:        null,
        resist:       null,
        dodge:        null,
        armor_reduc:  null,
        resist_reduc: null,
        avg_block_value:       0,
        extra_avg_block_value: 0,

        stealfromundefined: true
    },

    gearbag: null,
    new_gearbag: null,

    base_options:  {
        your_class:       {"type": "select", "default": "br", "title": "Your Class", "options": function () {
            var classes = {};

            _.each(classlist, function(info, shortname) {
                classes[shortname] = info[1];
            }, this);

            return classes;
        }},
        description:      {"type": "text", "default": "",   "title": "Description", "plain": true, "tip": "This is what we'll use in the list of saved characters."},
        level:            {"type": "text", "default": 60,   "title": "Level"},
        moblevel:         {"type": "text", "default": 63,   "title": "Mob Level"},
        base_str:         {"type": "text", "default": 1000, "title": "STR", "tip": "Str isn't used for anything", "alternative": [1, {extra_str: 1}]},
        base_dex:         {"type": "text", "default": 1000, "title": "DEX", "tip": "Dex is only used for skill effects (eg monk passive), not for dodge", "base_d_only": true, "alternative": [1, {extra_dex: 1}]},
        base_int:         {"type": "text", "default": 1000, "title": "INT", "tip": "Int is only used for skill effects (eg witch doctor passive), not for resist", "alternative": [1, {extra_int: 1}]},
        base_vit:         {"type": "text", "default": 1000, "title": "VIT", "alternative": 1},
        base_armor:       {"type": "text", "default": 4000, "title": "Armor", "alternative": 10},
        base_resist:      {"type": "text", "default": 200,  "title": "All Resist", "alternative": 1, 'tip': "Insert your most common value of resist from your details pane here. Make sure not use anything that is increased by '+x Special Resistance'!"},
        base_dodge:       {"type": "text", "default": 10,   "title": "Dodge %"},
        extra_life:       {"type": "text", "default": 13,   "title": "Extra Life %", "alternative": 1},
        base_melee_reduc: {"type": "text", "default": 0,    "title": "Melee Reduction",  "alternative": 1, 'melee_only': true},
        base_ranged_reduc:{"type": "text", "default": 0,    "title": "Ranged Reduction", "alternative": 1, 'ranged_only': true},
        base_elite_reduc: {"type": "text", "default": 0,    "title": "Elite Reduction",  "alternative": 1, 'elite_only': true},
        block_chance:     {"type": "text", "default": 0,    "title": "Block Chance",     "alternative": 1, 'base_b_only': true},
        min_block_value:  {"type": "text", "default": 0,    "title": "Min Block Amount"},
        max_block_value:  {"type": "text", "default": 0,    "title": "Max Block Amount"},
        avg_block_value:  {"type": "text", "default": 0,    "title": "Average Block Amount", "disabled": true, "alternative": [500, {extra_avg_block_value: 500}], 'base_b_only': true, "tip": "Calculated based on min and max block amount"},
        incoming_hit:     {"type": "text", "default": 70000,"title": "Incoming Hit", "tip": "To calculate block you need to input the raw incoming damage from a hit <br />70k is about normal for act2 nagas, act3 mobs <hr />next update I'll provide accurate presets!"}
    },
    options:       {},
    extra_options: {},
    shared_options: {
        enchantress_armor:      {"type": "checkbox", "default": false, "title": "Enchantress Powered Armor", "alternative": true, "alt": "+5% armor"},
        enchantress_reflect:    {"type": "checkbox", "default": false, "title": "Enchantress Reflect Missiles", "ranged_only": true,  "alternative": true, "alt": "-6% ranged damage taken"}
    },

    getAllOptions: function() {
        return _.extend({}, this.base_options, this.options, this.extra_options, this.shared_options);
    },

    initialize: function () {
        // ensure there's always an options collection
        if (!this.options) {
            this.options = {};
        }

        _.each(this.getAllOptions(), function(o_info, o_name) {
            if(typeof(this.get(o_name)) == 'undefined') {
                this.set(o_name, o_info['default']);
            }
        }, this);

        this.buildGearBags();

        this.on('change', this.simulate);
        this.trigger('change');
    },

    buildGearBags: function() {
        this.gearbag = new ItemBag();
        this.gearbag.localStorage = new Backbone.LocalStorage("gear" + this.id);
        this.gearbag.fetch();

        this.new_gearbag = new ItemBag();
        this.new_gearbag.localStorage = new Backbone.LocalStorage("new_gear" + this.id);
        this.new_gearbag.fetch();
    },

    stealGearBagsFromUndefined: function() {
        if (this.id && this.get('stealfromundefined') && this.gearbag.size() == 0 && this.new_gearbag.size() == 0) {
            this.buildGearBags();
            this.set('stealfromundefined', false);

            undefinedgearbag = new ItemBag();
            undefinedgearbag.localStorage = new Backbone.LocalStorage("gear" + undefined);
            undefinedgearbag.fetch();

            undefinednew_gearbag = new ItemBag();
            undefinednew_gearbag.localStorage = new Backbone.LocalStorage("new_gear" + undefined);
            undefinednew_gearbag.fetch();

            undefinedgearbag.each(function(item) {
                this.gearbag.add(item.clone());
            }, this);
            undefinednew_gearbag.each(function(item) {
                this.new_gearbag.add(item.clone());
            }, this);
        }
    },

    getItemForSlot: function(itemslot, itembag) {
        var aItems = itembag.where({'slot': itemslot}),
            item;

        if (aItems.length) {
            var item = aItems[0];
        } else {
            item = new Item({'slot': itemslot});
            itembag.add(item);
        }

        return item;
    },

    /*
     * these modify methods should be implemented by specific class classes
     *  the modifyBase* methods will modify the base stat before the modifier is applied
     *  the modify*Modifier methods will modify the modifier (most of the time that starts on 1) and is applied to the base afterwards
     *
     * note that if you implement modifyReductionModifier you'll either have to call super or copy the contents of the method here
     */
    modifyBaseArmor              : function (armor)          { return armor; },
    modifyArmorModifier          : function (armormodifier)  {
        if (this.get('enchantress_armor')) {
            armormodifier += .05;
        }

        return armormodifier;
    },
    modifyBaseResist             : function (resist)         { return resist; },
    modifyResistModifier         : function (resistmodifier) { return resistmodifier; },
    modifyVitModifier            : function (vitmodifier)    { return vitmodifier; },
    modifyBaseLife               : function (life)           { return life; },
    modifyLifeModifier           : function (lifemodifier)   { return lifemodifier; },
    modifyDodgeChance            : function (dodgechance)    { return dodgechance; },
    modifyReductionModifier      : function (modifier)       {
        if (this.get('melee')) {
            modifier *= (1 - 0.30);
        }

        return modifier;
    },
    modifyReductionModifierMelee  : function (modifier)       { return modifier; },
    modifyReductionModifierRanged : function (modifier)       {
        if (this.get('enchantress_reflect')) {
            modifier *= (1 - 0.05);
        }

        return modifier;
    },
    modifyReductionModifierElite  : function (modifier)       { return modifier; },
    modifyReductionModifierMagic  : function (modifier)       { return modifier; },

    getDodgeFromExtraDex : function() {
        var basedex  = this.get('base_dex');
        var extradex = this.get('extra_dex');

        var calcdex  = basedex;
        var dexsteps = [[100, 0.100], [500, 0.025], [1000, 0.020], [8000, 0.010]];
        var dodge    = 0;

        _.all(dexsteps, function(dexstep) {
            var stepmax = dexstep[0],
                ddgpdex = dexstep[1];

            if (basedex <= stepmax) {
                var dextomax    = (stepmax - basedex);
                var dexoverflow = dextomax - extradex;

                if (dexoverflow >= 0) {
                    dodge += (extradex * ddgpdex);

                    return false;
                } else {
                    dodge += (dextomax * ddgpdex);

                    basedex += dextomax;
                    extradex-= dextomax;

                    return true;
                }
            }

            return true;
        });

        return dodge;
    },

    rebase : function () {
        this.off('change', this.simulate);

        this.set('armor',  this.get('base_armor'));
        this.set('resist', this.get('base_resist'));
        this.set('dodge',  this.get('base_dodge'));

        // create and modify the armor modifier
        var armormodifier = 1;
        armormodifier = this.modifyArmorModifier(armormodifier);

        // create and modify the resist modifier
        var resistmodifier = 1;
        resistmodifier = this.modifyResistModifier(resistmodifier);

        this.set('base_armor',  this.get('armor')  / armormodifier);
        this.set('base_resist', this.get('resist') / resistmodifier);

        this.set('base_armor',  this.get('base_armor')  - this.modifyBaseArmor(0));
        this.set('base_resist', this.get('base_resist') - this.modifyBaseResist(0));


        // create and modify the dodge chance
        var dodgechance = 1;
        dodgechance = this.modifyDodgeChance(dodgechance);
        this.set('base_dodge', ((1 - (1-(this.get('dodge') / 100)) / dodgechance)) * 100);

        this.buildGearBags();
        this.set('stealfromundefined', false);

        this.on('change', this.simulate);
    },

    simulate : function () {
        this.off('change', this.simulate);

        // grab the base values and set them so we can start modifying that value
        this.set('str',    this.get('base_str')    + this.get('extra_str'));
        this.set('dex',    this.get('base_dex')    + this.get('extra_dex'));
        this.set('int',    this.get('base_int')    + this.get('extra_int'));
        this.set('vit',    this.get('base_vit'));

        this.set('armor',  this.get('base_armor')  + this.get('extra_armor')  + (this.get('extra_str')*1));
        this.set('resist', this.get('base_resist') + this.get('extra_resist') + (this.get('extra_int')*0.1));

        this.set('dodge',  this.get('base_dodge')  + this.getDodgeFromExtraDex());

        // modify the base values (static increases)
        this.set('armor',  this.modifyBaseArmor(this.get('armor')));
        this.set('resist', this.modifyBaseResist(this.get('resist')));

        // create and modify the armor modifier
        var armormodifier = 1;
        armormodifier = this.modifyArmorModifier(armormodifier);

        // create and modify the resist modifier
        var resistmodifier = 1;
        resistmodifier = this.modifyResistModifier(resistmodifier);

        var vitmodifier = 1;
        vitmodifier = this.modifyVitModifier(vitmodifier);

        this.set('vit', this.get('vit') * vitmodifier);

        // create and modify the dodge chance
        var dodgechance = 1;
        dodgechance *= (1 - (this.get('dodge') / 100));
        dodgechance = this.modifyDodgeChance(dodgechance);
        dodgechance = 1 - dodgechance;
        this.set('dodge', dodgechance);

        var dodgemodifier = 1 - dodgechance;

        // apply the modifiers to the base value (with their static increases already applied) for armor and resist
        this.set('armor',  this.get('armor')  * armormodifier);
        this.set('resist', this.get('resist') * resistmodifier);

        // calculate the actual reduction for armor and resist
        this.set('armor_reduc',  this.get('armor') /  (50 * this.get('moblevel') + this.get('armor')));
        this.set('resist_reduc', this.get('resist') / (5  * this.get('moblevel') + this.get('resist')));

        // stack the modifiers
        var modifier = 1;
        modifier *= (1 - this.get('armor_reduc'));
        modifier *= (1 - this.get('resist_reduc'));

        // add more modifiers
        modifier = this.modifyReductionModifier(modifier);

        // create the special modifiers
        var modifiers = {
            'base':   modifier,
            'melee':  this.modifyReductionModifierMelee( modifier * (1 - (this.get('base_melee_reduc')  / 100))),
            'ranged': this.modifyReductionModifierRanged(modifier * (1 - (this.get('base_ranged_reduc') / 100))),
            'elite':  this.modifyReductionModifierMelee( modifier * (1 - (this.get('base_elite_reduc')  / 100))),
            'magic':  this.modifyReductionModifierMagic( modifier)
        };

        // calculate life based on vit/level
        var lifebylvl = this.get('level') - 25;
        lifebylvl = lifebylvl < 10 ? 10 : lifebylvl;

        this.set('life', (36 + (4 * this.get('level')) + (lifebylvl * this.get('vit'))));

        // modify the base life (static increases)
        this.set('life', this.modifyBaseLife(this.get('life')));

        // create and modify the armor modifier
        var lifemodifier = 1 + (this.get('extra_life') / 100);
        lifemodifier = this.modifyLifeModifier(lifemodifier);

        // apply the life modifier
        this.set('life', this.get('life') * lifemodifier);

        // figure out avarage block value
        if (this.get('min_block_value') <= 0) {
            this.set('avg_block_value', this.get('max_block_value'));
        } else if (this.get('max_block_value') <= 0) {
            this.set('avg_block_value', this.get('min_block_value'));
        } else {
            this.set('avg_block_value', ( this.get('min_block_value') + this.get('max_block_value') ) / 2);
        }

        // ensure not below 0
        if (this.get('avg_block_value') < 0) {
            this.set('avg_block_value', 0);
        }

        this.set('avg_block_value', this.get('avg_block_value') + this.get('extra_avg_block_value'));

        // average expected hit after damage reduction
        var block_perc   = this.get('block_chance') / 100;
        var block_amt    = this.get('avg_block_value');
        var expected_hit = this.get('incoming_hit');

        _.each(resulttypes, function(resulttype) {
            var modifier       = modifiers[resulttype];
            var reduced_hit    = expected_hit > 0 ? expected_hit * modifier : 0;
            var block_modifier = expected_hit > 0 ? ((reduced_hit * (1 - block_perc) + block_perc * (reduced_hit - Math.min(reduced_hit, block_amt))) / expected_hit) : modifier;

            var ehp     = this.get('life') / modifier;
            var ehp_d   = this.get('life') / modifier / dodgemodifier;
            var ehp_b   = this.get('life') / block_modifier;
            var ehp_bnd = this.get('life') / block_modifier / dodgemodifier;

            this.set('ehp_'+resulttype,        ehp);
            this.set('ehp_'+resulttype+'_d',   ehp_d);
            this.set('ehp_'+resulttype+'_b',   ehp_b);
            this.set('ehp_'+resulttype+'_bnd', ehp_bnd);
        }, this);

        this.on('change', this.simulate);
    }
});