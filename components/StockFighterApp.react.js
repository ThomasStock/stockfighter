var React = require('react');
var World = require('./World.react.js');

// Export the StockFighterApp component
module.exports = StockFighterApp = React.createClass({

    // Set the initial component state
    getInitialState: function(props) {

        props = props || this.props;

        // Set initial application state using props
        return props;

    },



    // Called directly after component rendering, only on client
    componentDidMount: function() {

        // Preserve self reference
        var self = this;

        // Initialize socket.io
        var socket = io.connect();

        // On game event emission...
        socket.on('tst2', function(data) {

            // Add a tweet to our queue
            self.setState({worldState: data});

        });
        

    },

    // Render the component
    render: function() {

        return (
            <div className = "stockfighter-app">
                <World worldState={this.state.worldState} />
            </div>
        )
    }

});