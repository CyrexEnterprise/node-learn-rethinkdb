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

    // make sure toolbox database doesn't exist
    r.dbList().contains('toolbox').do(function(databaseExists) {
      return r.branch(databaseExists, r.dbDrop('toolbox'), { dbs_dropped: 0 });
    }).run(connection, callback);
  });
});

exercise.addProcessor(function(mode, callback) {
  var self = this;

  this.submissionChild.stdout.pipe(process.stdout);
  this.submissionChild.stderr.pipe(process.stderr);

  this.on('executeEnd', mode === 'verify' ? verify : callback);

  function verify() {
    r.dbList()
      .contains('toolbox')
      .run(connection, verifyDatabase);

    function verifyDatabase(err, databaseExists) {
      if (err) return callback(err);

      if (!databaseExists) {
        self.emit('fail', 'toolbox database is nowhere to be found');
        return callback(null, false);
      }

      self.emit('pass', 'toolbox database created');

      r.db('toolbox')
        .tableList()
        .contains('screws')
        .run(connection, verifyTable);
    }

    function verifyTable(err, tableExists) {
      if (err) return callback(err);

      if (!tableExists) {
        self.emit('fail', 'screws table is nowhere to be found');
        return callback(null, false);
      }

      self.emit('pass', 'screws table created');

      callback(null, true);
    }
  }
});

exercise.addCleanup(function(mode, pass, cb) {
  if (connection) connection.close(cb);
});

module.exports = exercise;
