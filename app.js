var React = require("react");
var Player = require("./client/Player.react");

// Snag the initial state that was passed from the server side
//var initialState = JSON.parse(document.getElementById("initial-state").innerHTML);

// Render the components, picking up where react left off on the server
React.render(
  <Player />,
  document.getElementById("react-app")
);
