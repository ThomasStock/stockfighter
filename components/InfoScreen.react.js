var React = require('react'),
    config = require('./../config');

module.exports = InfoScreen = React.createClass({

    // Called once, after initial rendering in the browser
    componentDidMount: function() {
        
        
    },

    // Render the component
    render: function() {
        
        var world = this.props.world;
        var playerInfo = this.props.playerInfo;
        
        var playerDiv = function(player, playerIndex){
            
            if(player == null){
                
                return <div>Waiting on Player {playerIndex} ...</div>
                
            }else{
                
                return <div>{player.name} has entered the game!</div>
                
            }
        };
        
        var playerNumberInfo = "";
        if(playerInfo.isIdentified){
            if(playerInfo.playerIndex == null){
                playerNumberInfo = "Sorry, maximum number of players reached. Please try again later by refreshing the game.";
            }else{
                playerNumberInfo = "You are assigned as Player " + (playerInfo.playerIndex + 1);
            }
        }
        
        return (   
            
            <div>
                <h1>StockFighter</h1>
                <p>
                    The game currently resets after 20 seconds. Refresh to play again.
                </p>
                <div className="players">
                    {playerDiv(world.players[0], 1)}
                    {playerDiv(world.players[1], 2)}
                </div>
                <div className="player-info">
                    <div>{playerInfo.isIdentified ? 'Identified!' : 'Identifying...'}</div>
                    <div>{playerNumberInfo}</div>
                </div>
            </div>
        );
    }

});