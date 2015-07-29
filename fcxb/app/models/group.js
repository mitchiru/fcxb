import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    htmlId: function() {
        return 'group_'+this.get('id');
    }.property('name')
});
