var express = require('express');
var io = require('socket.io');

var Attendee = require('./attendee');
var State = require('./state');

var app = express()
, server = require('http').createServer(app)
, io = io.listen(server);

server.listen(8080);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('getAll', function (data) {
        console.log(data);
        socket.emit('test');
    });
});


var attendee = new Attendee(new State({
    x: 0,
    y: 0,
    level: State.LevelEnum.GROUND
}));


attendee.setIntention(new State({
    x: 1000,
    y: 800,
    level: State.LevelEnum.GROUND    
}));


setTimeout(function () {
    attendee.setIntention(new State({
        x: 0,
        y: 0,
        level: State.LevelEnum.GROUND    
    }));
}, 500);


setInterval(function () {
    console.log(attendee.currentState().toString());
}, 100);

