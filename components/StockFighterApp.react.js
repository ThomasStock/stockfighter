var React = require('react');


// Export the StockFighterApp component
module.exports = StockFighterApp = React.createClass({

    updateState: function(state) {

        // Set application state
        this.setState(state);
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
        socket.on('game', function(data) {

            // Add a tweet to our queue
            self.updateState(data);

        });

    },

    // Render the component
    render: function() {

        return ( < div className = "stockfighter-app" >
            hello: {
                this.state.hello
            } < /div>
        )

    }

});