import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    private: DS.attr('number'),
    min_att: DS.attr('number'),
    max_att: DS.attr('number'),
    location: DS.attr('string'),
    weekday: DS.attr('string')
});
