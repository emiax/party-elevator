function State(spec) {
    this._x = spec.x || 0;
    this._y = spec.y || 0;
    this._level = spec.level || State.LevelEnum.GROUND;
}


State.prototype.toString = function () {
    var s = 'State: (' + this._x + ", " + this._y + ')';
    switch (this._level) {
        case State.LevelEnum.GROUND: s += " on ground"; break;
        case State.LevelEnum.ELEVATOR: s += " in elevator"; break;
        case State.LevelEnum.TOP: s += " on top floor"; break;
    }
    return s;
}

/**
 * Return distance between state coordinates.
 * @param {State} other
 */
State.prototype.distanceTo = function (other) {
    var xDiff = this._x - other._x;
    var yDiff = this._y - other._y;
    return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
}


/**
 * Level enum.
 */
State.LevelEnum = {
    GROUND: 0,
    ELEVATOR: 1,
    TOP: 2 
}


/**
 * Linear interpolation.
 */
function lerp(a, b, t) {
    return a*(1 - t) + b*t;
}


/**
 * Interpolate between two states (a and b) using t [0, 1]
 */
State.interpolate = function (a, b, t) {
    var x = lerp(a._x, b._x, t);
    var y = lerp(a._y, b._y, t);
    var level = a._level;
    return new State({
        x: x,
        y: y, 
        level: level
    });
}


module.exports = State;
