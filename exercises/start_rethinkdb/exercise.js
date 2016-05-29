var exercise = require('workshopper-exercise')();

var r = require('rethinkdb');

exercise.requireSubmission = false;

exercise.addProcessor(function(mode, cb) {
  var self = this;
  r.connect(function(err, connection) {
    if (err) {
      self.emit('fail', 'Error connecting to RethinkDB: ' + err.message);
      return cb(null, false);
    }
    self.emit('pass', 'Successfully connected to RethinkDB');
    connection.close(function(err) {
      cb(err, true);
    });
  });
});

module.exports = exercise;
