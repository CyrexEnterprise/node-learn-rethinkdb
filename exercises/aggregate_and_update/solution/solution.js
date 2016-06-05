var r = require('rethinkdb');

var characterId = process.argv[2];

r.connect({ db: 'RickAndMorty' }, onConnect);

function onConnect(err, connection) {
  if (err) throw err;

  r.table('characters').get(characterId).update({
    burp_count: burpCount(characterId)
  }, {
    nonAtomic: true
  }).run(connection, onUpdate);

  function onUpdate(err, result) {
    if (err) throw err;

    connection.close();
  }
}

function burpCount(characterId) {
  return r.table('episodes').sum(burpEpisodeCount);

  function burpEpisodeCount(episode) {
    return episode('burps')('character_id').count(characterId);
  }
}
