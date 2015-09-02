"use strict";

//var config = require("./../config");

module.exports = function () {

    var id;
    var name;
    var socket;
    var state;

    function log() {
        return "name: " + name;
    }

    return {

        get name() {
            return name;
        },
        set name(value) {
            name = value;
        },

        get id() {
            return id;
        },
        set id(value) {
            id = value;
        },

        get socket() {
            return socket;
        },
        set socket(value) {
            socket = value;
        },

        get state() {
            return state;
        },
        set state(value) {
            state = value;
        },

        log: log
    };
};
