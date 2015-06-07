// Require our dependencies
var config = require('./config');
var gameloop = require('node-gameloop');

module.exports = function(io, worldState) {

    //private variables

    var serverUpdateLoop = null;
    var matchUpdate = null;

    //export object

    var match = {
        start: start,
        stop: stop,
        log: log
    };
    return match;


    //public methods

    function log() {

        console.log("Match ");

    }

    function start() {

        reset();

        worldState.matchState = config.matchStates.matchStarted;

        io.emit(config.events.matchStarted, worldState);

        //for each player
        for (var i = 0; i < 2; i++) {

            (function(playerIndex) {

                var id = worldState.players[i].id;
                var socket = io.sockets.connected[id];

                if (socket) {
                    //listen to inputs
                    socket.on(config.events.matchInput, function(matchInput) {
                        onReceivedinput(matchInput, playerIndex);
                    });
                }
                
            })(i);
        }

        // start the loop at 30 fps (1000/30ms per frame) and grab its id 
        serverUpdateLoop = gameloop.setGameLoop(serverUpdateLoopTick, 1000 / config.loops.serverUpdateLoop);

        // stop the loop 2 seconds later 
        setTimeout(function() {
            console.log('2000ms passed, stopping the game loop');
            stop();
        }, 20000);

    }

    function stop() {

        gameloop.clearGameLoop(serverUpdateLoop);
        worldState.reset(io);
    }

    //private methods

    function reset() {

        worldState.players[0].pos = {
            x: 100,
            y: 600
        };
        worldState.players[1].pos = {
            x: 924,
            y: 600
        };

        serverUpdateLoop = null;

        matchUpdate = {

            players: [],

            frameCount: 0
        };

        //for each player
        for (var i = 0; i < 2; i++) {

            matchUpdate.players[i] = {
                pos: {
                    x: worldState.players[i].pos.x,
                    y: worldState.players[i].pos.y
                }
            };

        }
    }

    function onReceivedinput(input, playerIndex) {

        config.eventHandlers.onLog("received input " + input + " for player " + playerIndex);
        worldState.players[playerIndex].matchInputs.push(input);
    }

    function serverUpdateLoopTick(delta) {

        matchUpdate.frameCount++;

        //for each player
        for (var i = 0; i < 2; i++) {

            var player = worldState.players[i];

            if (!player) return;

            var inputsToHandle = player.matchInputs.slice();
            //todo: possible lost matchinputs if there were added between the slice and the reset
            player.matchInputs = [];

            if (inputsToHandle.length > 0) {

                var input = inputsToHandle[0];

                config.eventHandlers.onLog("handling input " + input);

                switch (input) {

                    case config.matchInputs.left:

                        player.pos.x -= 10;
                        break;

                    case config.matchInputs.right:

                        player.pos.x += 10;
                        break;
                }
            }
        }

        matchUpdate.players[0].pos = worldState.players[0].pos;
        matchUpdate.players[1].pos = worldState.players[1].pos;

        io.emit(config.events.matchUpdate, matchUpdate);
    }
};
