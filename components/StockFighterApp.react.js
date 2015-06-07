var React = require('react'),
    Match = require('./Match.react.js'),
    InfoScreen = require('./InfoScreen.react.js'),
    config = require('./../config');

module.exports = StockFighterApp = React.createClass({

    // Set the initial component state
    getInitialState: function(props) {

        props = props || this.props;

        // Set initial application state using props
        return props;

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
    
    //when a match ends
    onMatchEnded: function(worldState){
        
        console.log("match ended");
        
        this.setState({worldState: worldState});
        
    },


    // Called once, after initial rendering in the browser
    componentDidMount: function() {
        
        config.eventHandlers.onLog("initializing socket");

        socket = io.connect();
        
        //identify ourself to the server
        socket.emit(config.events.identify, config.identifiers.viewer);

        //set event handler for when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);

        //set event handler for when the server tells us player 1 joined
        socket.on(config.events.player1Joined, this.onPlayer1Joined);
        
        //set event handler for when the server tells us player 2 joined
        socket.on(config.events.player2Joined, this.onPlayer2Joined);

        //set event handler for when the server tells us the match can start
        socket.on(config.events.matchStarting, this.onMatchStarting);
        
        //set event handler for when the server tells us the match has started
        socket.on(config.events.matchStarted, this.onMatchStarted);
        
        //set event handler for when the server tells us the match has started
        socket.on(config.events.matchEnded, this.onMatchEnded);
        
    },

    // Render the component
    render: function() {
        
        var worldState = this.state.worldState;
        
        if(worldState.matchState == config.matchStates.waitingForPlayers
        || worldState.matchState == config.matchStates.matchStarting){
            
            return <InfoScreen worldState={worldState}/>
        }
        
        if(worldState.matchState == config.matchStates.matchStarted){
            
            return <Match worldState={worldState}/>
        }
        
        if(worldState.matchState == config.matchStates.matchEnded){
            
            return <div>refresh to restart game</div>
        }
        
        if(!worldState.matchState){
            
            return <div>loading..</div>
        }

        return <div>unimplemented view for matchstate {worldState.matchState}</div>
    }

});