var Class = require('better-js-class');
var mysql = require('mysql');
var Column = require('./Column').Column;
var All = require('./Column').All;

var Base = Class({
    join: function(right) {
        return new Join(this, 'inner join', right);
    },

    leftJoin: function(right) {
        return new Join(this, 'left join', right);
    },

    rightJoin: function(right) {
        return new Join(this, 'right join', right);
    },

    outerJoin: function(right) {
        return new Join(this, 'outer join', right);
    },

    leftOuterJoin: function(right) {
        return new Join(this, 'left outer join', right);
    },

    rightOuterJoin: function(right) {
        return new Join(this, 'right outer join', right);
    }
});

var Table = Class(Base, {
    _init: function(name) {
        this._name = name;
        this.__isTable__ = true;
    },

    as: function(alias) {
        this._alias = alias;
        return this;
    },

    where: function(condition) {
        if (!this._condition) {
            this._condition = condition;
        } else {
            this._condition = this._condition.and(condition);
        }

        return this;
    },

    getAlias: function() {
        if (this._alias) {
            return this._alias;
        } else {
            return this._name;
        }
    },

    col: function(name) {
        return new Column(this, name);
    },

    all: function() {
        return new All(this);
    },

    toS: function() {
        var l = [
            this._name
        ];
        if (this._alias) {
            l.push(
                ' as ',
                this._alias
            );
        }
        return l.join('');
    }
});

var Join = Class(Base, {
    _init: function(left, join, right) {
        this._left = left;
        this._right = right;
        this._join = join;
        this.__isJoin__ = true;
    },

    on: function(cond) {
        this._condition = cond;
        return this;
    },

    _conditionToS: function() {
        var condition = this._condition;

        if (this._left.__isTable__ && this._left._condition) {
            condition =  condition.and(this._left._condition);
        }

        if (this._right.__isTable__ && this._right._condition) {
            condition =  condition.and(this._right._condition);
        }

        return condition.normalize().toS();
    },

    toS: function() {
        var l = [];

        l.push(this._left.toS(), this._join, this._right.toS(), 'on', this._conditionToS());

        return '(' + l.join(' ') + ')';
    }
});

module.exports = Table;