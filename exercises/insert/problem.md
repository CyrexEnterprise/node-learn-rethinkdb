Let's insert a document into our database.

Use the table `characters` and the database `SouthPark`.
The document should have the following properties:

* firstName (passed as first argument to your script)
* lastName (passed as second argument to your script)
* age (passed as third argument to your script)

-----------------------------------------------------------
## HINTS

To insert a document in a table you can run something this:

```javascript
r.db('SouthPark')
  .table('characters')
  .insert({
    firstName: 'Eric',
    lastName: 'Cartman',
    age: 12
  }).run(connection, callback);
```

The table and database are created for you before you run your solution.

We will be throwing a random values to your solution which you
will need to use.

To access the arguments you may use the `process.argv` array of strings.

## Resources:

* Insert: https://www.rethinkdb.com/api/javascript/insert/
