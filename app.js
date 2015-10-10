/*************************************************************************
 * Laucity
 * CalHacks TeamFAB
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
var turnCounter = 0;
var turn = players[turnCounter % 4];



/* Create a new piece object */
function createPiece(team) {
	piece = new Object();
	piece.team = team;
	piece.isKing = false;
	return piece;
}

// COME BACK AND REMOVE POSITIONS
// Creates Initial Board
function createBoard() {
	return [[null, null, null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, null],
			[null, null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, null, null],
			[createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
			[null, createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white")],
			[createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
			[null, createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white")],
			[createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
			[null, createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white")],
			[createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
			[null, createPiece("black"), null, null, null, null, null, null, null, null, null, createPiece("white")],
			[null, null, null, createPiece("gold"), null, createPiece("gold"), null, createPiece("gold"), null, createPiece("gold"), null, null],
			[null, null, createPiece("gold"), null, createPiece("gold"), null, createPiece("gold"), null, createPiece("gold"), null, null, null]];
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

	socket.on('turnEnded', function(msg) {
		var newGameState = JSON.parse(msg);
		turnCounter++;
		turn = players[turnCounter % 4];
		io.emit('startGame', turn);
	})

	socket.on('refreshBoard', function(JSONBoard) {
		board = JSON.parse(JSONBoard);
		io.emit('board', JSON.stringify(board));
	})
	
});