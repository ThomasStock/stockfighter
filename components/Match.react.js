var React = require('react'),
    config = require('./../config');
    
module.exports = Match = React.createClass({
    
    game: null, //Phaser.Game
    
    endMatch: function(){
        
        //request the server to end the match
        socket.emit(config.events.requestEndMatch);
    },
    
    getSize: function () {
        return document.getElementById('surface').getBoundingClientRect();
    },
    
    preload: function(){
        
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.windowConstraints = {"right":"layout","bottom":"layout"};
    },
    
    create: function(){
        
        game.add.sprite(0,0,'sky');
        game.add.sprite(1004,748, 'star');
    },
    
    update: function(){
        
        
    },
    
    componentDidMount: function(){
        
        var self = this;
        
        game = new Phaser.Game(1024, 768, Phaser.AUTO, 'surface', { preload: self.preload, create: self.create, update: self.update });
        

    },
    

    // Render the component
    render: function() {
        
        //http://cssdeck.com/labs/emcxdwuz
        
        if(this.props.isEndMatchRequested){
            return <div>ending match..</div>;
        }
        
        

    
        return (
            <div id="match-view">
                <div id="surface">
                    
                </div>
            </div>
        );
    }
});