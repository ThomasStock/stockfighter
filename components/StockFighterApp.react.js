"use strict";

var React = require('react');
var Match = require('./Match.react.js');
var InfoScreen = require('./InfoScreen.react.js');
var config = require('./../config');
var cookie = require('react-cookie');

module.exports = React.createClass({
    
    getInitialState: function() {

        return {
            playerInfo: {
               state: config.playerInfoStates.inLobby
            },
            lobby: {
                rooms: []
            }
        };
    },

    onIdentified: function(playerIndex){
        
        var newState = this.state.playerInfo;
        newState.playerIndex = playerIndex;
        newState.isIdentified = true;
        this.setState(newState);
    },
    
    // Called one, before initial rendering on the server
    componentWillMount: function(){
        
        var self = this;
        
        config.eventHandlers.onLog("initializing socket");

        socket = io.connect();
        
        var socketIdentifyData = {
            identifier: config.identifiers.player,
            playerConnectionData: {
                sessionId: "bka"
            }
        }
        
        //identify ourself to the server
        socket.emit(config.events.identify, socketIdentifyData);
        
        //when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);
        
        //event handler for general world updates
        socket.on(config.events.lobbyUpdate, function(lobby){ 
            self.setState({lobby: lobby});
        });
    },


    // Called once, after initial rendering in the browser
    componentDidMount: function() {

        
    },

    // Render the component
    render: function() {
        
        var playerInfo = this.state.playerInfo;

        
        if(playerInfo.state == config.playerInfoStates.inLobby){
            
            return (
                <div className="stockfighter">
                    <Lobby />
                </div>
            );
        }
        
        if(world.matchState == config.matchStates.matchStarted){
            
            return <Match world={world}/>
        }
        
        if(world.matchState == config.matchStates.matchStarting){
            
            return <div>Match is starting..</div>
        }

        return <div>cant render stockfighter</div>
    }

});