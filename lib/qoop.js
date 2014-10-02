var Class = require('better-js-class');
var mysql = require('mysql');

(function() {
    var q;

    var c = table('collections').as('c').notDeleted();
    var u = table('users').as('u').notDeleted();

    q.select(
        c.col('id'),
        u.col('id')
    ).from(
        c.innerJoin(u).on(c.col('user_id'), u.col('id'))
    ).where(
        c.col('date_created').lessThan(new Date()).and(

        )
    )
    ;
})();






