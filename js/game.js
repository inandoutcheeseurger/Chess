let selectedSquareId = null;  // stores the id of the selected square, e.g. "e2"
let selectedPiece = null;     // stores the piece emoji, e.g. "♙"
let lastMove = null;
let enPassantCaptureSquare = null;  // globally track the actual square to remove a pawn from
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
    if(square.classList.contains("validMove")){
      // Move piece: set target square text to piece, clear source square text
      updateLastMove(sourceSquare.id, square.id, selectedPiece);
      square.textContent = selectedPiece;
      sourceSquare.textContent = "";
      // Check and handle en passant capture
      if (enPassantCaptureSquare) {
        const captured = document.getElementById(enPassantCaptureSquare);
        if (captured.textContent === '♟'){
          const enPassantMoveSquare = enPassantCaptureSquare[0] + (parseInt(enPassantCaptureSquare[1], 10) + 1).toString();
          console.log(enPassantMoveSquare);
          if(square.id === enPassantMoveSquare){
            captured.textContent = "";
          }
        }
        else if(captured.textContent === '♙'){
          const enPassantMoveSquare = enPassantCaptureSquare[0] + (parseInt(enPassantCaptureSquare[1], 10) - 1).toString();
          console.log(enPassantMoveSquare);
          if(square.id === enPassantMoveSquare){
            captured.textContent = "";
          }
        }
      }
      enPassantCaptureSquare = null; // Always reset after move
      sourceSquare.classList.remove('selected');
      clearValidMoveHighlights();

      // Switch turns
      currentTurn = currentTurn === 'white' ? 'black' : 'white';
      whosTurn.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1) + "'s Turn";
      selectedSquareId = null;
      selectedPiece = null;
    } else {
      alert("Unvalid move: try again");
    }

    

  
}

function findValidMoves(squareId, piece){
  const validMoves = [];
  const row = parseInt(squareId[1], 10); // e.g., "e2" -> 2 // 1,2,3,4 so on
  const col = squareId.charCodeAt(0) - 97; // e.g., "e2" -> 'e' -> 4 (zero-based index) a,b,c,d so on

  if (piece === '♙'){ // white pawn
    const pieceOneFront = document.getElementById(String.fromCharCode(col + 97) + (row + 1)).textContent;
    const pieceTwoFront = document.getElementById(String.fromCharCode(col + 97) + (row + 2)).textContent;
    if(!pieceOneFront && row < 8){
      validMoves.push(String.fromCharCode(col + 97) + (row + 1));
      if (!pieceTwoFront && row === 2){ // if it is their first move, they can also go up by 2
        validMoves.push(String.fromCharCode(col + 97) + (row + 2));
      }
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
    const enPassantMove =checkEnPassant(row, col, piece);
    console.log("enpassant square: " + enPassantMove);

    if (enPassantMove){
      console.log("enpassant should be availiable?");
      validMoves.push(enPassantMove);
    } 
    console.log(validMoves);

  }

  else if(piece ==='♟'){
    const pieceOneFront = document.getElementById(String.fromCharCode(col + 97) + (row - 1)).textContent;
    const pieceTwoFront = document.getElementById(String.fromCharCode(col + 97) + (row - 2)).textContent;
    if(!pieceOneFront && row > 1){
      validMoves.push(String.fromCharCode(col + 97) + (row - 1));
      if (!pieceTwoFront && row === 7){
        validMoves.push(String.fromCharCode(col + 97) + (row - 2));
      }
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
    const enPassantMove = checkEnPassant(row, col, piece);
    console.log("enpassant square: " + enPassantMove);
    if (enPassantMove){
      validMoves.push(enPassantMove);
    } 
    console.log(validMoves);
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
  else if (piece === '♗' || piece === '♝') { // white or black bishop
    const bishopDirections = [
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1]  // down-left
    ];
    bishopRookQueenMovement(bishopDirections, validMoves, row, col, piece);
  }
  else if (piece === '♖' || piece === '♜') { // white or black rook
    const rookDirections = [
      [1, 0],   // up
      [-1, 0],  // down
      [0, -1],  // left
      [0, 1]  // right
    ];
    bishopRookQueenMovement(rookDirections, validMoves, row, col, piece);
  }
  else if (piece === '♕' || piece === '♛') { // white or black queen
    const queenDirections = [
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1],  // down-left
      [1, 0],   // up
      [-1, 0],  // down
      [0, -1],  // left
      [0, 1]  // right
    ];
    bishopRookQueenMovement(queenDirections, validMoves, row, col, piece);
  }
  else if (piece ==='♔' || piece ==='♚'){
    const directions = [
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1],  // down-left
      [1, 0],   // up
      [-1, 0],  // down
      [0, -1],  // left
      [0, 1]  // right
    ];
    for (let [dr, dc] of directions){
      const newRow = row + dr;
      const newCol = col + dc;
      validMoves.push(String.fromCharCode(newCol + 97) + newRow);
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

function updateLastMove(fromSquare, toSquare, piece) {
  lastMove = { from: fromSquare, to: toSquare, piece: piece };
  console.log(lastMove);
}
// Function to check for en passant
function checkEnPassant(row, col, piece) {
  enPassantCaptureSquare = null;
  // Get the last move information
  if (lastMove && lastMove.piece !== piece) {
    const lastMoveFromRow = parseInt(lastMove.from[1], 10);
    const lastMoveToRow = parseInt(lastMove.to[1], 10);
    const lastMoveFromCol = lastMove.from.charCodeAt(0) - 97;
    const lastMoveToCol = lastMove.to.charCodeAt(0) - 97;


    if (
      piece === '♙' &&
      lastMove.piece === '♟' &&
      lastMoveFromRow === 7 && lastMoveToRow === 5 &&
      row === 5 && // Your pawn must be on the 5th rank
      Math.abs(lastMoveToCol - col) === 1 // pawn must next to each other
    ) {
      enPassantCaptureSquare = String.fromCharCode(lastMoveToCol + 97) + "5";  // Remove black pawn on 5th rank
      return String.fromCharCode(lastMoveToCol + 97) + "6";
    }
    
    else if (
      piece === '♟' &&
      lastMove.piece === '♙' &&
      lastMoveFromRow === 2 && lastMoveToRow === 4 &&
      row === 4 && // Your pawn must be on the 4th rank
      Math.abs(lastMoveToCol - col) === 1 // pawn must next to each other
    ) {
      enPassantCaptureSquare = String.fromCharCode(lastMoveToCol + 97) + "4"; // Remove white pawn on 4th rank
      return String.fromCharCode(lastMoveToCol + 97) + "3";
    }
  }

  return;
}

function bishopRookQueenMovement(directions, validMoves, row, col, piece){
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

function isInCheck(color) {
  const kingPos = findKing(color);
  const opponentColor = (color === "white") ? "black" : "white";
  const opponentMoves = getAllAttackingMoves(opponentColor); // NOT filtered by self-check!

  return opponentMoves.some(move => move.to === kingPos);
}

function findKing(color){
  const squares = document.querySelectorAll("#chessboard div"); // all divs inside chessboard

  if (color === "white"){
    console.log("got in white?");
    for (let square of squares){
      if(square.textContent === "♔"){
        return square.id;
      }
    }
  } else if (color === "black") {
    for (let square of squares){
      if(square.textContent === "♚"){
        return square.id;
      }
    }
  } else {
    alert("error: in function findKing, the color is not defined wtf is event this bruv");
    return;
  }
}

function getAllAttackingMoves(color){ // maybe use that findValidMoves functions ig bruv
  const attackedSquares = [];
  const squares = document.querySelectorAll("#chessboard div"); // all divs inside chessboard

  if (color === "white"){
    for(let square of squares){
      if (isWhitePiece(square.textContent)){
        attackedSquares.push(findValidMoves(square.textContent));
      }
    }
  } else if(color === "black"){
    for(let square of squares){
      if (isBlackPiece(square.textContent)){
        attackedSquares.push(findValidMoves(square.textContent));
      }
    }
  }
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
