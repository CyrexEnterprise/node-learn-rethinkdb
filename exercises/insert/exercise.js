var r = require('rethinkdb');
var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var utils = require('../utils');
var connection = null;

exercise = filecheck(exercise);

exercise = utils.executeSubmission(exercise);

var characters = [{
  firstName: 'Stan',
  lastName: 'Marsh',
  age: 10
}, {
  firstName: 'Kyle',
  lastName: 'Broflovski',
  age: 11
}, {
  firstName: 'Eric',
  lastName: 'Cartman',
  age: 12
}, {
  firstName: 'Kenny',
  lastName: 'McCormick',
  age: 13
}];

var character = utils.pickRandom(characters);

exercise.addSetup(function(mode, cb) {
  this.submissionArgs = [character.firstName, character.lastName];

  r.connect(onConnect);

  function onConnect(err, conn) {
    if (err) return cb(err);
    connection = conn;

    utils.ensureDatabase(connection, 'SouthPark', onDBCreate);
  }

  function onDBCreate(err) {
    if (err) return cb(err);

    connection.use('SouthPark');

    r.tableList().contains('characters')
      .do(function(tableExists) {
        return r.branch(tableExists, r.table('characters').delete(),
          r.tableCreate('characters'));
      }).run(connection, cb);
  }
});

exercise.addProcessor(function(mode, callback) {
  var self = this;

  this.submissionChild.stdout.pipe(process.stdout);
  this.submissionChild.stderr.pipe(process.stdout);

  this.once('executeEnd', mode === 'verify' ? verify : callback);

  function verify() {
    r.table('characters')
      .filter(character)
      .limit(1)
      .run(connection, function(err, cursor) {
        if (err) return callback(err);
        cursor.toArray(verifyCharacter);
      });
  }

  function verifyCharacter(err, result) {
    if (err) return callback(err);

    if (!result.length) {
      self.emit('fail', character.firstName + ' ' + character.lastName +
        ' is nowhere to be found');
      return callback(null, false);
    }

    self.emit('pass', character.firstName + ' ' + character.lastName +
      ' is in the database');

    callback(null, true);
  }
});

exercise.addCleanup(function(mode, pass, cb) {
  if (!connection) return cb();
  connection.close(cb);
});

module.exports = exercise;
