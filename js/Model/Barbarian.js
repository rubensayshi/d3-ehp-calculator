var Barbarian = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Barbarian',
        your_class:  "br",
        melee     :  true
    })
}, {
/* -- static properties -- */
    options : _.extend({}, Character.constructor.options, {
        toughasnails: {"type": "checkbox", "default": false, "title": "Tough as Nails", "alternative": true, "alt": "+25% armor"},
        nervesofsteel:{"type": "checkbox", "default": false, "title": "Nerves of Steel", "alternative": true, "alt": "100% of your vit as armor"},
        warcry:       {"type": "checkbox", "default": false, "title": "War Cry - No Rune", "alternative": true, "alt": "+20% armor"},
        warcry_armor: {"type": "checkbox", "default": false, "title": "War Cry - Hardened Wrath", "alternative": true, "alt": "another +20% armor (total +40%)"},
        warcry_resist:{"type": "checkbox", "default": false, "title": "War Cry - Impunity", "alternative": true, "alt": "+50% to all your resistance stats"},
        warcry_dodge: {"type": "checkbox", "default": false, "title": "War Cry - Veteran's Warning", "alternative": true, "dodge_only": true, "alt": "+15% dodge"},
        warcry_life:  {"type": "checkbox", "default": false, "title": "War Cry - Invigorate", "alternative": true, "alt": "+10% life"},
        superstition: {"type": "checkbox", "default": false, "title": "Superstition ", "alternative": true, 'magic_only': true, "tip": "note that it's for magic EHP only", "alt": "+20% dmg reduction non physical"}
    }),
    
    extra_options : _.extend({}, Character.constructor.extra_options, {
        threat_shout: {"type": "checkbox", "default": false, "title": "Threatening Shout", "alternative": true, "tip": "note that you can't always have this on all mobs (ranged etc)", "alt": "-20% dmg done by mobs"}
    }),
    
    getClassSharedOptions: function() {
        return {
            warcry:        this.options.warcry,
            warcry_resist: this.options.warcry_resist
        };
    }
});
