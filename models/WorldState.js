var config = require('./../config');
var Player = require('./Player');

module.exports = function() {

    var worldState = {

        players: [],

        viewers: [],

        matchState: config.matchStates.waitingForPlayers,

        log: log,

        reset: reset,

        assignNewPlayer: assignNewPlayer,

        canMatchStart: canMatchStart,
        
        onStateUpdate: null,
        
        broadcastUpdate: broadcastUpdate

    }

    return worldState;

    function log() {

        console.log("WorldState: ");
    }

    function reset(io) {

        var self = this;

        //reset the worldState

        self.matchState = config.matchStates.waitingForPlayers;
        self.players = [];

        io.emit(config.events.matchEnded, self);
    }

    //returns the player index or null of game is full
    function assignNewPlayer(socketId) {

        var self = this;

        //if the world needs no more players..
        if (self.players[0] != null && self.players[1] != null) {
            return null;
        }

        //if we need a player1..
        if (self.players[0] == null) {

            self.players[0] = new Player(id, "player 1");
            return 0;
        }
        else //we need a player2..
        {
            self.players[1] = new Player(id, "player 2");
            return 1;
        }
    }

    function canMatchStart() {

        return matchState == config.matchStates.waitingForPlayers && players[0] != null && players[1] != null;
    }
    
    // set up match socket.io event listeners and start the match
    function startMatch(io){
        
        var self = this;
        
        config.eventHandlers.onLog("starting match..");

        //update matchState
        self.matchState = config.matchStates.matchStarting;
        io.emit(config.events.worldStateUpdate, self);

        //let everyone know we can start the match
        io.emit(config.events.matchStarting, worldState);

        //initialize a new match
        var match = new Match(io, worldState);

        //start the match after 3 seconds
        setTimeout(function() {

            //some temp stuff
            worldState.players[0].name = "Player1";
            worldState.players[1].name = "Player2";
            worldState.players[0].color = config.colors.player1Color;
            worldState.players[1].color = config.colors.player2Color;

            config.eventHandlers.onLog("match started!");
            match.start();
        }, 1000);
    }
    
    function broadcastUpdate(){
        
        if(this.onStateUpdate != null){
            this.onStateUpdate(worldState);
        }
    }
};