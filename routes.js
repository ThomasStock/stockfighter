"use strict";

var server = require("./modules/server");
var serverState = server.state;

module.exports = {

    index: function () {
        return function (req, res) {

            // Render our "home" template
            res.render("home", {
                state: JSON.stringify(serverState) // Pass current state to client side
            });

        };
    }
};
