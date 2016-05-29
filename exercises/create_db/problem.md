Here we will learn how to create a database named `toolbox`.

-----------------------------------------------------------
## HINTS

To connect to the database, one can use something like this:

```js
var r = require('rethinkdb');
r.connect(function(err, conn) {
  // conn gives access to the database
});
```

To create a database, one can use `r.dbCreate('<database name>')`.

Note that creating a database that already exists will resolve with an error `ReqlRuntimeError`. But you don't have to worry about this since we will make sure there's no `toolbox` database before running your program.

If your program does not finish executing, you may have forgotten to
close the `conn`. That can be done by calling `conn.close()` after you
have finished.

## Resources:
* https://www.rethinkdb.com/api/javascript/db_create/
