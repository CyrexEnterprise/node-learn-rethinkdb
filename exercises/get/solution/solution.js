var r = require('rethinkdb');
var quantity = parseInt(process.argv[2]);

r.connect({ host: 'localhost', db: "toolbox", port: 28015 }, function(err, conn) {
  if (err) throw err;
  r.table('screws').filter(r.row("quantity").gt(quantity))
    .run(conn, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(error, results) {
        console.log(results);
        conn.close(function(err) {
          if (err) throw err;
        });
      });
    });
});
