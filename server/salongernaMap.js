/* Point class */

function Point(x, y) {
    this.x = x;
    this.y = y;
}


Point.prototype.compareTo = function (other) {
    if (this.y < other.y)
        return true;
    if (this.y > other.y)
        return false;
    if (this.x < other.x) 
        return true;
    return false;
};


Point.prototype.stringify = function () {
    return this.x + "," + this.y;
}



/* Triangle class */

var tId = 0;
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


Triangle.prototype.stringify = function () {
    return this.id;
}

Triangle.prototype.shortestPathTo = function (goal) {
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
            if (visited[triString]) return; // if visited already, then return.
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


/* Edge class */

function Edge(p0, p1) {
    if (p0.compareTo(p1)) {
        this.p0 = p0;
        this.p1 = p1;
    } else {
        this.p0 = p1;
        this.p1 = p0;
    }
}


Edge.prototype.stringify = function () {
    return this.p0.stringify() + "_" + this.p1.stringify();
}


/* Test map */

var triangles = [
    new Triangle(new Point(0, 0), new Point(10, 0), new Point(10, 10)),
    new Triangle(new Point(20, 10), new Point(10, 0), new Point(10, 10)),
    new Triangle(new Point(20, 10), new Point(10, 0), new Point(100, 10)),
    new Triangle(new Point(0, 0), new Point(10, 0), new Point(100, 10)),
]

/* Set up connectivity */

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


/* Run tests */

console.log(triangles);
console.log("SHORTEST PATH", triangles[3].shortestPathTo(triangles[0]));
