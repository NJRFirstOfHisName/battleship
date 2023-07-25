export default function printGame(pBoard, cBoard) {
  console.log(pBoard);
  const printBoard = (board) => {
    const prtBoard = document.createElement("div");
    prtBoard.className = "prtBoard";
    for (let i = 0; i < 10; i += 1) {
      const row = document.createElement("div");
      row.setAttribute("style", "display: flex;");
      for (let j = 0; j < 10; j += 1) {
        const square = document.createElement("div");
        square.setAttribute(
          "style",
          "border: 1px solid black; width: 40px; height: 40px;"
        );
        switch (board[i][j]) {
          case 0:
            square.innerText = "";
            square.className = "square empty";
            break;
          case 8:
            square.innerText = "O";
            square.className = "square miss";
            break;
          case 9:
            square.innerText = "X";
            square.className = "square hit";
            break;
          default:
            square.innerText = "";
            square.className = "square ship";
            break;
        }
        row.appendChild(square);
      }
      prtBoard.appendChild(row);
    }
    return prtBoard;
  };

  const container = document.querySelector(".gameContainer");
  container.appendChild(printBoard(pBoard.board));
  container.appendChild(printBoard(cBoard.board));
}
