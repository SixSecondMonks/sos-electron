/* eslint strict: 0, no-console: 0 */
'use strict';

const socketio = require('socket.io');
const express = require('express');
const webpack = require('webpack');
const json = require('json-file');
const zlib = require('zlib');
const http = require('http');

const config = require('./webpack.config.development');
const Kinect2 = require('./kinect2');

const app = express();
const compiler = webpack(config);
const kinectApp = express();

const WEB_PORT = 3000;
const KINECT_PORT = 8008;

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.listen(WEB_PORT, 'localhost', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${WEB_PORT}`);
});

// set up Kinect (either a real or dummy server)
const io = socketio(KINECT_PORT);

if (!config.kinect.dummy) {

  let kinect = new Kinect2();
  kinect.open();

  console.log(`Kinect listening at http://localhost:${KINECT_PORT}`);

  if (config.kinect.body) {
    kinect.on('bodyFrame', (bodies) => {
      io.sockets.emit('bodyFrame', bodies);
      io.flush();
    });
    kinect.openBodyReader();
  }

  let kinectAction = (on, fn, name) => {
    if (on) {
      kinect.on(name, (data) => {
        zlib.deflate(data, (err, result) => {
          if (!err) {
            io.sockets.emit(name, result.toString('base64'));
          }
        });
      });
    }
    fn();
  };

  kinectAction(config.kinect.color, kinect.openColorReader, 'colorFrame');
  kinectAction(config.kinect.depth, kinect.openDepthReader, 'depthFrame');
  kinectAction(config.kinect.infrared, kinect.openInfraredReader, 'infraredFrame');
  kinectAction(config.kinect.longExposureInfrared, kinect.openLongExposureInfraredReader, 'longExposureInfraredFrame');

} else {

  console.log(`Dummy Kinect listening at http://localhost:${KINECT_PORT}`);

  let fileCounter = 0;
  let length = config.kinect.dummyFiles.length;
  let current = json.read(config.kinect.dummyFiles[fileCounter]);
  let array = current.get('bodiesData');

  io.on('connection', function(socket) {
    let counter = 0;
    let intervalID = setInterval(() => {

      socket.emit("bodyFrame", array[counter]);
      counter++;

      if(counter >= array.length) {
	counter = 0;

	// advance to next file
	fileCounter++;
	current = json.read(config.kinect.dummyFiles[fileCounter % length]);
	array = current.get('bodiesData');
      }

    }, 33);

    socket.on('disconnect', function() {
      clearInterval(intervalID);
    });
  });
}
