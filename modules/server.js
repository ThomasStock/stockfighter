"use strict";

var config = require("./../config");
var _ = require("underscore");

var state = {};
var games = [];

function updateState(){
    
    function getGameState(game)
    {
        return game.state;
    }
    
    state.games = _.map(games, getGameState);
}

function initialize(){
    
    updateState();
}

module.exports = {
    initialize: initialize,
    state: state
};
