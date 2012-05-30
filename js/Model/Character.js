var Character = Backbone.Model.extend({
    defaults : {
        level:        60,
        base_vit:     1200,
        base_dex:     1200,
        base_armor:   4000,
        base_resist:  300,
        base_dodge:   10,
        base_dodge:   10,
        extra_life:   12,
        base_melee_reduc:   0,
        base_ranged_reduc:  0,

        melee:        false,

        moblevel:     63,

        vit:          null,
        dex:          null,
        life:         null,
        armor:        null,
        resist:       null,
        dodge:        null,
        armor_reduc:  null,
        resist_reduc: null,
        
        options:      {}
    },

    initialize : function () {
        // ensure there's always an options collection
        if (!this.get('options')) {
            this.set('options', {});
        }
        
        _.each(this.get('options'), function(o_default, o_name) {
            if( typeof(this.get(o_name)) == undefined ) this.set(o_name, o_default);
        }, this);
        
        this.on('change', this.simulate);

        this.trigger('change');
    },

    getAllInputStats : function () {
        return _.extend({}, {
            your_class:   this.get('your_class'),
            level:        this.get('level'),
            base_vit:     this.get('base_vit'),
            base_dex:     this.get('base_dex'),
            base_armor:   this.get('base_armor'),
            base_resist:  this.get('base_resist'),
            base_dodge:   this.get('base_dodge'),
            extra_life:   this.get('extra_life'),
            base_melee_reduc:   this.get('base_melee_reduc'),
            base_ranged_reduc:  this.get('base_ranged_reduc'),
            moblevel:     this.get('moblevel'),
        }, this.get('options'));
    },

    /*
     * these modify methods should be implemented by specific class classes
     *  the modifyBase* methods will modify the base stat before the modifier is applied
     *  the modify*Modifier methods will modify the modifier (most of the time that starts on 1) and is applied to the base afterwards
     *
     * note that if you implement modifyReductionModifier you'll either have to call super or copy the contents of the method here
     */
    modifyBaseArmor              : function (armor)          { return armor; },
    modifyArmorModifier          : function (armormodifier)  { return armormodifier; },
    modifyBaseResist             : function (resist)         { return resist; },
    modifyResistModifier         : function (resistmodifier) { return resistmodifier; },
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
    modifyReductionModifierRanged : function (modifier)       { return modifier; },
    modifyReductionModifierMagic  : function (modifier)       { return modifier; },

    simulate : function () {
        this.off('change', this.simulate);
        
        // grab the base values and set them so we can start modifying that value
        this.set('armor',  this.get('base_armor'));
        this.set('resist', this.get('base_resist'));
        this.set('vit',    this.get('base_vit'));
        this.set('dodge',  this.get('base_dodge'));

        // modify the base values (static increases)
        this.set('armor',  this.modifyBaseArmor(this.get('armor')));
        this.set('resist', this.modifyBaseResist(this.get('resist')));

        // create and modify the armor modifier
        var armormodifier = 1;
        armormodifier = this.modifyArmorModifier(armormodifier);

        // create and modify the resist modifier
        var resistmodifier = 1;
        resistmodifier = this.modifyResistModifier(resistmodifier);

        // create and modify the dodge chance
        var dodgechance = 1;
        dodgechance *= (1-(this.get('dodge') / 100));
        dodgechance = this.modifyDodgeChance(dodgechance);
        dodgechance = 1 - dodgechance;
                    
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

        // add melee only modifiers
        var modifier_melee = modifier;
        modifier_melee *= (1 - (this.get('base_melee_reduc') / 100));
        modifier_melee = this.modifyReductionModifierMelee(modifier_melee);

        // add ranged only modifiers
        var modifier_ranged = modifier;
        modifier_ranged *= (1 - (this.get('base_ranged_reduc') / 100));
        var modifier_ranged = this.modifyReductionModifierRanged(modifier_ranged);
        
        // add magic only modifiers
        var modifier_magic = modifier;
        var modifier_magic = this.modifyReductionModifierMagic(modifier_magic);

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

        // apply all modifiers
        var ehp             = this.get('life') / modifier;
        var ehp_dodge       = this.get('life') / modifier / dodgemodifier;
        var ehp_melee       = this.get('life') / modifier_melee;
        var ehp_dodge_melee = this.get('life') / modifier_melee / dodgemodifier;
        var ehp_ranged      = this.get('life') / modifier_ranged;
        var ehp_dodge_ranged= this.get('life') / modifier_ranged / dodgemodifier;
        var ehp_magic       = this.get('life') / modifier_magic;
        var ehp_dodge_magic = this.get('life') / modifier_magic / dodgemodifier;

        // set the final properties
        this.set('ehp',             ehp);
        this.set('ehp_dodge',       ehp_dodge);
        this.set('ehp_melee',       ehp_melee);
        this.set('ehp_dodge_melee', ehp_dodge_melee);
        this.set('ehp_ranged',      ehp_ranged);
        this.set('ehp_dodge_ranged',ehp_dodge_ranged);
        this.set('ehp_magic',       ehp_magic);
        this.set('ehp_dodge_magic', ehp_dodge_magic);
        
        this.on('change', this.simulate);
    }
});
