"use strict";

var React = require("react");
/*var Match = require("./Match.react.js");
var InfoScreen = require("./InfoScreen.react.js");*/
var config = require("./../config");
var cookie = require("react-cookie");

module.exports = React.createClass({

    getInitialState: function () {

        return {
            playerInfo: {
                state: config.playerInfoStates.notConnected,
                name: cookie.load("playerName")
            },
            lobby: {
                rooms: []
            }
        };
    },

    resetName: function (e) {
        e.preventDefault();

        cookie.remove("playerName");
        
        this.setState({
            playerInfo: {
                name: undefined
            }
        });
    },

    handleNameSubmit: function (e) {
        e.preventDefault();

        //entered in the input field
        var newName = this.refs.nameInput.getDOMNode().value;

        this.setState({
            playerInfo: {
                name: newName
            }
        });
        cookie.save("playerName", newName);
    },

    onIdentified: function (playerIndex) {

        var newState = this.state.playerInfo;
        newState.playerIndex = playerIndex;
        newState.isIdentified = true;
        this.setState(newState);
    },

    // Called one, before initial rendering on the server
    componentWillMount: function () {

        var self = this;

        config.eventHandlers.onLog("initializing socket");

        window.socket = io.connect();

        //event handler for general world updates
        socket.on("connection", function () {

            //tell self we are connected
            self.setState({
                playerInfo: {
                    state: config.playerInfoStates.connected
                }
            });

            //idenitify ourself to the server

            var socketIdentifyData = {
                identifier: config.identifiers.player,
                playerConnectionData: {
                    sessionId: "bka"
                }
            };

            //identify ourself to the server
            socket.emit(config.events.identify, socketIdentifyData);

            //when the server asks us to log something
            socket.on(config.events.log, config.eventHandlers.onLog);

            //event handler for general world updates
            socket.on(config.events.lobbyUpdate, function (lobby) {
                self.setState({
                    lobby: lobby
                });
            });
        });
    },


    // Called once, after initial rendering in the browser
    componentDidMount: function () {


    },

    // Render the component
    render: function () {

        var playerInfo = this.state.playerInfo;

        if (!playerInfo.name) {
            return (
                <div className="ask-name-form">
                    <form onSubmit={this.handleNameSubmit}>
                        <span>Please enter your name</span>
                        <input type="text" ref="nameInput" />
                        <button>Enter lobby</button>
                    </form>
                </div>
            );
        }

        if (playerInfo.state === config.playerInfoStates.inLobby) {

            return (
                <div className="stockfighter">
                    <Lobby />
                </div>
            );
        }


        return <div>stockfighter didnt know what view to render. {playerInfo.name} <a href="#" onClick={this.resetName}>change name</a></div>;
    }
});
