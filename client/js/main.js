requirejs.config({
    baseUrl: './js/',
    paths: {
        'socket.io': '../bower_components/socket.io-client/dist/socket.io',
        'jquery': '../bower_components/jquery/dist/jquery.min'
    }
});



require(['socket.io', 'jquery'], function (io, $) {

    var socket = io.connect('http://localhost:8081');
    var ctx = $('canvas')[0].getContext('2d');

function drawKeyframes(keyframes) {
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    
    ctx.beginPath();
    ctx.moveTo(keyframes[0].state.x, keyframes[0].state.y);
    keyframes.forEach(function (keyframe) {
        var x = keyframe.state.x;
        var y = keyframe.state.y;
        console.log(x, y);
        ctx.lineTo(x, y);
    });
    ctx.stroke();
}


function drawTriangle(p0, p1, p2) {
    ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
    
    ctx.beginPath();
    ctx.fillStyle = "rgba( 0, 0, 255, 0.2)";        

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
            socket.emit('intention', {
                x: evt.offsetX, 
                y: evt.offsetY,
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
            drawTriangle(tri.p0, tri.p1, tri.p2, i);
        });
    });
    

    socket.on('attendeeKeyframes', function (data) {
        drawKeyframes(data.keyframes);
        data.keyframes.forEach(function (keyframe) {
            var x = keyframe.state.x;
            var y = keyframe.state.y;
            $('#avatar').animate({
                left: x,
                top: y
            });
            
        });
    });

    socket.on('disconnect', function () {
        console.log("socket disconnected");
    });

    console.log("LOL");
    

    
});
