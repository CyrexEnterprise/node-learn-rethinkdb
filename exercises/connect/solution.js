var Exercise = require('workshopper-exercise');
var exercise = new Exercise()

var r = require('rethinkdb');

exercise.requireSubmission = false;

exercise.addProcessor(function(mode, callback) {
  var self = this;
  // connect
  r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
    if (err) {
      return self.emit('fail', 'Error connecting to RethinkDB. ' + err.message);
    }

    self.emit('pass', 'Successfully connected to RethinkDB')

    // create db
    r.dbCreate('toolbox').run(conn, function(err, res){

        if( err )
            return self.emit('fail', 'Error connecting to RethinkDB. ' + err.message);

        self.emit('pass', 'Created db connected to RethinkDB');
    });

    callbackb(null, true);
  })
});

exercise.addProcessor(function(mode, callback) {
  var self = this;
  r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
    if (err) {
      return self.emit('fail', 'Error connecting to RethinkDB. ' + err.message);
    }

    self.emit('pass', 'Successfully connected to RethinkDB')
    cb(null, true);
  })
});

module.exports = exercise
