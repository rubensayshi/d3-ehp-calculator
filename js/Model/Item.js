var Item = Backbone.Model.extend({
    defaults : {
        slot:        'inventory',
        description: 'My Item',
        base_vit:     0,
        extra_dex:    0,
        extra_int:    0,
        extra_str:    0,
        base_armor:   0,
        base_resist:  0,
        base_dodge:   0,
        extra_life:   0,
        base_melee_reduc:   0,
        base_ranged_reduc:  0,
        block_chance:       0,
        block_value:        0
    },

    base_options:  {
        description:      {"type": "text", "default": "", "title": "Description", "plain": true},
        extra_str:        {"type": "text", "default": 0,  "title": "STR"},
        extra_dex:        {"type": "text", "default": 0,  "title": "DEX"},
        extra_int:        {"type": "text", "default": 0,  "title": "INT"},
        base_vit:         {"type": "text", "default": 0,  "title": "VIT"},
        base_armor:       {"type": "text", "default": 0,  "title": "Armor"},
        base_resist:      {"type": "text", "default": 0,  "title": "All Resist"},
        base_dodge:       {"type": "text", "default": 0,  "title": "Dodge %"},
        extra_life:       {"type": "text", "default": 0,  "title": "Extra Life %"},
        base_melee_reduc: {"type": "text", "default": 0,  "title": "Melee Reduction"},
        base_ranged_reduc:{"type": "text", "default": 0,  "title": "Ranged Reduction"},
        base_elite_reduc: {"type": "text", "default": 0,  "title": "Elite Reduction"},
        block_chance:     {"type": "text", "default": 0,  "title": "Block Chance"},
        block_value:      {"type": "text", "default": 0,  "title": "Block Value"}
    },
    
    getAllOptions: function() {
        return _.extend({}, this.base_options);
    },
    
    initialize : function () {
        // ensure there's always an options collection
        if (!this.options) {
            this.options = {};
        }
        
        _.each(this.getAllOptions(), function(o_info, o_name) {
            if(typeof(this.get(o_name)) == 'undefined') {
                this.set(o_name, o_info['default']);
            }
        }, this);
        
        this.trigger('change');
    }
});