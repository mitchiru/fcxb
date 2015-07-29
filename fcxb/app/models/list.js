import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    htmlId: function() {
        return 'list_'+this.get('id');
    }.property('name')
});
