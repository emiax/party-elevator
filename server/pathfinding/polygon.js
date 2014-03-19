var PolygonVertex = require('./polygonVertex');
var Triangle = require('./triangle');


/**
 * Construct a simple polygon in ccw order. Points should not 
 */
var Polygon = function (points) {
    points = points.slice(0);

    if (points[0].equals(points[points.length - 1])) {
        points.pop();
    }
    
    var vertices = [];

    var firstHead = 0;
    var secondHead = 1;
    var firstTail = points.length - 1;
    var secondTail = points.length - 2;

    function angle(p0, p1, p2) {
        var e0 = p1.sub(p0);
        var e1 = p2.sub(p1);
        var diff = e1.arg() - e0.arg();
        
        // Make sure we are in the interval [-pi, pi]
        var pi = Math.PI;
        diff = (diff + pi)%(2*pi) - pi;
        
        return diff;
    }

    var totalAngle = 0;
    totalAngle += angle(points[firstTail], points[firstHead], points[secondHead]);
    for (var i = secondHead; i <= secondTail; i++) {
        totalAngle += angle(points[i - 1], points[i], points[i + 1]);
    }
    totalAngle += angle(points[secondTail], points[firstTail], points[firstHead]);    

    if (totalAngle < 0) {
        points.reverse();
    }

    points.forEach(function (p) {
        vertices.push(new PolygonVertex(p));
    });

    for (var i = firstHead; i <= secondTail; i++) {
        vertices[i].next = vertices[i+1];
    }
    for (var i = secondHead; i <= firstTail; i++) {
        vertices[i].prev = vertices[i-1];
    }

    vertices[firstTail].next = vertices[firstHead]; 
    vertices[firstHead].prev = vertices[firstTail];

    this.current = vertices[firstHead];
}



/**
 * Return a human readable string
 */
Polygon.prototype.toString = function () {
    var head = this.current;
    var ptr = head;
    var s = 'Polygon: [';
    do {
        s += ptr.toString();
        if (ptr.next !== head) {
                s += ", ";
        }
        ptr = ptr.next;
    } while (ptr !== head);
    s += '];'
    return s;
}


/**
 * Clip next ear. Remove it from the polygon, and return the newly generated triangle.
 * Return null if there are no more triangles.
 * @return {Triangle} the formed triangle.
 */
Polygon.prototype.clipNextEar = function () {
    var current = this.current;

    if (current.next.next === current) return null;
    if (current.next === current) return null;
    
    while (!current.isEar()) {
        var prev = current.prev;
        var next = current.next;
        if (prev === next) {
            return null;
        }
    }

    current.prev.next = current.next;
    current.next.prev = current.prev;
    this.current = current.next;
    return new Triangle(current.prev.point, current.point, current.next.point);
}


/**
 * Triangulate this polygon.
 * This will destroy the polygon and return a list of triangles.
 */
Polygon.prototype.triangulate = function () {
    var t, triangles = [];
    while (t = this.clipNextEar()) {
        triangles.push(t);
    }
    return triangles;
}


module.exports = Polygon;
