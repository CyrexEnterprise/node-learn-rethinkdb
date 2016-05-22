Here we will learn how to search tables.

In this exercise the database is `toolbox`. Use the table `screws` to find all screws with `quantity` higher than the first argument passed to your script.
Use `console.log` to print to `stdout`.

---
# HINTS
To get the all the documents in a table you can run something this:
```javasscript
r.db('rethinkDB').table('users').run(conn, callback);
```
To find a document or documents by some field you can use filter.
To access the arguments you can use the process.argv array of strings (the first argument is stored at the third position process.argv[2]). To convert to an integer, use parseInt().

Here is an example:

```javasscript
r.table('users').filter(r.row('age').gt(30)).run(conn, callback);
```


## Resource:
* https://www.rethinkdb.com/docs/introduction-to-reql/
