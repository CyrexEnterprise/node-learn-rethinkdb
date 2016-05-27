var exercise = require('workshopper-exercise')();
var r = require('rethinkdb');
var connection;

exercise.requireSubmission = false;



exercise.addSetup(function(mode, callback){

    r.connect({ host: "localhost" }, function(err, conn) {
        if( err )
            throw err;

        connection = conn;

        process.nextTick(callback);
    });
});

exercise.addProcessor(function(mode, callback) {

    var pass = false;

    r.dbList().run(connection, function(err, res){

        if( err ){
            this.emit("fail", err);
            connection.close();
        }

        pass = res.indexOf('toolbox') > -1;

        return callback(null, pass);
    });
});

module.exports = exercise;
