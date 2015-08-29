"use strict";

describe("lobby:", function () {

    var port = process.env.PORT || 8080;
    var io = require("socket.io-client");
    var app = require("express")();
    var http = require("http");
    var ioServer;
    var lobby = require("../modules/lobby");
    var config = require("../config");
    var enableDestroy = require("server-destroy");
    var httpServer;
    var socket;

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

        it("sends identified back event", function (done) {

            var socketIdentifyData = {
                identifier: config.identifiers.player,
                playerConnectionData: {
                    name: "foo"
                }
            };

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

        it("sends lobby state back", function (done) {

            var socketIdentifyData = {
                identifier: config.identifiers.player,
                playerConnectionData: {
                    name: "foo"
                }
            };
            
            socket.on(config.events.lobbyUpdate, function (args) {
                expect(args.players[0].name).toBe("foo");
                done();
            });

            socket.emit(config.events.identify, socketIdentifyData);
        });

        it("assignes name Freshmeat when the player is unnamed", function (done) {

            var socketIdentifyData = {
                identifier: config.identifiers.player,
                playerConnectionData: {
                    name: undefined
                }
            };

            var expectedInfoForClient = {
                name: "Freshmeat",
                state: config.playerInfoStates.inLobby
            };

            socket.on(config.events.identified, function (args) {
                expect(args.name).toBe(expectedInfoForClient.name);
                expect(args.state).toBe(expectedInfoForClient.state);
                done();
            });

            socket.emit(config.events.identify, socketIdentifyData);
        });

        it("adds an (N) to the name if it is already in use", function (done) {

            lobby.players = [{
                name: "foo"
            }, {
                name: "bar"
            }];

            var socketIdentifyData = {
                identifier: config.identifiers.player,
                playerConnectionData: {
                    name: "foo"
                }
            };

            var expectedInfoForClient = {
                name: "foo (1)",
                state: config.playerInfoStates.inLobby
            };

            socket.on(config.events.identified, function (args) {
                expect(args.name).toBe(expectedInfoForClient.name);
                expect(args.state).toBe(expectedInfoForClient.state);
                done();
            });

            socket.emit(config.events.identify, socketIdentifyData);
        });
    });
});
