// Require our dependencies
var config = require('./../config');
var gameloop = require('node-gameloop');

module.exports = function(io, world) {

    //private variables

    var serverUpdateLoop = null;
    var matchUpdate = null;
    var frameCount = 0;
    var previousMatchUpdate;
    var stateChanged = true; //set to true when a change to the world is done, set to false upon sending

    //export object

    var match = {
        start: start,
        stop: stop,
        log: log,
        broadcastUpdate: broadcastUpdate,
        onUpdate: onUpdate,
        onStop: null
    };
    return match;


    //public methods

    function log() {

        console.log("Match ");

    }

    function onUpdate() {

        if (stateChanged) {

            config.eventHandlers.onLog("emitting stateChanged");
            io.emit(config.events.matchUpdate, matchUpdate);

            stateChanged = false;
        }
    }

    function start() {

        reset();

        world.matchState = config.matchStates.matchStarted;
        world.broadcastUpdate();

        //for each player
        for (var i = 0; i < 2; i++) {

            (function(playerIndex) {

                if (world.players[i] == null) return;

                var id = world.players[i].id;
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

        // stop the loop 20 seconds later 
        setTimeout(function() {
            console.log('20s passed, stopping the game loop');
            stop();
        }, 600000);

    }

    function onReceivedinput(input, playerIndex) {

        // config.eventHandlers.onLog("received input " + input + " for player " + playerIndex);
        var player = world.players[playerIndex];
        if (player) {
            player.matchInputs.push(input);
            //config.eventHandlers.onLog("pushed input " + input + " for player " + playerIndex);
        }
    }

    function canMoveLeftRight(player) {

        return player.state == config.playerStates.normal;
    }

    function serverUpdateLoopTick(delta) {

        //var startTime = new Date();

        frameCount++;

        //for each player
        for (var i = 0; i < 2; i++) {

            var player = world.players[i];
            var otherPlayer = i == 0 ? world.players[1] : world.players[0];

            if (!player) {
                //config.eventHandlers.onLog("could not find player i");
                continue;
            }

            //punching is only 1 frame. Reset to normal if we were punching
            if (player.state == config.playerStates.punching) {
                player.state = config.playerStates.normal;
                stateChanged = true;
            }

            var inputsToHandle = player.matchInputs.splice(0, player.matchInputs.length);

            if (inputsToHandle.length > 0) {

                var input = inputsToHandle[0][0];

                config.eventHandlers.onLog("handling input " + input);

                switch (input) {

                    case config.matchInputs.left:

                        if (canMoveLeftRight(player)) {

                            player.viewDirection = "left";
                            player.pos.x -= 7;
                            stateChanged = true;
                        }
                        break;

                    case config.matchInputs.right:

                        if (canMoveLeftRight(player)) {

                            player.viewDirection = "right";
                            player.pos.x += 7;
                            stateChanged = true;
                        }
                        break;

                    case config.matchInputs.down:

                        if (player.state == config.playerStates.normal) {

                            player.state = config.playerStates.ducked;
                            stateChanged = true;
                        }
                        break;

                    case config.matchInputs.down_:

                        if (player.state == config.playerStates.ducked) {

                            player.state = config.playerStates.normal;
                            stateChanged = true;
                        }
                        break;

                    case config.matchInputs.punch:

                        if (canPunch(player)) {

                            player.state = config.playerStates.punching;
                            stateChanged = true;

                            if (isHit(player, otherPlayer, "punch")) {

                                otherPlayer.health -= 5;
                            }

                        }
                        break;
                }
            }
        }


        matchUpdate.players[0] = world.players[0];
        matchUpdate.players[1] = world.players[1];

        broadcastUpdate();

        //var endTime = new Date();

        //config.eventHandlers.onLog("serverUpdateLoopTick: " + (endTime.getTime() - startTime.getTime()))
    }

    function canPunch(player) {
        return player.state == config.playerStates.normal;
    }

    function isHit(player, otherPlayer, action) {

        switch (action) {
            case "punch":

                if (otherPlayer.state != config.playerStates.normal)
                    return false;
                    
                if(Math.abs(otherPlayer.pos.x - player.pos.x) < 100){
                    return true;
                }
                
                return false;

                break;
        }
    }

    function stop() {

        gameloop.clearGameLoop(serverUpdateLoop);

        world.matchState = config.matchStates.matchEnded;
        world.broadcastUpdate();

        io.emit(config.events.matchEnded);

        world.reset();
    }

    function broadcastUpdate() {

        if (onUpdate != null) {
            onUpdate();
        }
    }


    function reset() {

        frameCount = 0;
        stateChanged = true;

        world.players[0].pos = {
            x: 150,
            y: 500
        };
        world.players[0].viewDirection = "right";

        world.players[1].pos = {
            x: 724,
            y: 500
        };
        world.players[1].viewDirection = "left";
        
        //for each player
        for (var i = 0; i < 2; i++) {
            
            world.players[i].state = config.playerStates.normal;
            world.players[i].health = 100;
        }

        serverUpdateLoop = null;

        matchUpdate = {

            players: [],

            frameCount: 0
        };

        //for each player
        for (var i = 0; i < 2; i++) {

            matchUpdate.players[i] = {
                pos: {
                    x: world.players[i].pos.x,
                    y: world.players[i].pos.y
                }
            };

            matchUpdate.players[i].state = world.players[i].state;
            matchUpdate.players[i].health = world.players[i].health;

        }
    }
};
