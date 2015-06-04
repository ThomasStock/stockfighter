var React = require('react'),
    config = require('./../config');

module.exports = Match = React.createClass({
    
    endMatch: function(){
        
        //request the server to end the match
        socket.emit(config.events.requestEndMatch);
    },
    
    // Render the component
    render: function() {
        
        if(!this.props.isEndMatchRequested){
            
            return (
                <div className="match-view">
                    <div>Imagine awesomeness.</div><br/>
                    <input type="button" value="End the match" onClick={this.endMatch} />
                </div>
            );
        }

        return <div>ending match..</div>;
       
    }

});