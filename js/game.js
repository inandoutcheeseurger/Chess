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

      // highlight validmoves
      const validMoves = findValidMoves(selectedSquareId, selectedPiece);
      addValidMoveHighlights(validMoves);
    }
    return;
  }
    // Piece already selected - try to move to this square
    
    const sourceSquare = document.getElementById(selectedSquareId);
    // prevent taking your own piece
    if ((currentTurn === 'white' && isWhitePiece(piece)) ||
        (currentTurn === 'black' && isBlackPiece(piece))) {
        // select a different piece of your own
        clearValidMoveHighlights();
        sourceSquare.classList.remove('selected');
        selectedSquareId = square.id;
        selectedPiece = piece;
        square.classList.add('selected');
        const validMoves = findValidMoves(selectedSquareId, selectedPiece);
        addValidMoveHighlights(validMoves);
        return;
    }

    // Move piece: set target square text to piece, clear source square text
    square.textContent = selectedPiece;
    sourceSquare.textContent = "";
    sourceSquare.classList.remove('selected');
    clearValidMoveHighlights();

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
    if(row < 8){
      validMoves.push(String.fromCharCode(col + 97) + (row + 1));
    }

    if (row === 2){ // if it is their first move, they can also go up by 2
      validMoves.push(String.fromCharCode(col + 97) + (row + 2));
    }
    // Check diagonal captures (up-left and up-right)
    // Up-left (row + 1, col - 1)
    if (row < 8 && col > 0) { // Make sure we're not out of bounds
      const diagLeft = String.fromCharCode(col - 1 + 97) + (row + 1);
      const targetPiece = document.getElementById(diagLeft).textContent;
      if (isBlackPiece(targetPiece)){
        validMoves.push(diagLeft);
      }
      
    }

    // Up-right (row + 1, col + 1)
    if (row < 8 && col < 7) { // Make sure we're not out of bounds
      const diagRight = String.fromCharCode(col + 1 + 97) + (row + 1);
      const targetPiece = document.getElementById(diagRight).textContent;
      if (isBlackPiece(targetPiece)){
        validMoves.push(diagRight);
      }
    }

  }

  else if(piece ==='♟'){
    if(row > 1){
      validMoves.push(String.fromCharCode(col + 97) + (row - 1));
    }

    if (row === 7){
      validMoves.push(String.fromCharCode(col + 97) + (row - 2));
    }

    // Check diagonal captures (up-left and up-right)
    // down-left (row - 1, col - 1)
    if (row > 1 && col > 0) { // Make sure we're not out of bounds
      const diagLeft = String.fromCharCode(col - 1 + 97) + (row - 1);
      const targetPiece = document.getElementById(diagLeft).textContent;
      if (isWhitePiece(targetPiece)){
        validMoves.push(diagLeft);
      }
      
    }

    // Up-right (row - 1, col + 1)
    if (row > 1 && col < 7) { // Make sure we're not out of bounds
      const diagRight = String.fromCharCode(col + 1 + 97) + (row - 1);
      const targetPiece = document.getElementById(diagRight).textContent;
      if (isWhitePiece(targetPiece)){
        validMoves.push(diagRight);
      }
    }
  }
  
  else if (piece ==='♘' || piece ==='♞'){
    const knightMoves = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    for (let [dr, dc] of knightMoves){
      const newRow = row + dr;
      const newCol = col + dc;
      validMoves.push(String.fromCharCode(newCol + 97) + newRow);
    }
  }
  if (piece === '♗' || piece === '♝') { // white or black bishop
    const directions = [
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1]  // down-left
    ];
  
    for (let [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 1 && r <= 8 && c >= 0 && c <= 7) {
        const targetId = String.fromCharCode(c + 97) + r;
        const targetSquare = document.getElementById(targetId);
        if (!targetSquare) break;
  
        const targetPiece = targetSquare.textContent;
  
        // Stop if it's an ally piece
        if (
          (isWhitePiece(piece) && isWhitePiece(targetPiece)) ||
          (isBlackPiece(piece) && isBlackPiece(targetPiece))
        ) break;
  
        validMoves.push(targetId);
  
        // Stop if it's an enemy piece after capturing
        if (
          (isWhitePiece(piece) && isBlackPiece(targetPiece)) ||
          (isBlackPiece(piece) && isWhitePiece(targetPiece))
        ) break;
  
        r += dr;
        c += dc;
      }
    }
  }
  
  console.log(validMoves);
  return filterValidMoves(validMoves, piece);
}

function filterValidMoves(validMoves, piece) {
  const filtered = [];

  for (let move of validMoves) {
    // if there are something like c-2 it just goes through
    if (move.length!== 2) continue;

    const col = move.charCodeAt(0) - 97;
    const row = parseInt(move[1], 10);

    // Bound check
    if (col < 0 || col > 7 || row < 1 || row > 8) continue;
    const targetPiece = document.getElementById(move).textContent;
    if (!targetPiece) {
      // Square is empty — always valid
      filtered.push(move);
    } else if (
      (isWhitePiece(piece) && isBlackPiece(targetPiece)) ||
      (isBlackPiece(piece) && isWhitePiece(targetPiece))
    ) {
      // Square has an enemy piece — valid capture
      filtered.push(move);
    }
    // If square has same-color piece, we skip it
  }

  return filtered;
}


function isWhitePiece(piece) {
  return ['♙','♖','♘','♗','♕','♔'].includes(piece);
}
  
function isBlackPiece(piece) {
  return ['♟','♜','♞','♝','♛','♚'].includes(piece);
}
  
function addValidMoveHighlights(validMoves) {
  for(let moves of validMoves){
    const canMove = document.getElementById(moves);
    canMove.classList.add("validMove");
  }
}

function clearValidMoveHighlights() {
  const highlighted = document.querySelectorAll('.validMove');
  highlighted.forEach(square => square.classList.remove('validMove'));
}
