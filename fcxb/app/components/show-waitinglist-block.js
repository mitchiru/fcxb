import Ember from 'ember';

export default Ember.Component.extend({
    showwatinglistblock: function() {
        if (this.get('max_att') <= this.get('registrations')) {
            var toomany = this.get('registrations') - this.get('max_att');
            if (this.get('index') === toomany) {
                return true;
            }
        }
        return false;
    }.property('max_att', 'index', 'registrations')
});
