var React = require('react'),
    WorldState = require('./../models/WorldState');

// Export the StockFighterApp component
module.exports = Controller = React.createClass({
    
    left: function(){
      
      console.log("left");
      this.send();
        
    },
        
    right: function(){
      
      console.log("right");
        
    },
        
    jump: function(){
      
      console.log("jump");
        
    },
    
    send: function(){
      
       // Preserve self reference
        var self = this;

        // Initialize socket.io
        var socket = io.connect();
        
        socket.emit('tst', new WorldState());
        
    },

    // Render the component
    render: function() {
        
        var buttonStyle = {
            padding: '10px',
            margin: '10px'
        };

        return (
            <div className="controller">
                <input type="button" style={buttonStyle} onClick={this.left} value="Left" ></input>
                <input type="button" style={buttonStyle} onClick={this.jump} value="Jump" ></input>
                <input type="button" style={buttonStyle} onClick={this.right} value="Right" ></input>
            </div>
        );
    }

});