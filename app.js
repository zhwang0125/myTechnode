var express = require('express');
var app = express();
var path = require('path');
var socketIo = require('socket.io');
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/static')));
app.use(function (req, res) {
    res.sendfile(path.join(__dirname, '/static/index.html'));
});

var server = app.listen(port, function (err) {
    if (err) {
        return console.error('server start fail');
    }

    console.log('server port ' + port)
});

var io = socketIo.listen(server);
var messages = [];

io.on('connection', function (socket) {
    socket.on('messages.read', function () {
        socket.emit('messages.read', messages);
    });

    socket.on('messages.create', function (message) {
        messages.push(message);
        io.sockets.emit('messages.add', message);
    });
});