var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var comparestdout = require('workshopper-exercise/comparestdout');
var spawn = require('child_process').spawn;

var r = require('rethinkdb');
var connection;

exercise = filecheck(exercise);

exercise = execute(exercise);

/**
 *  overwrite default execute processor with a
 *  processor that only executes the submission
 */

function onlyExecuteSubmission(mode, callback) {
  // backwards compat for workshops that use older custom setup functions
  if (!this.submissionCommand) {
    this.submissionCommand = [this.submission].concat(this.submissionArgs);
  }

  this.submissionChild = spawn(process.execPath,
    this.submissionCommand, { env: this.env });
  this.submissionStdout = this.getStdout('submission', this.submissionChild);

  // give other processors a chance to overwrite stdout
  setImmediate(function() {
    this.submissionStdout.on('end', kill.bind(this));
  }.bind(this));

  process.nextTick(function() {
    callback(null, true);
  });

  function kill() {
    this.submissionChild.kill();
    setTimeout(function() {
      this.emit('executeEnd');
    }.bind(this), 10);
  }
}

// remove standard execute processor
exercise._processors.shift();

// add in the new processor
exercise.addProcessor(onlyExecuteSubmission);

var names = ['nodeschool', 'workshops', 'node', 'exercise'];

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var database;
var table;

exercise.addSetup(function(mode, callback) {
  var self = this;

  database = pickRandom(names);
  table = pickRandom(names.filter(function(name) {
    return name !== database;
  }));

  this.submissionArgs = [database, table];

  r.connect(function(err, conn) {
    if (err) return callback(err);

    connection = conn;

    removeDatabase(connection, database, callback);
  });
});

function removeDatabase(connection, database, callback) {
  r.dbList()
    .contains(database)
    .do(function(databaseExists) {
      return r.branch(databaseExists,
        r.dbDrop(database), { dbs_dropped: 0 });
    }).run(connection, callback);
}

exercise.addProcessor(function(mode, callback) {
  var self = this;

  this.submissionChild.stdout.pipe(process.stdout);
  this.submissionChild.stderr.pipe(process.stderr);

  this.once('executeEnd', mode === 'verify' ? verify : callback);

  function verify() {
    console.log('asd');
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
  if (connection) {
    removeDatabase(connection, database,
      function(err) {
        if (err) return cb(err);
        connection.close(cb);
      });
  }
});

module.exports = exercise;
