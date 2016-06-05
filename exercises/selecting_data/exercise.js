var r = require('rethinkdb'),
  exercise = require('workshopper-exercise')(),
  filecheck = require('workshopper-exercise/filecheck'),
  execute = require('workshopper-exercise/execute'),
  comparestdout = require('workshopper-exercise/comparestdout');

var connection = null;

exercise = filecheck(exercise);

exercise = execute(exercise);

exercise = comparestdout(exercise);

var screws = [{
  "description": "Screws with a smooth shank and tapered point for use in wood. ",
  "id": "ca38c2a9-a16d-4803-a493-3b9d409354a6",
  "quantity": 4567,
  "type": "wood screws"
}, {
  "description": "Machine screws with a thread cutting (self tapping) point.",
  "id": "f38b75d7-6968-4222-b67a-a6bbf7e2cb34",
  "quantity": 1222,
  "type": "thread cutting machine screws"
}, {
  "description": "Screws with threads for use with a nut or tapped hole. ",
  "id": "007c73af-aa41-4d78-bb14-15baf4cd638d",
  "quantity": 675,
  "type": "machine screws"
}, {
  "description": "Fully threaded screws with a point for use in sheet metal.",
  "id": "fd0ef0be-00bb-4fbf-aabf-1dc54d62fd54",
  "quantity": 2131,
  "type": "sheet metal screws"
}];

var values = [675, 1220, 2131, 4500];

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

exercise.addSetup(function(mode, cb) {
  var self = this;
  var value = pickRandom(values);
  this.submissionArgs = [value];
  this.solutionArgs = [value];
  r.connect({ host: 'localhost', port: 28015 }, onConnect);

  function onConnect(err, conn) {
    if (err) throw err;
    connection = conn;

    r.dbList().contains('toolbox')
      .do(function(databaseExists) {
        return r.branch(databaseExists, { dbs_created: 0 },
          r.dbCreate('toolbox'));
      }).run(connection, onDBCreate);
  }

  function onDBCreate(err) {
    if (err) throw err;

    connection.use('toolbox');

    r.tableList().contains('screws')
      .do(function(tableExists) {
        return r.branch(tableExists, { tables_created: 0 },
          r.tableCreate('screws'));
      }).run(connection, onTableCreate);
  }

  function onTableCreate(err) {
    if (err) throw err;

    r.table('screws')
      .insert(screws, { conflict: 'replace' })
      .run(connection, cb);
  }
});

exercise.addCleanup(function(mode, pass, cb) {
  if (connection) connection.close(cb);
});

module.exports = exercise;
