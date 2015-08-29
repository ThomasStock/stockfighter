"use strict";

describe("lobby:", function () {

    var rewire = require("rewire");
    var lobby = rewire("../modules/lobby");
    var config = require("../config");
    var socket;
    var foobarPlayers;

    var handlePlayerIdentify;
    var isPlayerNameAvailable;

    beforeEach(function () {

        lobby.reset();

        handlePlayerIdentify = lobby.__get__("handlePlayerIdentify");
        isPlayerNameAvailable = lobby.__get__("isPlayerNameAvailable");

        socket = {
            emit: function () {},
            id: 123
        };
        spyOn(socket, "emit");

        foobarPlayers = [{
            name: "foo"
        }, {
            name: "bar"
        }];
    });

    it("should be able to find out if a name is already in use", function () {

        lobby.players = foobarPlayers;

        expect(isPlayerNameAvailable("foo")).toBe(false);
        expect(isPlayerNameAvailable("baz")).toBe(true);
    });

    describe("when a player identifies", function () {

        it("with a unique name it should be added with his identification data and the client shoudl be notified.", function () {

            var playerConnectionData = {
                name: "baz"
            };
            
            var expectedIdentifiedEventArg = {
                name: "baz",
                state: "inLobby"
            }


            handlePlayerIdentify(socket, playerConnectionData);
            
            expect(lobby.players[0].socket.id).toBe(123);
            expect(lobby.players[0].state).toBe(config.playerInfoStates.inLobby);
            expect(lobby.players[0].name).toBe("baz");
            expect(socket.emit).toHaveBeenCalledWith(config.events.identified, expectedIdentifiedEventArg);
        });

        it("should give the player name freshmeat (N) if the name is undefined, and tell the client", function () {

            var playerConnectionData = {};

            handlePlayerIdentify(socket, playerConnectionData);
            handlePlayerIdentify(socket, playerConnectionData);
            handlePlayerIdentify(socket, playerConnectionData);

            expect(lobby.players[0].name).toBe("Freshmeat");
            expect(lobby.players[1].name).toBe("Freshmeat (1)");
            expect(lobby.players[2].name).toBe("Freshmeat (2)");
            expect(socket.emit.calls.argsFor(0)[1].name).toBe("Freshmeat");
            expect(socket.emit.calls.argsFor(1)[1].name).toBe("Freshmeat (1)");
            expect(socket.emit.calls.argsFor(2)[1].name).toBe("Freshmeat (2)");


        });

        it("should give the player name requestedName (N) if the name was in use, and tell the client", function () {

            lobby.players = foobarPlayers;

            var playerConnectionData = {
                name: "foo"
            };

            handlePlayerIdentify(socket, playerConnectionData);

            expect(lobby.players[2].name).toBe("foo (1)");
            expect(socket.emit.calls.mostRecent().args[1].name).toBe("foo (1)");

        });
    });
});
