config = require('./../config');
    
module.exports = function () {
    
    var worldState = {
        
        player1: null,
        
        player2: null,
        
        viewers: [],
        
        matchState: config.matchStates.waitingForPlayers,
        
        log: log
        
    }
    
    return worldState;
    
    function log(){
        
        console.log("Worldstate: ");
    }
};