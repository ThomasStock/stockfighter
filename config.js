var dateFormat = require('dateformat');

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
            
            var now = new Date();
            
            console.log(dateFormat(now, "isoDate") + " " + dateFormat(now, "isoTime") + ": " + data);
        }
    },
    
    matchStates: {
      
      waitingForPlayers: "waitingForPlayers",
      matchStarting: "matchStarting",
      matchStarted: "matchStarted",
      matchEnded: "matchEnded"
    },
    
    playUrl: "https://stockfighter-tstock.c9.io/play",
    
    colors: {
        
        player1Color: "FF0000",
        player2Color: "0000FF"
    }
}