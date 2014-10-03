Error.stackTraceLimit = Infinity;

var Class = require('better-js-class');
var mysql = require('mysql');

var qoop = require('../lib/qoop');
var Query = qoop.Query;
var Table = qoop.Table;
var Cond = qoop.Condition;

(function() {

    var co = new Table('collections').as('co');
    co.where(co.col('deleted').isNull());

    var u = new Table('user_profiles').as('u');
    u.where(u.col('deleted').isNull());

    var c = new Table('clips').as('c');
    c.where(c.col('deleted').isNull());

    var i = new Table('items').as('i');
    i.where(i.col('deleted').isNull());

    var q = new Query();
    /*
     var q = db.format([
     'select c.*, u.user_info as user_info, co.title as collection_title, i.asset_info as asset_info, i.id as original_item_id, i.clip_count as clip_count',
     'from items i, clips c, collections co, user_profiles u',
     'where i.id in (?)',
     'and i.representative_clip_id = c.id',
     'and c.representative_collection_id = co.id',
     'and c.user_profile_id = u.id',
     'and u.deleted is not true'
     ].join(' '), [ids]);
     */
    /*
    q.select(
        c.all(),
        u.col('user_info').as('user_info'),
        co.col('title').as('collection_title'),
        i.col('asset_info').as('asset_info'),
        i.col('id').as('original_item_id'),
        i.col('clip_count').as('clip_count')
    ).from(
        c, u, co, i
    ).where(
        Cond.and(
            i.col('id').isIn([1,2,3]),
            i.col('representative_clip_id').is('=', c.col('id')),
            c.col('representative_collection_id').is('=', co.col('id')),
            c.col('user_profile_id').is('=', u.col('id'))
        )
    )
    ;
    */

    q.select(
        c.all(),
        u.col('user_info').as('user_info'),
        co.col('title').sum().as('collection_title'),
        i.col('asset_info').as('asset_info'),
        i.col('id').as('original_item_id'),
        i.col('clip_count').as('clip_count')
    ).from(
        i
            .join(c).on(i.col('representative_clip_id').is('=', c.col('id')))
            .join(u).on(c.col('user_profile_id').is('=', u.col('id')))
            .join(co).on(c.col('representative_collection_id').is('=', co.col('id'))),
        new Query().select(u.all()).from(u).where(u.col('clip_count').is('=', 1)).as('user_test')
    ).where(
        i.col('id').isIn([1,2,3])
            .and(i.col('date_created').is('<', new Date()))
            .and(co.col('clip_count').is('>', i.col('clip_count')))
    ).group(u.col('id')).having(
        u.col('collection_count').count().is('>', u.col('clip_count').sum())
    ).limit(100).offset(200)
    ;

    console.log(q.toS());
})();






