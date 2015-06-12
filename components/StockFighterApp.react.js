var React = require('react');
var Match = require('./Match.react.js');
var InfoScreen = require('./InfoScreen.react.js');
var config = require('./../config');
var cookie = require('react-cookie');

module.exports = StockFighterApp = React.createClass({
    
    getInitialState: function() {

        return {
            playerInfo: {
                playerNumber: null,
                isConnected: false,
                isAssigned: false
            }
        };
    },

    //when the match is starting
    onMatchStarting: function(worldState){
        
        console.log("match will start");
        
        this.setState({worldState: worldState});
        
    },
    
    //when the match is started
    onMatchStarted: function(worldState){
        
        console.log("match has started");
        
        this.setState({worldState: worldState});
        
    },
    
    //when player 1 joined
    onPlayer1Joined: function(worldState){
        
        console.log("player 1 joined");
        
        this.setState({worldState: worldState});
        
    },
    
    //when player 2 joined
    onPlayer2Joined: function(worldState){
        
        console.log("player 2 joined");
        
        this.setState({worldState: worldState});
        
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
        
        this.setState({worldState: worldState});
        
    },
    
    
    onIdentified: function(playerNumber){
        
        var newState = state.playerInfo;
        newState.playerNumber = playerNumber;
        newState.isIdentified = true;
        this.setState(newState);
    },
    
    // Called one, before initial rendering on the server
    componentWillMount: function(){
        
        var playerInfo = this.state.playerInfo;
        
        //hardcoded for now
        var identifier = config.identifiers.controllerWithView;
        
        config.eventHandlers.onLog("initializing socket");

        socket = io.connect();
        
        socket.on("connection", function(){
          
            playerInfo.isConnected = true;
            setState({playerInfo: playerInfo});
           
            //identify ourself to the server
            socket.emit(config.events.identify, config.identifiers.controllerWithView);
            
            //when the server asks us to log something
            socket.on(config.events.log, config.eventHandlers.onLog);
            
            //when the server identified us
            socket.on(config.events.identified, this.onIdentified);
            
        });
        

        
        //set event handler for when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);

/*        //set event handler for when the server tells us player 1 joined
        socket.on(config.events.player1Joined, this.onPlayer1Joined);
        
        //set event handler for when the server tells us player 2 joined
        socket.on(config.events.player2Joined, this.onPlayer2Joined);

        //set event handler for when the server tells us the match can start
        socket.on(config.events.matchStarting, this.onMatchStarting);
        
        //set event handler for when the server tells us the match has started
        socket.on(config.events.matchStarted, this.onMatchStarted);
        
        //set event handler for when the server tells us the match has started
        socket.on(config.events.matchEnded, this.onMatchEnded);*/
    },


    // Called once, after initial rendering in the browser
    componentDidMount: function() {

        
    },

    // Render the component
    render: function() {
        
        var worldState = this.props.worldState;
        var playerInfo = this.state.playerInfo;

        
        if(worldState.matchState == config.matchStates.waitingForPlayers){
            
            return (
                <div className="stockfighter">
                    <InfoScreen worldState={worldState} playerInfo={playerInfo} />
                </div>
            );
        }
        
/*        if(worldState.matchState == config.matchStates.matchStarted){
            
            return <Match worldState={worldState}/>
        }
        
        if(worldState.matchState == config.matchStates.matchEnded){
            
            return <div>refresh to restart game</div>
        }
        
        if(!worldState.matchState){
            
            return <div>loading..</div>
        }*/

        return <div>cant render stockfighter</div>
    }

});