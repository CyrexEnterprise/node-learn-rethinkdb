Let's insert a document into our database.

Use the table `characters` and the database `RickAndMorty`.
The document should have the following properties:

* firstName (passed as first argument to your script)
* lastName (passed as second argument to your script)

Use `console.log` to print to `stdout`.

-----------------------------------------------------------
## HINTS

To insert a document in a table you can run something this:

```javascript
r.db('RickAndMorty')
  .table('characters')
  .insert({
    firstName: 'Morty',
    lastName: 'Smith'
  }).run(connection, callback);
```

The table and database are created for you before you run your solution.

We will be throwing a random values to your solution which you
will need to use.

To access the arguments you can use the `process.argv` array of strings.

## Resources:

* Insert: https://www.rethinkdb.com/api/javascript/insert/
