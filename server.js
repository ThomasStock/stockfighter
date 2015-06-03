// Require our dependencies
var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  bodyParser = require('body-parser'),
  routes = require('./routes'),
  WorldState = require('./models/WorldState');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});


var worldState = new WorldState();
worldState.log();
worldState.hello = "bla";
worldState.log();


// Initialize socket.io
//var io = require('socket.io').listen(server);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log("on connection");
  socket.on("tst", function(data){
    console.log("on tst");
    console.log(io.nsps['/'].adapter.rooms);
    io.to('view').emit("tst2", data);
  });
});

// Index Route
app.get('/', routes.index(worldState));

// Play Route
app.get('/play', routes.play());


