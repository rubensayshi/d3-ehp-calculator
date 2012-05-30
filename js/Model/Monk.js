var Monk = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        your_class: "mn",
        melee     : true,
        options   : {
            resolve:                  false,
            seize_the_initiative:     false,
            the_guardians_path:       false,
            mantra_of_evasion:        false,
            mantra_of_evasion_armor:  false,
            mantra_of_healing_time:   false,
            deadly_reach_keen_eye:    false,
            crippling_wave_concussion:false,
            fists_of_thunder_flash:   false
        }
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
