"use strict";

var React = require("react");
var Player = require("./Player.react.js");
var config = require("./../config");

module.exports = React.createClass({

    getInitialState: function () {

        return {
            mode: this.props.mode
        };
    },

    // Called one, before initial rendering on the server
    componentWillMount: function () {

    },


    // Called once, after initial rendering in the browser
    componentDidMount: function () {


    },

    // Render the component
    render: function () {

        var mode = this.state.mode;
        
        switch(mode){
            case config.modes.singlePlayer:
                return <Player />;
                
        }

        return <div>Cannot render mode { mode }</div>;
    }
});
