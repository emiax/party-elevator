var Triangle = require('./triangle');


var PolygonVertex = function (point) {
    this.point = point;
    this.next = null;
    this.prev = null;
}

/**
 * Return true if this polygon is an ear
 * Runs in O(n). n is number of vertices in polygon.
 */
PolygonVertex.prototype.isEar = function () {
    var potentialEar = new Triangle(this.prev.point, this.point, this.next.point);
    
    // base case. this polygon is already a triangle.
    if (this.next.next.next === this) return true;
    
    // An ear may not contain any other point of the polygon.
    var v = this.next.next;
    while (v !== this.prev.prev) {
        if (potentialEar.containsPoint(v.point)) {
            return false;
        }
        v = v.next;
    }

    return !potentialEar.clockwise();

}


/**
 * To string
 */
PolygonVertex.prototype.toString = function () {
    return "PolygonVertex : {" + this.point.toString() + "}";
}

module.exports = PolygonVertex;
