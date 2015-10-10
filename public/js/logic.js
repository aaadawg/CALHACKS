function drawboard(board) {
    $("#chess_board").empty();
    for (var i = 0; i < board.length; i++) {
        $("#chess_board").append("<tr id='row" + i + "'>");
        for (var j = 0; j < board[i].length; j++) {
            var elem = board[i][j];
            if (elem == null) {
                $("#row" + i).append("<td hasPiece='false' class='location' id=" + i + "-" + j + "></td>");
            } else {
                $("#row" + i).append("<td hasPiece='true' class='location' id='" + i + "-" + j + "'><a href='#' class='pawn " + elem.team + "'>&#9823;</a></td>");
            }   
        }
        $("#chess_board").append("</tr>");

    }
}


function canSelect(piece) {
	if (piece == null || turn !== player) {
		return false;
	}
	if (piece.team === player && !hasMoved) {
		return true;
	}
}

function canMove(piece, src, dest) {

	if (hasSelectedPiece) {
		var diffX = Math.abs(src[0] - dest[0]);
		var diffY = Math.abs(src[1] - dest[1]);
		var product = diffX * diffY;
		var sum = diffX + diffY;
		if (board[dest[0]][dest[1]] == null) { //make sure place clicked has no piece
			if (piece.isKing && (product == 1 || product == 4)) {
				if (product === 4)  { //capture diagonal
					var enemyPiece = board[(src[0] + dest[0])/2][(src[1] + dest[1])/2];
					if (enemyPiece != null && enemyPiece.team != player) {//enemyPiece on different team
						return 1; // move is a capture
					}
				} else {
					return 0; // move is not a capture
				}
			} else if (!piece.isKing || (piece.isKing && product === 0)) {
				if (sum <= 2 && product === 0) { //move or jump
					if (sum === 2) {//jump
						var enemyPiece = null;
						if (diffX === 0) { //enemy piece is aligned on y axis
							enemyPiece = board[dest[0]][(src[1] + dest[1])/2];
						} else { //aligned on x axis
							enemyPiece = board[(src[0] + dest[0])/2][dest[1]];
						}
						if (enemyPiece != null && enemyPiece.team != player) {//enemyPiece on different team
							return 1; // move is a capture;
						}
					} else {
						return 0; // move is not a capture
					}
				}
			}
		}
	}
	return -1; // can't move
}

function endTurn() {
	hasSelectedPiece = false;
	hasMoved = false;
	selectedPiece = null;
	src = null;
}

function canKing(piece, location) {
	if (piece.team == "gold" && location[1] == 0) || (piece.team == "blue" && location[1] == 11) || (piece.team == "red" && location[0] == 11) || (piece.team == "white" && location[0] == 0) {
		return true;
	}
	return false;
}