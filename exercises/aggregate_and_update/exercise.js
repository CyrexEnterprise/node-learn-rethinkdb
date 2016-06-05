var r = require('rethinkdb');
var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var utils = require('../utils');
var connection = null;

exercise = filecheck(exercise);

exercise = utils.executeSubmission(exercise);

var characters = [{
  id: 'C-137-13af',
  firstName: 'Rick',
  lastName: 'Sanchez'
}, {
  id: 'C-137-1a23',
  firstName: 'Morty',
  lastName: 'Smith'
}, {
  id: 'C-789-950b',
  firstName: 'Summer',
  lastName: 'Smith'
}, {
  id: 'C-789-7cb4',
  firstName: 'Jerry',
  lastName: 'Smith'
}, {
  id: 'C-789-921a',
  firstName: 'Beth',
  lastName: 'Smith'
}];

var episodes = [{
  id: 1,
  title: 'Pilot'
}, {
  id: 2,
  title: 'Lawnmower Dog'
}, {
  id: 3,
  title: 'Anatomy Park'
}, {
  id: 4,
  title: 'M. Night Shaym-Aliens!'
}, {
  id: 5,
  title: 'Meeseeks and Destroy'
}];

var character = utils.pickRandom(characters);

var burps = [
  { character_id: 'C-137-13af' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-789-7cb4' },
  { character_id: 'C-789-921a' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-137-13af' },
  { character_id: 'C-789-950b' },
  { character_id: 'C-789-7cb4' },
  { character_id: 'C-137-1a23' },
  { character_id: 'C-137-1a23' },
  { character_id: 'C-137-1a23' },
  { character_id: 'C-137-1a23' }
];

burps = burps.map(function(burp) {
  burp.duration = Math.floor(Math.random() * 2000) + 300;
  return burp;
});

episodes = episodes.map(function(episode) {
  var burpCount = Math.floor(Math.random() * 16);

  episode.burps = [];

  while (burpCount) {
    episode.burps.push(utils.pickRandom(burps));
    burpCount--;
  }

  return episode;
});

var count = episodes.reduce(function(lastCount, episode) {
  return lastCount + episode.burps.filter(function(burp) {
    return burp.character_id === character.id;
  }).length;
}, 0);

exercise.addSetup(function(mode, cb) {
  this.submissionArgs = [character.id];

  r.connect(onConnect);

  function onConnect(err, conn) {
    if (err) return cb(err);
    connection = conn;

    utils.ensureDatabase(connection, 'RickAndMorty', onDBCreate);
  }

  function onDBCreate(err) {
    if (err) return cb(err);

    connection.use('RickAndMorty');

    utils.loadTable(connection, 'characters', characters, onTableCharacters);
  }

  function onTableCharacters(err) {
    if (err) return cb(err);

    utils.loadTable(connection, 'episodes', episodes, cb);
  }

});


exercise.addProcessor(function(mode, callback) {
  var self = this;

  this.submissionChild.stdout.pipe(process.stdout);
  this.submissionChild.stderr.pipe(process.stdout);

  this.once('executeEnd', mode === 'verify' ? verify : callback);

  function verify() {
    r.table('characters')
      .get(character.id)
      .pluck('burp_count')
      .run(connection, verifyCount);
  }

  function verifyCount(err, result) {
    if (err) return callback(err);

    if (result.burp_count == null) {
      self.emit('fail', character.firstName + ' ' + character.lastName +
        ' is missing a burp count');
      return callback(null, false);
    }

    if (result.burp_count !== count) {
      self.emit('fail', character.firstName + ' ' + character.lastName +
        ' expected burp count is ' + count + ', your count: ' +
        result.burp_count);
      return callback(null, false);
    }

    self.emit('pass', character.firstName + ' ' + character.lastName +
      ' burp count is ' + count + ' that\'s correct!');

    callback(null, true);
  }
});

exercise.addCleanup(function(mode, pass, cb) {
  if (!connection) return cb();
  connection.close(cb);
});

module.exports = exercise;
