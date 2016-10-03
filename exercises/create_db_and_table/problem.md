Here we will learn how to create a database and in this
database create a table.

The database and table names will be given to the script arguments, first the
database then the table name.

-----------------------------------------------------------
## HINTS

Get the database name and table name from the script arguments, with something
like this:

```javascript
var database = process.argv[2];
var table = process.argv[3];
```

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
var query = r.dbCreate('nodeschool');
query.run(function callback(error, result) {
  // callback for when the database is created (or in case of error)
});
```

Note that creating a database or table that already exists will callback with
an error. But you don't have to worry about this since we will make
sure that there's no database before running your program, that is
only if you are using `learnyourethinkdb run yoursolution.js` to run it.

If your program does not finish executing, you may have forgotten to
close the `conn`. That can be done by calling `conn.close()` after you
have finished.

## Resources:

* Connect: https://www.rethinkdb.com/api/javascript/connect/
* Run: https://www.rethinkdb.com/api/javascript/run/
* Create Database: https://www.rethinkdb.com/api/javascript/db_create/
* Create Table: https://www.rethinkdb.com/api/javascript/table_create/
