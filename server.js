/* jslint node: true */
"use strict";

const express     = require('express'),
      _           = require('lodash'),
      app         = express(),
      path        = require('path'),
      httpServer  = require('http').Server(app),
      port        = process.env.PORT || 8080,
      io          = require('socket.io')(httpServer);

let clients     = {},
    socketId    = 1;

let realtime = io
  .of('/realtime')
  .on('connection', socket => {
    let id = socketId++;
    clients[id] = { socket: socket, name: null };
    
    socket.on('new-user', data => {
      clients[id].name = data.name;
      io.of('/realtime').emit('new-user', { name: data.name, numUsers: _.size(clients) });
    });
    
    socket.on('say', data => {
      io.of('/realtime').emit('say', { message: data.message, sender: clients[id].name });
    });    

    socket.on('disconnect', () => {
      delete clients[id];
    });
  });

let server = {
  listen (customPort) {
    let listen = typeof(customPort) === 'undefined' ? port : customPort;
    httpServer.listen(listen);
  },

  close () {
    httpServer.close(); 
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = server;
