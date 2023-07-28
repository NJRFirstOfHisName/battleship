export default function setSquare(GB, square, x, y) {
  const newSquare = square;
  const board = GB.getBoard();
  if (board[x][y] < 0 && board[x][y] > -9) {
    newSquare.className = "hit";
  } else {
    switch (board[x][y]) {
      case 0:
        newSquare.className = "square empty";
        break;
      case 9:
        newSquare.className = "miss";
        break;
      case -9:
        newSquare.className = "sunk";
        break;
      default:
        if (GB.isComp()) {
          newSquare.className = "square ship";
        } else {
          newSquare.className = "square ship";
        }
        break;
    }
  }
  return newSquare;
}
