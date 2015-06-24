var config = require('./../config');
var gameloop = require('game-loop');

//used on the client
module.exports = function(game) {

    //private variables

    var inputUpdateLoop = null;

    var controller = {

        isLeftKeyDown: false,
        isRightKeyDown: false,
        isDownKeyDown: false,
        
        commands: [],
        
        onCommand: onCommand,

        start: start,

        stop: stop,

        inputUpdateLoopTick: inputUpdateLoopTick,

        processCommands: processCommands,
        addDownKeysToCommands: addDownKeysToCommands
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

    function onCommand(context) {

        var self = this;
        
        config.eventHandlers.onLog(context.event.keyIdentifier + " justdown:" + context.justDown + " isdown:" + context.isDown + " justup:" + context.justUp + " isup:" + context.isUp)

        switch (context.keyCode) {
            case Phaser.Keyboard.DOWN:
                if(context.isDown)
                    self.commands.push(config.matchInputs.down);
                else
                    self.commands.push(config.matchInputs.down_);
                break;
            case Phaser.Keyboard.SPACEBAR:
                if(context.isDown)
                    self.commands.push(config.matchInputs.punch);
                break;
        }
    }
    
    /*
    
    function onUp(context) {

        var self = this;
        
        config.eventHandlers.onLog(context.event.keyIdentifier + " justdown:" + context.justDown + " isdown:" + context.isDown + " justup:" + context.justUp + " isup:" + context.isUp)

        switch (context.keyCode) {
            case Phaser.Keyboard.LEFT:
                self.commands.push(config.matchInputs.left_);
                break;
            case Phaser.Keyboard.RIGHT:
                self.commands.push(config.matchInputs.right_);
                break;
            case Phaser.Keyboard.DOWN:
                self.commands.push(config.matchInputs.duck_);
                break;
        }
    }
*/
    //private

    function stop() {

        clearInterval(inputUpdateLoop);
    }

    function inputUpdateLoopTick() {
        
        this.processCommands();
    }

    function processCommands() {
        
        this.addDownKeysToCommands();

        var commandCount = this.commands.length;
        if (commandCount > 0) {
            console.log("sending " + commandCount + " inputs: " + this.commands[0]);
            socket.emit(config.events.matchInput, this.commands);
            this.commands = [];
        }

    }
    
    function addDownKeysToCommands(){
        
        if(this.isDownKeyDown) this.commands.push(config.matchInputs.down);
        if(this.isRightKeyDown) this.commands.push(config.matchInputs.right);
        if(this.isLeftKeyDown) this.commands.push(config.matchInputs.left);
    }
};