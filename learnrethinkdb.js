var workshopper = require('workshopper');
var path = require('path');

var opts = {
  name: 'learnrethinkdb',
  title: 'Learn RethinkDB',
  description: 'Learn RethinkDB',
  appDir: __dirname,
  exerciseDir: fpath('./exercises'),
  footerFile: fpath('footer.md'),
  languages: ['en']
}

if (process.platform !== 'win32') {
  opts.menu = {
    bg: 15
  , fg: 'black'
  }
}

workshopper(opts)

function fpath (f) {
  return path.join(__dirname, f)
}
