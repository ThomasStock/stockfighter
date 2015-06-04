var React = require('react');

module.exports = World = React.createClass({
    
    getLatency: function(){
      
      return new Date().getTime() - new Date(this.props.worldState.timer).getTime();
        
    },

    // Render the component
    render: function() {

        return (
            <div>
            <div>Hello is {this.props.worldState.hello} and timer is {new Date(this.props.worldState.timer).getTime()}</div>
            <div>Current time is {new Date().getTime()}</div>
            <div>Latency is {this.getLatency()}</div>
            </div>
            
        )
    }

});