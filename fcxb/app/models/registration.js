import DS from 'ember-data';

export default DS.Model.extend({
    event: DS.belongsTo('event', {async: true}),
    user: DS.attr('string'),
    crdate: DS.attr('number'),
    crdate_dif: DS.attr('string')
});
