var State = require('./state');
var ElevatorKeyframe = require('./elevatorKeyframe');

var Elevator = {

    delay: 500,

    travelTime: 3000,
    
    keyframes: [new ElevatorKeyframe(State.LevelEnum.GROUND, new Date(), 'arrival')],
    

    clearOldKeyframes: function () {
        var i;
        for (i = 0; i < this.keyframes.length; i++) {
            if (!this.keyframes[i].hasOccured()) {
                break;
            }
        }
        var firstRelevantKeyframe = i - 1;
        if (firstRelevantKeyframe > 0) {
            this.keyframes = this.keyframes.slice(firstRelevantKeyframe);
        }
    },
    
    
    keyframeIndexBefore: function (time) {
        var index = 0;
        var keyframes = this.keyframes;
        for (var i = 0; i < keyframes.length; i++) {
            var keyframe = keyframes[i];
            if (!keyframe.isAfter(time)) {
                index = i;
            } else {
                break;
            }
        }
        return index;
    },
    
    
    requestArrivalTime: function (level, after) {
        this.clearOldKeyframes();

        var keyframes = this.keyframes;

        var previousKeyframeIndex = this.keyframeIndexBefore(after);
        
        console.log("previous keyframe index",  this.keyframeIndexBefore(after));
        
        for (var i = previousKeyframeIndex; i < keyframes.length; i++) {
            var keyframe = keyframes[i];
            if (keyframe.level() === level && keyframe.type() === 'arrival') {
                if (keyframe.isAfter(after)) {
                    console.log("WILL ARRIVE AT KEYFRAME");
                    return keyframe.time(); // Will arrive at the keyframe.
                } else {
                    console.log("ALREADY THERE ACCORDING TO");
                    console.log(this.keyframes);
                    return after; // already there at the time.
                }
            }
        }
        
        var lastKeyframeIndex = keyframes.length - 1;
        var lastKeyframe = keyframes[lastKeyframeIndex];
        
        var lastScheduledTime = after;
        if (lastKeyframe.isAfter(after)) {
            var lastScheduledTime = lastKeyframe.time();
        }
        
        var departureTime = new Date(lastScheduledTime.getTime() + this.delay);
        var arrivalTime = new Date(departureTime.getTime() + this.travelTime);

        var departure = new ElevatorKeyframe(lastKeyframe.level(), departureTime, 'departure');
        var arrival = new ElevatorKeyframe(level, arrivalTime, 'arrival');
        this.keyframes.push(departure);
        this.keyframes.push(arrival);
        
        console.log("GENERATING NEW KEYFRAME");
        console.log("ELEVATOR KEYFRAMES", this.keyframes);
        
        return arrivalTime;
    },

    toClientFormat: function () {
        this.clearOldKeyframes();
        var clientKeyframes = [];
        this.keyframes.forEach(function (k) {
            clientKeyframes.push(k.toClientFormat());
        });

        return {
            delay: this.delay,
            travelTime: this.travelTime,
            keyframes: clientKeyframes
        }
    }
};

module.exports = Elevator;
