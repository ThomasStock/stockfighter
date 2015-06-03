var React = require('react'),
    WorldState = require('./../models/WorldState');

// Export the StockFighterApp component
module.exports = Controller = React.createClass({
    
    socket: null,
    
    left: function(){
      
      console.log("left");
      this.send();
        
    },
        
    right: function(){
      
      console.log("right");
      this.send();
        
    },
        
    jump: function(){
      
      console.log("jump");
      this.send();
        
    },
    
    send: function(){
      
        socket.emit('tst', new WorldState());
        
    },
    
     // Called directly after component rendering, only on client
    componentDidMount: function() {

        // Initialize socket.io
        socket = io.connect();
        

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