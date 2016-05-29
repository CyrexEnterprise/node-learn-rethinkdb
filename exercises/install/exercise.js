var exercise = require('workshopper-exercise')();
var exec = require('child_process').exec;

exercise.requireSubmission = false;

exercise.addProcessor(function(mode, cb) {
  var filename = process.platform === 'win32' ?
    'rethinkdb.exe' : 'rethinkdb';

  exec(filename + ' --version', function(err, stdout) {
    if (err) {
      this.emit('fail',
        'It doesn\'t look like rethinkdb is installed and in your $PATH'
      );
      return cb(null, false);
    }

    if (mode === 'run') {
      console.log(stdout);
      return;
    }

    var matches = stdout.match(/rethinkdb \d\.\d\.\d/);
    var vers;

    if (matches) {
      vers = matches[0];
      this.emit('pass', 'RethinkDB successfully installed.');
    } else {
      this.emit('fail', 'Invalid output from RethinkDB.');
    }
    cb(null, !!vers);
  }.bind(this)).stdin.end();
});

module.exports = exercise;
