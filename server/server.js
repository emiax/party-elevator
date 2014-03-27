var express = require('express');
var io = require('socket.io');

var Attendee = require('./attendee');
var State = require('./state');
var party = require('./party');
var Pathfinder = require('./pathfinder');

var app = express()
, server = require('http').createServer(app)
, io = io.listen(server);

//var HOSTNAME = "127.0.0.1";
var PORT = 8081;

server.listen(PORT);
//console.log("Server started on " + HOSTNAME + " lisening to " + PORT);

var defaultState = new State({
    x: 90,
    y: 40
});
var sockets = {};
var socketToFbId = {};
var fbIdToAttendee = {};

var nextSocketId = 0;

Pathfinder.loadMap(function () {
    io.sockets.on('connection', function (socket) {
        
        var socketId = nextSocketId++;
        sockets[socketId] = socket;

        socket.emit('all', party.allToClientFormat());

        socket.emit('sync', (new Date()).getTime());

        socket.on('login', function (facebookData) {
            console.log("LOGIN");
            var attendee = fbIdToAttendee[facebookData.id];
            if (!attendee) {
                attendee = new Attendee(defaultState);
                party.addAttendee(attendee);
                fbIdToAttendee[facebookData.id] = attendee;
            }
            attendee.setFacebookData(facebookData);
            socketToFbId[socketId] = facebookData.id;
            console.log(attendee);
        });

        socket.on('chat', function (data) {
            var fbId = socketToFbId[socketId];
            var attendee = fbIdToAttendee[fbId]
            if (!attendee) { return; }
            var attendeeId = attendee.id();

            if (fbId) {
                Object.keys(sockets).forEach(function (outSocketId) {
                    var outputSocket = sockets[outSocketId];
                    outputSocket.emit('chat', {
                        attendee: attendeeId,
                        message: data
                    });
                });
            }
        });
        
        socket.on('intention', function (data) {
            var fbId = socketToFbId[socketId];
            var attendee = fbIdToAttendee[fbId]
            if (!attendee) { return; }
            var attendeeId = attendee.id();

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
            Object.keys(sockets).forEach(function (outSocketId) {
                var outputSocket = sockets[outSocketId];
                var tris = [];
                Pathfinder.triangles().forEach(function (tri) {
                    tris.push(tri.toClientFormat());
                });
//                outputSocket.emit('drawTriangles', tris);

                console.log("lOL!");
                outputSocket.emit('attendeeKeyframes', attendee.toClientFormat());

            })
        });
    });
});

