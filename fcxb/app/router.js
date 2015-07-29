import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('matches', {path: '/'});

  this.resource('event', function() {


      this.route('edit', { path: ':id' });
  });

  this.route('event', function() {
      this.route('item', { path: ':event_id' });
      this.route('new');
  });

});