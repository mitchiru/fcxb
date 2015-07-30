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
    publicClass: function(){
        var Model = this.get('model');
        return (Model.get('private')?'mdi-toggle-radio-button-off':'mdi-toggle-radio-button-on');
    }.property('model.private'),
    privateClass: function(){
        var Model = this.get('model');
        return (Model.get('private')?'mdi-toggle-radio-button-on':'mdi-toggle-radio-button-off');
    }.property('model.private'),


    actions: {
        setPublic: function () {
            var Model = this.get('model');
            Model.set('private',false);
        },
        setPrivate: function () {
            var Model = this.get('model');
            Model.set('private',true);
        },

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

            this.transitionToRoute('events');
            return false;
        }
    }
});