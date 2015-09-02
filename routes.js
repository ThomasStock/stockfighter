"use strict";

var lobby = require("./server/lobby");
var config = require("./config");

module.exports = {

    index: function () {
        return function (req, res) {
            
            // Render our "home" template
            res.render("home", {
                state: {mode: config.modes.singlePlayer} // Pass current state to client side
            });

        };
    }
};
