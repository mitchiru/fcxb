import DS from 'ember-data';

export default DS.Model.extend({
    event: DS.belongsTo('event', {async: true}),
    user: DS.attr('string'),
    crdate: DS.attr('number'),
    crdate_dif: DS.attr('string'),
    pos_x: DS.attr('number'),
    pos_y: DS.attr('number'),
    sub: DS.attr('boolean'),
    mp: DS.attr('number')
});
