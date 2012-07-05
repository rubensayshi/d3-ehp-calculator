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
        block_chance:    0,
        min_block_value: 0,
        max_block_value: 0
    },

    base_options:  {
        description:      {"type": "text", "default": "My Item", "title": "Description", "plain": true},
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
        block_chance:     {"type": "text", "default": 0,    "title": "Block Chance"},
        min_block_value:  {"type": "text", "default": 0,    "title": "Min Block Amount"},
        max_block_value:  {"type": "text", "default": 0,    "title": "Max Block Amount"},
        avg_block_value:  {"type": "text", "default": 0,    "title": "Average Block Amount", "disabled": true, "tip": "Calculated based on min and max block amount"}
    },
    
    getAllOptions: function() {
        return _.extend({}, this.base_options);
    },
    
    initialize : function() {
        // ensure there's always an options collection
        if (!this.options) {
            this.options = {};
        }
        
        _.each(this.getAllOptions(), function(o_info, o_name) {
            if(typeof(this.get(o_name)) == 'undefined') {
                this.set(o_name, o_info['default']);
            }
        }, this);

        this.on('change', this.simulate);
        
        this.trigger('change');
    },
    
    simulate : function() { 
        // figure out avarage block value
        if (this.get('min_block_value') <= 0) {
            this.set('avg_block_value', this.get('max_block_value'));
        } else if (this.get('max_block_value') <= 0) {
            this.set('avg_block_value', this.get('min_block_value'));
        } else {
            this.set('avg_block_value', ( this.get('min_block_value') + this.get('max_block_value') ) / 2);
        }
        
        // ensure not below 0
        if (this.get('avg_block_value') < 0) {
            this.set('avg_block_value', 0);
        }
    },

    hasNonDefaultValues: function() {
        return _.any(this.getAllOptions(), function(o_info, o_name) {
            if(this.get(o_name) != o_info['default']) {
                return true;
            }
            return false;
        }, this);
    },

    reset : function() {
        _.each(this.getAllOptions(), function(o_info, o_name) {
            this.set(o_name, o_info['default']);
        }, this);
        
        this.trigger('change');
        this.save();
    },

    overwriteStatsWith : function (item) {
        _.each(this.getAllOptions(), function(o_info, o_name) {
            this.set(o_name, item.get(o_name))
        }, this);

        this.trigger('change');
        this.save();
    }
});
