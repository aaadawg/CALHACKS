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

function drawboard(board) {
	for (var i = 0; i < board.length; i++) {
		$("#chess_board").append("<tr>");
		for (var j = 0; j < board[i].length; j++) {
			if (elem == null) {
				$("#chess_board").append("<td class='location' id=" + i + "-" + j "></td>");
			} else {
				$("#chess_board").append("<td id=" + i + "-" + j " class='location pawn " + " " + elem.team ">&#9823; </td>");
			}	
		}
		$("#chess_board").append("</tr>");
	}
}