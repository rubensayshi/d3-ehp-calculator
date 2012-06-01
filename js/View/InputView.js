var InputView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this);
        
        updateBreadcrumb("input-char");

        this.template = _.template($('#input-template').html());
    },

    render: function() {
        $(this.template()).appendTo($(this.el));
    }
});