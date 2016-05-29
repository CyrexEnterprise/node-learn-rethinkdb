Here we will learn how to create a database named `toolbox` and in this
database create a table named `screws`.

-----------------------------------------------------------
## HINTS

To connect to the database, one can use something like this:

```js
var r = require('rethinkdb');
r.connect(function(err, connection) {
  // connection gives access to the RethinkDB instance
});
```

To create a database, one can use `r.dbCreate('<database name>')`.

To create a table (a collection of JSON documents) in a table, one can use
`r.db('<database name').tableCreate('<table name>')`.

These functions create an query object that you will need to run.

```js
var query = r.dbCreate('toolbox').run(function callback(error, result) {
  // callback for when the database is created (or incase of error)
});
```

Note that creating a database or table that already exists will callback with
an error. But you don't have to worry about this since we will make
sure that there's no `toolbox` database before running your program.

If your program does not finish executing, you may have forgotten to
close the `conn`. That can be done by calling `conn.close()` after you
have finished.

## Resources:

* https://www.rethinkdb.com/api/javascript/connect/
* https://www.rethinkdb.com/api/javascript/run/
* https://www.rethinkdb.com/api/javascript/db_create/
* https://www.rethinkdb.com/api/javascript/table_create/
