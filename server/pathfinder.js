var Keyframe = require('./keyframe');

Pathfinder = {
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
