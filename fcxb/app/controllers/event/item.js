import Ember from 'ember';

export default Ember.Controller.extend({
    sortedList: function() {
        return Ember.ArrayProxy.extend(Ember.SortableMixin).create({
            sortProperties: ['crdate'],
            sortAscending: false,
            content: this.get('model').get('registrations')
        });

    }.property('model'),

    isEditingName: false,
    isEditingDesc: false,
    isEditingMax: false,
    inputAddPlayer: '',
    bufferedName: '',
    bufferedDesc: '',
    bufferedMax: '',
    actions: {
        focusInput: function () {
            if (Ember.$('#inputAddPlayer').val()==='') {
                Ember.$('#inputAddPlayer').focus();
            } else {
                this.send('addPlayer',Ember.$('#inputAddPlayer').val());
            }
        },
        addPlayer: function (user) {
            var _this = this;

            var record = this.store.createRecord('registration', {
                event: this.get('model'),
                user: user,
                crdate_dif: 'now',
                crdate: Math.floor(Date.now() / 1000)
            });
            record.save().then(function(record) {
                Ember.$('#inputAddPlayer').val("");

                Ember.run.later((function() {
                    _this.get('model').get('registrations').addObject(record);
                }), 200);

            });
        },
        startEditingName: function () {
            this.set('isEditingName',1);
            var Model = this.get('model');
            this.set('bufferedName', Model.get('name'));
        },
        startEditingDesc: function () {
            this.set('isEditingDesc',1);
            var Model = this.get('model');
            this.set('bufferedDesc', Model.get('description'));
        },
        startEditingMax: function () {
            Ember.$('#inputMax').focus();
            this.set('isEditingMax',1);
            var Model = this.get('model');
            var max_att = Model.get('max_att');
            this.set('bufferedMax', max_att);
        },
        doneEditingName: function () {
            var bufferedName = this.get('bufferedName').trim();

            if (Ember.isEmpty(bufferedName)) {
                this.send('cancelEditingName');
            } else {
                var Model = this.get('model');
                Model.set('name', bufferedName);
                Model.save();
            }

            this.set('isEditingName', 0);
        },
        doneEditingMax: function () {
            var bufferedMax = this.get('bufferedMax').trim();

            if (Ember.isEmpty(bufferedMax)) {
                this.send('cancelEditingMax');
            } else {
                var Model = this.get('model');
                Model.set('max_att', bufferedMax);
                Model.save();
            }

            this.set('isEditingMax', 0);
        },
        doneEditingDesc: function () {
            var bufferedDesc = this.get('bufferedDesc');

            if (Ember.isEmpty(bufferedDesc)) {
                this.send('cancelEditingDesc');
            } else {
                var Model = this.get('model');
                Model.set('description', bufferedDesc);
                Model.save();
            }

            this.set('isEditingDesc', 0);
        },
        cancelEditingName: function () {
            this.set('bufferedName', this.get('name'));
            this.set('isEditingName',0);
        },
        cancelEditingDesc: function () {
            alert('cancelEditingDesc');
            this.set('bufferedDesc', this.get('description'));
            this.set('isEditingDesc',0);
        },
        cancelEditingMax: function () {
            this.set('bufferedMax', this.get('max_att'));
            this.set('isEditingMax',0);
        },
        removeConfirm: function (user) {
            Ember.$('#memberlist div.list-group-item .row-action-remove-member').show();
            Ember.$('#memberlist div.list-group-item .row-action-removed').hide();

            Ember.$('#memberlist div.list-group-item[data-registration="'+user+'"] .row-action-remove-member').hide();
            Ember.$('#memberlist div.list-group-item[data-registration="'+user+'"] .row-action-removed').show();
        },
        removePlayer: function (user) {
            this.store.find('registration', user).then(function (registration) {
                registration.deleteRecord();
                registration.get('isDeleted');
                registration.save();
            });
        },
        removeEventConfirm: function () {
            Ember.$('.RemoveDiv').show();
            Ember.$('.CancelDiv').hide();
        },
        hideRemoveDiv: function () {
            Ember.$('.RemoveDiv').hide();
        },
        removeEvent: function () {
            var _this = this;

            this.get('model').destroyRecord().then(function() {
                _this.transitionToRoute('events');
            });
        },
        cancelEventConfirm: function () {
            Ember.$('.CancelDiv').show();
            Ember.$('.RemoveDiv').hide();
        },
        hideCancelDiv: function () {
            Ember.$('.CancelDiv').hide();
        },
        cancelEvent: function () {
            var _this = this;
            var Model = this.get('model');
            Model.set('canceled', 1);
            Model.save().then(function() {
                _this.transitionToRoute('events');
            });
        },
        uncancelEvent: function () {
            var _this = this;
            var Model = this.get('model');
            Model.set('canceled', 0);
            Model.save().then(function() {
                _this.transitionToRoute('events');
            });
        }

    }
});
