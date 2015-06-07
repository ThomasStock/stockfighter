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
        log: log

    }

    return match;


    //public methods

    function log() {

        console.log("Match ");

    }

    function start() {
        
        io.emit(config.events.matchUpdate, {frameCount: 0});

        reset();

        worldState.matchState = config.matchStates.matchStarted;

        io.emit(config.events.matchStarted, worldState);

        // start the loop at 30 fps (1000/30ms per frame) and grab its id 
        serverUpdateLoop = gameloop.setGameLoop(serverUpdateLoopTick, 1000 / config.loops.serverUpdateLoop);

        // stop the loop 2 seconds later 
        setTimeout(function() {
            console.log('2000ms passed, stopping the game loop');
            gameloop.clearGameLoop(serverUpdateLoop);
            stop();
        }, 5000);

    }

    function stop() {

        worldState.matchState = config.matchStates.matchEnded;

        io.emit(config.events.matchEnded, worldState);
    }

    //private methods

    function reset() {

        worldState.player1.pos = {
            x: 100,
            y: 600
        };
        worldState.player2.pos = {
            x: 924,
            y: 600
        };

        serverUpdateLoop = null;
        
        matchUpdate = {
            
            player1: {
                pos: {
                    x: null,
                    y: null
                }
            },
            
            player2: {
                pos: {
                    x: null,
                    y: null
                }
            },
            
            frameCount: 0
        };

    }

    function serverUpdateLoopTick(delta) {
        
        matchUpdate.frameCount++;

        worldState.player1.pos.x++;
        worldState.player2.pos.x--;
        
        matchUpdate.player1.pos = worldState.player1.pos;
        matchUpdate.player2.pos = worldState.player2.pos;

        io.emit(config.events.matchUpdate, matchUpdate);
        config.eventHandlers.onLog("sending matchupdate frame " + matchUpdate.frameCount);
    }
};
