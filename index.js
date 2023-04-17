const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const nicknames = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    socket.broadcast.emit('user connection', 'a user connected');
    console.log('a user connected');

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      const nickname = nicknames[socket.id] || 'Anonymous';
      console.log(nickname)
      const formattedMessage = `${nickname}: ${msg}`;
    io.emit('chat message', formattedMessage);
    // socket.broadcast.emit('chat message', msg);
    // io.emit('chat message', msg);


    });

    
    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.broadcast.emit('user disconnected', 'a user disconnected')
    });
  

  socket.on('nickname', (nickname) => {
    nicknames[socket.id] = nickname;
    socket.broadcast.emit('userJoined', `${nickname} has joined the chat.`);
    console.log(nicknames)
  });
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});