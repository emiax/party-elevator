var Keyframe = require('./keyframe');
var ElevatorKeyframe = require('./elevatorKeyframe');
var GraphImporter = require('./pathfinding/graphImporter');
var Vector = require('./pathfinding/vector');
var State = require('./state');
var Elevator = require('./elevator');


var graphs = null;
var topFloorGraph = null;
var groundFloorGraph = null;

var elevatorX = 600;
var elevatorY = 310;

Pathfinder = {

    

    loadMap: function (cb) {
        graphs = GraphImporter.importGraphs();
//        groundFloorGraph = graphs.groundFloor;
//        topFloorGraph = graphs.topFloor;
        
        if (cb) {
            cb();
        }
    },

    triangles: function(level) {
        return graphs[level]._triangles;
    },


    portalState: function (level) {
        return new State({
            x: graphs[level]._portalPoint.x,
            y: graphs[level]._portalPoint.y,
            level: level
        });
    },


    keyframesWithinLevel: function (positions, originalState, startTime) {
        if (!positions) {
            return [new Keyframe(originalState, startTime)];
        }

        var level = originalState._level;

        var states = [];
        positions.forEach(function (p) {
            states.push(new State({
                x: p.x,
                y: p.y,
                level: level
            }));
        });

        var speed = 0.1;
        var keyframes = [];


        var originalKeyframe = new Keyframe(originalState, startTime);
        keyframes.push(originalKeyframe);

        var lastState = originalState;
        var lastTime = startTime;
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
        
    },
    
    
    /**
     * Create keyframes.
     */
    createKeyframes: function (originalState, intentionState, startTime) {
        var originalLevel = originalState._level;
        var intentionLevel = intentionState._level;
        var elevatorDelay = Elevator.delay;

        var respawn = [new Keyframe(
            new State({
                level: State.LevelEnum.GROUND,
                x: 200,
                y: 350
            }), new Date()
        )];

        var p0 = new Vector(originalState._x, originalState._y);
        var jitterX = (Math.random()-0.5)*40;
        var jitterY = (Math.random()-0.5)*40;

        if (originalLevel === intentionLevel) {

            var p1 = new Vector(intentionState._x, intentionState._y);
            var positions = graphs[originalLevel].shortestPath(p0, p1);
            if (!positions) {
                return respawn;
            }

            return this.keyframesWithinLevel(positions, originalState, startTime);

        } else if (originalLevel !== State.LevelEnum.ELEVATOR) {
            var positions = graphs[originalLevel].shortestPathToPortalPoint(p0);
            if (!positions) {
                return respawn;
            }

            var keyframesOriginalFloor = this.keyframesWithinLevel(positions, originalState, startTime);
            var lastOriginalFloorKeyframe = keyframesOriginalFloor[keyframesOriginalFloor.length - 1];

            var portalTime = lastOriginalFloorKeyframe.time();
            var earliestEnterTime = new Date(portalTime.getTime() + elevatorDelay);
                console.log('I want the elevator to be at level ' + originalLevel);
            var enterElevatorTime = Elevator.requestArrivalTime(originalLevel, earliestEnterTime);

            var enterElevatorKeyframe = new Keyframe(
                new State({
                    level: State.LevelEnum.ELEVATOR,
                    x: elevatorX + jitterX,
                    y: elevatorY + jitterY,
                }), enterElevatorTime
            );
            
            if (intentionLevel === State.LevelEnum.Elevator) {
                return [originalKeyframe].concat(keyframesOriginalFloor.concat([enterElevatorKeyframe]));
            } else {

                console.log('I want the elevator to be at level ' + intentionLevel);
                var elevatorArrivalTime = Elevator.requestArrivalTime(intentionLevel, new Date(enterElevatorTime.getTime() + 1));
                var leaveElevatorTime = new Date(elevatorArrivalTime.getTime() + elevatorDelay);
                
                var leaveElevatorKeyframe = new Keyframe(
                    new State({
                        level: State.LevelEnum.ELEVATOR,
                        x: elevatorX + jitterX,
                        y: elevatorY + jitterY
                    }), leaveElevatorTime
                );

                var p1 = new Vector(intentionState._x, intentionState._y);
                var positions = graphs[intentionLevel].shortestPathFromPortalPoint(p1);
                if (!positions) {
                    return respawn;
                }

                var newFloorState = this.portalState(intentionLevel);
                
                var keyframesIntentionFloor = this.keyframesWithinLevel(positions, newFloorState, leaveElevatorTime);

                return keyframesOriginalFloor.concat([enterElevatorKeyframe, leaveElevatorKeyframe],
                                                     keyframesIntentionFloor);
                                                                      
            } 
        } else if (originalLevel === State.LevelEnum.ELEVATOR
                   && intentionLevel !== State.LevelEnum.ELEVATOR) {

            console.log("YOYO");
            
            var elevatorArrivalTime = Elevator.requestArrivalTime(intentionLevel, startTime);
            var leaveElevatorTime = new Date(elevatorArrivalTime.getTime() + elevatorDelay);
            

            var nowKeyframe = new Keyframe(originalState, new Date());

            var leaveElevatorKeyframe = new Keyframe(
                new State({
                    level: State.LevelEnum.ELEVATOR,
                    x: elevatorX,
                    y: elevatorY
                }), leaveElevatorTime
            );
            
            var p1 = new Vector(intentionState._x, intentionState._y);
            var positions = graphs[intentionLevel].shortestPathFromPortalPoint(p1);
            if (!positions) {
                return [new Keyframe(originalState, new Date())];
            }


            var newFloorState = this.portalState(intentionLevel);
            
            var keyframesIntentionFloor = this.keyframesWithinLevel(positions, newFloorState, leaveElevatorTime);
            

            return [nowKeyframe, leaveElevatorKeyframe].concat(keyframesIntentionFloor);
            
        }
        return respawn;
    }
};


module.exports = Pathfinder;
