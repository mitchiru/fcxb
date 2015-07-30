import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('events', {path: '/'});

  this.route('event', function() {
      this.route('item', { path: ':event_id' });
      this.route('new');
  });

});