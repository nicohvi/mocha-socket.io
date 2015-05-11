/* jslint node: true */
"use strict";

const assert      = require('assert'),
      port        = 1337,
      socketURL   = 'http://0.0.0.0:'+port+'/realtime',
      url         = 'http://localhost:'+port,
      clientName  = 'Rust Cole',
      http        = require('http'),
      server      = require('./server'),
      io          = require('socket.io-client'),
      options     = {
        transports: ['websocket'],
        'force new connection': true
      };

describe("server api", () => {

  before( () => server.listen(port));
  after(  () => server.close()); 
  
  it("returns 200 for the root", done => {
    const test = (res) => {
      assert.equal(200, res.statusCode);
      done();
    };

    http.get(url, test);
  });

  describe("realtime api", () => {
    let client;

    beforeEach( () => client = io.connect(socketURL, options));
    afterEach(  () => client.disconnect());

    it("should broadcast new users to all users", done => {
      let count = 0,
          otherClient;

      const otherName = 'Marty Heart',
        test = data => {
          count++;
          if(count === 2) {
            assert.equal(data.name, otherName);
            assert.equal(data.numUsers, 2);
            otherClient.disconnect();
            done();
          } else {
            assert.equal(data.name, clientName);
            assert.equal(data.numUsers, 1);
          }
        };

      client.on('connect', () => {
        client.emit('new-user', { name: clientName });
        client.on('new-user', test);

        otherClient = io.connect(socketURL, options);
        otherClient.on('connect', () => {
          otherClient.emit('new-user', { name: otherName });   
        }); 
      });
    });

    it("should broadcast messages to all other users", done => {
      let count = 0,
          client2, client3;

      const message = 'Hello world',
        test = data => {
          count++;
          assert.equal(data.message, message);
          assert.equal(data.sender, clientName);
          if(count === 3) { 
            client2.disconnect();
            client3.disconnect();
            done(); 
          } 
        },
        sendName = (name, client) => {
          client.on('connect', () => 
            client.emit('new-user', { name: name }));
        }

      client2 = io.connect(socketURL, options);
      client3 = io.connect(socketURL, options);

      sendName(clientName, client);
      sendName('Marty Heart', client2);
      sendName('Reginald LeDeux', client3);

      client.on('new-user', data => {
        if(data.numUsers !== 3) { return; }
        client.emit('say', { message: message }); 
      });

      client.on('say', test);
      client2.on('say', test);
      client3.on('say', test);
    });

  }); 
});

