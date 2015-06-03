module.exports = function (id) {
    
    var player = {
        
        id: id,
        
        log: log
        
    }
    
    return player;
    
    function log(){
        

        console.log("Player " + id);
    }
};