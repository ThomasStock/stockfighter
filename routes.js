var React = require('react');
var Server = require('./modules/Server');

module.exports = {

    index: function(worldState) {

        return function(req, res) {
            
            // Render our 'home' template
            res.render('home', {
                markup: "", // Pass rendered react markup
                state: JSON.stringify(worldState) // Pass current state to client side
            });

        }
    },

    play: function() {

        return function(req, res) {


            // Render our 'home' template
            res.render('home', {
                markup: "", // Pass rendered react markup
                state: JSON.stringify({}),
                layout: 'play'
            });

        }
    },

}