var JSX = require('node-jsx').install(),
    React = require('react'),
    io = require('socket.io'),
    StockFighterApp = React.createFactory(require('./components/StockFighterApp.react')),
    Controller = React.createFactory(require('./components/Controller.react'));

module.exports = {

    index: function(worldState) {

        return function(req, res) {
            
            worldState.log();

            // Render React to a string, passing in our fetched tweets
            var markup = React.renderToString(
                StockFighterApp({
                    worldState: worldState
                })
            );

            // Render our 'home' template
            res.render('home', {
                markup: "", // Pass rendered react markup
                state: JSON.stringify(worldState) // Pass current state to client side
            });

        }
    },

    hello: function(io) {

        return function(req, res) {

            io.sockets.emit('hello', {
                val: req.body.hello
            });

        }
    },

    play: function() {

        return function(req, res) {

            // Render React to a string, passing in our fetched tweets
            var markup = React.renderToString(
                Controller()
            );

            // Render our 'home' template
            res.render('home', {
                markup: markup, // Pass rendered react markup
                state: JSON.stringify({}),
                layout: 'play'
            });

        }
    },

}