var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var comparestdout = require('workshopper-exercise/comparestdout');

var r = require('rethinkdb');
var connection;

exercise = filecheck(exercise);

exercise = execute(exercise);

exercise.addSetup(function(mode, callback) {

  r.connect(function(err, conn) {
    if (err) return callback(err);

    connection = conn;

    r.dbList().run(connection, function(err, res) {
      if (err) return callback(err);

      // make sure toolbox database doesn't exist
      if (res.indexOf('toolbox') === -1) {
        return callback();
      }

      r.dbDrop('toolbox').run(connection, callback);
    });
  });
});

exercise.addProcessor(function(mode, callback) {
  this.submissionStdout.pipe(process.stdout);
  return this.on('executeEnd', function() {
    if (mode === 'verify') {
      verify(connection, callback);
    } else {
      callback();
    }
  });
});

function verify(conn, cb) {
  r.dbList().run(conn, function(err, res) {
    if (err) return cb(err);

    cb(null, res.indexOf('toolbox') !== -1);
  });
}

exercise.addCleanup(function(mode, callback) {
  connection.close(callback);
});

module.exports = exercise;
