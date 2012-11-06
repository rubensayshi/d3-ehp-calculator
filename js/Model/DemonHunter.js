var DemonHunter = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Demon Hunter',
        your_class:  "dh",
        melee     :  false
    }),

    options : _.extend({}, Character.prototype.options, {
        perfectionist: {"type": "checkbox", "default": false, "title": "Perfectionist", "alternative": true, "alt": "+10% armor, life and resist"},
    }),

    modifyArmorModifier : function (armormodifier) {
        if (this.get('perfectionist')) {
            armormodifier += .10;
        }

        // parent does the check for enchantress
        return this.constructor.__super__.modifyArmorModifier.apply(this, arguments);
    },

    modifyResistModifier : function (resistmodifier) {
        if (this.get('perfectionist')) {
            resistmodifier += .10;
        }

        return resistmodifier;
    },

    modifyLifeModifier : function (lifemodifier) {
        if (this.get('perfectionist')) {
            lifemodifier += .10;
        }

        return lifemodifier;
    }
});
