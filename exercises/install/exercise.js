var exercise = require('workshopper-exercise')();
var exec = require('child_process').exec;

exercise.requireSubmission = false;

exercise.addProcessor(function(mode, cb) {
  var filename = process.platform === 'win32'
    ? 'rethinkdb.exe'
    : 'rethinkdb'
  var errmsg = 'It doesn\'t look like rethinkdb is installed and in your $PATH';

  exec(filename + ' --version', function(err, stdout, stderr) {
    if (err) {
      return this.emit('fail', errmsg);
    }

    if (mode === 'run') {
      console.log(stdout);
      return;
    }

    var matches = stdout.match(/rethinkdb \d\.\d\.\d/);

    if (matches) {
      var vers = matches[0];
      this.emit('pass', vers);
    } else {
      this.emit('fail', 'Invalid output from rethinkdb');
    }

    cb(null, !!vers);
  }.bind(this)).stdin.end()
})

module.exports = exercise
