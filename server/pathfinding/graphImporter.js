var Vector = require('./vector');
var Triangle = require('./triangle');
var Polygon = require('./polygon');
var Graph = require('./graph');

var GraphImporter = {};
    
/**
 * Import svg data. A stirng describing the polygon.
 */
GraphImporter.importGraph = function (filePath) {

    var svgString = '727.41,509.52 656.97,509.52 656.97,526.52 667.35,526.52 667.35,597.44 618.02,597.44 618.02,566.9 524.07,566.9 524.07,614.44 556.61,614.44 556.61,835.97 447.29,835.97 447.29,754.8 409.26,754.8 409.26,737.95 487.29,737.95 487.29,680.93 409.26,680.93 409.26,641.46 487.29,641.46 487.29,614.44 490.58,614.44 490.58,597.44 348.56,597.44 348.56,614.44 392.26,614.44 392.26,731.57 352.77,731.57 352.77,835.97 348.56,835.97 348.56,852.97 391.15,852.97 391.15,921.93 281.53,921.93 281.53,852.97 315.07,852.97 315.07,835.97 269.11,835.97 269.11,789.09 296.07,789.09 296.07,614.44 315.07,614.44 315.07,597.44 252.11,597.44 252.11,745.06 242.42,745.06 242.42,796.24 252.11,796.24 252.11,835.97 113.28,835.97 113.28,796.24 201.84,796.24 201.84,745.06 113.28,745.06 113.28,695 145.17,695 145.17,641.46 210.12,641.46 210.12,614.44 218.62,614.44 218.62,577.14 201.62,577.14 201.62,597.44 181.39,597.44 181.39,573.37 145.17,573.37 145.17,540.35 181.39,540.35 181.39,526.52 201.62,526.52 201.62,546.33 218.62,546.33 218.62,509.52 210.12,509.52 210.12,481.21 139.92,481.21 139.92,438.26 229.03,438.26 229.03,399.99 113.28,399.99 113.28,356.4 155.97,356.4 155.97,268.84 239.74,268.84 239.74,371.1 271.03,371.1 271.03,509.52 252.11,509.52 252.11,526.52 473.84,526.52 473.84,509.52 460.87,509.52 460.87,479.28 366.92,479.28 353.78,446.06 353.78,329.15 330.68,329.15 330.68,268.84 366.92,268.84 366.92,299.09 460.87,299.09 460.87,268.84 483.81,268.84 483.81,371.1 507.17,371.1 507.17,499.61 507.33,499.61 507.33,526.52 560.74,526.52 560.74,509.52 524.17,509.52 524.17,475.16 598.58,475.16 598.58,509.52 593.28,509.52 593.28,526.52 623.48,526.52 623.48,509.52 615.58,509.52 615.58,416.04 524.17,416.04 524.17,316.73 626.42,316.73 626.42,268.84 687.56,268.84 687.56,375.05 727.41,375.05';

    // 1. Parse chain and make sure there are no duplicate entries.
    var chain = GraphImporter.parsePolygonChain(svgString);
    var set = {};
    chain.forEach(function (v) {
        if (set[v.stringify()]) {
            throw "Duplicate point entry for " + v.toString();
        }
        set[v.stringify()] = v;
    });
    
    // 2. create polygon
    var polygon = new Polygon(chain);
    console.log("POLYGON", polygon);
    // 3. triangulate polygon
    var triangles = polygon.triangulate();
    // 4. find neighbors
    var graph = new Graph(triangles);
    
    console.log("Imported graph triangles: ", graph._triangles);
}

GraphImporter.parsePolygonChain = function (str) {
    
    var ptr = 0;
    var vectors = [];
    
    function parseDouble() {
        var pos = ptr;
        while (str[pos] && str[pos] !== ' ' && str[pos] !== ',') {
            pos++;
        }
        var number = parseFloat(str.substr(ptr, pos - ptr));
        ptr = pos;
        return number;
    }

    while (str[ptr] !== undefined) {
        var x = parseDouble();
        ptr++; // advance through ,
        var y = parseDouble();
        ptr++; // advance through whitespace
        vectors.push(new Vector(x, y));
    }
    return vectors;
}

module.exports = GraphImporter;
