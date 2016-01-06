/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'fcxb',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
        API: 'http://test.fcxb.de/',
        contentSecurityPolicy: {
            //https://github.com/rwjblue/ember-cli-content-security-policy
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline' 127.0.0.1:35729 www.fussball.de maxcdn.bootstrapcdn.com", // Allow scripts from https://cdn.mxpnl.com
            'font-src': "'self' http://fonts.googleapis.com http://maxcdn.bootstrapcdn.com", // Allow fonts to be loaded from http://fonts.gstatic.com
            'connect-src': "'self' 127.0.0.1 api.fcxb.de test.fcxb.de trainingslist.dev www.fussball.de", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
            'img-src': "'self' https://maps.googleapis.com trainingslist.dev api.fcxb.de test.fcxb.de",
            'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com http://maxcdn.bootstrapcdn.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com
            'media-src': "'self' https://maps.googleapis.com",
            'report-uri': "'self'"
        },
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created

            'LOG_ACTIVE_GENERATION': false
        }
    };

    if (environment === 'development') {
        ENV.APP.LOG_RESOLVER = false;
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_TRANSITIONS = false;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
        ENV.APP.LOG_VIEW_LOOKUPS = true;
        //ENV.API = 'http://trainingslist.dev/API';
        ENV.API = 'http://test.fcxb.de';
    }
    //ENV.APP.LOG_RESOLVER = true;
    //ENV.APP.LOG_ACTIVE_GENERATION = true;

    if (environment === 'production') {
        ENV.API = 'http://api.fcxb.de';
    }

    return ENV;
};
