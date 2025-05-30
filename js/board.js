const board = document.getElementById("chessboard");

// Files and ranks to generate square names
const files = ['a','b','c','d','e','f','g','h'];
const ranks = [8,7,6,5,4,3,2,1]; // rank 8 on top, rank 1 on bottom

const startingPosition = {
  a8: "♜", b8: "♞", c8: "♝", d8: "♛", e8: "♚", f8: "♝", g8: "♞", h8: "♜",
  a7: "♟", b7: "♟", c7: "♟", d7: "♟", e7: "♟", f7: "♟", g7: "♟", h7: "♟",
  a2: "♙", b2: "♙", c2: "♙", d2: "♙", e2: "♙", f2: "♙", g2: "♙", h2: "♙",
  a1: "♖", b1: "♘", c1: "♗", d1: "♕", e1: "♔", f1: "♗", g1: "♘", h1: "♖"
};


for (let r = 0; r < 8; r++) {
  for (let f = 0; f < 8; f++) {
    const square = document.createElement("div");
    const file = files[f];
    const rank = ranks[r];
    const squareName = file + rank;

    square.classList.add("square");

    // Color alternation
    if ((r + f) % 2 === 0) {
      square.classList.add("white");
    } else {
      square.classList.add("black");
    }

    square.id = squareName;
    square.textContent = startingPosition[squareName] || ""; // shows piece or blank

    board.appendChild(square);
  }
}
