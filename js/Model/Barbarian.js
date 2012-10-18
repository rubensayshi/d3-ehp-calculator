var Barbarian = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Barbarian',
        your_class:  "br",
        melee     :  true
    }),

    options : _.extend({}, Character.prototype.options, {
        toughasnails: {"type": "checkbox", "default": false, "title": "Tough as Nails", "alternative": true, "alt": "+25% armor"},
        nervesofsteel:{"type": "checkbox", "default": false, "title": "Nerves of Steel", "alternative": true, "alt": "100% of your vit as armor"},
        warcry:       {"type": "checkbox", "default": false, "title": "War Cry - No Rune", "alternative": true, "alt": "+20% armor"},
        warcry_armor: {"type": "checkbox", "default": false, "title": "War Cry - Hardened Wrath", "alternative": true, "alt": "another +20% armor (total +40%)"},
        warcry_resist:{"type": "checkbox", "default": false, "title": "War Cry - Impunity", "alternative": true, "alt": "+20% to all your resistance stats"},
        warcry_dodge: {"type": "checkbox", "default": false, "title": "War Cry - Veteran's Warning", "alternative": true, "base_d_only": true, "alt": "+15% dodge"},
        warcry_life:  {"type": "checkbox", "default": false, "title": "War Cry - Invigorate", "alternative": true, "alt": "+10% life"},
        superstition: {"type": "checkbox", "default": false, "title": "Superstition ", "alternative": true, 'magic_only': true, "tip": "note that it's for magic EHP only", "alt": "+20% dmg reduction non physical"}
    }),

    extra_options : _.extend({}, Character.prototype.extra_options, {
        threat_shout: {"type": "checkbox", "default": false, "title": "Threatening Shout", "alternative": true, "tip": "note that you can't always have this on all mobs (ranged etc)", "alt": "-20% dmg done by mobs"}
    }),

    modifyBaseArmor : function (armor) {
        if (this.get('nervesofsteel')) {
            armor += this.get('vit');
        }

        return armor;
    },

    modifyArmorModifier : function (armormodifier) {
        // any version of warcry gives 20%
        if (this.get('warcry') || this.get('warcry_armor') || this.get('warcry_resist') || this.get('warcry_life') || this.get('warcry_dodge')) {
            armormodifier += .2;
        }
        // warcry runed for armor gives an aditional 20%
        if (this.get('warcry_armor')) {
            armormodifier += .2;
        }

        if (this.get('toughasnails')) {
            armormodifier += .25;
        }

        // parent does the check for enchantress
        return this.constructor.__super__.modifyArmorModifier.apply(this, arguments);
    },

    modifyResistModifier : function (resistmodifier) {
        if (this.get('warcry_resist')) {
            resistmodifier += .20;
        }

        return resistmodifier;
    },

    modifyLifeModifier : function (lifemodifier) {
        if (this.get('warcry_life')) {
            lifemodifier += 0.10;
        }

        return lifemodifier;
    },

    modifyReductionModifier : function (modifier) {
        if (this.get('threat_shout')) {
            modifier *= (1 - 0.20);
        }

        // parent does the check for melee 30% reduction
        return this.constructor.__super__.modifyReductionModifier.apply(this, arguments);
    },

    modifyReductionModifierMagic : function (modifier) {
        if (this.get('superstition')) {
            modifier *= (1 - 0.20);
        }

        return modifier;
    },

    modifyDodgeChance : function (dodgechance) {
        if (this.get('warcry_dodge')) {
            dodgechance *= (1 - 0.15);
        }

        return dodgechance;
    }
});
