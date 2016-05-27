var r = require('rethinkdb'),
  exercise = require('workshopper-exercise')(),
  filecheck = require('workshopper-exercise/filecheck'),
  execute = require('workshopper-exercise/execute'),
  comparestdout = require('workshopper-exercise/comparestdout');

var connection = null;

exercise = filecheck(exercise)

exercise = execute(exercise)

exercise = comparestdout(exercise)

function load_data(conn, cb) {
  r.db('toolbox').table('screws').insert([
    {
      "description":  "Screws with a smooth shank and tapered point for use in wood. " ,
      "id":  "ca38c2a9-a16d-4803-a493-3b9d409354a6" ,
      "quantity": 4567 ,
      "type":  "wood screws"
    },
    {
      "description":  "Machine screws with a thread cutting (self tapping) point." ,
      "id":  "f38b75d7-6968-4222-b67a-a6bbf7e2cb34" ,
      "quantity": 1222 ,
      "type":  "thread cutting machine screws"
    },
    {
      "description":  "Screws with threads for use with a nut or tapped hole. " ,
      "id":  "007c73af-aa41-4d78-bb14-15baf4cd638d" ,
      "quantity": 675 ,
      "type":  "machine screws"
    },
    {
      "description":  "Fully threaded screws with a point for use in sheet metal." ,
      "id":  "fd0ef0be-00bb-4fbf-aabf-1dc54d62fd54" ,
      "quantity": 2131 ,
      "type":  "sheet metal screws"
    }
  ], {conflict: "replace"}).run(conn, function(err, result) {
    if(err) throw err;
    cb();
    // console.log(JSON.stringify(result, null, 2));
  });
}

function create_table(conn, cb) {
  r.db("toolbox").tableList().run(conn, function(err, result) {
    if (err) throw err;
    if(result.indexOf('screws') != -1) {
      load_data(conn, cb);
    } else {
      r.db("toolbox").tableCreate("screws").run(conn, function(err, result) {
        if (err) throw err;
        load_data(conn, cb);
      });
    }
  });
}

function create_db(conn, cb) {
  r.dbCreate("toolbox").run(conn, function(err, result) {
    if (err) throw err;
    create_table(conn, cb);
  });
}

exercise.addSetup(function(mode, cb) {
  var self = this
  this.submissionArgs = [700]
  this.solutionArgs = [700]
  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
      if (err) throw err;
      connection = conn;
      r.dbList().run(conn, function(err, result) {
        if(err) throw err;
        if(result.indexOf('toolbox') != -1) {
          create_table(conn, cb);
        } else {
          create_db(conn, cb);
        }
      });
  });
})

exercise.addCleanup(function(mode, pass, cb) {
  connection.close(function(err) {
    if (err) throw err;
    cb();
  });
})

module.exports = exercise
