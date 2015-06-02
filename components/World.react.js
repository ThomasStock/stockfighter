var React = require('react');

// Export the StockFighterApp component
module.exports = World = React.createClass({

    // Render the component
    render: function() {

        return (
            <div>{this.props.worldState.hello}</div>
        )
    }

});