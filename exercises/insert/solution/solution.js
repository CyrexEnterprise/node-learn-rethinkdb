var r = require('rethinkdb');

var character = {
  firstName: process.argv[2],
  lastName: process.argv[3],
  age: process.argv[4]
};

r.connect({ db: 'SouthPark' }, onConnect);

function onConnect(err, connection) {
  if (err) throw err;

  r.table('characters')
    .insert(character)
    .run(connection, onInsert);

  function onInsert(err, result) {
    if (err) throw err;

    connection.close();
  }
}
