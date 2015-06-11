var React = require('react'),
    config = require('./../config');

module.exports = InfoScreen = React.createClass({

    // Called once, after initial rendering in the browser
    componentDidMount: function() {


    },

    // Render the component
    render: function() {
        
        var worldState = this.props.worldState;
        var playerInfo = this.props.playerInfo;
        
        var playerDiv = function(player, playerNumber){
            
            if(player == null){
                
                return <div>Waiting on Player{playerNumber}</div>
                
            }else{
                
                return <div>Player{playerNumber} connected!</div>
                
            }
        };
        
        var playerInfo = <p>connecting...</p>
        if(playerInfo.isConnected){
            playerInfo = <p>connected as player {playerInfo.playerNumber}!</p>
        }
        
        return (   
            
            <div className="ask-name">
                <h1>StockFighter</h1>
                <p>
                    The game currently resets after 20 seconds. Refresh the controller(s) to play again.
                </p>
                <div className="players">
                    {playerDiv(worldState.players[0], 1)}
                    {playerDiv(worldState.players[1], 2)}
                </div>
                {playerInfo}
            </div>
        );
    }

});