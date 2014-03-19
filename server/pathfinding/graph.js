var Graph = function (triangles) {

    this._triangles = triangles;
    
    var edgeToTriangles = {};
    triangles.forEach(function (t) {
        t.edges.forEach(function (e) {
            var edgeKey = e.stringify();
            if (!edgeToTriangles[edgeKey]) {
                edgeToTriangles[edgeKey] = [];
            }
            edgeToTriangles[edgeKey].push(t);
        });
    });

    Object.keys(edgeToTriangles).forEach(function (edgeString) {
        var triangleArray = edgeToTriangles[edgeString];
        if (triangleArray.length === 2) {
            var t0 = triangleArray[0];
            var t1 = triangleArray[1];
            t0.neighbors[edgeString] = t1;
            t1.neighbors[edgeString] = t0;
        }
    });
}


/**
 * Find containing triangle
 * @param {Vector p}
 */
Graph.prototype.containingTriangle = function () {
    var i, nTriangles = this._triangles.length;
    for (i = 0; i < nTriangles; i++) {
        var triangle = this._triangles[i];
        if (triangle.containsPoint(i)) {
            return triangle;
        }
    }
    return null;
}


/**
 * Find the shortest path from p0 to p1.
 * @param {Vector} p0
 * @param {Vector} p1
 */
Graph.prototype.shortestPath = function (p0, p1) {
    var t0 = this.containingTriangle(p0);
    var t1 = this.containingTriangle(p1);
    
    if (!t0 || !t1) {
        return null;
    }
    
    var triangleList = t0.shortestPathToTriangle(t1);
    // todo: implement funnel algorithm, and return the result!
}


module.exports = Graph;
