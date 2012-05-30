var WitchDoctor = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        your_class: "wd",
        melee     : false,
        options   : {
            jungle_fortitude:          false,
            gruesome_feast:            0,
            bad_medicine:              false,
            soul_harvest:              0,
            zombie_dogs_life_link:     false,
            horrify_frightening_aspect:false
        }
    }),
    
    modifyBaseResist : function (resist) {  
        if (this.get('soul_harvest') > 0) {
            // (130 Int for every soul harvested up to 5) * resist per Int
            resist += (this.get('soul_harvest')*130) * 0.1
        }
        
        if (this.get('gruesome_feast') > 0) {
            // (10% Int for every healtglobe consumed up to 5) * resist per Int
            resist += (this.get('gruesome_feast')*(0.1*this.get('base_int'))) * 0.1
        }
      
      return resist;
    },

    modifyArmorModifier : function (armormodifier) {
        if (this.get('horrify_frightening_aspect')) {
            armormodifier += 1;
        }
        
        return armormodifier;
    },

    modifyReductionModifier : function (modifier) {
        if (this.get('jungle_fortitude')) {
            modifier *= (1 - 0.20);
        }
        
        if (this.get('bad_medicine')) {
            modifier *= (1 - 0.20);
        }
        
        if (this.get('zombie_dogs_life_link')) {
            modifier *= (1 - 0.10);
        }            
        
        return modifier;
    }
});