"use strict";

var dateFormat = require("dateformat");

module.exports = {

    events: {
        identify: "identify",
        identified: "identified",
        log: "log",
        matchStarting: "matchStarting",
        matchStarted: "matchStarted",
        requestEndMatch: "requestEndMatch",
        matchEnded: "matchEnded",
        matchInput: "matchInput",
        matchUpdate: "matchUpdate",
        lobbyUpdate: "lobbyUpdate",
        playerStateChanged: "playerStateChanged",
        createGame: "createGame",
        gameCreated: "gameCreated"
    },
    identifiers: {
        player: "player"
    },
    eventHandlers: {
        onLog: function (data) {
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
    playerInfoStates: {
        notConnected: "notConnected",
        connecting: "connecting",
        identifying: "identifying",
        inLobby: "inLobby"
    },
    playUrl: "https://stockfighter-tstock.c9.io/play",
    colors: {
        player1Color: "FF0000",
        player2Color: "0000FF"
    },
    runmodes: {
        waitOnPlayers: "waitOnPlayers", //normal mode, wait for 2 players before starting game
        waitOn1Player: "waitOn1Player", //1 player needed, other is mocked
        waitOnViewer: "waitOnViewer" //no controls possible, go straight to the match screen
    },
    modes: {
        singlePlayer: "singlePlayer"
    },
    runmode: "waitOnPlayers",
    game: {
        width: 1024,
        height: 768
    },
    loops: {
        serverUpdateLoop: 30, // # of ms per frame for input/output processing on the server
        serverPhysicsLoop: 15, // # of ms
        inputUpdateLoop: 30
    },
    matchInputs: {
        left: "left",
        left_: "left_", //keyup
        right: "right",
        right_: "right_", //keyup
        up: "up",
        down: "down",
        down_: "down_", //keyup
        punch: "punch"
    },
    playerStates: {
        normal: "normal",
        ducked: "ducked",
        jumping: "jumping",
        punching: "punching"
    }
};
