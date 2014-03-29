var Vector = require('./vector');
var Triangle = require('./triangle');
var Polygon = require('./polygon');
var Graph = require('./graph');
var State = require('../state');

var GraphImporter = {};


var topFloorPoints = '668.085,328.035 668.085,410.835 504.735,410.835 504.735,339.455 511.965,339.455 511.965,321.165 504.735,321.165 504.735,298.055 410.785,298.055 410.785,345.595 443.325,345.595 443.325,567.125 334.005,567.125 334.005,485.955 295.975,485.955 295.975,469.105 374.005,469.105 374.005,412.085 295.975,412.085 295.975,372.615 374.005,372.615 374.005,345.595 377.295,345.595 377.295,328.595 235.275,328.595 235.275,345.595 278.975,345.595 278.975,462.725 239.485,462.725 239.485,567.125 235.275,567.125 235.275,584.125 277.865,584.125 277.865,653.095 168.245,653.095 168.245,584.125 201.785,584.125 201.785,567.125 155.825,567.125 155.825,520.245 182.785,520.245 182.785,345.595 201.785,345.595 201.785,328.595 138.825,328.595 138.825,476.215 129.135,476.215 129.135,527.395 138.825,527.395 138.825,567.125 -0.005,567.125 -0.005,527.395 88.555,527.395 88.555,476.215 -0.005,476.215 -0.005,426.155 31.885,426.155 31.885,372.615 96.835,372.615 96.835,345.595 105.335,345.595 105.335,308.295 88.335,308.295 88.335,328.595 68.105,328.595 68.105,304.525 31.885,304.525 31.885,271.505 68.105,271.505 68.105,257.675 88.335,257.675 88.335,277.485 105.335,277.485 105.335,240.675 96.835,240.675 96.835,212.365 26.635,212.365 26.635,169.415 115.745,169.415 115.745,131.145 -0.005,131.145 -0.005,87.555 42.685,87.555 42.685,-0.005 126.455,-0.005 126.455,102.255 157.745,102.255 157.745,240.675 138.825,240.675 138.825,257.675 360.555,257.675 360.555,240.675 347.585,240.675 347.585,210.435 253.635,210.435 240.495,177.215 240.495,60.305 217.395,60.305 217.395,-0.005 253.635,-0.005 253.635,30.245 347.585,30.245 347.585,-0.005 370.525,-0.005 370.525,102.255 393.885,102.255 393.885,230.765 394.045,230.765 394.045,257.675 447.455,257.675 447.455,240.675 410.885,240.675 410.885,206.315 485.295,206.315 485.295,240.675 479.995,240.675 479.995,257.675 510.195,257.675 510.195,240.675 502.295,240.675 502.295,147.195 410.885,147.195 410.885,102.235 453.295,102.235 453.295,-0.005 574.285,-0.005 574.285,168.415 614.125,168.415 614.125,240.675 543.685,240.675 543.685,257.675 554.065,257.675 554.065,321.165 546.086,321.165 546.086,338.495 581.445,338.495 581.445,328.035 592.104,328.035 592.104,322.905 655.71,322.905 655.71,328.035';

var groundFloorPoints = '592.104,328.035 592.104,322.905 636.103,322.905 636.103,328.035 668.085,328.035 668.085,550.52 0,550.52 0,328.035';	

//var groundFloorPoints = '581.445,328.035 587.765,328.035 587.765,322.905 662.835,322.905 662.835,328.035 668.085,328.035 668.085,447.52 0,447.52 0,328.035';

var portalPoint = new Vector(600, 330);


/**
 * Import svg data. A stirng describing the polygon.
 */
GraphImporter.importGraphs = function () {
    // 1. Parse chain and make sure there are no duplicate entries.


    var topFloorChain = GraphImporter.parsePolygonChain(topFloorPoints);
    var groundFloorChain = GraphImporter.parsePolygonChain(groundFloorPoints);
//    var elevatorChain = GraphImporter.parsePolygonChain(elevatorPoly);


    var set = {};
/*    chain.forEach(function (v) {
        if (set[v.stringify()]) {
            throw "Duplicate point entry for " + v.toString();
        }
        set[v.stringify()] = v;
    });*/

    // 2. create polygon
    var topFloorPoly = new Polygon(topFloorChain);
    var groundFloorPoly = new Polygon(groundFloorChain);
//    var elevatorPoly = new Polygon(elevatorChain);
    // 3. triangulate polygon
    var topFloorTriangles = topFloorPoly.triangulate();
    var groundFloorTriangles = groundFloorPoly.triangulate();
//    var elevatorPoly = elevatorPoly.triangulate();
    // 4. find neighbors
    var topFloorGraph = new Graph(topFloorTriangles, portalPoint);
    var groundFloorGraph = new Graph(groundFloorTriangles, portalPoint);
//    var elevatorGraph = new Graph(topFloorTriangles);

    var graphs = {};
    graphs[State.LevelEnum.TOP] = topFloorGraph;
    graphs[State.LevelEnum.GROUND] = groundFloorGraph;
    
    
    return graphs;
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
