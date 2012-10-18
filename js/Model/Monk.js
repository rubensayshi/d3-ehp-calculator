var Monk = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Monk',
        your_class:  "mn",
        melee     :  true
    }),

    options : _.extend({}, Character.prototype.options, {
        resolve:                   {"type": "checkbox", "default": false, "title": "Resolve", "alternative": true, "tip": "Keep in mind you can't always have this on your target (ranged mobs, etc).", "alt": "-20% damage taken from mobs you've hit"},
        the_guardians_path:        {"type": "checkbox", "default": false, "title": "The Guardians Path", "alternative": true, "base_d_only": true, "tip": "Only if you're using DUAL WIELD!!", "alt": "+15% dodge when dual wielding"},
        seize_the_initiative:      {"type": "checkbox", "default": false, "title": "Seize the Initiative", "alternative": true, "alt": "50% of your dex as armor"},
        mantra_of_evasion:         {"type": "checkbox", "default": false, "title": "Mantra of Evasion", "alternative": true, "base_d_only": true, "alt": "+15% dodge"},
        mantra_of_evasion_armor:   {"type": "checkbox", "default": false, "title": "Mantra of Evasion - Hard Target", "alternative": true, "alt": "an extra +20% armor"},
        mantra_of_healing_time:    {"type": "checkbox", "default": false, "title": "Mantra of Healing - Time of Need", "alternative": true, "alt": "+20% to all resistance"},
        mantra_of_healing_heavenly:{"type": "checkbox", "default": false, "title": "Mantra of Healing - Heavenly Body", "alternative": true, "alt": "+10% life"},
        mystic_ally_earth:         {"type": "checkbox", "default": false, "title": "Mystic Ally - Earth", "alternative": true, "alt": "+10% life"}
    }),

    extra_options : _.extend({}, Character.prototype.extra_options, {
        mantra_of_conv_intimid:   {"type": "checkbox", "default": false, "title": "Mantra of Conviction - Intimidation", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        deadly_reach_keen_eye:    {"type": "checkbox", "default": false, "title": "Deadly Reach - Keen Eye", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        crippling_wave_concussion:{"type": "checkbox", "default": false, "title": "Crippling Wave - Concussion", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        fists_of_thunder_flash:   {"type": "checkbox", "default": false, "title": "Fists of Thunder - Lightning Flash", "alternative": true, 'base_d_only': true, "tip": "Keep in mind you can't really keep a 100% uptime"}
    }),

    modifyBaseArmor : function (armor) {
        if (this.get('seize_the_initiative')) {
               armor += (0.5 * this.get('dex'));
        }

        return armor;
    },

    modifyResistModifier : function (resistmodifier) {
        if (this.get('mantra_of_healing_time')) {
            resistmodifier += .20;
        }

        return resistmodifier;
    },

    modifyVitModifier : function (vitmodifier) {
        if (this.get('mantra_of_healing_heavenly')) {
            vitmodifier += .10;
        }

        return vitmodifier;
    },

    modifyLifeModifier : function (lifemodifier) {
        if (this.get('mystic_ally_earth')) {
            lifemodifier += .10;
        }

        return lifemodifier;
    },

    modifyArmorModifier : function (armormodifier) {
        if (this.get('mantra_of_evasion_armor')) {
            armormodifier += .20;
        }

        if (this.get('deadly_reach_keen_eye')) {
            armormodifier += .50;
        }

        // parent does the check for enchantress
        return this.constructor.__super__.modifyArmorModifier.apply(this, arguments);
    },


    modifyDodgeChance : function (dodgechance) {
        if (this.get('mantra_of_evasion') || this.get('mantra_of_evasion_armor')) {
            dodgechance *= (1 - 0.15);
        }

        if (this.get('the_guardians_path')) {
            dodgechance *= (1 - 0.15);
        }

        if (this.get('fists_of_thunder_flash')) {
            dodgechance *= (1 - 0.16);
        }

        return dodgechance;
    },

    modifyReductionModifier : function (modifier) {
        if (this.get('resolve')) {
            modifier *= (1 - 0.20);
        }

        if (this.get('crippling_wave_concussion')) {
            modifier *= (1 - 0.20);
        }

        if (this.get('mantra_of_conv_intimid')) {
            modifier *= (1 - 0.10);
        }

        // parent does the check for melee 30% reduction
        return this.constructor.__super__.modifyReductionModifier.apply(this, arguments);
    }
});
