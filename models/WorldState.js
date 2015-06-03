module.exports = function () {
    
    var worldState = {
        
        player1: null,
        
        player2: null,
        
        viewers: [],
        
        match: null,
        
        log: log
        
    }
    
    return worldState;
    
    function log(){
        
        console.log("Worldstate: ");
    }
};