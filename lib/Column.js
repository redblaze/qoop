var Class = require('better-js-class');
var mysql = require('mysql');
var Condition = require('./Condition');

var Column = Class({
    _init: function(table, column) {
        this._table = table;
        this._column = column;
        this.__isColumn__ = true;
    },

    as: function(alias) {
        this._alias = alias;
        return this;
    },

    toS: function() {
        var l = [
            this._table.getAlias(),
            '.',
            this._column
        ];
        return l.join('');
    },

    toFullS: function() {
        var l = [
            this.toS()
        ];
        if (this._alias) {
            l.push(
                ' as ',
                this._alias
            );
        }
        return l.join('');
    },

    isNull: function() {
        return new Condition.IsNull(this);
    },

    isNotNull: function() {
        return new Condition.IsNotNull(this);
    },

    isTrue: function() {
        return new Condition.IsTrue(this);
    },

    isFalse: function() {
        return new Condition.IsFalse(this);
    },

    is: function(op, other) {
        return new Condition.Is(this, op, other);
    }
});

module.exports = Column;