"use strict";

var config = require("./../config");
var _ = require("underscore");

var games = [];
var players = [];

function pushState() {
    
    var state = {};

    function getGameState(game) {
        return game.state;
    }

    state.games = _.map(games, getGameState);
}

function handlePlayerConnect(socket, playerConnectionData) {

    
}

function handleSocketIdentify(socket, socketIdentifyData) {

    //check which type of client connected
    switch (socketIdentifyData.identifier) {
    case config.identifiers.player:
        handlePlayerConnect(socketIdentifyData.playerConnectionData);
        break;
    }

}

function listenForConnections() {

    //when anyone connects to socket.io, set up some event listeners for that socket
    io.on("connection", function (socket) {

        //when the socket emits an idenity event..
        socket.on(config.events.identify, function (data) {
            handleSocketIdentify(socket, data);
        });
    });
}

function initialize() {

    listenForConnections();

    updateState();
}

module.exports = {
    initialize: initialize,
    state: state
};
