var r = require('rethinkdb');

var character = {
  firstName: process.argv[2],
  lastName: process.argv[3]
};

r.connect({ db: 'RickAndMorty' }, onConnect);

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
