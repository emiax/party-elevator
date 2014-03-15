requirejs.config({
    baseUrl: './js/',
    paths: {
        'socket.io': '../bower_components/socket.io-client/dist/socket.io'
    }
});


require(['socket.io', 'jquery'], function (io, $) {

    var socket = io.connect('http://localhost:8081');

    socket.on('connect', function () {
        console.log("socket connected");
    });
    socket.on('attendeeKeyframes', function (data) {
        
        // Log socket messages
        console.log(data);

        // Do something with the data
        if (data.keyframes !== undefined){
            if(data.keyframes.length > 0){

                // TODO: Check if attendee representation exists, if not, add it
                var attendeeExists = false;

                if (attendeeExists != true){

                    console.log("x: " + data.keyframes[0].state.x + "; y: " + data.keyframes[0].state.y + ";");
                    
                    // Add new attendee representation to the canvas
                    // TODO: Add attendee ID to each representation
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(" + Math.round(Math.random() * 300) + "," + Math.round(Math.random() * 300) + "," + Math.round(Math.random() * 300) + ",1)";
                    ctx.arc(data.keyframes[0].state.x,data.keyframes[0].state.y,5,0,2*Math.PI);
                    ctx.stroke();
                    ctx.fill();
                }
            };         
        }
    });

    socket.on('disconnect', function () {
        console.log("socket disconnected");
    });

    socket.emit('intention', {
        x: Math.round(Math.random() * 300),
        y: Math.round(Math.random() * 225),
        level: 'ground'
    });

    // Add canvas
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#e5e5e5";
    ctx.fillRect(0,0,300,225);
});
