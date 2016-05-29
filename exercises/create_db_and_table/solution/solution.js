var r = require('rethinkdb');

r.connect(onceConnect);

function onceConnect(err, connection) {
  if (err) throw err;

  r.dbCreate('toolbox')
    .run(connection, onceDBCreate);

  function onceDBCreate(err) {
    if (err) throw err;

    r.db('toolbox')
      .tableCreate('screws')
      .run(connection, onceTableCreate);
  }

  function onceTableCreate(err) {
    if (err) throw err;

    connection.close();
  }
}
