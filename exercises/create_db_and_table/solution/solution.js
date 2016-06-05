var r = require('rethinkdb');

var database = process.argv[2];
var table = process.argv[3];

r.connect(onConnect);

function onConnect(err, connection) {
  if (err) throw err;

  r.dbCreate(database)
    .run(connection, onDBCreate);

  function onDBCreate(err) {
    if (err) throw err;

    r.db(database)
      .tableCreate(table)
      .run(connection, onTableCreate);
  }

  function onTableCreate(err) {
    if (err) throw err;

    connection.close();
  }
}
