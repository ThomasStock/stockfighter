"use strict";

var config = require("./../config");
var _ = require("underscore");

var io;
var state = {};
var players = [];

function updateState(){
    
    function getGameState(game)
    {
        return game.state;
    }
    
    state.games = _.map(games, getGameState);
}

function initialize(ioToSet){
    
    io = ioToSet;
    
    updateState();
}

module.exports = {
    initialize: initialize,
    state: state
};
