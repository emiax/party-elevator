var State = require('./state');

function Keyframe(state, time) {
    this._state = state;
    this._time = time;
}


/**
 * To string
 */
Keyframe.prototype.toString = function () {
    return "{ state: " + this._state.toString() + "}";
}


Keyframe.prototype.toClientFormat = function () {
    return {
        state: this._state.toClientFormat(),
        time: this._time.getTime()
    };
}

/**
 * Return true if this keyframe has already occured.
 */
Keyframe.prototype.hasOccured = function () {
    return this._time <= new Date();
}


/**
 * Return time of keyframe.
 */
Keyframe.prototype.time = function () {
    return this._time;
}


/**
 * Return state of keyframe.
 */
Keyframe.prototype.state = function () {
    return this._state;
}


/**
 * Use two keyframes (a, b) to create a interpolated state in time.
 */
Keyframe.interpolateStates = function (a, b, time) {
    var startTime = a.time();
    var endTime = b.time();
    var t = (time - startTime) / (endTime - startTime);
    return State.interpolate(a.state(), b.state(), t);
}


module.exports = Keyframe;
