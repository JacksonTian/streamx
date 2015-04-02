'use strict';

var thunkify = require('thunkify');

exports.written = thunkify(function (writable, callback) {
  var done = function (err) {
    // cleanup
    writable.removeListener('error', done);
    writable.removeListener('finish', done);
    // pass
    callback(err);
  };

  writable.on('error', done);

  writable.on('finish', done);
});

exports.read = thunkify(function (readable, callback) {
  var cleanup = function (err) {
    // cleanup
    readable.removeListener('error', onError);
    readable.removeListener('data', onData);
    readable.removeListener('end', onEnd);
  };

  var bufs = [];
  var size = 0;

  var onData = function (buf) {
    bufs.push(buf);
    size += buf.length;
  };

  var onError = function (err) {
    cleanup();
    callback(err);
  };

  var onEnd = function () {
    cleanup();
    callback(null, Buffer.concat(bufs, size));
  };

  readable.on('error', onError);
  readable.on('data', onData);
  readable.on('end', onEnd);
});
