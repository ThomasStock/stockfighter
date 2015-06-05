// Require our dependencies
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    WorldState = require('./models/WorldState'),
    Player = require('./models/Player'),
    config = require('./config'),
    Match = require('./match');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});

//initialize the world state (empty game, nobody connected)
var worldState = new WorldState();

//initialize socket.io server
var io = require('socket.io')(server);

config.eventHandlers.onLog("waiting for players");

//when anyone connects to socket.io, set up some event listeners for that socket
io.on('connection', function(socket) {

    //when the socket emits an idenity event..
    socket.on(config.events.identify, function(data) {

        //get some information about the client

        var ip = socket.client.conn.remoteAddress;
        var id = socket.id;
        var identifier = data; // "player" or "viewer"

        //log the information
        var logMessage = ip + " has connected as " + identifier + " (id: " + id + ")";
        config.eventHandlers.onLog(logMessage);

        //also send the info to all clients, telling them to log it.
        io.emit(config.events.log, logMessage);

        //check which type of client connected
        switch (identifier) {
            case config.identifiers.controller:

                //if the world needs no more players..
                if (worldState.player1 != null && worldState.player2 != null) {

                    config.eventHandlers.onLog(id + " disconnected because there are no more players needed");

                    //let the client know
                    socket.emit(config.events.noMorePlayersNeeded);

                    //and then disconnect it.
                    socket.disconnect();
                }

                //if we need a player1..
                if (worldState.player1 == null) {

                    config.eventHandlers.onLog(id + " assigned as player 1");

                    //assign the current socket to it
                    worldState.player1 = new Player(id);

                    //let the socket know it's player 1
                    socket.emit(config.events.acceptedAsPlayer, 1);

                    //broadcast to everyone that a player 1 has entered
                    io.emit(config.events.player1Joined, worldState);
                }
                else //we need a player2..
                {
                    
                    config.eventHandlers.onLog(id + " assigned as player 2");
                    
                    //assign the current socket to it
                    worldState.player2 = new Player(id);

                    //let the socket know it's player 2
                    socket.emit(config.events.acceptedAsPlayer, 2);

                    //broadcast to everyone that a player 2 has entered
                    io.emit(config.events.player2Joined, worldState);
                }

                //at this point we know a player joined the game. 
                //check if we now have 2 players and can start the match
                if (worldState.player1 != null && worldState.player2 != null) {

                    config.eventHandlers.onLog("starting match..");
                    
                    //update matchState
                    worldState.matchState = config.matchStates.matchStarting;

                    //let everyone know we can start the match
                    io.emit(config.events.matchStarting, worldState);

                    //initialize a new match
                    var match = new Match(io, worldState);

                    //start the match after 3 seconds
                    setTimeout(function() {
                        
                        //some temp stuff
                        worldState.player1.name = "Player1";
                        worldState.player2.name = "Player2";
                        worldState.player1.color = config.colors.player1Color;
                        worldState.player2.color = config.colors.player2Color;
                        
                        
                        config.eventHandlers.onLog("match started!");
                        match.start();
                    }, 3000);
                }

                break;
            case config.identifiers.viewer:

                //when the viewer requests the game to end.. 
                socket.on(config.events.requestEndMatch, function(data) {

                    config.eventHandlers.onLog("ending match");

                    //reset the worldState

                    worldState.matchState = config.matchStates.waitingForPlayers;
                    worldState.player1 = null;
                    worldState.player2 = null;

                    io.emit(config.events.matchEnded, worldState);

                });

                break;

        }
    });

    //when the socket emits a disconnect event..
    socket.on("disconnect", function() {

    });

});

// Index Route
app.get('/', routes.index(worldState));

// Play Route
app.get('/play', routes.play());
