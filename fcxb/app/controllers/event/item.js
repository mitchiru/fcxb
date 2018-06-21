import Ember from 'ember';

export default Ember.Controller.extend({
    sortedList: Ember.computed.sort('model.registrations', 'nameSort'),
    nameSort: ['crdate:desc'],

    isEditingName: false,
    isEditingScore: false,
    isEditingDesc: false,
    isEditingMax: false,
    inputAddPlayer: '',
    bufferedName: '',
    bufferedScore: '',
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

            if (user.length > 0) {
                var record = this.store.createRecord('registration', {
                    event: this.get('model'),
                    user: user,
                    crdate_dif: 'now',
                    crdate: Math.floor(Date.now() / 1000)
                });
                record.save().then(function(record) {
                    Ember.$('#inputAddPlayer').val("");

                    Ember.run.later((function() {
                        _this.get('model').get('registrations').unshiftObject(record);
                    }), 200);
                });
            }
        },
        startEditingName: function () {
            this.set('isEditingName',1);
            var Model = this.get('model');
            this.set('bufferedName', Model.get('name'));
        },
        startEditingScore: function () {
            this.set('isEditingScore',1);
            var Model = this.get('model');
            this.set('bufferedScore', Model.get('score'));
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
        doneEditingScore: function () {
            var bufferedScore = this.get('bufferedScore').trim();

            if (Ember.isEmpty(bufferedScore)) {
                this.send('cancelEditingScore');
            } else {
                var Model = this.get('model');
                Model.set('score', bufferedScore);
                Model.save();
            }

            this.set('isEditingScore', 0);
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
        cancelEditingScore: function () {
            this.set('bufferedScore', this.get('score'));
            this.set('isEditingScore',0);
        },
        cancelEditingDesc: function () {
            this.set('bufferedDesc', this.get('description'));
            this.set('isEditingDesc',0);
        },
        cancelEditingMax: function () {
            this.set('bufferedMax', this.get('max_att'));
            this.set('isEditingMax',0);
        },
        addGoal: function (user) {
            this.store.find('registration', user).then(function (registration) {
                var goals = registration.get('goals');
                var goals_total = registration.get('goals_total');

                registration.set('goals',goals+1);
                registration.set('goals_total',goals_total+1);
                registration.save();
            });
        },
        removeGoal: function (user) {
            this.store.find('registration', user).then(function (registration) {
                var goals = registration.get('goals');
                var goals_total = registration.get('goals_total');

                if (goals>0) {
                    registration.set('goals',goals-1);
                    registration.set('goals_total',goals_total-1);
                }
                registration.save();
            });
        },
        addAssist: function (user) {
            this.store.find('registration', user).then(function (registration) {
                var assists = registration.get('assists');
                var assists_total = registration.get('assists_total');

                registration.set('assists',assists+1);
                registration.set('assists_total',assists_total+1);
                registration.save();
            });
        },
        removeAssist: function (user) {
            this.store.find('registration', user).then(function (registration) {
                var assists = registration.get('assists');
                var assists_total = registration.get('assists_total');

                if (assists>0) {
                    registration.set('assists',assists-1);
                    registration.set('assists_total',assists_total-1);
                    registration.save();
                }
            });
        },

        removeConfirm: function (user) {
            Ember.$('#memberlist div.list-group-item .row-action-remove-member').show();
            Ember.$('#memberlist div.list-group-item .row-action-removed').hide();
            Ember.$('#memberlist div.list-group-item .row-action-goals').hide();

            Ember.$('#memberlist div.list-group-item[data-registration="'+user+'"] .row-action-remove-member').hide();
            Ember.$('#memberlist div.list-group-item[data-registration="'+user+'"] .row-action-removed').show();

            Ember.$('#memberlist div.list-group-item[data-registration="'+user+'"] .row-action-goals').show();
        },
        removePlayer: function (user) {
            console.log('user',user);
            var _this = this;
            this.store.find('registration', user).then(function (registration) {

                registration.destroyRecord().then(function () {
                  _this.store.recordForId('registration', user); // undefined
                });
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
