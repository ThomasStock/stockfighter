var dateFormat = require('dateformat');

module.exports = {

    events: {
        
        identify: "identify",
        identified: "identified",
        log: "log",
        player1Joined: "player1Joined",
        player2Joined: "player2Joined",
        matchStarting: "matchStarting",
        matchStarted: "matchStarted",
        requestEndMatch: "requestEndMatch",
        matchEnded: "matchEnded",
        matchInput: "matchInput",
        matchUpdate: "matchUpdate",
        worldUpdate: "worldUpdate"
    },
    
    identifiers: {
        
        viewer: "viewer",
        controller: "controller",
        controllerWithView: "controllerWithView"
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
    },
    
    runmodes: {
        
        waitOnPlayers : "waitOnPlayers",    //normal mode, wait for 2 players before starting game
        waitOn1Player: "waitOn1Player",     //1 player needed, other is mocked
        waitOnViewer: "waitOnViewer"        //no controls possible, go straight to the match screen
    },
    
    runmode: "waitOnPlayers",
    
    game: {
        width: 1024,
        height: 768
    },
    
    loops: {
        serverUpdateLoop: 30, // # of ms per frame for input/output processing on the server
        serverPhysicsLoop: 15, // # of ms
    },
    
    matchInputs:{
        left: "left",
        right: "right",
        jump: "jump"
    }
}