var r = require('rethinkdb');
var quantity = process.argv[2];

r.connect( {host: 'localhost', db: "toolbox", port: 28015}, function(err, conn) {
    if (err) throw err;
    r.table('screws').filter(r.row("quantity").gt(quantity))
      .run(conn, function(err, res) {
        if(err) throw err;
        console.log(res);
      });
});
