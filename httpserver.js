"use strict";

var express = require("express"),
    exphbs = require("express-handlebars"),
    http = require("http"),
    bodyParser = require("body-parser"),
    routes = require("./routes"),
    lobby = require("./modules/lobby"),
    path = require("path"),
    config = require("./config");


function initializeHttpServer(app) {
    
    var port = process.env.PORT || 8080;

    // Set handlebars as the templating engine
    app.engine("handlebars", exphbs({
        defaultLayout: "main"
    }));
    app.set("view engine", "handlebars");

    // http://www.askapache.com/htaccess/apache-speed-etags.html
    app.disable("etag");

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    
    //app.use(express.cookieParser());
    //app.use(express.session({secret: '1234567890QWERTY'}));

    // parse application/json
    app.use(bodyParser.json());

    // Set /public as our static content dir
    app.use("/", express.static(path.join(__dirname, "/public/")));

    // Fire this bitch up (start our server)
    return http.createServer(app).listen(port, function() {
        config.eventHandlers.onLog("Expresss server listening on port " + port);
    });
}

function setupRoutes(app) {

    // Index Route
    app.get("/", routes.index());
}

var app = express();

setupRoutes(app);

var httpServer = initializeHttpServer(app);

var io = require("socket.io")(httpServer);

lobby.listenForConnections(io);
