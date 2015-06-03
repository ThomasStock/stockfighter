var React = require('react');
var Controller = require('./components/Controller.react');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

// Render the components, picking up where react left off on the server
React.render(
  <Controller/>, 
  document.getElementById('react-app')
);