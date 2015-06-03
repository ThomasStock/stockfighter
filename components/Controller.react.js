var React = require('react'),
    WorldState = require('./../models/WorldState'),
    config = require('./../config');

// Export the StockFighterApp component
module.exports = Controller = React.createClass({
    
    getInitialState: function() {
        return {
            id: "pending..",
            playerNumber: "pending.."
        };
    },
    
    left: function(){
      
      console.log("left");
      this.send();
        
    },
        
    right: function(){
      
      console.log("right");
      this.send();
        
    },
        
    jump: function(){
      
      console.log("jump");
      this.send();
        
    },
    
    send: function(){
      
        socket.emit('tst', new WorldState());
        
    },
    
    onMatchStarting: function(){
        
        console.log("match will start");
    },
    
    onAcceptedAsPlayer: function(playerNumber){
        
        console.log("accepted as player " + playerNumber);
        
        this.setState({playerNumber: playerNumber});
    },
    
    onNoMorePlayersNeeded: function(){
        
        console.log("no more players needed..");
        
        this.setState({playerNumber: "NO"});
    },
    
    
    // Called once, after initial rendering in the browser
    componentDidMount: function() {
        
        var self = this;

        socket = io.connect();
        
        socket.on("connect", function(){
            
            self.setState({id: socket.id});
        });
        
        //set event handler for when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);
        
        //set event handler for when the server tells us the match can start
        socket.on(config.events.matchStarting, this.onMatchStarting);
        
        //set event handler for when the server tells us we are accepted as a player
        socket.on(config.events.acceptedAsPlayer, this.onAcceptedAsPlayer);
        
       //set event handler for when the server tells us we are denied as controller
        socket.on(config.events.noMorePlayersNeeded, this.onNoMorePlayersNeeded);

        //identify ourself to the server
        socket.emit(config.events.identify, config.identifiers.controller);
        


    },

    // Render the component
    render: function() {
        
        var buttonStyle = {
            padding: '10px',
            margin: '10px'
        };

        return (
            <div className="controller">
                <input type="button" style={buttonStyle} onClick={this.left} value="Left" ></input>
                <input type="button" style={buttonStyle} onClick={this.jump} value="Jump" ></input>
                <input type="button" style={buttonStyle} onClick={this.right} value="Right" ></input>
                <div>socket id: {this.state.id}</div>
                <div>player: {this.state.playerNumber}</div>
            </div>
        );
    }

});
