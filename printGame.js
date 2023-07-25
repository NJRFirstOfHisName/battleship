export default function printGame(pBoard, cBoard) {
  const printBoard = (board) => {
    const prtBoard = document.createElement("div");
    prtBoard.className = "prtBoard";
    for (let i = 1; i < 10; i += 1) {
      const row = document.createElement("div");
      row.setAttribute("style", "display: flex;");
      for (let j = 1; j < 10; j += 1) {
        const square = document.createElement("div");
        square.setAttribute(
          "style",
          "border: 1px solid black; width: 20px; height: 20px;"
        );
        square.className("square");
        square.innerText = board.board[i][j];
        row.appendChild(square);
      }
      prtBoard.appendChild(row);
    }
    return prtBoard;
  };

  const container = document.querySelector("gameContainer");
  container.appendChild(printBoard(pBoard));
  container.appendChild(printBoard(cBoard));
}
