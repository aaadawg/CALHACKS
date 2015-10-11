function rotateClockwise(old_board) {
	var new_board = [[null, null, null, null, null, null, null, null, null, null, null, null], 
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null],
					 [null, null, null, null, null, null, null, null, null, null, null, null]];
	for (var i = 0; i < old_board[0].length; i++) {
        for (var j = 0; j < old_board[i].length; j++) {
            new_board[i][j] = old_board[old_board[i].length - j - 1][i];
        }
    }
	console.log(new_board);
	return new_board;
}

function drawboard(board) {
    $("#gameBoard").empty();
    for (var i = 0; i < board.length; i++) {
        $("#gameBoard").append("<tr id='row" + i + "'>");
        for (var j = 0; j < board[i].length; j++) {
            var elem = board[i][j];
            if (elem == null) {
                $("#row" + i).append("<td hasPiece='false' class='location' id=" + i + "-" + j + "></td>");
            } else if (!elem.isKing) {
                $("#row" + i).append("<td hasPiece='true' class='location' id='" + i + "-" + j + "'><a href='#' class='pawn " + elem.team + "'>&#9762;</a></td>");
            } else {
            	$("#row" + i).append("<td hasPiece='true' class='location' id='" + i + "-" + j + "'><a href='#' class='pawn " + elem.team + "'>&#9812;</a></td>");
            }
        }
        $("#gameBoard").append("</tr>");

    }
}


function canSelect(piece) {
	if (piece != null && piece.team == turn) {
		if (!hasMoved) {
			return true;
		}
	} else if (piece != null && piece.team != player && turn == player) {
		sweetAlert("Oops...", "You clicked the wrong team's piece!", "error");
	}
	return false;
}

function canMove(piece, src, dest) {

	if (hasSelectedPiece) {
		if (movedBackwards(piece, src, dest)) {
			if (playerPoints < 1) {
				return -1;
			}
		}
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
				} else if (!hasMoved) {
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
					} else if (!hasMoved) {
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
	moveKey = 0;
}

function canKing(piece, location) {
	if (piece.team == "gold" && location[0] == 0) {
		return true;
	} else if (piece.team == "blue" && location[0] == 11) {
		return true;
	} else if (piece.team == "red" && location[1] == 11) {
		return true;
	} else if (piece.team == "white" && location[1] == 0) {
		return true;
	} else {
		return false;
	}
}

function getPiece(board, src) {
	return board[src[0]][src[1]];
}

function movedBackwards(piece, src, dest) {
	if (piece.isKing) {
		return true;
	}
	var zeroDiff = dest[0] - src[0];
	var oneDiff = dest[1] - src[1];
	if (piece.team == "gold") {
		if (zeroDiff == 1 || zeroDiff == 2) {
			return true;
		}
	} else if (piece.team == "blue") {
		if (zeroDiff == -1 || zeroDiff == -2) {
			return true;
		}
	} else if (piece.team == "white") {
		if (oneDiff == 1 || oneDiff == 2) {
			return true;
		}
	} else if (piece.team == "red") {
		if (oneDiff == -1 || oneDiff == -2) {
			return true;
		}
	} 
	return false;
}