var r = require('rethinkdb');

r.connect(onceConnect);

function onceConnect(err, connection) {
  if (err) throw err;

  r.dbCreate('toolbox')
    .run(connection, onDBCreate);

  function onDBCreate(err) {
    if (err) throw err;

    r.db('toolbox')
      .tableCreate('screws')
      .run(connection, onTableCreate);
  }

  function onTableCreate(err) {
    if (err) throw err;

    connection.close();
  }
}
