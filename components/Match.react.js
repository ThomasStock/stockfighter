var React = require('react'),
    config = require('./../config');
    Controller = require('./../models/Controller');

module.exports = Match = React.createClass({

    game: null, //Phaser.Game
    matchUpdate: null, //object contains the latest information received from the server
    sprites: {}, //container for sprites that must be updated


    getSize: function() {
        return document.getElementById('surface').getBoundingClientRect();
    },

    preload: function() {

        var self = this;
        var game = self.game;

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

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
        var props = self.props;
        
        //set up environment

        var sky = game.add.sprite(0, 0, 'sky');
        sky.width = game.world.width;
        sky.height = game.world.height;

        var ground = game.add.sprite(0, game.world.height - 120, 'ground');
        ground.height = 120;
        ground.width = game.world.width;
        
        //setup players

        sprites.player1 = game.add.sprite(props.world.players[0].pos.x, props.world.players[0].pos.y, 'dude');
        sprites.player1.frame = 5;


        sprites.player2 = game.add.sprite(props.world.players[1].pos.x, props.world.players[1].pos.y, 'dude');
        sprites.player2.frame = 0;
        
        //setup inputs
        
        var controller = new Controller();
        var keyboard = game.input.keyboard;
        
        var cursorKeys = keyboard.createCursorKeys();
        cursorKeys.left.onDown.add(controller.addCommand, controller);
        cursorKeys.right.onDown.add(controller.addCommand, controller);
        cursorKeys.up.onDown.add(controller.addCommand, controller);
        cursorKeys.down.onDown.add(controller.addCommand, controller);
        
        controller.start();

    },

    //phaser main game loop tick
    update: function() {
        
        //console.log("in update");

        if (this.matchUpdate != null) {
            
            config.eventHandlers.onLog("handling matchUpdate " + this.matchUpdate.players[0].pos.x)
            
            var sprites = this.sprites;

            sprites.player1.x = this.matchUpdate.players[0].pos.x;
            sprites.player1.y = this.matchUpdate.players[0].pos.y;

            sprites.player2.x = this.matchUpdate.players[1].pos.x;
            sprites.player2.y = this.matchUpdate.players[1].pos.y;
            
            this.matchUpdate = null;
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