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

    var v = vertices[firstHead];
    while (v !== vertices[firstTail]) {
        v = v.next;
    }
    
    this.current = vertices[firstHead];
    

    if (this.clockwise()) {
        throw "Polygon must be ccw."
    }
}


/**
 * Clockwise
 */
Polygon.prototype.clockwise = function () {
    var ptr = this.current;
    var doubleArea = 0;
    do {
        doubleArea += ptr.point.x*ptr.next.point.y - ptr.next.point.x*ptr.point.y;
        ptr = ptr.next;
    } while (ptr !== this.current)
    return (doubleArea < 0);
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
    var beginning = this.current;
    var i = 0;

    if (this.current.next.next === this.current) return null;

    while (!this.current.isEar()) {
        this.current = this.current.next;
        i++;
        if (this.current === beginning) {
            throw "Could not clip any ear. " + i + " triangles left in polygon.";
        }
    }
    
    this.current.prev.next = this.current.next;
    this.current.next.prev = this.current.prev;

    var tri = new Triangle(this.current.prev.point, this.current.point, this.current.next.point);
    this.current = this.current.prev;
    return tri;
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
