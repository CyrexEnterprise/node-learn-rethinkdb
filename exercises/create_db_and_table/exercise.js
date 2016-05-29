var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var comparestdout = require('workshopper-exercise/comparestdout');

var r = require('rethinkdb');
var connection;

exercise = filecheck(exercise);

exercise = execute(exercise);

// make sure toolbox database doesn't exist
exercise.addSetup(function(mode, callback) {

  r.connect(function(err, conn) {
    if (err) return callback(err);

    connection = conn;

    r.dbList().run(conn, function(err, res) {
      if (err) return callback(err);

      if (!~res.indexOf('toolbox')) {
        return callback();
      }

      r.dbDrop('toolbox').run(conn, callback);
    });
  });
});

exercise.addProcessor(function(mode, callback) {
  var self = this;

  this.submissionStdout.pipe(process.stdout);

  this.on('executeEnd', mode === 'verify' ? verify : callback);

  function verify() {
    r.dbList().run(connection, verifyDatabase);

    function verifyDatabase(err, res) {
      if (err) return callback(err);

      if (!~res.indexOf('toolbox')) {
        self.emit('fail', 'toolbox database is nowhere to be found');
        return callback(null, false);
      }

      self.emit('pass', 'toolbox database created');

      r.db('toolbox').tableList().run(connection, verifyTable);
    }

    function verifyTable(err, res) {
      if (err) return callback(err);

      if (!~res.indexOf('screws')) {
        self.emit('fail', 'screws table is nowhere to be found');
        return callback(null, false);
      }

      self.emit('pass', 'screws table created');

      callback(null, true);
    }
  }
});

exercise.addCleanup(function(mode, callback) {
  connection.close(callback);
});

module.exports = exercise;
