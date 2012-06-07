var DemonHunter = Character.extend({
    defaults: _.extend({}, Character.prototype.defaults, {
        description: 'Demon Hunter',
        your_class:  "dh",
        melee     :  false
    })
});
