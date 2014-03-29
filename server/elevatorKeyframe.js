var State = require('./state');


function ElevatorKeyframe(level, time, type) {
    this._time = time;
    this._level = level;
    this._type = type;
}


/**
 * To string
 */
ElevatorKeyframe.prototype.toString = function () {
    return "{ ElevatorKeyframe: " + this._level + "}";
}


/**
 * Return level.
 */
ElevatorKeyframe.prototype.level = function () {
    return this._level;
}


/**
 * Return type.
 */
ElevatorKeyframe.prototype.type = function () {
    return this._type;
}


/**
 * Return time.
 */
ElevatorKeyframe.prototype.time = function () {
    return this._time;
}


ElevatorKeyframe.prototype.toClientFormat = function () {
    return {
        level: this._level === State.LevelEnum.TOP ? 'top' : 'ground',
        time: this._time.getTime(),
        type: this._type
    };
}

/**
 * Return true if this keyframe has already occured.
 */
ElevatorKeyframe.prototype.hasOccured = function () {
    return this._time <= new Date();
}


/**
 * Return true if this keyframe is after another keyframe.
 */
ElevatorKeyframe.prototype.isAfter = function (time) {
    return this._time.getTime() > time.getTime();
}


/**
 * Return time of keyframe.
 */
ElevatorKeyframe.prototype.time = function () {
    return this._time;
}

module.exports = ElevatorKeyframe;
