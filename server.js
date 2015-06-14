// Require our dependencies
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    World = require('./models/World'),
    config = require('./config')


// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// http://www.askapache.com/htaccess/apache-speed-etags.html
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

//initialize socket.io server
var io = require('socket.io')(server);

//initialize the world state (empty game, nobody connected)
var world = new World(io);

//when the worldstate changes, broadcast to all sockets
world.onUpdate = function() {
    io.emit(config.events.worldUpdate, world);
};

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
                var playerIndex = world.assignNewPlayer(id);

                //let the socket know if it got a playerNumber
                socket.emit(config.events.identified, playerIndex);

                //push info to clients
                world.broadcastUpdate();

                //can we start the game after (trying to) assign this player?
                if (world.canMatchStart()) {
                    var match = world.startMatch();
                }

                break;
        }
    });

    //when the socket emits a disconnect event..
    socket.on("disconnect", function() {
        config.eventHandlers.onLog(socket.id + " disconnected.");
        
        world.removePlayer(socket.id);
    });

});

// Index Route
app.get('/', routes.index(world));

// Play Route
app.get('/play', routes.play());
