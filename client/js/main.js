requirejs.config({
    baseUrl: './js/',
    paths: {
        'socket.io': '../bower_components/socket.io-client/dist/socket.io',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'gl-matrix': '../bower_components/gl-matrix/dist/gl-matrix'
    }
});




require(['projector', 'socket.io', 'jquery', 'spriteanimator'], function (Projector, io, $, animate) {

    var socket = io.connect('http://localhost:8081');
    var ctx = $('canvas')[0].getContext('2d');

function drawKeyframes(keyframes) {
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.lineWidth = 3;
    
    ctx.beginPath();

    var pos = {
        x: keyframes[0].state.x,
        y: keyframes[0].state.y
    };
    var projected = Projector.project(pos);

    ctx.moveTo(projected.x, projected.y);
    keyframes.forEach(function (keyframe) {
        var x = keyframe.state.x;
        var y = keyframe.state.y;

        var pos = {
            x: keyframe.state.x,
            y: keyframe.state.y
        };
        var projected = Projector.project(pos);
        
//        console.log(x, y);
        ctx.lineTo(projected.x, projected.y);
    });
    ctx.stroke();
}


function drawTriangle(p0, p1, p2) {
    ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
    
    ctx.beginPath();
    ctx.fillStyle = "rgba( " + Math.round(100+Math.random()*80) + ", " + Math.round(100+Math.random()*80) + ", " + Math.round(Math.random()) + ", 0.4)";        

    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();
    ctx.fill();
}




      



    socket.on('connect', function () {
        console.log("socket connected");

        $('canvas').click(function (evt) {
            var projected = {
                x: evt.offsetX,
                y: evt.offsetY
            };

            var pos = Projector.unproject(projected);
            socket.emit('intention', {
                x: pos.x,
                y: pos.y,
                level: 'ground'
            });
        });

        socket.emit('intention', {
            x: 522, 
            y: 113,
            level: 'ground'
        });
    });

    socket.on('drawTriangles', function (triangles) {
        ctx.clearRect(0, 0, 1000, 1000);
        triangles.forEach(function (tri, i) {
            drawTriangle(Projector.project(tri.p0), Projector.project(tri.p1), Projector.project(tri.p2), i);
        });
    });
    

    socket.on('attendeeKeyframes', function (data) {
        drawKeyframes(data.keyframes);
        data.keyframes.forEach(function (keyframe) {
            var x = keyframe.state.x;
            var y = keyframe.state.y;

            var projected = Projector.project({
                x: x,
                y: y
            });


            /** Dirty sprite animation! */

            // Init animator
            animate({
                spriteID: 'avatar',
                targetCoords: { x: projected.x, y: projected.y },
                speed: 5
            })
            
        });
        console.log("Done.")
    });

    socket.on('disconnect', function () {
        console.log("socket disconnected");
    });

    console.log("LOL");
    
//    console.log(Projector.unproject((Projector.project({x: 307, y: 326.5}))));
//    console.log(Projector.project({x: 614, y: 326.5}));
//    console.log(Projector.project({x: 0, y: 326.5}));
//    console.log(Projector.unproject({x: 400, y: 250}))
    console.log(Projector.unproject({x: 500, y: 250}))
//    console.log(Projector.unproject({x: 0, y: 250}));
//    console.log(Projector.unproject({x: 400, y: 250}))
///    console.log(Projector.unproject({x: 800, y: 250}))
//    console.log(Projector.unproject((Projector.project({x: 0, y: 326.5}))));
    
});
