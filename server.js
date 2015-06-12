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

//when the worldstate changes, broadcast to all sockets
worldState.onUpdate = function(worldState){
    io.emit(config.events.worldStateUpdated, worldState);
}

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
            case config.identifiers.controllerWithView:
                
                //try assign as player
                var playerNumber = worldState.assignNewPlayer(id);
                
                //let the socket know if it got a playerNumber
                socket.emit(config.events.identified, playerNumber);
                
                //can we start the game after (trying to) assign this player?
                if(worldState.canMatchStart()){
                    
                    
                    var match = worldState.startMatch(io);
                }
                
                break;
            

                //at this point we know a player joined the game. 
                //check if we now have 2 players and can start the match
                if (worldState.players[0] != null && worldState.players[1] != null) {

                   
                }

                break;
            case config.identifiers.viewer:
                
                //static setting for debugging purposes
                if (config.runmode == config.runmodes.waitOnViewer) {

                    //test mode without controllers, immediate game start
                
                    worldState.players[0] = new Player(1000, "computer1");
                    worldState.players[1] = new Player(2000, "computer2");
                    worldState.players[0].color = config.colors.player1Color;
                    worldState.players[1].color = config.colors.player2Color;
                
                    var match = new Match(io, worldState);
                
                    config.eventHandlers.onLog("starting match now!");
                    match.start();
                }

                //when the viewer requests the game to end.. 
                socket.on(config.events.requestEndMatch, function(data) {

                    config.eventHandlers.onLog("ending match");

                    worldState.reset(io);

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
