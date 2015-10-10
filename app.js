/* Creates a web server */
var express = require('express'), // Creates an express instance
    app = express(),
    server = require('http').createServer(app), // Creates a web server
    io = require('socket.io').listen(server); // Creates a socket.io instance

server.listen(process.env.PORT || 3000); // Listening port for server
console.log("Listening on port 3000");
console.log("Visit localhost:3000 in your browser");

/* Serve static content */
app.use(express.static('public'));

// Routing for webpages
app.get('/', function(req, res) {

  res.sendfile("chessboard.html");

});