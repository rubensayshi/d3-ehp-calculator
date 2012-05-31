var InputView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this);

        this.template = _.template($('#input-template').html());
    },

    render: function() {
        $(this.template()).appendTo($(this.el));
    }
});