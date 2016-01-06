import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return this.store.find('event', params.event_id);
    }
/*
 http://discuss.emberjs.com/t/what-is-an-async-relationship-async-true-vs-async-false/4107/6
    model: function() {
        return Ember.RSVP.hash({
            event: this.store.find('event', params.event_id)
        }).then(function(hash) {
            hash.registrations = hash.event.get('registrations');
            return hash;
        })
    }

 */
});
