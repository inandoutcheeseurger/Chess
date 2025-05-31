let selectedSquareId = null;  // stores the id of the selected square, e.g. "e2"
let selectedPiece = null;     // stores the piece emoji, e.g. "♙"
let currentTurn = 'white';    // track who's turn it is (optional now)
const whosTurn = document.getElementById("whosTurn"); // get's the who's turn id
whosTurn.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1) + "'s Turn";
function onSquareClick(e) {
  const square = e.target;
  const piece = square.textContent;

  if (!selectedSquareId) {
    // No piece selected yet
    if (piece &&
        (
            // check if the player choose their piece not oppenent's
            currentTurn === 'white' && isWhitePiece(piece) ||
            currentTurn === 'black' && isBlackPiece(piece)
        )
    ) {
      // Select only if piece belongs to current player (optional)
      selectedSquareId = square.id;
      selectedPiece = piece;
      square.classList.add('selected'); // highlight selected
    }
    return;
  }
    // Piece already selected - try to move to this square
    
    const sourceSquare = document.getElementById(selectedSquareId);
    // prevent taking your own piece
    if ((currentTurn === 'white' && isWhitePiece(piece)) ||
        (currentTurn === 'black' && isBlackPiece(piece))) {
        // select a different piece of your own
        sourceSquare.classList.remove('selected');
        selectedSquareId = square.id;
        selectedPiece = piece;
        square.classList.add('selected');
        return;
    }

    // Move piece: set target square text to piece, clear source square text
    square.textContent = selectedPiece;
    sourceSquare.textContent = "";
    sourceSquare.classList.remove('selected');

    // Switch turns
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    whosTurn.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1) + "'s Turn";
    selectedSquareId = null;
    selectedPiece = null;
    

  
}

function findValidMoves(squareId, piece){
  const validMoves = [];
  const row = parseInt(squareId[1], 10); // e.g., "e2" -> 2 // 1,2,3,4 so on
  const col = squareId.charCodeAt(0) - 97; // e.g., "e2" -> 'e' -> 4 (zero-based index) a,b,c,d so on

  if (piece === '♙'){ // white pawn

    validMoves.push(String.fromCharCode(col + 97) + (row + 1));

    if (row === 2){ // if it is their first move, they can also go up by 2
      validMoves.push(String.fromCharCode(col + 97) + (row + 2));
    }
    if (/* there is a piece in the diagnal */){
      // add to the validMoves 
    }
    return filterValidMoves(validMoves);
  }
}

function filterValidMoves(validMoves){
  // check if the validMoves squares are not valid due to blocked by some pieces, or there is a piece of your teammates.
}

function isWhitePiece(piece) {
  return ['♙','♖','♘','♗','♕','♔'].includes(piece);
}
  
function isBlackPiece(piece) {
  return ['♟','♜','♞','♝','♛','♚'].includes(piece);
}
  

