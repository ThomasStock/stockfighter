var React = require('react'),
    World = require('./World.react.js'),
    config = require('./../config');

// Export the StockFighterApp component
module.exports = StockFighterApp = React.createClass({

    // Set the initial component state
    getInitialState: function(props) {

        props = props || this.props;

        // Set initial application state using props
        return props;

    },



    // Called once, after initial rendering in the browser
    componentDidMount: function() {

        socket = io.connect();

        //set event handler for when the server asks us to log something
        socket.on(config.events.log, config.eventHandlers.onLog);

        //identify ourself to the server
        socket.emit(config.events.identify, config.identifiers.viewer);
    },

    // Render the component
    render: function() {

        return ( <div className = "stockfighter-app">
            <World worldState = {this.state.worldState}/> 
            </div>
        )
    }

});