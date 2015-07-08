"use strict";

var config = require("./../config");

var io;

function bla(blo){

    config.eventHandlers.onLog("blo: " + blo);
}

function initialize(newIo){
    
    io = newIo;
}

module.exports = {
    initialize: initialize,
    bla: bla
};
