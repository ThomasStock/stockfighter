"use strict";

var React = require("react");
var config = require("./../config");

module.exports = React.createClass({

    // Called once, after initial rendering in the browser
    componentDidMount: function() {
        
        
    },

    // Render the component
    render: function() {
        
        var props = this.props;
        var games = props.games;
        var players = props.players;
        
        debugger;
        
        return (
            <div className="lobby">
                <h1>lobby</h1>
                <h2>Games:</h2>
                <ul>
                    {games.map(function(game) {
                        return <li>{game.id}</li>;
                    })}
                </ul>
                <h2>Players:</h2>
                <ul>
                    {players.map(function(player) {
                        return <li>{player.id}</li>;
                    })}
                </ul>
            </div>
        );
    }
});
