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
var numberOfClients = 0;
var board = createBoard();
var players = ['red', 'white', 'gold', 'blue'];
var availablePlayers = ['red', 'white', 'gold', 'blue'];
var socketIDToColor = {};
var socketIDToSocket = {}
var colorToPoints = {};
var turnCounter = 0;
var turn = players[turnCounter % 4];

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
	socket.emit('player', colorForSocket, colorToPoints[colorForSocket]); // Send to client
	io.emit('board', JSON.stringify(board)); // Send current board to all sockets

	if (numberOfClients == 4) {
		io.emit('startGame', turn, colorToPoints[turn]);
	}

	/* If a player disconnects */
	socket.on('disconnect', function() {
		disconnectedColor = socketIDToColor[socket.id];
		availablePlayers.push(disconnectedColor);
		delete socketIDToColor[socket.id];
		numberOfClients--;
	});

	//pointKey signifies what move took place
	//0 --> normal move
	// -1 --> nonKing backwards move
	// 2 --> capture
	// 3 --> kingCapture

	socket.on('turnEnded', function(msg) {
		var newGameState = JSON.parse(msg);
		turnCounter++;
		socket.emit('player', turn, colorToPoints[turn]);
		turn = players[turnCounter % 4];
		io.emit('startGame', turn, colorToPoints[turn]);
	})

	socket.on('refreshBoard', function(JSONBoard, pointKey) {
		colorToPoints[turn] += pointKey;
		board = JSON.parse(JSONBoard);
		socket.emit('player', turn, colorToPoints[turn]);
		io.emit('board', JSON.stringify(board));
	})



    /* Messaging Client */
     socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    
});