var React = require('react'),
    config = require('./../config');

module.exports = InfoScreen = React.createClass({

    // Set the initial component state
    getInitialState: function(props) {

        props = props || this.props;

        // Set initial application state using props
        return props;

    },




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
        }
        
        

        return (   
            
            <div className="info-screen">
                <h1>StockFighter</h1>
                <p>
                    Surf to <a href={config.playUrl} target="_blank">{config.playUrl}</a> in another browsertab or on a mobile device to enter as player.
                </p>
                <div className="players">
                    {playerDiv(worldState.player1, 1)}
                    {playerDiv(worldState.player2, 2)}
                </div>
            </div>
        );
    }

});