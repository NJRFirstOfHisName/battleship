export default function printGame(GB) {
  const board = GB.getBoard();
  const prtBoard = document.createElement("div");

  for (let i = 0; i < 10; i += 1) {
    const row = document.createElement("div");
    row.setAttribute("style", "display: flex;");
    for (let j = 0; j < 10; j += 1) {
      const square = document.createElement("div");
      square.setAttribute(
        "style",
        "border: 1px solid black; width: 40px; height: 40px;"
      );
      square.id = `${i}${j}`;
      switch (board[i][j]) {
        case 0:
          square.innerText = "";
          square.className = "square empty";
          break;
        case 8:
          square.innerText = "";
          square.className = "miss";
          break;
        case 9:
          square.innerText = "";
          square.className = "hit";
          break;
        case -1:
          square.innerText = "";
          square.className = "sunk";
          break;
        default:
          if (GB.isComp()) {
            square.innerText = "";
            square.className = "square ship";
          } else {
            square.innerText = "";
            square.className = "square ship";
          }
          break;
      }
      square.className += ` ${board[i][j]}`;
      row.appendChild(square);
    }
    prtBoard.appendChild(row);
  }

  let container;
  if (GB.isComp()) {
    prtBoard.className = "board comp";
    container = document.querySelector(".compContainer");
  } else {
    prtBoard.className = "board player";
    container = document.querySelector(".playerContainer");
  }

  container.innerHTML = "";
  container.appendChild(prtBoard);
}
