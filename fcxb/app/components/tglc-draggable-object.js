import Ember from 'ember';
import DraggableObject from 'ember-drag-drop/components/draggable-object';

export default DraggableObject.extend({
  didRender: function() {
    let Y = this.get('content.pos_y'),
      X = this.get('content.pos_x'),
      sub = this.get('content.sub');

      Y = Y < 70 ? 70 : Y;
      Y = Y > 1250 ? 1250 : Y;

      X = X < 13 ? 13 : X;
      X = X > 730 ? 730 : X;

      Y *= this.get('factor');
      X *= this.get('factor');

    Ember.$('#' + this.elementId).css({
      top: Y,
      left: X,
      position: 'absolute',
      backgroundColor: sub ? 'gray' : 'red'
    });
  },

  init: function() {
    this._super(...arguments);

    this.set('factor',this.getFactor());
    var resizeHandler = function() {
      this.set('factor',this.getFactor());
      this.didRender();
    }.bind(this);

    this.set('resizeHandler', resizeHandler);
    Ember.$(window).bind('resize', this.get('resizeHandler'));
  },
  factor: 1,
  getFactor: function () {
      if (Ember.$('body').width() >= 800) {
        return 1;
      } else {
        return Ember.$('body').width() / 800;
      }
  },
  sub: function() {
    return this.get('content').get('sub');
  }.property('content'),

  click: function(event) {
    var obj = this.get('content');
    this.sendAction('clickedAction', obj, event);
    this.didRender();
  }
});
