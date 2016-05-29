var r = require('rethinkdb');

r.connect(function(err, conn) {
  if (err) throw err;

  r.dbCreate('toolbox').run(conn, function(err, res) {
    if (err) throw err;

    console.log(res);

    conn.close();
  });
});
