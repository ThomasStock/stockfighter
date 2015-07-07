var config = require('./../config');

module.exports = function(io){
    
    this.io = io;
    this.bla = bla;
}

function bla(blo){
    
    config.eventHandlers.onLog("blo: " + blo);
}