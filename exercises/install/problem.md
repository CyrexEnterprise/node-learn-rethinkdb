# Introduction

### What is RethinkDB?

> RethinkDB is the first open-source, scalable JSON database built from the
> ground up for the realtime web. It inverts the traditional database architecture
> by exposing an exciting new access model – instead of polling for changes,
> the developer can tell RethinkDB to continuously push updated query results
> to applications in realtime. RethinkDB’s realtime push architecture
> dramatically reduces the time and effort necessary to build scalable realtime
> apps.

* Frequently Asked Questions: https://www.rethinkdb.com/faq/

It has out of the box this cool features:

- Changefeeds for a table, a single document or a specific query
- Natural and intuitive query language (ReQL) that is composable
- Automatically parallelized queries
- Table joins and aggregations including map-reduce
- Nice atomic operations
- Simple administration

-----------------------------------------------------------

### Installation

Now before we start let's make sure we have RethinkDB installed.

* Follow the instructions on this page: https://www.rethinkdb.com/docs/install/

To verify that RethinkDB is installed, you can try running `rethinkdb --version`.

If you are on Windows, you will need to use `rethinkdb.exe` instead,
make sure that is in your `PATH` variable.

To move on to the next task run `learnrethinkdb verify`
