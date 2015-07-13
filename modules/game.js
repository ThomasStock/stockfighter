"use strict";

var config = require("./../config");
var _ = require("underscore");

var state = {};
var players = [];

function updateState(){
    
    function getPlayerState(player)
    {
        return player.state;
    }
    
    state.players = _.map(players, getPlayerState);
}

function initialize(){
    
    updateState();
}

module.exports = {
    initialize: initialize,
    state: state
};
