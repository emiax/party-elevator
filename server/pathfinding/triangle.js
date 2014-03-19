var Edge = require('./edge');
var tId = 0;

/**
 * Construct a new triangle.
 */
function Triangle(v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.edges = [
        new Edge(this.v0, this.v1),
        new Edge(this.v1, this.v2),
        new Edge(this.v2, this.v0)
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
    return sign(this.v0, this.v1, this.v2) < 0;
}

/**
 * Return true if the triangle contains a point
 * @param {Vector} point
 */
Triangle.prototype.containsPoint = function (point) {
  var b0, b1, b1, v0 = this.v0, v1 = this.v1, v2 = this.v2;
  b0 = sign(point, v0, v1) < 0;
  b1 = sign(point, v1, v2) < 0;
  b2 = sign(point, v2, v0) < 0;
  return ((b0 === b1) && (b1 === b2));
}



/**
 * Return a list of triangles that has to be traversed to reach goal.
 * Both this and goal are included in the list.
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
    var path = new Array(distance);
    var current = goal;
    for (var i = distance; i >= 0; i--) {
        path[i] = current;
        current = previous[current.stringify()];
    }
    return path;
}


module.exports = Triangle;
