var Class = require('better-js-class');
var mysql = require('mysql');
var Column = require('./Column');

var Table = Class({
    _init: function(name) {
        this._name = name;
    },

    as: function(alias) {
        this._alias = alias;
        return this;
    },

    where: function(condition) {
        this._condition = condition;
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

    conditionToS: function() {
        if (this._condition) {
            return this._condition.toS();
        } else {
            return '';
        }
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

module.exports = Table;