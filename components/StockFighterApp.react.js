var React = require('react'),
    World = require('./World.react.js'),
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
    
    //when player 1 joined
    onPlayer1Joined: function(worldState){
        
        console.log("player 1 joined");
        
        this.setState({worldState: worldState});
        
    },
    
    //when player 2 joined
    onPlayer1Joined: function(worldState){
        
        console.log("player 2 joined");
        
        this.setState({worldState: worldState});
        
    },


    // Called once, after initial rendering in the browser
    componentDidMount: function() {

        socket = io.connect();

        //set event handler for when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);

        //identify ourself to the server
        socket.emit(config.events.identify, config.identifiers.viewer);

        //set event handler for when the server tells us player 1 joined
        socket.on(config.events.player1Joined, this.onPlayer1Joined);
        
        //set event handler for when the server tells us player 2 joined
        socket.on(config.events.player2Joined, this.onPlayer2Joined);

        //set event handler for when the server tells us the match can start
        socket.on(config.events.matchStarting, this.onMatchStarting);
        
    },

    // Render the component
    render: function() {

        return (         
            
            <div className="stockfighter-app">
                <InfoScreen worldState={this.state.worldState}/> 
            </div>
            
        );
    }

});