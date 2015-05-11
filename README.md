# Socket.io, Mocha, and EcmaScript 2015

This repository shows a (very) basic setup using mocha
to test a socket.io application. [iojs](http://iojs.org) is being
leveraged to use [EcmaScript 2015](https://github.com/lukehoban/es6features) features and syntax.

## Usage

First, you might want to install [nvm](https://github.com/creationix/nvm) to manage different installs of node. Once that's done, ensure you've installed (and are using) iojs version `1.7.x`. 

```
nvm use iojs
nvm current
=> iojs 1.7.1
```

And then you can install the necessary dependencies.

```
npm install --save-dev
```

To start the server you can run `npm start`, and if you want to 
start the gulp task that fires up the test suite and runs your
tests whenever a file changes simply run `npm test`.
