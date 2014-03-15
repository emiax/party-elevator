var express = require('express');
var io = require('socket.io');


var app = express()
, server = require('http').createServer(app)
, io = io.listen(server);

server.listen(8081);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('getAll', function (data) {
        console.log(data);
        socket.emit('test');
    });
});
