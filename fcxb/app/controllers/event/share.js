import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        selectAll: function () {

            Ember.$('#input-copy').select();
        },
        selectAllLocation: function () {

            Ember.$('#input-copy-location').select();
        },
        selectAllMapsLink: function () {

            Ember.$('#input-copy-MapsLink').select();
        },
        doneEditingLocation: function () {

            var Model = this.get('model');
            Model.save();
        }


    }
});
