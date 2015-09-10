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

function broadcastLobbyUpdate() {

    var lobbyState = getState();
    io.emit(config.events.lobbyUpdate, lobbyState);
}

function isPlayerNameAvailable(name) {

    var isNameAlreadyUsed = _.any(players, function (player) {
        return player.name === name;
    });

    return !isNameAlreadyUsed;
}

function handlePlayerIdentify(socket, playerConnectionData) {

    function getRandomName() {
        var firstParts = ["Amazing", "Fluffy", "Super", "Derpy", "Glorious", "Horny", "Smelly", "Inflatable", "Much"];
        var secondParts = ["Cat", "Doge", "Wow", "Nerd", "Armpit", "Derp", "Jackass", "Plant", "Spider", "Scorpion", "Headbanger", "Dildo", "Athlete", "Memer", "CamGirl"];

        var firstRandom = firstParts[Math.floor(Math.random() * firstParts.length)];
        var secondRandom = secondParts[Math.floor(Math.random() * secondParts.length)];

        return firstRandom + " " + secondRandom;
    }

    function createGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function getPlayerById(id) {
        var player = _.find(players, function (player) {
            return player.id == id;
        });
        return player;
    }

    var playerName = playerConnectionData.name;
    if (!playerName) {
        playerName = getRandomName();
    }

    var playerId = playerConnectionData.id;
    if (!playerId) {
        playerId = createGuid();
    }

    var player = getPlayerById(playerId);
    if (!player) {
        //player with that ID never played before
        player = new Player();
        players.push(player);
    }
    player.socket = socket;
    player.state = config.playerInfoStates.inLobby;
    player.name = playerName;
    player.id = playerId;

    var infoForClient = {
        id: player.id,
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

        socket.on('disconnect', function () {

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
