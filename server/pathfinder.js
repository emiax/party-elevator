var Keyframe = require('./keyframe');
var ElevatorKeyframe = require('./elevatorKeyframe');
var GraphImporter = require('./pathfinding/graphImporter');
var Vector = require('./pathfinding/vector');
var State = require('./state');

var graph = null;

Pathfinder = {

    loadMap: function (cb) {
        graph = GraphImporter.importGraph();
        if (cb) {
            cb();
        }
    },

    triangles: function() {
        return graph._triangles;
    },


    dumpMap: function () {
        console.log(this.map);
    },

    
    /**
     * Create keyframes.
     */
    createKeyframes: function (originalState, intentionState, startTime) {

        var p0 = new Vector(originalState._x, originalState._y);
        var p1 = new Vector(intentionState._x, intentionState._y);

        var positions = graph.shortestPath(p0, p1);
        
        if (!positions) {
            return [new Keyframe(originalState, startTime)];
        }
        
        var states = [];
        positions.forEach(function (p) {
            states.push(new State({
                x: p.x,
                y: p.y,
            }));
        });

        var speed = 1;
        var keyframes = [];

        keyframes.push(new Keyframe(originalState, startTime));

        var lastState = originalState;
        var lastTime = new Date();
        states.forEach(function (s) {
            if (s === states[0]) { return; }
            var distance = lastState.distanceTo(s);
            var duration = distance / speed;
            var thisTime = new Date(lastTime.getTime() + duration);
            keyframes.push(new Keyframe(s, thisTime));
            
            lastTime = thisTime;
            lastState = s;
        });
        
        return keyframes;
    }
};


module.exports = Pathfinder;
