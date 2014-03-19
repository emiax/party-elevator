var Vector = require('./vector');
var Triangle = require('./triangle');
var Polygon = require('./polygon');
var Graph = require('./graph');

var GraphImporter = {};
    
/**
 * Import svg data. A stirng describing the polygon.
 */
GraphImporter.importGraph = function (filePath) {

    // 1. TODO: parse svg, convert to list of vectors
    // Temporary placeholder: a set of points.
    var chain = [new Vector(0, 0),
                 new Vector(1, 0),
                 new Vector(2, 2),
                 new Vector(0, 1),
                 new Vector(0, 0.5)
            ];

    // 2. create polygon
    var polygon = new Polygon(chain);
    // 3. triangulate polygon
    var triangles = polygon.triangulate();
    // 4. find neighbors
    var graph = new Graph(triangles);
    
    console.log("Imported graph triangles: ", graph._triangles);
}

module.exports = GraphImporter;
