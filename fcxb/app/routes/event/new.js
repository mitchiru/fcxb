import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.store.createRecord('event');
    },
    setupController: function(controller, model) {
        controller.set('model', model);
        //controller.set('post', model);
        this.store.findAll('template').then(function(template) {
            controller.set('templates', template);
        });
    }
});