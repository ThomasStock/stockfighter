var React = require('react');


// Export the StockFighterApp component
module.exports = StockFighterApp = React.createClass({

    updateHello: function(data) {

        // Set application state
        this.setState({
            hello: data
        });
    },

    // Set the initial component state
    getInitialState: function(props) {

        props = props || this.props;

        // Set initial application state using props
        return {
            hello: props.hello,
        };

    },

    componentWillReceiveProps: function(newProps, oldProps) {
        this.setState(this.getInitialState(newProps));
    },

    // Called directly after component rendering, only on client
    componentDidMount: function() {

        // Preserve self reference
        var self = this;

        // Initialize socket.io
        var socket = io.connect();

        // On game event emission...
        socket.on('hello', function(data) {

            // Add a tweet to our queue
            self.updateHello(data.val);

        });
        
        socket.emit('hello2', {val: "fromclient"} );


    },

    // Render the component
    render: function() {

        return <div className = "stockfighter-app">
            hello is {this.state.hello}</div>;

    }

});