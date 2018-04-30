import Ember from 'ember';

export default Ember.Controller.extend({
    sortedList: Ember.computed.sort('model', 'nameSort'),
    nameSort: ['evdate:asc']
});
