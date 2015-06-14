var config = require('./../config');
var gameloop = require('game-loop');

//used on the client
module.exports = function() {

    //private variables

    var inputUpdateLoop = null;

    var controller = {

        addCommand: addCommand,

        commands: [],

        start: start,

        stop: stop,

        inputUpdateLoopTick: inputUpdateLoopTick,

        processCommands: processCommands
    }


    return controller;

    //public

    function start() {

        inputUpdateLoop = setInterval(
            (function(self) {
                return function() {
                    self.inputUpdateLoopTick();
                }
            })(this), 1000 / config.loops.inputUpdateLoop); // 33 milliseconds = ~ 30 frames per sec

    }

    function addCommand(context) {

        var self = this;

        switch (context.keyCode) {
            case Phaser.Keyboard.LEFT:
                self.commands.push(config.matchInputs.left);
                break;
            case Phaser.Keyboard.RIGHT:
                self.commands.push(config.matchInputs.right);
                break;
            case Phaser.Keyboard.UP:
                self.commands.push(config.matchInputs.jump);
                break;
            case Phaser.Keyboard.DOWN:
                self.commands.push(config.matchInputs.duck);
                break;
        }
    }

    //private

    function stop() {

        clearInterval(inputUpdateLoop);
    }

    function inputUpdateLoopTick() {

        this.processCommands();
    }

    function processCommands() {

        var commandCount = this.commands.length;
        if (commandCount > 0) {
            console.log("sending " + commandCount + " inputs: " + this.commands[0]);
            socket.emit(config.events.matchInput, this.commands);
            this.commands = [];
        }

    }
};