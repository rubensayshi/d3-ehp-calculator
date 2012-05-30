var Wizard = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        your_class: "wz",
        melee     : false,
        options   : {
            energy_armor: false,
            prismatic:    false,
            blur:         false,
            glass_cannon: false,
            archon:       false
        }
    }),

    modifyArmorModifier : function (armormodifier) {
        if (this.get('energy_armor')) {
            armormodifier += .65;
        }

        if (this.get('glass_cannon')) {
            armormodifier -= .10;
        }
        
        if (this.get('archon')) {
            armormodifier += .40;
        }

        return armormodifier;
    },

    modifyResistModifier : function (resistmodifier) {
        if (this.get('prismatic')) {
            resistmodifier += .40;
        }

        if (this.get('glass_cannon')) {
            resistmodifier -= .10;
        }
        
        if (this.get('archon')) {
            resistmodifier += .40;
        }

        return resistmodifier;
    },

    modifyReductionModifierMelee : function (modifier) {
        if (this.get('blur')) {
            modifier *= (1 - 0.20);
        }

        return modifier;
    }
});
