import DS from 'ember-data';
import config from '../config/environment';

export default DS.RESTAdapter.extend({
    host: config.API,
    ajax: function(url, type, hash) {

        if (type==='PUT') {
            type = 'POST';
        }

        return this._super(url, type, hash);
    }
});
