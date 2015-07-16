"use strict";

var lobby = require("./modules/lobby");

module.exports = {

    index: function () {
        return function (req, res) {
            
            // Render our "home" template
            res.render("home", {
                state: JSON.stringify(lobby.getState()) // Pass current state to client side
            });

        };
    }
};
