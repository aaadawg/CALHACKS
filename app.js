/* Creates a web <server */
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

/* Create a new piece object */
function createPiece(team, position) {
	piece = new Object();
	piece.team = team;
	piece.position = position;
	piece.isKing = false;
	return piece;
}

function createBoard() {
	return [[null, null, null, null, createPiece("blue", [0, 4]), null, createPiece("blue", [0, 6]), null, createPiece("blue", [0, 8]), null, createPiece("blue", [0, 10]), null, null, null,], 
			[null, null, null, createPiece("blue", [1, 3]), null, createPiece("blue", [1, 5]), null, createPiece("blue", [1, 7]), null, createPiece("blue", [1, 9]), null, null, null, null,],
			[null, null, null, null, createPiece("blue", [2, 4]), null, createPiece("blue", [2, 6]), null, createPiece("blue", [2, 8]), null, createPiece("blue", [2, 10]), null, null, null,],
			[null, createPiece("black", [3, 1]), null, null, null, null, null, null, null, null, null, createPiece("white", [3, 11]), null, createPiece("white", [3, 13]),],
			[createPiece("black", [4, 0]), null, createPiece("black", [4, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [4, 12]), null,],
			[null, createPiece("black", [5, 1]), null, null, null, null, null, null, null, null, null, createPiece("white", [5, 11]), null, createPiece("white", [5, 13]),],
			[createPiece("black", [6, 0]), null, createPiece("black", [6, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [6, 12]), null,],
			[null, createPiece("black", [7, 0]), null, null, null, null, null, null, null, null, null, createPiece("white", [7, 11]), null, createPiece("white", [7, 13]),],
			[createPiece("black", [8, 0]), null, createPiece("black", [8, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [8, 12]), null,],
			[null, createPiece("black", [9, 0]), null, null, null, null, null, null, null, null, null, createPiece("white", [9, 11]), null, createPiece("white", [9, 13]),],
			[createPiece("black", [10, 0]), null, createPiece("black", [10, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [10, 12]), null,],
			[null, null, null, null, null, null, null, null, null, null, null, null, null, null,],
			[null, null, null, createPiece("gold", [11, 3]), null, createPiece("gold", [10, 5]), null, createPiece("gold", [10, 7]), null, createPiece("gold", [10, 9]), null, null, null, null,],
			[null, null, null, null, createPiece("gold", [12, 4]), null, createPiece("gold", [12, 6]), null, createPiece("gold", [12, 8]), null, createPiece("gold", [12, 10]), null, null, null,],
			[null, null, null, createPiece("gold", [13, 3]), null, createPiece("gold", [13, 5]), null, createPiece("gold", [13, 7]), null, createPiece("gold", [13, 9]), null, null, null, null,]];
}