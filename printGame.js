/* eslint-disable import/extensions */
import setSquare from "./setSquare.js";

export default function printGame(GB) {
  const prtBoard = document.createElement("div");

  for (let i = 0; i < 10; i += 1) {
    const row = document.createElement("div");
    row.setAttribute("style", "display: flex;");
    row.className = "row";
    for (let j = 0; j < 10; j += 1) {
      let square = document.createElement("div");
      square.setAttribute(
        "style",
        "border: 1px solid black; width: 40px; height: 40px;"
      );
      if (!GB.isComp()) {
        square.setAttribute("draggable", "true;");
        square.id = `${i}${j}`;
      } else {
        square.id = `${i}${j}CPU`;
      }
      square = setSquare(GB, square, i, j);

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
