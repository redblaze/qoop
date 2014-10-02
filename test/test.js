Error.stackTraceLimit = Infinity;

var Class = require('better-js-class');
var mysql = require('mysql');

var qoop = require('../lib/qoop');
var Query = qoop.Query;
var Table = qoop.Table;

(function() {

    var c = new Table('collections');
    c.where(c.col('deleted').isNull());

    var u = new Table('users');
    u.where(u.col('deleted').isNull());

    var q = new Query();

    q.select(
        c.col('id').as('collection_id'),
        u.col('id').as('user_id')
    ).from(
        c, u
    ).where(
        c.col('date_created').is('<', new Date()).and(
            c.col('user_id').is('=', u.col('id'))
        )
    )
    ;

    console.log(q.toS());
})();






