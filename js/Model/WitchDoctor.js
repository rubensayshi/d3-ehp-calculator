var WitchDoctor = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Witch Doctor',
        your_class:  "wd",
        melee     :  false
    }),

    options : _.extend({}, Character.prototype.options, {
        jungle_fortitude: {"type": "checkbox", "default": false, "title": "Jungle Fortitude", "alternative": true, "alt": "-20% damage to your and your pets"},
        gruesome_feast:   {"type": "select",   "default": 0, "title": "Gruesome Feast", "options": [0,1,2,3,4,5], "alt": "10% Int for every healthglobe collected"},
        bad_medicine:     {"type": "checkbox", "default": false, "title": "Bad Medicine", "alternative": true, "alt": "-20% damage if did poison damage to"}
   }),

    extra_options : _.extend({}, Character.prototype.extra_options, {
        soul_harvest:               {"type": "select",   "default": 0, "title": "Soul Harvest", "options": [0,1,2,3,4,5], "tip": "note that you most likely will not have a 5 Stack / 100% uptime on this!", "alt": "up to five stacks of +130 Int"},
        zombie_dogs_life_link:      {"type": "checkbox", "default": false, "title": "Zombie Dogs - Life Link", "alternative": true, "tip": "of course this will only work if you have zombie dogs alive", "alt": "your dogs take 10% of the damage done to you"},
        horrify_frightening_aspect: {"type": "checkbox", "default": false, "title": "Horrify - Frightening Aspect", "alternative": true, "tip": "you will gain 100% Armor after casting this spell. However, this only lasts 8 secounds whereas the cooldown is 20 secs. So you will not get more than 2/5 uptime on this!", "alt": "+100% Armor for 8 seconds after casting this spell"}
    }),

    modifyBaseResist : function (resist) {
        if (this.get('soul_harvest') > 0) {
            // (130 Int for every soul harvested up to 5) * resist per Int
            resist += (this.get('soul_harvest')*130) * 0.1;
        }

        if (this.get('gruesome_feast') > 0) {
            // (10% Int for every healtglobe consumed up to 5) * resist per Int
            resist += (this.get('gruesome_feast')*(0.1*this.get('int'))) * 0.1;
        }

      return resist;
    },

    modifyArmorModifier : function (armormodifier) {
        if (this.get('horrify_frightening_aspect')) {
            armormodifier += 1;
        }

        return this.constructor.__super__.modifyArmorModifier.apply(this, arguments);
    },

    modifyReductionModifier : function (modifier) {
        if (this.get('jungle_fortitude')) {
            modifier *= (1 - 0.15);
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
