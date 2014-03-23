var Vector = require('./vector');
var Triangle = require('./triangle');
var Polygon = require('./polygon');
var Graph = require('./graph');

var GraphImporter = {};
    
/**
 * Import svg data. A stirng describing the polygon.
 */
GraphImporter.importGraph = function (filePath) {

    var svgString = '614.13,240.68 543.69,240.68 543.69,257.68 554.07,257.68 554.07,328.6 504.74,328.6 504.74,298.06 410.79,298.06 410.79,345.6 443.33,345.6 443.33,567.13 334.01,567.13 334.01,485.96 295.98,485.96 295.98,469.11 374.01,469.11 374.01,412.09 295.98,412.09 295.98,372.62 374.01,372.62 374.01,345.6 377.3,345.6 377.3,328.6 235.28,328.6 235.28,345.6 278.98,345.6 278.98,462.73 239.49,462.73 239.49,567.13 235.28,567.13 235.28,584.13 277.87,584.13 277.87,653.09 168.25,653.09 168.25,584.13 201.79,584.13 201.79,567.13 155.83,567.13 155.83,520.25 182.79,520.25 182.79,345.6 201.79,345.6 201.79,328.6 138.83,328.6 138.83,476.22 129.14,476.22 129.14,527.4 138.83,527.4 138.83,567.13 0,567.13 0,527.4 88.56,527.4 88.56,476.22 0,476.22 0,426.16 31.89,426.16 31.89,372.62 96.84,372.62 96.84,345.6 105.34,345.6 105.34,308.3 88.34,308.3 88.34,328.6 68.11,328.6 68.11,304.53 31.89,304.53 31.89,271.51 68.11,271.51 68.11,257.68 88.34,257.68 88.34,277.49 105.34,277.49 105.34,240.68 96.84,240.68 96.84,212.37 26.64,212.37 26.64,169.42 115.75,169.42 115.75,131.15 0,131.15 0,87.56 42.69,87.56 42.69,0 126.46,0 126.46,102.26 157.75,102.26 157.75,240.68 138.83,240.68 138.83,257.68 360.56,257.68 360.56,240.68 347.59,240.68 347.59,210.44 253.64,210.44 240.5,177.22 240.5,60.31 217.4,60.31 217.4,0 253.64,0 253.64,30.25 347.59,30.25 347.59,0 370.53,0 370.53,102.26 393.89,102.26 393.89,230.77 394.05,230.77 394.05,257.68 447.46,257.68 447.46,240.68 410.89,240.68 410.89,206.32 485.3,206.32 485.3,240.68 480,240.68 480,257.68 510.2,257.68 510.2,240.68 502.3,240.68 502.3,147.2 410.89,147.2 410.89,47.89 513.14,47.89 513.14,0 574.28,0 574.28,106.21 614.13,106.21'

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
    // 3. triangulate polygon
    var triangles = polygon.triangulate();
    // 4. find neighbors
    var graph = new Graph(triangles);
    return graph;
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
