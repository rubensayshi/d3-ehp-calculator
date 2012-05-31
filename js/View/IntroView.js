var IntroView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this);

        this.template = _.template($('#intro-template').html());
    },

    render: function() {
        $(this.template()).appendTo($(this.el));
    }
});