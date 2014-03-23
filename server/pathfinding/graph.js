var Triangle = new require('./triangle');
var Vector = new require('./vector');


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
        } else if (triangleArray.length > 2) {
            throw "More than two triangles sharing the same edge.";
        }
    });

    triangles.forEach(function (t) {
        var nNeighbors = Object.keys(t.neighbors).length;
        if (nNeighbors === 0) {
            throw "Dangling triangle."
        }
        if (nNeighbors > 3) {
            throw "Triangle detected with more than 3 neighbors."
        }
    });
}


/**
 * Find containing triangle
 * @param {Vector p}
 */
Graph.prototype.containingTriangle = function (p) {
    var i, nTriangles = this._triangles.length;
    for (i = 0; i < nTriangles; i++) {
        var triangle = this._triangles[i];
        if (triangle.containsPoint(p)) {
            return triangle;
        }
    }
    return null;
}


function angleTest(subject, left, right) {
    var rightTri = new Triangle(new Vector(0, 0), right, subject);
    if (rightTri.clockwise()) {
        var leftTri = new Triangle(new Vector(0, 0), subject, left);
        if (leftTri.clockwise()) {
            return 'between';
        } else {
            return 'left';
        }
    } else {
        return 'right';
    }         
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

     var diagonals = t0.shortestPathToTriangle(t1);
     if (!diagonals) {
         console.log("NO PATH");
         return null;
     }
     
     if (diagonals.length === 0) {
         console.log("SAME TRIANGLE");
         return [p0, p1];
     }
 
     var path = [p0];
     
     var leftVertices = [];
     var rightVertices = [];

     var left = diagonals[0].p0;
     var right = diagonals[0].p1;

     if ((new Triangle(p0, right, left)).clockwise()) {
         var temp = left;
         left = right;
         right = temp;
     }

     leftVertices.push(left);
     rightVertices.push(right);

     var nDiagonals = diagonals.length;
     for (var i = 1; i < diagonals.length; i++) {         
         console.log("iter" + i);
         var diagonal = diagonals[i];
         var leftTail = leftVertices[i-1];
         var rightTail = rightVertices[i-1];
         
         if (leftTail.equals(diagonal.p0) || rightTail.equals(diagonal.p1)) {
             leftVertices.push(diagonal.p0);
             rightVertices.push(diagonal.p1);
         } else if (leftTail.equals(diagonal.p1) || rightTail.equals(diagonal.p0)) {
             leftVertices.push(diagonal.p1);
             rightVertices.push(diagonal.p0);
         } else {
             throw "Invalid path."
         }
     };


     leftVertices.push(p1);
     rightVertices.push(p1);

     var narrowingLeft = 0;
     var narrowingRight = 0;
     for (var i = 1; i < nDiagonals + 1; i++) {
         var apex = path[path.length - 1];
         if (!leftVertices[i].equals(leftVertices[i - 1])) {
             var newVertex = leftVertices[i];
             // left vertex is different
             if ((new Triangle(apex, newVertex, leftVertices[narrowingLeft])).clockwise()) {
                 // Widens funnel.
                 console.log("Widen to the left.");
             } else if ((new Triangle(apex, rightVertices[narrowingRight], newVertex)).clockwise()) {
                 // Crosses over right side.
                 console.log("Left side crossing over right one");
                 path.push(rightVertices[narrowingRight]);
//                 i++;
                 //narrowingLeft = i;
                 //narrowingRight = i;
                 //                 return path;
                 
                 var next = narrowingRight+1;
                 while (rightVertices.length > next && rightVertices[narrowingRight].equals(rightVertices[next])) {
                     next++;
                 }
                 
                 i = next;
                 narrowingLeft = i;
                 narrowingRight = i;
             } else {
                 // Narrows funnel
                 console.log("Narrowing left.");
                 narrowingLeft = i;
             }
         }
         if (!rightVertices[i].equals(rightVertices[i - 1])) {
             var newVertex = rightVertices[i];
             // right vertex is different
             if ((new Triangle(apex, rightVertices[narrowingRight], newVertex)).clockwise()) {
                 // Widens funnel.
                 console.log("Widen to the right.");
             } else if ((new Triangle(apex, newVertex, leftVertices[narrowingLeft])).clockwise()) {
                 // Crosses over left side.
                 console.log("Right side crossing over left one");
                 path.push(leftVertices[narrowingLeft]);

                 var next = narrowingLeft+1;
                 while (leftVertices.length > next && leftVertices[narrowingLeft].equals(leftVertices[next])) {
                     next++;
                 }
                 
                 i = next;
                 narrowingLeft = i;
                 narrowingRight = i;
             } else {
                 // Narrows funnel
                 console.log("Narrowing right.");
                 narrowingRight = i;
             }
         } 
     }

     path.push(p1);
     return path;

 }

     module.exports = Graph;
