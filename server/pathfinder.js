var Keyframe = require('./keyframe');
var ElevatorKeyframe = require('./elevatorKeyframe');

var GraphImporter = require('./pathfinding/graphImporter');

Pathfinder = {

    loadMap: function (cb) {
        var graph = GraphImporter.importGraph('someFile');
        this.map = graph;
    },


    dumpMap: function () {
        console.log(this.map);
    },


    isWall: function (x, y) {
        return map[y][x];
    },


    

    /**
     * Create keyframes.
     */
    createKeyframes: function (originalState, intentionState, startTime) {
        var firstKeyframe = new Keyframe(originalState, startTime);

        var distance = originalState.distanceTo(intentionState);
        var speed = 1;
        var duration = distance / speed;
        var lastKeyframe = new Keyframe(intentionState, new Date(startTime.getTime() + duration));
        
        return [firstKeyframe, lastKeyframe];
    }
};


module.exports = Pathfinder;
