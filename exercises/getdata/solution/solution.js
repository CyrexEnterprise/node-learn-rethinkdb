var r = require('rethinkdb');
var quantity = process.argv[2];

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    r.db('toolbox').table('screws').filter(r.row("quantity").gt(quantity))
      .run(conn, function(err, result) {
        if(err) throw err;
        console.log("!!",result);
      });
});
