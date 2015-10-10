function canSelect(piece) {
	if (piece == null || turn !== player) {
		return false;
	}
	if (piece.team === player && !hasMoved) {
		return true;
	}
}

function canMove(piece, src, dst) {
	if (pieceSelected) {
		var diffX = Math.abs(src[0] - dest[0]);
		var diffY = Math.abs(src[1] - dest[1]);
		var product = diffX * diffY;
		var sum = diffX + diffY;
		if (board[dest[0]][dest[1]] === null) { //make sure place clicked has no piece
			if (piece.isKing && (product == 1 || product == 4)) {
				if (product === 4)  { //capture diagonal
					var enemyPiece = board[(src[0] + dest[0])/2][(src[1] + dest[1])/2];
					if (enemyPiece !== null && enemyPiece.team != player) {//enemyPiece on different team
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
						if (enemyPiece !== null && enemyPiece.team != player) {//enemyPiece on different team
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

//global booleans: pieceSelected, hasMoved