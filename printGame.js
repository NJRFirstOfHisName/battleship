/* eslint-disable import/extensions */
import setSquare from "./setSquare.js";

// Prints the board to the screen.
export default function printGame(GB) {
  const prtBoard = document.createElement("div");

  // Prints a 10x10 grid of divs.
  for (let i = 0; i < 10; i += 1) {
    const row = document.createElement("div");
    row.setAttribute("style", "display: flex;");
    row.className = "row";
    for (let j = 0; j < 10; j += 1) {
      let square = document.createElement("div");
      // square.setAttribute("style", "width: 40px; height: 40px;");
      // If the board is for a player, sets the divs so that the ships can be placed.
      if (!GB.isComp()) {
        square.setAttribute("draggable", "true;");
        square.id = `${i}${j}`;
      } else {
        square.id = `${i}${j}CPU`;
      }
      // Applies className(s) to the square depending on its contents.
      square = setSquare(GB, square, i, j);

      row.appendChild(square);
    }
    prtBoard.appendChild(row);
  }

  // Places the board in its proper spot on the screen.
  let container;
  if (GB.isComp()) {
    prtBoard.className = "board comp";
    container = document.querySelector(".compContainer");
  } else {
    prtBoard.className = "board player";
    container = document.querySelector(".playerContainer");
  }

  // Clears the old board before printing the updated one.
  container.innerHTML = "";
  container.appendChild(prtBoard);
}
