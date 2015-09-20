"use strict";

var React = require("react");
/*var Match = require("./Match.react.js");
var InfoScreen = require("./InfoScreen.react.js");*/
var Lobby = require("./Lobby.react");
var config = require("./../config");
var cookie = require("react-cookie");

module.exports = React.createClass({

    getInitialState: function () {

        return {
            playerInfo: {
                state: config.playerInfoStates.connecting,
                name: cookie.load("playerName"),
                id: cookie.load("playerId")
            },
            lobby: {
                games: [],
                players: []
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
        var playerInfo = this.state.playerInfo;
        playerInfo.name = name;
        this.setState({
            playerInfo: playerInfo
        });
        cookie.save("playerName", name);
        this.setState({
            isChoosingName: false
        });
    },
    
    setId: function (id) {
        var playerInfo = this.state.playerInfo;
        playerInfo.id = id;
        this.setState({
            playerInfo: playerInfo
        });
        cookie.save("playerId", id);
    },

    // Called one, before initial rendering on the server
    componentWillMount: function () {

        var self = this;

        config.eventHandlers.onLog("initializing socket");

        window.socket = io.connect();

        //event handler for general world updates
        socket.on("connect", function () {

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
                    name: self.state.playerInfo.name,
                    id: self.state.playerInfo.id
                }
            };

            config.eventHandlers.onLog("identifying player");

            //identify ourself to the server
            socket.emit(config.events.identify, socketIdentifyData);

            //when the server asks us to log something
            socket.on(config.events.log, config.eventHandlers.onLog);

            //when the server tells us we have identified
            socket.on(config.events.identified, function (args) {
                config.eventHandlers.onLog("identified!");
                self.setName(args.name);
                self.setId(args.id);
                self.state.playerInfo.state = config.playerInfoStates.inLobby;
                self.setState({
                    playerInfo: self.state.playerInfo
                });
            });

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

        var playerInfoDivContent;
        switch (playerInfo.state) {
            case config.playerInfoStates.connecting:
                playerInfoDivContent = <div className="playerInfo">Connecting...</div>;
                break;
            case config.playerInfoStates.identifying:
                playerInfoDivContent = <div className="playerInfo">Identifying...</div>;
                break;
            case config.playerInfoStates.inLobby:
                playerInfoDivContent = <div className="playerInfo">{playerInfo.name} ({playerInfo.id}) <a href="#" onClick={this.resetName}>change name</a></div>;
                break;
            default:
                playerInfoDivContent = "error: dont know how to render infostate " + playerInfo.state;
        }
        
        var mainDivContent = function() {
            switch(playerInfo.state){
                case config.playerInfoStates.inLobby:
                    return <Lobby {...state.lobby} />;
                default:
                    return "";
            }
        };

        return (
            <div id="stockfighter-player">
                <div id="player-info">
                    {playerInfoDivContent}
                </div>
                <div id="main">{mainDivContent()}</div>
            </div>
        );

        /*
        if (!state.isChoosingName) {
            <div className="ask-name-form">
                <form onSubmit={this.handleNameSubmit}>
                    <span>Please enter your name</span>
                    <input type="text" ref="nameInput" />
                    <button>Enter lobby</button>
                </form>
            </div>
        }*/


    }
});
