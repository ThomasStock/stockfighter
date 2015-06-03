module.exports = {

    events: {
        
        identify: "identify",
        log: "log",
        player1Joined: "player1Joined",
        player2Joined: "player2Joined",
        noMorePlayersNeeded: "noMorePlayersNeeded",
        matchStarting: "matchStarting",
        acceptedAsPlayer: "acceptedAsPlayer"
    },
    
    identifiers: {
        
        viewer: "viewer",
        controller: "controller",
        server: "server"
    },
    
    eventHandlers: {
        
        onLog: function(data){
            
            console.log(data);
        }
    }
}