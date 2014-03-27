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
    this.interpolatedKeyframes().forEach(function (kf) {
        keyframes.push(kf.toClientFormat());
    });
    return {
        id: this._id,
        keyframes: keyframes,
        fbId: this._facebookData.id
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
 * Set facebook data.
 */
Attendee.prototype.setFacebookData = function (data) {
    this._facebookData = data;
}


/**
 * 
 */
Attendee.prototype.interpolatedKeyframes = function () {
    var keyframes = this._keyframes;
    var interpolatedKeyframes = keyframes.slice(this.previousKeyframeIndex() + 1);
    interpolatedKeyframes.unshift(new Keyframe(this.currentState(), new Date()));
    return interpolatedKeyframes;
}


/**
 * Set intention.
 */
Attendee.prototype.setIntention = function (intentionState) {
    console.log("NEW INTENTION: ", intentionState);
    var currentState = this.currentState();

    console.log(currentState);
    var keyframes = Pathfinder.createKeyframes(currentState, intentionState, new Date());
    console.log(keyframes);
    this._keyframes = keyframes;
}


/**
 * Return the interpolated state.
 */
Attendee.prototype.currentState = function () {
    var previousKeyframeIndex = this.previousKeyframeIndex();
    var previousKeyframe = this._keyframes[previousKeyframeIndex];

//    console.log(previousKeyframe);

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
