function Edge(v0, v1) {
    if (v0.compareTo(v1)) {
        this.v0 = v0;
        this.v1 = v1;
    } else {
        this.v0 = v1;
        this.v1 = v0;
    }
}


/**
 * Return a string handy for hasing
 */
Edge.prototype.stringify = function () {
    return this.v0.stringify() + "_" + this.v1.stringify();
}


/**
 * Return the edge vector (from v0 to v1)
 */
Edge.prototype.vector = function () {
    return this.v1.sub(this.v0);
}


module.exports = Edge;
