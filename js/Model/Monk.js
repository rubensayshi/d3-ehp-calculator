var Monk = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Monk',
        your_class:  "mn",
        melee     :  true
    })
}, {
    /* -- static properties -- */
    options : _.extend({}, Character.constructor.options, {
        resolve:                   {"type": "checkbox", "default": false, "title": "Resolve", "alternative": true, "tip": "Keep in mind you can't always have this on your target (ranged mobs, etc).", "alt": "-25% damage taken from mobs you've hit"},
        the_guardians_path:        {"type": "checkbox", "default": false, "title": "The Guardians Path", "alternative": true, "dodge_only": true, "tip": "Only if you're using DUAL WIELD!!", "alt": "+15% dodge when dual wielding"},
        seize_the_initiative:      {"type": "checkbox", "default": false, "title": "Seize the Initiative", "alternative": true, "alt": "100% of your dex as armor"},
        mantra_of_evasion:         {"type": "checkbox", "default": false, "title": "Mantra of Evasion", "alternative": true, "dodge_only": true, "alt": "+15% dodge"},
        mantra_of_evasion_armor:   {"type": "checkbox", "default": false, "title": "Mantra of Evasion - Hard Target", "alternative": true, "alt": "an extra +20% armor"},
        mantra_of_healing_time:    {"type": "checkbox", "default": false, "title": "Mantra of Healing - Time of Need", "alternative": true, "alt": "+20% to all resistance"},
        mantra_of_healing_heavenly:{"type": "checkbox", "default": false, "title": "Mantra of Healing - Heavenly Body", "alternative": true, "alt": "+10% life"},
        mystic_ally_earth:         {"type": "checkbox", "default": false, "title": "Mystic Ally - Earth", "alternative": true, "alt": "+10% life"}
    }),
    
    extra_options : _.extend({}, Character.constructor.extra_options, {       
        mantra_of_conv_intimid:   {"type": "checkbox", "default": false, "title": "Mantra of Conviction - Intimidation", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        deadly_reach_keen_eye:    {"type": "checkbox", "default": false, "title": "Deadly Reach - Keen Eye", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        crippling_wave_concussion:{"type": "checkbox", "default": false, "title": "Crippling Wave - Concussion", "alternative": true, "tip": "Keep in mind you can't really keep a 100% uptime"},
        fists_of_thunder_flash:   {"type": "checkbox", "default": false, "title": "Fists of Thunder - Lightning Flash", "alternative": true, 'dodge_only': true, "tip": "Keep in mind you can't really keep a 100% uptime"}
    }),
    
    getClassSharedOptions: function() {
        return {
            resolve:                this.options.resolve,
            mantra_of_evasion:      this.options.mantra_of_evasion,
            mantra_of_healing_time: this.options.mantra_of_healing_time
        };
    }
});
