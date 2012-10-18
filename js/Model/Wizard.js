var Wizard = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Wizard',
        your_class:  "wz",
        melee     :  false
    }),

    options : _.extend({}, Character.prototype.options, {
        energy_armor: {"type": "checkbox", "default": false, "title": "Energy Armor", "alternative": true, "alt": "+35% armor"},
        ice_armor:    {"type": "checkbox", "default": false, "title": "Ice Armor", "alternative": true, "melee_only": true, "alt": "-12% melee damage taken"},
        prismatic:    {"type": "checkbox", "default": false, "title": "Energy Armor - Prismatic", "alternative": true, "alt": "+25% to all resistance stats"},
        blur:         {"type": "checkbox", "default": false, "title": "Blur", "alternative": true, "melee_only": true, "alt": "-20% melee dmg taken"},
        glass_cannon: {"type": "checkbox", "default": false, "title": "Glass Cannon", "alternative": true, "alt": "-10% armor/resistance for 15% dmg"}
   }),

    extra_options : _.extend({}, Character.prototype.extra_options, {
        archon: {"type": "checkbox", "default": false, "title": "Archon", "alternative": true, "tip": "Keep in mind it's only 15 second duration!"}
    }),

    modifyArmorModifier : function (armormodifier) {
        if (this.get('energy_armor') || this.get('prismatic')) {
            armormodifier += .35;
        }

        if (this.get('glass_cannon')) {
            armormodifier -= .10;
        }

        if (this.get('archon')) {
            armormodifier += .40;
        }

        return this.constructor.__super__.modifyArmorModifier.apply(this, arguments);
    },

    modifyResistModifier : function (resistmodifier) {
        if (this.get('prismatic')) {
            resistmodifier += .25;
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

        if (this.get('ice_armor')) {
            modifier *= (1 - 0.12);
        }

        return modifier;
    }
});
