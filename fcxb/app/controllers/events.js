import Ember from 'ember';

export default Ember.Controller.extend({
    sortedList: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['evdate'],
            sortAscending: true,
            content: this.get('model')
        });

    }.property('model')
});
