function ElevatorKeyframe(time, floor) {
    this._time = time;
    this._floor = floor;
}


/**
 * To string
 */
ElevatorKeyframe.prototype.toString = function () {
    return "{ ElevatorKeyframe: " + this._floor + "}";
}


ElevatorKeyframe.prototype.toClientFormat = function () {
    return {
        floor: this._floor,
        time: this._time
    };
}

/**
 * Return true if this keyframe has already occured.
 */
ElevatorKeyframe.prototype.hasOccured = function () {
    return this._time <= new Date();
}


/**
 * Return time of keyframe.
 */
ElevatorKeyframe.prototype.time = function () {
    return this._time;
}

module.exports = ElevatorKeyframe;
