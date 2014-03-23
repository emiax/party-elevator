var Edge = require('./edge');
var tId = 0;

/**
 * Construct a new triangle.
 */
function Triangle(p0, p1, p2) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.edges = [
        new Edge(this.p0, this.p1),
        new Edge(this.p1, this.p2),
        new Edge(this.p2, this.p0)
    ];
    this.neighbors = {};
    this.id = tId++;
}


/**
 * Convert to string, used for key in maps.
 */
Triangle.prototype.stringify = function () {
    return this.id;
}



/**
 * Convert to string, used for key in maps.
 */
Triangle.prototype.toClientFormat = function () {
    return {
        p0: this.p0.toClientFormat(),
        p1: this.p1.toClientFormat(),
        p2: this.p2.toClientFormat()
    };
}


/**
 * Convert to a human readable string
 */
Triangle.prototype.toString = function () {
    return "Triangle {" + this.p0.toString() + ", " + this.p1.toString() + ", " + this.p2.toString() + "}";
}


/**
 * Helper function for orientation-related queries.
 */
function sign(p0, p1, p2)
{
  return (p0.x - p2.x) * (p1.y - p2.y) - (p1.x - p2.x) * (p0.y - p2.y);
}


/**
 * Return true if the points of this triangle are stored in clockwise order.
 */
Triangle.prototype.clockwise = function () {
    return sign(this.p0, this.p1, this.p2) <= 0;
}

/**
 * Return true if the triangle contains a point
 * @param {Vector} point
 */
Triangle.prototype.containsPoint = function (point) {
  //console.log("is " + point.toString() + " contained by " + this.toString());
  var b0, b1, b1, p0 = this.p0, p1 = this.p1, p2 = this.p2;
  b0 = sign(point, p0, p1) < 0;
  b1 = sign(point, p1, p2) < 0;
  b2 = sign(point, p2, p0) < 0;
  return ((b0 === b1) && (b1 === b2));
}


/**
 * Return the edge that this triangle share with the other triangle.
 * Return null if no such edge exists.
 */
Triangle.prototype.getCommonEdge = function (other) {
    var edge = null;
    this.edges.forEach(function (thisEdge) {
        other.edges.forEach(function (otherEdge) {
            if (edge) return;
            if (thisEdge.equals(otherEdge)) {
                edge = thisEdge;
            }
        })
    });
    return edge;
}



/**
 * Return a list of edges that have to be crossed in order to reach the goal.
 */
Triangle.prototype.shortestPathToTriangle = function (goal) {
    var distances = {};
    var previous = {};

    var startString = this.stringify();
    var goalString = goal.stringify();
    var visited = {};

    visited[startString] = this;
    distances[startString] = 0;
    
    while (distances[goalString] === undefined) {
        // find the closest triangle to the start.
        var closest = null;
        Object.keys(distances).forEach(function (triString) {
            var tri = visited[triString];
            if (!closest || distances[triString] < distances[closest.stringify()]) {
                closest = tri;
            }
        });
        if (closest === null) return null; // no path could be found.

        var closestString = closest.stringify();
        var currentDistance = distances[closestString];
        Object.keys(closest.neighbors).forEach(function (edgeString) {
            var tri = closest.neighbors[edgeString];
            var triString = tri.stringify();
            if (visited[triString]) return;
            distances[triString] = currentDistance + 1;
            previous[triString] = closest;
            visited[triString] = tri;
        });
        delete distances[closestString];
    }

    var distance = distances[goalString];
    if (distance > 0) {
        var path = new Array(distance - 1);
        var current = goal;
        for (var i = distance-1; i >= 0; i--) {
            var prev = previous[current.stringify()];
            path[i] = current.getCommonEdge(prev);
            current = previous[current.stringify()];
        }
        return path;
    } else {
        return [];
    }
}


module.exports = Triangle;
