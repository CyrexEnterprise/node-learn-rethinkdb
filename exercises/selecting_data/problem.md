Here we will learn how to search tables and selecting data from them.

In this exercise the database is `toolbox`. Use the table `screws` to find all
screws with `quantity` higher than the first argument passed to your script.

Use `console.log` to print to `stdout`.

-----------------------------------------------------------
## HINTS

To get the all the documents in a table you can run something this:

```javascript
r.db('RethinkDB').table('users').run(connection, callback);
```

The table and database are created for you before you run your solution.
Also we will be throwing a random value to your solution which you will
need to use.

To access the arguments you can use the `process.argv` array of strings.
To convert to an integer, you can use `parseInt`.

To find a document or documents by some field you can use filter.

Here is an example:

```javascript
r.table('users').filter(r.row('age').eq(30)).run(connection, callback);
```

## Resources:

* Introduction to ReQL: https://www.rethinkdb.com/docs/introduction-to-reql/
* Filter: https://rethinkdb.com/api/javascript/filter/
