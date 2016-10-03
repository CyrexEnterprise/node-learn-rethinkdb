var workshopper = require('workshopper');
var path = require('path');

var opts = {
  name: 'learnyourethinkdb',
  title: 'Learn RethinkDB',
  description: 'Learn RethinkDB',
  appDir: __dirname,
  exerciseDir: path.join(__dirname, './exercises'),
  footerFile: path.join(__dirname, 'footer.md'),
  languages: ['en']
};

workshopper(opts);
