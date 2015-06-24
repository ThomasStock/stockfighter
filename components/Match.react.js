var React = require('react'),
    config = require('./../config'),
    Controller = require('./../models/Controller');

module.exports = Match = React.createClass({

    game: null, //Phaser.Game
    matchUpdate: null, //object contains the latest information received from the server
    sprites: {}, //container for sprites that must be updated
    texts: {}, //container for game texts that must be updated


    getSize: function() {
        return document.getElementById('surface').getBoundingClientRect();
    },
    
    translatePlayerState: function(state){
        
        switch(state){
            
            case config.playerStates.ducked:
                return "duck";
            case config.playerStates.punching:
                return "punch";
            default: return "1";
        }
    },

    preload: function() {

        var self = this;
        var game = self.game;

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.atlasJSONHash('dude', 'assets/dude.png', "assets/dude.json");

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.windowConstraints = {
            "right": "layout",
            "bottom": "layout"
        };
    },

    create: function() {

        var self = this;
        var game = self.game;
        var sprites = self.sprites;
        var texts = self.texts;
        var props = self.props;
        
        //set up environment

        var sky = game.add.sprite(0, 0, 'sky');
        sky.width = game.world.width;
        sky.height = game.world.height;

        var ground = game.add.sprite(0, game.world.height - 120, 'ground');
        ground.height = 120;
        ground.width = game.world.width;
        
        var player1HealthText = game.add.text(50, 50, "player 1 health:");
        texts.player1HealthValue = game.add.text(50, 100, "100%");
        
        var player2HealthText = game.add.text(game.world.width - 270, 50, "player 2 health:");
        texts.player2HealthValue = game.add.text(game.world.width - 140, 100, "100%");
        
        //setup players

        sprites.player1 = game.add.sprite(props.world.players[0].pos.x, props.world.players[0].pos.y, 'dude');
        sprites.player1.frameName = "1";
        sprites.player1.anchor.setTo(.5, 0); //so it flips around its middle

        sprites.player2 = game.add.sprite(props.world.players[1].pos.x, props.world.players[1].pos.y, 'dude');
        sprites.player2.frameName = "1";
        sprites.player2.anchor.setTo(.5, 0); //so it flips around its middle
        sprites.player2.scale.x *= -1;
        
        //setup inputs
        
        var controller = new Controller();
        var keyboard = game.input.keyboard;
        
        var cursorKeys = keyboard.createCursorKeys();
        
        //send jump command
        cursorKeys.up.onDown.add(controller.onCommand, controller);
        
        //send duck command
        cursorKeys.down.onDown.add(controller.onCommand, controller);
        
        //send duck_ command
        cursorKeys.down.onUp.add(controller.onCommand, controller);
        
        
        cursorKeys.left.onDown.add(function(){ controller.isLeftKeyDown = true; });
        cursorKeys.right.onDown.add(function(){ controller.isRightKeyDown = true; });

        
        cursorKeys.left.onUp.add(function(){ controller.isLeftKeyDown = false; });
        cursorKeys.right.onUp.add(function(){ controller.isRightKeyDown = false; });

        //send punch command
        var spaceKey = keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(controller.onCommand, controller);

        
        //start sending commands to the server
        controller.start();

    },

    //phaser main game loop tick
    update: function() {
        
        //console.log("in update");

        if (this.matchUpdate != null) {
            
            config.eventHandlers.onLog("handling matchUpdate " + this.matchUpdate.players[0].pos.x)
            
            var sprites = this.sprites;
            var texts = this.texts;
            var data = this.matchUpdate;

            sprites.player1.x = data.players[0].pos.x;
            sprites.player1.y = data.players[0].pos.y;
            sprites.player1.frameName = this.translatePlayerState(data.players[0].state);
            texts.player1HealthValue.text = data.players[0].health + " %";

            if(data.players[0].viewDirection == "left" && sprites.player1.scale.x > 0) sprites.player1.scale.x *= -1;
            else  if(data.players[0].viewDirection == "right" && sprites.player1.scale.x < 0) sprites.player1.scale.x *= -1;

            sprites.player2.x = data.players[1].pos.x;
            sprites.player2.y = data.players[1].pos.y;
            sprites.player2.frameName = this.translatePlayerState(data.players[1].state);
            texts.player2HealthValue.text = data.players[1].health + " %";

            if(data.players[1].viewDirection == "left" && sprites.player2.scale.x > 0) sprites.player2.scale.x *= -1;
            else  if(data.players[1].viewDirection == "right" && sprites.player2.scale.x < 0) sprites.player2.scale.x *= -1;

            data = null;
        }
    },

    componentDidMount: function() {

        var self = this;

        //initilize the HTML5 game engine Phaser
        self.game = new Phaser.Game(config.game.width, config.game.height, Phaser.AUTO, 'surface', {
            preload: self.preload,
            create: self.create,
            update: self.update
        });

        config.eventHandlers.onLog("start listening to matchUpdate events");

        //start listening to update events
        socket.on(config.events.matchUpdate, self.onMatchUpdateReceived)

    },
    
    componentWillUnmount: function() {
        
        this.game.destroy();
    },

    onMatchUpdateReceived: function(matchUpdate) {

        //config.eventHandlers.onLog("received matchupdate frame " + matchUpdate.frameCount);

        this.matchUpdate = matchUpdate;
    },


    // Render the component
    render: function() {

        //http://cssdeck.com/labs/emcxdwuz

        if (this.props.isEndMatchRequested) {
            return <div>ending match..</div>;
        }

        return ( 
            <div id="match-view">
                <div id="surface"></div>
            </div>
        );
    }
});