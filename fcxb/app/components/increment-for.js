import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    numOfTimes: function(){
        //var times = new Array(parseInt(this.get('times')));
        //var times = new Array(100);

        var numOfTimes = [];
        for(var i = 0; i < this.get('times'); i++) {
            numOfTimes.push(i);
        }
        return numOfTimes;
    }.property('times')
});
