var React = require('react'),
    config = require('./../config');

module.exports = InfoScreen = React.createClass({

    // Called once, after initial rendering in the browser
    componentDidMount: function() {


    },

    // Render the component
    render: function() {
        
        var worldState = this.props.worldState;
        
        var playerDiv = function(player, playerNumber){
            
            if(player == null){
                
                return <div>Waiting on Player{playerNumber}</div>
                
            }else{
                
                return <div>Player{playerNumber} connected!</div>
                
            }
        };
        
        var gameStartMessage = function(){
            
            if(worldState.matchState == config.matchStates.matchStarting){
                
                return (
                    <div>The game is about to start!</div>
                );
            }
            
        };
        
        return (   
            
            <div className="info-screen">
                <h1>StockFighter</h1>
                <p>
                    Surf to <a href={config.playUrl} target="_blank">{config.playUrl}</a> in another browser tab or on a mobile device to enter as player.<br/>
                    (Open multiple browser tabs to play against yourself.)
                </p>
                <p>
                    The game currently resets after 20 seconds. Refresh the controller(s) to play again.
                </p>
                <div className="players">
                    {playerDiv(worldState.players[0], 1)}
                    {playerDiv(worldState.players[1], 2)}
                </div>
                {gameStartMessage()}
            </div>
        );
    }

});