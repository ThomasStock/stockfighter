"use strict";

var config = require("./../config");


function updateState() {

}

module.exports = function (socketId) {
    
    return {
        socketId: socketId,
    }
};
