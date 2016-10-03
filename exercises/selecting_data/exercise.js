var r = require('rethinkdb'),
  exercise = require('workshopper-exercise')(),
  filecheck = require('workshopper-exercise/filecheck'),
  execute = require('workshopper-exercise/execute'),
  comparestdout = require('workshopper-exercise/comparestdout'),
  utils = require('../utils');

var connection = null;

exercise = filecheck(exercise);

exercise = execute(exercise);

exercise = comparestdout(exercise);

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

exercise.addSetup(function(mode, cb) {

  this.submissionArgs = characters;
  this.solutionArgs = characters;

  r.connect(onConnect);

  function onConnect(err, conn) {
    if (err) return cb(err);
    connection = conn;

    utils.ensureDatabase(connection, 'SouthPark', onDBCreate);
  }

  function onDBCreate(err) {
    if (err) return cb(err);

    connection.use('SouthPark');

    utils.loadTable(connection, 'characters', characters, cb);
  }
});

// exercise.addProcessor(function(mode, callback) {
//   var self = this;
//
//   this.submissionChild.stdout.pipe(process.stdout);
//   this.submissionChild.stderr.pipe(process.stderr);
//
//
//
// });

exercise.addCleanup(function(mode, pass, cb) {
  if (!connection) return cb();

  connection.close(cb);
});

module.exports = exercise;
