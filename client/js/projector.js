define([
    'gl-matrix'
], function (glMatrix) {
    var mapWidth = 614;
    var mapHeight = 653;
    
    var viewWidth = 1000;
    var viewHeight = 500;
    
    var mat4 = glMatrix.mat4;
    var vec4 = glMatrix.vec4;
    var vec3 = glMatrix.vec3;
    
    var fov = Math.PI/1.9;

    var perp = mat4.create();
    mat4.perspective(perp, fov, 1, 0.1, 1); 

    var mv = mat4.create();
    var camPos = [0, -0.5, -1];

    var camTranslation = mat4.create();
    mat4.translate(camTranslation, camTranslation, camPos);

    var camRotation = mat4.create();
    mat4.rotate(camRotation, camRotation, Math.atan2(-camPos[1],-camPos[2]), [1, 0, 0]);

    mat4.multiply(mv, mv, camRotation);
    mat4.multiply(mv, mv, camTranslation);

    var mvp = mat4.create();
    mat4.multiply(mvp, perp, mv);
    
    var camRotationInv = mat4.create();
    mat4.invert(camRotationInv, camRotation);
    
    var perpInv = mat4.create();
    mat4.invert(perpInv, perp);
    
    var Projector = {
        /**
         * Project
         */
        project: function (coords) {
            var normalizedCoords = vec4.create();
            vec4.set(normalizedCoords, coords.x/mapWidth - 0.5, coords.y/mapHeight - 0.5, 0, 1);
            
            var projected = vec4.create();
            vec4.transformMat4(projected, normalizedCoords, mvp);
            
            var x = projected[0] / projected[3];
            var y = projected[1] / projected[3];
            
            return {
                x: (x + 0.5)* viewWidth, 
                y: (y + 0.5)* viewHeight
            };
        },

        
        /**
         * Unproject
         */
        unproject: function (coords) {
            var x = (coords.x/viewWidth) - 0.5;
            var y = (coords.y/viewHeight) - 0.5;

            var screenVec = vec4.create();
            vec4.set(screenVec, x, y, -1.0, 1);

            var viewVec = vec4.create();
            vec4.transformMat4(viewVec, screenVec, perpInv);

            console.log("view vec", viewVec);
            
            console.log('xyz', viewVec);

            var rayVector = vec3.create();
            vec3.set(rayVector, viewVec[0], viewVec[1], viewVec[2]);
            
            // plane is z = 0.
            // equation: camPos[2] + k*rayVector[2] = 0;
            // k*rv[1] = -camPos[2]
            
            vec3.transformMat4(rayVector, rayVector, camRotationInv);
            console.log('world xyz', rayVector[0], rayVector[1], rayVector[2]);

            console.log("LENGTH", vec3.length(rayVector));
            

            var dist = -camPos[2]/rayVector[2];
            console.log(dist);
            
            var worldPos = vec3.create();
            vec3.scale(worldPos, rayVector, dist);
            vec3.add(worldPos, worldPos, camPos);

            console.log("world pos :", worldPos);

            var normalizedCoords = vec4.create();
            return {x: (-worldPos[0]+0.5)*mapWidth, y: (-worldPos[1]+0.5)*mapHeight};
        }
    }
    return Projector;
});
