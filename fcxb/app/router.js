import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('events', {path: '/'});


  this.route('event.item', { path: '/:event_id' });
  this.route('event.share', { path: '/s/:event_id' });
  this.route('event.lineup', { path: '/l/:event_id' });
  this.route('event.new');

  this.route('league');
  this.route('tally');
});