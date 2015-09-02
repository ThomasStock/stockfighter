"use strict";

var config = require("./../config");
var _ = require("underscore");
var Player = require("./player");

var games = [];
var players = [];
var io;


function getState() {

    var state = {};

    function getGameState(game) {
        return game.state;
    }
    
    function getPlayerState(player) {
        return {
            name: player.name,
            state: player.state
        };
    }

    state.games = _.map(games, getGameState);
    state.players = _.map(players, getPlayerState);

    return state;
}

function broadcastLobbyUpdate(){
    
    var lobbyState = getState();
    io.emit(config.events.lobbyUpdate, lobbyState);
}

function isPlayerNameAvailable(name) {

    var isNameAlreadyUsed = _.any(players, function (player) {
        return player.name === name;
    });

    return !isNameAlreadyUsed;
}

function getUniqueName(name) {

    if (!name) {
        //assign name Freshmeat (N) if no name was supplied
        name = "Freshmeat";
    }

    var rootName = name;

    if (!isPlayerNameAvailable(name)) {
        var i = 1;
        do {
            name = rootName + " (" + i + ")";
            i++;
        } while (!isPlayerNameAvailable(name));
    }

    return name;
}

function handlePlayerIdentify(socket, playerConnectionData) {

    var playerName = playerConnectionData.name;
    playerName = getUniqueName(playerName);

    var player = new Player();
    player.socket = socket;
    player.state = config.playerInfoStates.inLobby;
    player.name = playerName;
    players.push(player);

    var infoForClient = {
        name: player.name,
        state: player.state
    };

    socket.emit(config.events.identified, infoForClient);
    
    broadcastLobbyUpdate();
}

function handleSocketIdentify(socket, socketIdentifyData) {

    //check which type of client connected
    switch (socketIdentifyData.identifier) {
    case config.identifiers.player:
        handlePlayerIdentify(socket, socketIdentifyData.playerConnectionData);
        break;
    }

}

function listenForConnections(ioServer) {

    io = ioServer;

    //when anyone connects to socket.io, set up some event listeners for that socket
    io.on("connection", function (socket) {

        //when the socket emits an idenity event..
        socket.on(config.events.identify, function (data) {
            handleSocketIdentify(socket, data);
        });
    });
}

function reset() {

    games = [];
    players = [];
}

module.exports = {

    get players() {
        return players;
    },
    set players(value) {
        players = value;
    },

    get io() {
        return io;
    },
    set io(value) {
        io = value;
    },

    reset: reset,

    listenForConnections: listenForConnections
};
