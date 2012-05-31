var Barbarian = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        your_class: "br",
        melee     : true,
    }),
    
    options : _.extend({}, Character.prototype.options, {
        toughasnails: {"type": "checkbox", "default": true, "title": "Tough as Nails", "alternative": true},
        nervesofsteel:{"type": "checkbox", "default": false, "title": "Nerves of Steel", "alternative": true},
        warcry:       {"type": "checkbox", "default": false, "title": "War Cry - No Rune", "alternative": true},
        warcry_armor: {"type": "checkbox", "default": false, "title": "War Cry - Hardened Wrath", "alternative": true},
        warcry_resist:{"type": "checkbox", "default": false, "title": "War Cry - Impunity", "alternative": true},
        warcry_dodge: {"type": "checkbox", "default": false, "title": "War Cry - Veteran's Warning", "alternative": true},
        superstition: {"type": "checkbox", "default": false, "title": "Superstition ", "alternative": true}
    }),
    
    extra_options : _.extend({}, Character.prototype.extra_options, {
        threat_shout: {"type": "checkbox", "default": false, "title": "Threatening Shout"}
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

        return armormodifier;
    },

    modifyResistModifier : function (resistmodifier) {
        if (this.get('warcry_resist')) {
            resistmodifier += .50;
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
            modifier *= (1 - 0.25);
        }

        if (this.get('melee')) {
            modifier *= (1 - 0.30);
        }

        return modifier;
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
    },
});
