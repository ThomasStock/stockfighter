var React = require('react'),
    WorldState = require('./../models/WorldState'),
    config = require('./../config');

module.exports = ControllerApp = React.createClass({
    
    getInitialState: function() {
        return {
            id: null,
            playerNumber: null,
            noMorePlayersNeeded: null,
            matchHasEnded: null,
            disconnected: null
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
        
        this.setState({noMorePlayersNeeded: true});
    },
    
    //when a match ends
    onMatchEnded: function(worldState){
        
        console.log("match ended");
        
        this.setState({matchHasEnded: true});
        
    },
    
    
    // Called once, after initial rendering in the browser
    componentDidMount: function() {
        
        var self = this;

        socket = io.connect();
        
        socket.on("connect", function(){
            
            self.setState({id: socket.id});
        });
        
        socket.on("disconnect", function(){
            
            self.setState({disconnected: true});
        });
        
        //set event handler for when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);
        
        //set event handler for when the server tells us the match can start
        socket.on(config.events.matchStarting, this.onMatchStarting);
        
        //set event handler for when the server tells us we are accepted as a player
        socket.on(config.events.acceptedAsPlayer, this.onAcceptedAsPlayer);
        
       //set event handler for when the server tells us we are denied as controller
        socket.on(config.events.noMorePlayersNeeded, this.onNoMorePlayersNeeded);
        
        //set event handler for when the server tells us the match has started
        socket.on(config.events.matchEnded, this.onMatchEnded);

        //identify ourself to the server
        socket.emit(config.events.identify, config.identifiers.controller);

    },

    // Render the component
    render: function() {
        
        var state = this.state;
        
        if(state.matchHasEnded){
            
            return <div>Thank you for playing</div>;
        }
        
        var playerInfo = function(){
            
            if(state.noMorePlayersNeeded){
             
                return (
                    <div className="no-more-players-needed-message">
                        Sorry, there were no more players needed in the current game.<br/>
                        Try again later.
                    </div>
                );
            }
            
            if(state.playerNumber == null){
                
                return (
                    <div className="connecting-message">Connecting..</div>
                );
            }
            
            return (
                <div className="player-info-data">
                    <div className="connected-as-message">
                        Connected as Player{state.playerNumber}!
                    </div>
                    <div className="socket-id-message">
                        <small>Your socket id is: {state.id}</small>
                    </div>
                    
                </div>
            );
            
        };
        
        var disconnectedInfo = function(){
            
            if(state.disconnected){
                
                return <div>You have been disconnected.</div>;
            }
        }
        
        var buttonStyle = {
            padding: '10px',
            margin: '10px'
        };
        
        var controls = function(){
            
            if(state.playerNumber != null){
                
                return (
                    <div className="controller">
                        <input type="button" style={buttonStyle} onClick={this.left} value="Left" ></input>
                        <input type="button" style={buttonStyle} onClick={this.jump} value="Jump" ></input>
                        <input type="button" style={buttonStyle} onClick={this.right} value="Right" ></input>
                    </div>
                );
            }
        };
        
        return (
            <div className="controller-app">
                {controls()}
                {playerInfo()}
                {disconnectedInfo()}
            </div>
        );

    }

});
