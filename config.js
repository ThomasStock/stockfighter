module.exports = {

    events: {
        
        identify: "identify",
        log: "log",
        player1Joined: "player1Joined",
        player2Joined: "player2Joined",
        noMorePlayersNeeded: "noMorePlayersNeeded",
        acceptedAsPlayer: "acceptedAsPlayer",
        matchStarting: "matchStarting",
        matchStarted: "matchStarted",
        requestEndMatch: "requestEndMatch",
        matchEnded: "matchEnded",
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
    },
    
    matchStates: {
      
      waitingForPlayers: "waitingForPlayers",
      matchStarting: "matchStarting",
      matchStarted: "matchStarted",
      matchEnded: "matchEnded"
    },
    
    playUrl: "https://stockfighter-tstock.c9.io/play"
}