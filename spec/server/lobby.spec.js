"use strict";

describe("lobby:", function () {

    var port = process.env.PORT || 8080;
    var io = require("socket.io-client");
    var app = require("express")();
    var http = require("http");
    var ioServer;
    var lobby = require("../../server/lobby");
    var config = require("../../config");
    var enableDestroy = require("server-destroy");
    var httpServer;
    var socket;

    function getAnotherSocket(done) {

        var anotherSocket = io.connect("http://localhost:" + port, {
            "reconnection delay": 0,
            "reopen delay": 0,
            "force new connection": true
        });
        anotherSocket.on("connect", function () {
            done(anotherSocket);
        });
    }

    function getSocketIdentifyData(name) {
        var socketIdentifyData = {
            identifier: config.identifiers.player,
            playerConnectionData: {
                name: name
            }
        };
        return socketIdentifyData;
    }

    beforeEach(function (done) {

        httpServer = http.createServer(app).listen(port, function () {

            ioServer = require("socket.io")(httpServer);

            lobby.listenForConnections(ioServer);

            socket = io.connect("http://localhost:" + port, {
                "reconnection delay": 0,
                "reopen delay": 0,
                "force new connection": true
            });
            socket.on("connect", function () {
                done();
            });
        });

        enableDestroy(httpServer);
    });

    afterEach(function (done) {

        if (socket.connected) {
            socket.disconnect();
        }

        lobby.reset();

        httpServer.destroy();

        done();
    });

    describe("when a player identifies:", function () {

        it("sends identified event back to client with the selected name", function (done) {

            socket.on(config.events.identified, function (args) {
                expect(args.id).not.toBeNull();
                expect(args.name).toBe("foo");
                expect(args.state).toBe(config.playerInfoStates.inLobby);
                done();
            });
            
            socket.emit(config.events.identify, getSocketIdentifyData("foo"));
        });

        it("sends lobby state to every connected player", function (done) {

            var isFirstUpdate = true;

            socket.on(config.events.lobbyUpdate, function (args) {

                expect(args.players[0].name).toBe("foo");
                expect(args.players[0].state).toBe(config.playerInfoStates.inLobby);

                if (!isFirstUpdate) {
                    expect(args.players[1].name).toBe("bar");
                    expect(args.players[1].state).toBe(config.playerInfoStates.inLobby);
                    done();
                }
                isFirstUpdate = false;
            });

            socket.emit(config.events.identify, getSocketIdentifyData("foo"));

            getAnotherSocket(function (anotherSocket) {
                anotherSocket.emit(config.events.identify, getSocketIdentifyData("bar"));
            });
        });

        it("assignes a random name when the player is unnamed", function (done) {

            socket.on(config.events.identified, function (args) {
                expect(args.name).not.toBeNull();
                expect(args.name).not.toBeUndefined();
                expect(args.state).toBe(config.playerInfoStates.inLobby);
                done();
            });

            socket.emit(config.events.identify, getSocketIdentifyData(undefined));
        });

    });
    
/*    xdescribe("when a player creates a match", function () {

        it("sends gameCreated event back to client", function (done) {

            var expectedInfoForClient = {
                name: socketIdentifyData.playerConnectionData.name,
                state: config.playerInfoStates.inLobby
            };

            socket.on(config.events.identified, function (args) {
                expect(args.name).toBe(expectedInfoForClient.name);
                expect(args.state).toBe(expectedInfoForClient.state);
                done();
            });

            socket.emit(config.events.identify, socketIdentifyData);
        });

    })*/
});
