import Ember from 'ember';

export default Ember.Controller.extend({
    init: function () {
        //console.log('draganbnble');
        //Ember.$('.player').draggable();


    },
    sortedList: function() {
        return this.get('model').get('registrations');

    }.property('model.[]'),

    dragcoordinator: Ember.inject.service('drag-coordinator'),

    actions: {
        dragEndAction: function (content,obj) {
            let X = obj.pageX - 64,
                Y = obj.pageY - 14,
                factor = this.getFactor();

            content.set('pos_x',X*(1/factor));
            content.set('pos_y',Y*(1/factor));
            content.save();
        },

        clickedAction: function (content) {
            content.set('sub', !content.get('sub'));
            content.save();
        }
    },
    getFactor: function () {
        if (Ember.$('body').width() >= 800) {
          return 1;
        } else {
          return Ember.$('body').width() / 800;
        }
    },
});
