/*************************************************************************
 * Laucity
 *
 *************************************************************************
 *
 * @description Server logic
 * 
 * 
 * @author Rohit Lalchandani, Anish Balaji, Pranay Kumar, Brennen Nelson
 * 
 *
 *************************************************************************/


/************************
 * Creates a web server *
 ************************/
var express = require('express'), // Creates an express instance
    app = express(),
    server = require('http').createServer(app), // Creates a web server
    io = require('socket.io').listen(server); // Creates a socket.io instance

server.listen(process.env.PORT || 3000); // Listening port for server
console.log("Listening");

/* Serve static content */
app.use(express.static('public'));

// Routing for webpages
app.get('/', function(req, res) {
  res.sendfile("chessboard.html");
});


/**************
 * Game Logic *
 **************/
var numberOfClients = 0;
var board = createBoard();
var players = ['black', 'white', 'gold', 'blue'];
var availablePlayers = ['black', 'white', 'gold', 'blue'];
var socketIDToColor = {};
var socketIDToSocket = {}
var turn = players[0];


/* Create a new piece object */
function createPiece(team, position) {
	piece = new Object();
	piece.team = team;
	piece.isKing = false;
	return piece;
}

// COME BACK AND REMOVE POSITIONS
// Creates Initial Board
function createBoard() {
	return [[null, null, null, createPiece("blue", [2, 4]), null, createPiece("blue", [2, 6]), null, createPiece("blue", [2, 8]), null, createPiece("blue", [2, 10]), null, null],
			[null, null, createPiece("blue", [1, 3]), null, createPiece("blue", [1, 5]), null, createPiece("blue", [1, 7]), null, createPiece("blue", [1, 9]), null, null, null],
			[createPiece("black", [3, 1]), null, null, null, null, null, null, null, null, null, createPiece("white", [3, 11]), null],
			[null, createPiece("black", [4, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [4, 12])],
			[createPiece("black", [5, 1]), null, null, null, null, null, null, null, null, null, createPiece("white", [5, 11]), null],
			[null, createPiece("black", [6, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [6, 12])],
			[createPiece("black", [7, 0]), null, null, null, null, null, null, null, null, null, createPiece("white", [7, 11]), null],
			[null, createPiece("black", [8, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [8, 12])],
			[createPiece("black", [9, 0]), null, null, null, null, null, null, null, null, null, createPiece("white", [9, 11]), null],
			[null, createPiece("black", [10, 2]), null, null, null, null, null, null, null, null, null, createPiece("white", [10, 12])],
			[null, null, null, createPiece("gold", [12, 4]), null, createPiece("gold", [12, 6]), null, createPiece("gold", [12, 8]), null, createPiece("gold", [12, 10]), null, null],
			[null, null, createPiece("gold", [11, 3]), null, createPiece("gold", [10, 5]), null, createPiece("gold", [10, 7]), null, createPiece("gold", [10, 9]), null, null, null]];
}

/*************************
 * Socket.io Connections *
 *************************/
io.on('connection', function(socket) {
	
	numberOfClients++;

	/* Send initial data to client */
	colorForSocket = availablePlayers.pop(); // Choose an available player
	socketIDToColor[socket.id] = colorForSocket; // Add to dictionary
	socketIDToSocket[socket.id] = socket; // Add to socket dictionary
	socket.emit('player', colorForSocket); // Send to client
	io.emit('board', JSON.stringify(board)); // Send current board to all sockets

	if (numberOfClients >= 1) {
		io.emit('startGame', turn);
	}

	/* If a player disconnects */
	socket.on('disconnect', function() {
		disconnectedColor = socketIDToColor[socket.id];
		availablePlayers.push(disconnectedColor);
		delete socketIDToColor[socket.id];
		numberOfClients--;
	});

	socket.on('endTurn', function(msg) {
		var newGameState = JSON.parse(msg);

	})
	
});