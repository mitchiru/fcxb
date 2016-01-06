import DS from 'ember-data';

export default DS.Model.extend({
    user: DS.attr('string'),
    goals_total: DS.attr('number'),
    assists_total: DS.attr('number'),
    scored_in_matches: DS.attr('number')
});
