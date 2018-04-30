import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    evdate: DS.attr('number'),
    evdate_str: DS.attr('string'),
    evdate_dif: DS.attr('string'),
    ended: DS.attr('boolean'),
    description: DS.attr('string'),
    canceled: DS.attr('number'),
    private: DS.attr('number'),
    as_template: DS.attr('boolean'),
    min_att: DS.attr('number'),
    max_att: DS.attr('number'),
    location: DS.attr('string'),
    score: DS.attr('string'),
    hasScore: function () {
        return (this.get('score') !== '' && this.get('score') !== '0:0');
    }.property('score'),
    registrations: DS.hasMany('registrations', {async: true}),
    weekday: DS.attr('string'),
    hour: DS.attr('string'),
    weather: DS.attr('string'),
    sunset: DS.attr('string'),
    weather_icon: DS.attr('string'),
    weather_wind_speed: DS.attr('number'),
    weather_temperature: DS.attr('number'),

    weather_temperature_icon: function() {
        var date = new Date(this.get('evdate')*1000);
        var month = date.getMonth();
        var seasonTemperature = [20,30];

        switch (month) {
            case 0:
            case 1:
            case 2:
            case 11:
                seasonTemperature = [0,10];
                break;
            case 3:
            case 4:
            case 9:
            case 10:
                seasonTemperature = [10,20];
                break;
        }

        if (this.get('weather_temperature') > seasonTemperature[1]) {
            return '/icons/Themperature_high.png';
        } else if (this.get('weather_temperature') < seasonTemperature[0]) {
            return '/icons/Themperature_low.png';
        } else {
            return '/icons/Themperature_medium.png';
        }
    }.property('weather_temperature'),
    google_maps_link: function () {
        return 'https://maps.google.com/maps?t=m&f=d&saddr=Current+Location&daddr='+this.get('location').replace(/\s/g,'+').replace(/,/g,'+');
    }.property('location'),
    bar_width: function() {
        if (this.get("overbooked")===0) {
            return 'width: '+(this.get('registrations.length'))*100/(this.get('max_att'))+'%';
        } else {
            return 'width:'+this.get('max_att')*100/this.get("registrations.length")+'%';
        }
    }.property('registrations'),
    link: function () {
        return 'http://fcxb.de/'+this.get('id');
    }.property('id'),
    bar_color: function() {
        return this.get('registrations.length') >= this.get('min_att') ? 'progress-bar' : 'progress-bar progress-bar-info';
    }.property('registrations'),
    overbooked: function() {
        if (this.get('registrations.length') > this.get('max_att')) {
            return this.get('registrations.length') - this.get('max_att');
        }
        return 0;
    }.property('registrations'),

    overbooked_with: function () {
        return 'width: '+this.get('overbooked')*100/(this.get('overbooked')+this.get('max_att'))+'%';
    }.property('registrations')
});
