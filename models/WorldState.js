config = require('./../config');

module.exports = function() {

    var worldState = {

        players: [],

        viewers: [],

        matchState: config.matchStates.waitingForPlayers,

        log: log,

        reset: reset

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
};