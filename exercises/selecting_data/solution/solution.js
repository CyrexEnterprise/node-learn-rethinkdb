var r = require('rethinkdb');

var quantity = parseInt(process.argv[2]);

r.connect({ host: 'localhost', db: 'toolbox', port: 28015 }, onConnect);

function onConnect(err, connection) {
  if (err) throw err;

  r.table('screws')
    .filter(r.row('quantity').gt(quantity))
    .run(connection, onFilter);

  function onFilter(err, cursor) {
    if (err) throw err;

    cursor.toArray(function (err, results) {
      if (err) throw err;

      console.log(results);

      connection.close();
    });
  }
}
