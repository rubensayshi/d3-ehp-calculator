var Gear = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("Gear"),
    model: Item
});