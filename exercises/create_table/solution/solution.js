// solution stuff here

var r = require('rethinkdb');

r.connect({ host: "localhost" }, function(err, conn) {
    if( err )
        throw err;

    r.db('toolbox').tableCreate('screws').run(conn, function(err, res){
        if( err )
            console.error("Error:",err);

        conn.close(function(err) {
                if (err)
                    throw err;
            });
    });
});
