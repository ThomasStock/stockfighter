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
                state: config.playerInfoStates.connecting,
                name: cookie.load("playerName")
            },
            lobby: {
                rooms: []
            },
            isChoosingName: false
        };
    },

    handleResetName: function (e) {
        e.preventDefault();

        this.resetName();
    },
    resetName: function () {
        cookie.remove("playerName");
        this.setState({
            playerInfo: {
                name: undefined
            }
        });
        this.setState({
            isChoosingName: true
        });
    },

    handleNameSubmit: function (e) {
        e.preventDefault();

        //entered in the input field
        var newName = this.refs.nameInput.getDOMNode().value;

        this.setName(newName);

    },
    setName: function (name) {
        this.setState({
            playerInfo: {
                name: name
            }
        });
        cookie.save("playerName", name);
        this.setState({
            isChoosingName: false
        });
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
                    state: config.playerInfoStates.identifying
                }
            });

            //identify ourself to the server

            var socketIdentifyData = {
                identifier: config.identifiers.player,
                playerConnectionData: {
                    name: this.state.playerInfo.name
                }
            };

            //identify ourself to the server
            socket.emit(config.events.identify, socketIdentifyData);

            //when the server asks us to log something
            socket.on(config.events.log, config.eventHandlers.onLog);

            //when the server tells us we have identified
            socket.on(config.events.identified, function (args) {
                self.setName(args.name);
            });

/*            //when the server tells us we have succesfully joined the lobby
            socket.on(config.events.playerStateChanged, function (newState) {
                self.setState({
                    playerInfo: {
                        state: newState
                    }
                });
            });
*/
            //event handler for lobby updates
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

        var state = this.state;
        var playerInfo = state.playerInfo;

        if (state.isChoosingName) {
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
