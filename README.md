qoop
====

A purely object oriented mysql query builder.

# Install

```sh
npm install qoop
```

# Use

```js
var qoop = require('qoop');
var Query = qoop.Query;
var Table = qoop.Table;
```

# APIs

## Query
* new Query
* select
* from
* where
* asc
* desc
* limit
* offset
* group
* having
* union

## Table
* new Table
* col
* as
* where
* all
* join
* leftJoin
* rightJoin
* leftOuterJoin
* rightOuterJoin

## Join
* on

## Column
* as
* isNull
* isNotNull
* isTrue
* isFalse
* is
* isIn
* count
* distinct
* min
* max
* sum

## Condition
* and
* or
* not

# Example

```js
var notDelete = function(table) {
    table.where(
        table.col('deleted').isNull()
            .or(table.col('deleted').isFalse())
    );
};

var s = new Table('students').as('s');
notDelete(s);

var c = new Table('courses').as('c');
notDelete(c);

var r = new Table('registrations').as('r');
notDelete(r);

var q = new Query().select(
    s.all()
).from(
    s
        .join(r).on(r.col('student_id').is('=', s.col('id')))
        .join(c).on(c.col('id').is('=', r.col('course_id')))
).where(
    c.col('credits').is('>=', 4)
        .and(s.col('gender').is('=', 'male'))
).group(
    s.col('id')
).having(
    c.col('id').count().is('>', 2)
).limit(20).offset(10)
;
```
