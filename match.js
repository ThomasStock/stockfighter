// Require our dependencies
config = require('./config');

module.exports = function(io, worldState) {

    var match = {
  
        start: start,
    
        log: log
  
    }

    return match;
    
    //public methods
  
    function log() {
  
        console.log("Match ");
        
    }

    function start() {
        
        reset();
  
        worldState.matchState = config.matchStates.matchStarted;
  
        io.emit(config.events.matchStarted, worldState);
  
    }
    
    //private methods
    
    function reset(){
        
        worldState.player1.pos = {x: 50, y: 50};
        worldState.player2.pos = {x: 100, y: 50};
        
    }
};