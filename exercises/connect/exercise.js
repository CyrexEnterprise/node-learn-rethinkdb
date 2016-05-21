var Exercise = require('workshopper-exercise');
var exercise = new Exercise()

var r = require('rethinkdb');

exercise.requireSubmission = false;

exercise.addProcessor(function(mode, cb) {
  var self = this;
  r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
    if (err) {
      return self.emit('fail', 'Error connecting to RethinkDB. ' + err.message);
    }

    self.emit('pass', 'Successfully connected to RethinkDB')
    cb(null, true);
  })
})

module.exports = exercise
