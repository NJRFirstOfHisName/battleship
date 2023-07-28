export default function setSquare(GB, square, x, y) {
  const newSquare = square;
  const board = GB.getBoard();
  if (board[x][y] < -1) {
    newSquare.innerText = "";
    newSquare.className = "hit";
  } else {
    switch (board[x][y]) {
      case 0:
        newSquare.innerText = "";
        newSquare.className = "square empty";
        break;
      case 9:
        newSquare.innerText = "";
        newSquare.className = "miss";
        break;
      case -1:
        newSquare.innerText = "";
        newSquare.className = "sunk";
        break;
      default:
        if (GB.isComp()) {
          newSquare.innerText = "";
          newSquare.className = "square ship";
        } else {
          newSquare.innerText = "";
          newSquare.className = "square ship";
        }
        break;
    }
  }
  return newSquare;
}
