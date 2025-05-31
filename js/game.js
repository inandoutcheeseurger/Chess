let selectedSquareId = null;  // stores the id of the selected square, e.g. "e2"
let selectedPiece = null;     // stores the piece emoji, e.g. "♙"
let currentTurn = 'white';    // track who's turn it is (optional now)

function onSquareClick(e) {
  const square = e.target;
  const piece = square.textContent;
  console.log(square);
  console.log(piece);

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
  } else {
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
    selectedSquareId = null;
    selectedPiece = null;

  }
}

function isWhitePiece(piece) {
    return ['♙','♖','♘','♗','♕','♔'].includes(piece);
  }
  
  function isBlackPiece(piece) {
    return ['♟','♜','♞','♝','♛','♚'].includes(piece);
  }
  

