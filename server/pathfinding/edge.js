/**
 * Create an edge
 * @param {Vector} p0
 * @param {Vector} p1
 */

function Edge(p0, p1) {
    if (p0.compareTo(p1)) {
        this.p0 = p0;
        this.p1 = p1;
    } else {
        this.p0 = p1;
        this.p1 = p0;
    }
}


/**
 * Return a string handy for hasing
 */
Edge.prototype.stringify = function () {
    return this.p0.stringify() + "_" + this.p1.stringify();
}


/**
 * Return true if this edge equals the other edge
 * @param {Edge} other
 */
Edge.prototype.equals = function (other) {
    return this.stringify() === other.stringify();
}

/**
 * Return the edge vector (from p0 to p1)
 */
Edge.prototype.vector = function () {
    return this.p1.sub(this.p0);
}


module.exports = Edge;
