var express = require('express');
var io = require('socket.io');

var Attendee = require('./attendee');
var State = require('./state');
var party = require('./party');
var Pathfinder = require('./pathfinder');

var app = express()
, server = require('http').createServer(app)
, io = io.listen(server);

var HOSTNAME = "127.0.0.1";
var PORT = 8081;

server.listen(PORT, HOSTNAME);
console.log("Server started on " + HOSTNAME + " lisening to " + PORT);

var defaultState = new State({
    x: 90,
    y: 40
});
var sockets = {};

Pathfinder.loadMap(function () {
    io.sockets.on('connection', function (socket) {
        
        console.log("new connection");
        
        var attendee = new Attendee(defaultState);
        party.addAttendee(attendee);
        sockets[attendee.id()] = socket;

        socket.emit('all', party.allToClientFormat());

        socket.emit('sync', (new Date()).getTime());

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

            party.setIntention(attendee, new State({
                x: x,
                y: y,
                level: level
            }));

            // send updates to clients.
            Object.keys(sockets).forEach(function (attendeeId) {
                var outputSocket = sockets[attendeeId];
                var tris = [];
                Pathfinder.triangles().forEach(function (tri) {
                    tris.push(tri.toClientFormat());
                });
//                outputSocket.emit('drawTriangles', tris);

                outputSocket.emit('attendeeKeyframes', attendee.toClientFormat());

            })
        });
    });
});

