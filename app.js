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
var deadPlayers = [];
var socketIDToColor = {};
var socketIDToSocket = {}
var colorToSocket = {}
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

    // return [[null, null, null, null, null, null, null, null, null, null, null, null], 
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, createPiece("gold"), createPiece("red"), null, null, null, null, null, null, null, null],
				// 	 [null, null, createPiece("white"), createPiece("blue"), null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null],
				// 	 [null, null, null, null, null, null, null, null, null, null, null, null]]; TESTCASE FOR QUICK WINS
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
	colorToSocket[colorForSocket] = socket;
	colorToPoints[colorForSocket] = DEFAULT_POINTS; //Every player gets 2 points to start
	pieceCounts[colorForSocket] = NUM_PIECES_START; //Every color starts with 8 pieces
	socket.emit('player', colorForSocket, JSON.stringify(colorToPoints)); // Send to client
	io.emit('board', JSON.stringify(board)); // Send current board to all sockets
	io.emit('allPieces', JSON.stringify(pieceCounts));
	io.emit('updateGameState', turn, JSON.stringify(colorToPoints), JSON.stringify(pieceCounts));
	if (numberOfClients == 4) {
		io.emit('updateGameState', turn, JSON.stringify(colorToPoints), JSON.stringify(pieceCounts));
	}

	/* If a player disconnects */
	socket.on('disconnect', function() {
		disconnectedColor = socketIDToColor[socket.id];
		availablePlayers.push(disconnectedColor);
		delete socketIDToColor[socket.id];
		delete colorToPoints[disconnectedColor];
		delete pieceCounts[disconnectedColor];
		delete colorToSocket[disconnectedColor];
		numberOfClients--;
		io.emit('updateGameState', turn, JSON.stringify(colorToPoints), JSON.stringify(pieceCounts));
	});

	/* If a piece is captured. */
	socket.on('pieceCaptured', function(team) {
		pieceCounts[team] -= 1;
		io.emit('updateGameState', turn, JSON.stringify(colorToPoints), JSON.stringify(pieceCounts));
		if (pieceCounts[team] == 0) {
			//socket.emit('youLost', team);
			//var index = players.indexOf(team);
			//players.splice(index, 1);
			deadPlayers.push(team);
			console.log("dead:");
			console.log(team);
			if (deadPlayers.length == 3) {
				var winner;
				for (var p in players) {
					if (deadPlayers.indexOf(p) == -1) {
						winner = p;
						break;
					}
				}

				socket.emit('youWin', winner);
				// END GAME
			}
		}
	});

	// pointKey signifies what move took place
	//  0 --> normal move
	// -1 --> nonKing backwards move
	//  2 --> capture
	//  3 --> king was captured

	socket.on('turnEnded', function(msg) {
		console.log("turn ended");
		var newGameState = JSON.parse(msg);
		io.emit('killedPlayers', JSON.stringify(deadPlayers));
		turnCounter++;
		socket.emit('player', turn, JSON.stringify(colorToPoints));
		turn = players[turnCounter % (players.length)];

		while (deadPlayers.indexOf(turn) != -1) {
			turnCounter ++;
			turn = players[turnCounter % (players.length)];
		}

		io.emit('newTurn', turn);
		io.emit('updateGameState', turn, JSON.stringify(colorToPoints), JSON.stringify(pieceCounts));
	});

	socket.on('refreshBoard', function(JSONBoard, pointKey) {
		colorToPoints[turn] += pointKey;
		board = JSON.parse(JSONBoard);
		socket.emit('player', turn, JSON.stringify(colorToPoints));
		io.emit('updateGameState', turn, JSON.stringify(colorToPoints), JSON.stringify(pieceCounts));
		io.emit('board', JSON.stringify(board));
	});

    /* Messaging Client */
     socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    
});