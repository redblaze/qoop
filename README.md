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
