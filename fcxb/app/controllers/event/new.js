import Ember from 'ember';

export default Ember.Controller.extend({
    weekdays: ["Mon", "Tue", "Wed","Thu","Fri","Sat","Sun"],
    isValid: function (Model) {

        if (Ember.isEmpty(this.get('model.location'))) {
            Model.set('location','Sportplatz Wiener Straße, Berlin, GERMANY');
        }

        if (Ember.isEmpty(this.get('model.min_att')) || Number(this.get('model.min_att'))===this.get('model.min_att') && this.get('model.min_att')%1===0) {
            Model.set('min_att',8);
        }

        if (Ember.isEmpty(this.get('model.max_att'))) {
            Model.set('max_att',16);
        }
        return (!Ember.isEmpty(this.get('model.name')));
    },
    actions: {
        save: function () {
            var Model = this.get('model');
            var _this = this;

            if (_this.isValid(Model)) {
                this.get('model').save().then(function(item) {
                    _this.transitionToRoute('event.item',item.id);
                });
            }
            return false;
        },
        cancel: function () {
            var Model = this.get('model');
            Model.deleteRecord();

            this.transitionToRoute('matches');
            return false;
        }
    }
});
