var React = require('react');
var Match = require('./Match.react.js');
var InfoScreen = require('./InfoScreen.react.js');
var config = require('./../config');
var cookie = require('react-cookie');

module.exports = StockFighterApp = React.createClass({
    
    getInitialState: function() {

        return {
            playerInfo: {
                playerIndex: null,
                isAssigned: false
            },
            world: this.props.world
        };
    },

    onIdentified: function(playerIndex){
        
        var newState = this.state.playerInfo;
        newState.playerIndex = playerIndex;
        newState.isIdentified = true;
        this.setState(newState);
    },
    
    // Called one, before initial rendering on the server
    componentWillMount: function(){
        
        var self = this;
        
        config.eventHandlers.onLog("initializing socket");

        socket = io.connect();
        
        //identify ourself to the server
        socket.emit(config.events.identify, config.identifiers.controllerWithView);
        
        //when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);
        
        //when the server identified us
        socket.on(config.events.identified, self.onIdentified);
        
        socket.on(config.events.matchEnded, function(){
            self.setState({playerInfo: self.getInitialState().playerInfo});
            //socket.emit(config.events.identify, config.identifiers.controllerWithView);
        })
        
        //event handler for general world updates
        socket.on(config.events.worldUpdate, function(world){ 
            self.setState({world: world});
        });
    },


    // Called once, after initial rendering in the browser
    componentDidMount: function() {

        
    },

    // Render the component
    render: function() {
        
        var world = this.state.world;
        var playerInfo = this.state.playerInfo;

        
        if(world.matchState == config.matchStates.waitingForPlayers){
            
            return (
                <div className="stockfighter">
                    <InfoScreen world={world} playerInfo={playerInfo} />
                </div>
            );
        }
        
        if(world.matchState == config.matchStates.matchStarted){
            
            return <Match world={world}/>
        }
        
        if(world.matchState == config.matchStates.matchStarting){
            
            return <div>Match is starting..</div>
        }

        return <div>cant render stockfighter</div>
    }

});