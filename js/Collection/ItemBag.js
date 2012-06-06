var ItemBag = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("ItemBag"),
    model: Item
});