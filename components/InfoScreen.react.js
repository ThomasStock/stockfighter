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
                
                return <div>Waiting on Player{playerNumber} ...</div>
                
            }else{
                
                return <div>Player{playerNumber} has entered the game!</div>
                
            }
        };
        
        var playerNumberInfo = "";
        if(playerInfo.isIdentified){
            if(playerInfo.playerNumber == null){
                playerNumberInfo = "Sorry, maximum number of players reached. Please try again later by refreshing the game.";
            }else{
                playerNumberInfo = "You are assigned as Player" + playerInfo.playerNumber;
            }
        }
        
        return (   
            
            <div>
                <h1>StockFighter</h1>
                <p>
                    The game currently resets after 20 seconds. Refresh the controller(s) to play again.
                </p>
                <div className="players">
                    {playerDiv(worldState.players[0], 1)}
                    {playerDiv(worldState.players[1], 2)}
                </div>
                <div className="player-info">
                    <div>{playerInfo.isConnected ? 'Connected!' : 'Connecting...'}</div>
                    <div>{playerInfo.isIdentified ? 'Identified!' : 'Identifying...'}</div>
                    <div>{playerNumberInfo}</div>
                </div>
            </div>
        );
    }

});