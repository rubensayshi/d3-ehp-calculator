var IntroView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this);
        
        updateBreadcrumb("intro");

        this.template = _.template($('#intro-template').html());
    },

    render: function() {
        $(this.template()).appendTo($(this.el));
    }
});