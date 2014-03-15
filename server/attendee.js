var Keyframe = require('./keyframe');
var Pathfinder = require('./pathfinder');


var nextId = 0;

function Attendee(state) {
    var firstKeyframe = new Keyframe(state, new Date());
    this._keyframes = [firstKeyframe];
    this._id = nextId++;
}



Attendee.prototype.id = function () {
    return this._id;
}


Attendee.prototype.toClientFormat = function () {
    var keyframes = [];
    this.keyframes().forEach(function (kf) {
        keyframes.push(kf.toClientFormat());
    });
    return {
        id: this._id,
        keyframes: keyframes
    }
}


Attendee.prototype.toString = function () {
    var s = "Attendee: {";
    
    this._keyframes.forEach(function (kf) {
        s += kf.toString();
    });

    s += "}";
    return s;
    
}


Attendee.prototype.keyframes = function () {
    return this._keyframes;
}


/**
 * Set intention.
 */
Attendee.prototype.setIntention = function (intentionState) {
    var currentState = this.currentState();
    this._keyframes = Pathfinder.createKeyframes(currentState, intentionState, new Date());
}


/**
 * Return the interpolated state.
 */
Attendee.prototype.currentState = function () {
    var previousKeyframeIndex = this.previousKeyframeIndex();
    var previousKeyframe = this._keyframes[previousKeyframeIndex];

    var nextKeyframeIndex = previousKeyframeIndex + 1;
    if (nextKeyframeIndex < this._keyframes.length) {
        var nextKeyframe = this._keyframes[nextKeyframeIndex];
        return Keyframe.interpolateStates(previousKeyframe, nextKeyframe, new Date());
    } else {
        return previousKeyframe.state();
    }
}


/**
 * Get index of previous state.
 */
Attendee.prototype.previousKeyframeIndex = function () {
    var previousKeyframeIndex = 0;
    var nKeyframes = this._keyframes.length;
    for (var i = 0; i < nKeyframes; i++) {
        var keyframe = this._keyframes[i];
        if (keyframe.hasOccured()) {
            previousKeyframeIndex = i;
        } else {
            break;
        }
    }
    return previousKeyframeIndex;
}


module.exports = Attendee;
