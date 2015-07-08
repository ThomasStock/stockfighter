"use strict";

var express = require("express"),
    exphbs = require("express-handlebars"),
    http = require("http"),
    bodyParser = require("body-parser"),
    routes = require("./routes"),
    server = require("./modules/server"),
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

    // parse application/json
    app.use(bodyParser.json());

    // Set /public as our static content dir
    app.use("/", express.static(path.join(__dirname, "/public/")));

    // Fire this bitch up (start our server)
    return http.createServer(app).listen(port, function() {
        config.eventhandlers.onLog("Express server listening on port " + port);
    });
}

function setupRoutes(app) {

    // Index Route
    app.get("/", routes.index(server));

    // Play Route
    app.get("/play", routes.play());
}


var app = express();

setupRoutes(app);

var httpServer = initializeHttpServer(app);

var io = require("socket.io")(httpServer);

server.bla("bleh");

server.initialize(io);
