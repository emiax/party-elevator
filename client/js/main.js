requirejs.config({
    baseUrl: './js/',
    paths: {
        'socket.io': '../bower_components/socket.io-client/dist/socket.io'
    }
});


require(['socket.io'], function (io) {

    var socket = this._socket = io.connect('http://localhost:8081');

    socket.on('connect', function () {
        console.log("socket connected");
    });
    socket.on('attendeeKeyframes', function (data) {
        console.log(data);
    });

    socket.on('disconnect', function () {
        console.log("socket disconnected");
    });

    socket.emit('intention', {
        x: 1000,
        y: 0,
        level: 'ground'
    });
});
