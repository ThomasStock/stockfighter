// Require our dependencies
config = require('./config');

module.exports = function(io, worldState) {

    var match = {
  
        start: start,
    
        log: log
  
    }

    return match;
  
    function log() {
  
        console.log("Match ");
        
    }

    function start() {
  
        worldState.matchState = config.matchStates.matchStarted;
  
        io.emit(config.events.matchStarted, worldState);
  
    }
};