var Monk = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Monk',
        your_class:  "mn",
        melee     :  true
    }),
    
    options : _.extend({}, Character.prototype.options, {
        resolve:                   {"type": "checkbox", "default": false, "title": "Resolve", "alternative": true, "tip": "Keep in mind you can't always have this on your target (ranged mobs, etc).", "alt": "-25% damage taken from mobs you've hit"},
        the_guardians_path:        {"type": "checkbox", "default": false, "title": "The Guardians Path", "alternative": true, "dodge_only": true, "tip": "Only if you're using DUAL WIELD!!", "alt": "+15% dodge when dual wielding"},
        seize_the_initiative:      {"type": "checkbox", "default": false, "title": "Seize the Initiative", "alternative": true, "alt": "100% of your dex as armor"},
        mantra_of_evasion:         {"type": "checkbox", "default": false, "title": "Mantra of Evasion", "alternative": true, "dodge_only": true, "alt": "+15% dodge"},
        mantra_of_evasion_armor:   {"type": "checkbox", "default": false, "title": "Mantra of Evasion - Hard Target", "alternative": true, "alt": "an extra +20% armor"},
        mantra_of_healing_time:    {"type": "checkbox", "default": false, "title": "Mantra of Healing - Time of Need", "alternative": true, "alt": "+20% to all resistance"},
        mantra_of_healing_heavenly:{"type": "checkbox", "default": false, "title": "Mantra of Healing - Heavenly Body", "alternative": true, "alt": "+15% dodge"}
    }),
    
    extra_options : _.extend({}, Character.prototype.extra_options, {       
        deadly_reach_keen_eye:    {"type": "checkbox", "default": false, "title": "Deadly Reach - Keen Eye", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        crippling_wave_concussion:{"type": "checkbox", "default": false, "title": "Crippling Wave - Concussion", "alternative": true, 'magic_only': true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        fists_of_thunder_flash:   {"type": "checkbox", "default": false, "title": "Fists of Thunder - Lightning Flash", "alternative": true, 'dodge_only': true, "tip": "Keep in mind you can't really keep a 100% uptime"}
    }),

    modifyBaseArmor : function (armor) {
        if (this.get('seize_the_initiative')) {
               armor += this.get('base_dex');
        }

        return armor;
    },
    
    modifyResistModifier : function (resistmodifier) {
        if (this.get('mantra_of_healing_time')) {
            resistmodifier += .20;
        }
        
        return resistmodifier;
    },
    
    modifyLifeModifier : function (lifemodifier) {
        if (this.get('mantra_of_healing_heavenly')) {
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

        return armormodifier;
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
            modifier *= (1 - 0.25);
        }
        
        if (this.get('crippling_wave_concussion')) {
            modifier *= (1 - 0.20);
        }

        return modifier;
    }
});
