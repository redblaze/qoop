var $U = require('underscore');
var Class = require('better-js-class');

var Order = require('./Order');
var Cursor = require('./Cursor');
var Group = require('./Group');

var empty = function(s) {
    return s == null || s == '';
};

var Query = Class({
    _init: function() {
        this._columns = [];
        this._tables = [];
        this._orders = [];
    },

    select: function() {
        for (var i = 0; i < arguments.length; i++) {
            this._columns.push(arguments[i]);
        }
    },

    from: function() {
        for (var i = 0; i < arguments.length; i++) {
            this._tables.push(arguments[i]);
        }
    },

    where: function(cond) {
        this._cond = cond;
    },

    _columnsToS: function() {
        var l = [];

        $U.each(this._columns, function(column) {
            l.push(column.toFullS());
        });

        return l.join(', ');
    },

    _tablesToS: function() {
        var l = [];

        $U.each(this._tables, function(table) {
            l.push(table.toS());
        });

        return l.join(', ');
    },

    _tableFilters: function() {
        var l = [];

        $U.each(this._tables, function(table) {
            var s = table.conditionToS();
            if (!empty(s)) {
                l.push(s);
            }
        });

        return l.join(' and ');
    },

    _conditionToS: function() {
        var l = [];

        var cond = this._cond.toS();

        if (!empty(cond)) {
            l.push('(');
            l.push(cond);
            l.push(')');
        }

        var tableFilters = this._tableFilters();

        if (!empty(tableFilters)) {
            l.push('and (');
            l.push(tableFilters);
            l.push(')');
        }

        return l.join(' ');
    },

    asc: function(column) {
        this._orders.push(new Order(column, 'asc'));
    },

    desc: function(column) {
        this._orders.push(new Order(column, 'desc'));
    },

    _ordersToS: function() {
        if (this._orders.length == 0) {
            return '';
        } else {
            var l = [];

            $U.each(this._orders, function(order) {
                order.toS();
            });

            return l.join(', ');
        }
    },

    limit: function(limit) {
        this._cursor = new Cursor(limit);
    },

    offset: function(offset) {
        if (this._cursor) {
            this._cursor.offset(offset);
        }
    },

    group: function(column) {
        this._group = new Group(column);
    },

    having: function(cond) {
        if (this._group) {
            this._group.having(cond);
        }
    },

    toS: function() {
        var l = [];

        l.push('select');
        l.push(this._columnsToS());
        l.push('from');
        l.push(this._tablesToS());

        var condition = this.conditionToS();
        if (!empty(condition)) {
            l.push('where', condition);
        }

        var order = this._ordersToS();
        if (!empty(order)) {
            l.push('order by', order);
        }

        if (this._cursor) {
            var cursor = this._cursor.toS();
            if (!empty(cursor)) {
                l.push(cursor);
            }
        }

        if (this._group) {
            var group = this._group.toS();
            if (!empty(group)) {
                l.push(group);
            }
        }

        return l.join(' ');
    }
});

