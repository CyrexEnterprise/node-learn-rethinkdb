Here we will learn how to aggregate data and update data.

In this exercise the database is `RickAndMorty`. We will be interested in
two tables `characters` and `episodes`.

Your script will be called with an id of a character at random.

We want you to count all the burps of that character on all the episodes of the
show and then update the character with the total count on the field `burp_count`.

The episode schema is as follows:

```javascript
{
  id: 1,
  title: 'Pilot',
  burps: [{
    character_id: 'C-137-1a23',
    duration: 1256
  }, {
    character_id: 'C-789-7cb4',
    duration: 672
  }]
}
```

-----------------------------------------------------------
## HINTS

First attempt to update the character even if its the wrong count.
Here's an example:

```javascript
connection.use('RickAndMorty');
r.table('characters').get(id).update({
  burp_count: 10,
}).run(connection, callback);
```

You can replace the number in the previous example with an query to
 another table:

```javascript
r.table('episodes').sum(function(episode) {
  // count the episode burps of the character here
})
```

When you query another table on an update you need to explicitly add the option:
`nonAtomic: true` to the update operation.

```javascript
r.table('episodes').get(1).update({
  rating: r.table('ratings')
            .filter({episode_id: 1})
            .avg('value')
            .default(null)
}, {
  nonAtomic: true
}).run(connection, callback);
```

Use the count with a field value to only count matching values.

```javascript
episode('burps')('character_id').count(id);
```

Use the Data Explorer to assist you in building the aggregation query to
get the burp count of a character.

* http://localhost:8080/#dataexplorer


The table and database are created for you before you run your solution with
random values.

## Resources:

* Update: https://www.rethinkdb.com/api/javascript/update/
* Count: https://www.rethinkdb.com/api/javascript/count/
* Sum: https://www.rethinkdb.com/api/javascript/sum/
* Bracket: https://rethinkdb.com/api/javascript/bracket/
