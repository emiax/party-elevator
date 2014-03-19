function Vector(x, y) {
    this.x = x;
    this.y = y;
}


/**
 * Return true if this is lexiographically smaller than other vector
 * @param {Vector} other
 */
Vector.prototype.compareTo = function (other) {
    if (this.y < other.y)
        return true;
    if (this.y > other.y)
        return false;
    if (this.x < other.x) 
        return true;
    return false;
};


/**
 * Return a human readable string
 */
Vector.prototype.toString = function () {
    return "Vector {" + this.x + ", " + this.y + "}";
}


/**
 * Return a string handy for hasing
 */
Vector.prototype.stringify = function () {
    return this.x + "," + this.y;
}


/**
 * Subtract other from this and return the difference as a new Vector.
 * @param {Vector} other
 */
Vector.prototype.sub = function (other) {
    return new Vector(this.x - other.x, this.y - other.y);
}


/**
 * Return true if this vector equals other
 * @param {Vector} other
 */
Vector.prototype.equals = function (other) {
    return this.x === other.x && this.y === other.y;
}


/**
 * Return the argument (angle) of this vector (radians)
 */
Vector.prototype.arg = function () {
    return Math.atan2(this.y, this.x);
}


module.exports = Vector;
