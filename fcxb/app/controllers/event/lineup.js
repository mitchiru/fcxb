import Ember from 'ember';

export default Ember.Controller.extend({
    init: function () {
        //console.log('draganbnble');
        //Ember.$('.player').draggable();


    },
    sortedList: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['crdate'],
            sortAscending: false,
            content: this.get('model').get('registrations')
        });

    }.property('model')
});
