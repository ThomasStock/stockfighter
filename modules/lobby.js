"use strict";

var config = require("./../config");
var _ = require("underscore");

var games = [];
var players = [];


function getState() {

    var state = {};

    function getGameState(game) {
        return game.state;
    }

    state.games = _.map(games, getGameState);

    return state;
}

function pushState() {

    var state = getState();

    //todo: push state

}

function isPlayerNameAvailable(name) {

    var isNameAlreadyUsed = _.any(players, function (player) {
        return player.name === name;
    });
    
    return !isNameAlreadyUsed;
}

function handlePlayerConnect(socket, playerConnectionData) {

    var playerName = playerConnectionData.name;
    if (!playerName){
        
    }else{
        if(!isPlayerNameAvailable(name)){
            return true;
            
            
        }
    }

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

}

module.exports = {
    initialize: initialize,
    getState: getState
};
