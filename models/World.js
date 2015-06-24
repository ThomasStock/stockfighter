var config = require('./../config');
var Player = require('./Player');
var Match = require('./Match');

module.exports = function(io) {

    var world = {

        players: [],

        viewers: [],

        matchState: config.matchStates.waitingForPlayers,

        log: log,

        reset: reset,

        assignNewPlayer: assignNewPlayer,

        canMatchStart: canMatchStart,
        
        startMatch: startMatch,
        
        onUpdate: null,
        
        broadcastUpdate: broadcastUpdate,
        
        removePlayer: removePlayer

    }

    return world;

    function log() {

        console.log("World: ");
    }

    function reset() {
        
        config.eventHandlers.onLog("resetting world");

        var self = this;

        //reset the world

        self.matchState = config.matchStates.waitingForPlayers;
        self.players = [];
        
        self.broadcastUpdate();
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

            self.players[0] = new Player(socketId, "player 1");
            return 0;
        }
        else //we need a player2..
        {
            self.players[1] = new Player(socketId, "player 2");
            return 1;
        }
    }

    function canMatchStart() {

        return this.matchState == config.matchStates.waitingForPlayers && this.players[0] != null && this.players[1] != null;
    }
    
    // set up match socket.io event listeners and start the match
    function startMatch(){
        
        var self = this;
        
        config.eventHandlers.onLog("starting match..");

        //update matchState
        self.matchState = config.matchStates.matchStarting;
        //let everyone know we can start the match
        self.broadcastUpdate();

        //initialize a new match
        var match = new Match(io, world);

        //start the match after 3 seconds
        setTimeout(function() {

            config.eventHandlers.onLog("match started!");
            match.start();
        }, 3000);
    }
    
    function broadcastUpdate(){
        
        if(this.onUpdate != null){
            this.onUpdate();
        }
    }
    
    function removePlayer(id){
        
        config.eventHandlers.onLog("removing player " + id);

        for (var i = 0; i < 2; i++) {
        
            if(this.players[i] != null && this.players[i].id == id){
                this.players[i] = null;
            }
        }
    }
};