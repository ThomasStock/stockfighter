var React = require('react'),
    io = require('socket.io');

module.exports = {

    index: function(worldState) {

        return function(req, res) {
            
/*            // Render React to a string, passing in our fetched tweets
            var markup = React.renderToString(
                StockFighterApp({
                    worldState: worldState
                })
            );*/

            // Render our 'home' template
            res.render('home', {
                markup: "", // Pass rendered react markup
                state: JSON.stringify(worldState) // Pass current state to client side
            });

        }
    },


    play: function() {

        return function(req, res) {

/*            // Render React to a string, passing in our fetched tweets
            var markup = React.renderToString(
                ControllerApp()
            );*/

            // Render our 'home' template
            res.render('home', {
                markup: "", // Pass rendered react markup
                state: JSON.stringify({}),
                layout: 'play'
            });

        }
    },

}