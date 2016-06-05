var execute = require('workshopper-exercise/execute');
var spawn = require('child_process').spawn;
var r = require('rethinkdb');

function executeSubmission(exercise, opts) {
  if (!opts) opts = {};

  /**
   *  overwrite default execute processor with a
   *  processor that only executes the submission
   */

  exercise = execute(exercise, opts);

  function onlyExecuteSubmission(mode, callback) {
    // backwards compat for workshops that use older custom setup functions
    if (!this.submissionCommand) {
      this.submissionCommand = [this.submission].concat(this.submissionArgs);
    }

    this.submissionChild = spawn(opts.exec || process.execPath,
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
  exercise._processors.pop();

  // add in the new processor
  exercise.addProcessor(onlyExecuteSubmission);

  return exercise;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}


function removeDatabase(connection, database, callback) {
  r.dbList()
    .contains(database)
    .do(function(databaseExists) {
      return r.branch(databaseExists,
        r.dbDrop(database), { dbs_dropped: 0 });
    }).run(connection, callback);
}

module.exports = {
  executeSubmission: executeSubmission,
  pickRandom: pickRandom,
  removeDatabase: removeDatabase
};
