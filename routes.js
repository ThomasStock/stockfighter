var JSX = require('node-jsx').install(),
  React = require('react'),
  StockFighterApp = require('./components/StockFighterApp.react');

module.exports = {

    index: function(req, res) {
    
        var game = {hello: "bla"};
    
        // Render React to a string, passing in our fetched tweets
        var markup = React.renderComponentToString(
            StockFighterApp({
              game: game
            })
        );
        
        // Render our 'home' template
        res.render('home', {
            markup: markup, // Pass rendered react markup
            state: JSON.stringify(game) // Pass current state to client side
        });
    
    }

}