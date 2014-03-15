var express = require('express');
var io = require('socket.io');

var Attendee = require('./attendee');
var State = require('./state');
var party = require('./party');

var app = express()
, server = require('http').createServer(app)
, io = io.listen(server);

server.listen(8080);

var defaultState = new State();
var sockets = {};

io.sockets.on('connection', function (socket) {

    var attendee = new Attendee(defaultState);
    party.addAttendee(attendee);
    sockets[attendee.id()] = socket;

    //    socket.emit('allStates', party.allStates());
    socket.on('intention', function (data) {
        // handle input.
        var x = data.x;
        var y = data.y;
        var level;
        switch (data.level) {
        case 'top': level = State.LevelEnum.TOP;
        case 'elevator': level = State.LevelEnum.ELEVATOR;
        default: level = State.LevelEnum.GROUND;
        }

        // do stuff.
        party.setIntention(attendee, new State({
            x: x,
            y: y,
            level: level
        }));

        // send updates to clients.
        Object.keys(sockets).forEach(function (attendeeId) {
            var outputSocket = sockets[attendeeId];
            outputSocket.emit('attendeeKeyframes', attendee.toClientFormat());
        })
    });
});

