import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        selectAll: function () {

            Ember.$('#input-copy').select();
        }
    }
});
