var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var utils = require('../utils.js');

var r = require('rethinkdb');
var connection;

exercise = filecheck(exercise);

exercise = utils.executeSubmission(exercise);

var names = ['nodeschool', 'workshops', 'node', 'exercise'];

var database;
var table;

exercise.addSetup(function(mode, callback) {

  database = utils.pickRandom(names);
  table = utils.pickRandom(names.filter(function(name) {
    return name !== database;
  }));

  this.submissionArgs = [database, table];

  r.connect(function(err, conn) {
    if (err) return callback(err);

    connection = conn;

    utils.removeDatabase(connection, database, callback);
  });
});

exercise.addProcessor(function(mode, callback) {
  var self = this;

  this.submissionChild.stdout.pipe(process.stdout);
  this.submissionChild.stderr.pipe(process.stderr);

  this.once('executeEnd', mode === 'verify' ? verify : callback);

  function verify() {
    r.dbList()
      .contains(database)
      .run(connection, verifyDatabase);

    function verifyDatabase(err, databaseExists) {
      if (err) return callback(err);

      if (!databaseExists) {
        self.emit('fail', database + ' database is nowhere to be found');
        return callback(null, false);
      }

      self.emit('pass', database + ' database created');

      r.db(database)
        .tableList()
        .contains(table)
        .run(connection, verifyTable);
    }

    function verifyTable(err, tableExists) {
      if (err) return callback(err);

      if (!tableExists) {
        self.emit('fail', table + ' table is nowhere to be found');
        return callback(null, false);
      }

      self.emit('pass', table + ' table created');

      callback(null, true);
    }
  }
});

exercise.addCleanup(function(mode, pass, cb) {
  if (!connection) return cb();
  connection.close(cb);
});

module.exports = exercise;
