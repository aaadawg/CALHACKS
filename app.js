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

/* Set Jade view engine */
app.set('view engine', 'jade');

// Routing for webpages
app.get('/', function(req, res) {
  //res.sendfile("chessboard.html");
  res.render('index');
});


/**************
 * Game Logic *
 **************/
var DEFAULT_POINTS = 2;
var NUM_PIECES_START = 8;
var numberOfClients = 0;
var board = createBoard();
var players = ['red', 'white', 'gold', 'blue'];
var availablePlayers = ['red', 'white', 'gold', 'blue'];
var socketIDToColor = {};
var socketIDToSocket = {}
var colorToPoints = {};
var turnCounter = 0;
var turn = players[turnCounter % (players.length)];
var pieceCounts = {};

/* Create a new piece object */
function createPiece(team) {
    piece = new Object();
    piece.team = team;
    piece.isKing = false;
    return piece;
}

/* Creates Initial Board */
function createBoard() {
    return [[null, null, null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, null],
            [null, null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, createPiece("blue"), null, null, null],
            [createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
            [null, createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white")],
            [createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
            [null, createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white")],
            [createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
            [null, createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white")],
            [createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white"), null],
            [null, createPiece("red"), null, null, null, null, null, null, null, null, null, createPiece("white")],
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
	colorToPoints[colorForSocket] = DEFAULT_POINTS; //Every player gets 2 points to start
	pieceCounts[colorForSocket] = NUM_PIECES_START; //Every color starts with 8 pieces
	socket.emit('player', colorForSocket, JSON.stringify(colorToPoints)); // Send to client
	io.emit('board', JSON.stringify(board)); // Send current board to all sockets
	io.emit('allPieces', JSON.stringify(pieceCounts));

	if (numberOfClients == 4) {
		io.emit('startGame', turn, JSON.stringify(colorToPoints));
	}

	/* If a player disconnects */
	socket.on('disconnect', function() {
		disconnectedColor = socketIDToColor[socket.id];
		availablePlayers.push(disconnectedColor);
		delete socketIDToColor[socket.id];
		numberOfClients--;
	});

	/* If a piece is captured. */
	socket.on('pieceCaptured', function(team) {
		pieceCounts[team] -= 1;
		io.emit('allPieces', JSON.stringify(pieceCounts));
		if (pieceCounts[team] == 0) {
			socket.emit('youLost', team);
			var index = players.indexOf(team);
			players.splice(index, 1);
			if (players.length == 1) {
				socket.emit('youWin', players[0]);
				// END GAME
			}
		}
	});

	// pointKey signifies what move took place
	// 0 --> normal move
	//-1 --> nonKing backwards move
	// 2 --> capture
	// 3 --> kingCapture

	socket.on('turnEnded', function(msg) {
		var newGameState = JSON.parse(msg);
		turnCounter++;
		socket.emit('player', turn, JSON.stringify(colorToPoints));
		turn = players[turnCounter % (players.length)];
		io.emit('startGame', turn, JSON.stringify(colorToPoints));
	})

	socket.on('refreshBoard', function(JSONBoard, pointKey) {
		colorToPoints[turn] += pointKey;
		board = JSON.parse(JSONBoard);
		socket.emit('player', turn, JSON.stringify(colorToPoints));
		io.emit('startGame', turn, JSON.stringify(colorToPoints));
		io.emit('board', JSON.stringify(board));
	})



    /* Messaging Client */
     socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    
});