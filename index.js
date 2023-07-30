/* eslint-disable import/extensions */
import printGame from "./printGame.js";
import setSquare from "./setSquare.js";

const Ship = (size) => {
  let damage = 0;
  const length = size;
  let sunk = false;

  const hit = () => {
    damage += 1;
  };

  const isSunk = () => {
    if (damage >= length) {
      sunk = true;
    }
    return sunk;
  };
  return { hit, isSunk };
};

const Gameboard = () => {
  const board = [];
  const ships = [];
  let numberOfShips = 0;
  let activeShips;
  let comp = false;

  const initializeBoard = () => {
    for (let i = 0; i < 10; i += 1) {
      board[i] = [];
      for (let j = 0; j < 10; j += 1) {
        board[i][j] = 0;
      }
    }
  };

  const addShip = (x, y, direction, size) => {
    let length = size;
    if (size === 0) {
      comp = true;
      if (numberOfShips < 1) {
        length = 5;
      } else if (numberOfShips < 3) {
        length = 4;
      } else if (numberOfShips < 6) {
        length = 3;
      } else {
        length = 2;
      }
    }
    let valid = true;
    switch (direction) {
      case "S":
        if (x + length > 9) {
          valid = false;
          break;
        }
        for (let i = 0; i < length; i += 1) {
          if (board[x + i][y] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < length; i += 1) {
            board[x + i][y] = numberOfShips;
          }
        }
        break;
      case "N":
        if (x - length < 0) {
          valid = false;
          break;
        }
        for (let i = 0; i < length; i += 1) {
          if (board[x - i][y] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < length; i += 1) {
            board[x - i][y] = numberOfShips;
          }
        }
        break;
      case "E":
        if (y + length > 9) {
          valid = false;
          break;
        }
        for (let i = 0; i < length; i += 1) {
          if (board[x][y + i] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < length; i += 1) {
            board[x][y + i] = numberOfShips;
          }
        }
        break;
      case "W":
        if (y - length < 0) {
          valid = false;
          break;
        }
        for (let i = 0; i < length; i += 1) {
          if (board[x][y - i] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < length; i += 1) {
            board[x][y - i] = numberOfShips;
          }
        }
        break;

      default:
        break;
    }
    if (valid) {
      ships[numberOfShips] = Ship(length);
    }
    activeShips = numberOfShips;
  };

  const placeShips = (fleet) => {
    const shipsNeeded = fleet;
    const playerBoard = document.querySelector(".player");
    let xStart;
    let yStart;
    let direction;
    let length;
    let shipsPlaced = 0;
    let valid = false;

    function highlightSquare(square) {
      if (square.classList.contains("empty")) {
        square.classList.add("drag-valid");
        valid = true;
      } else {
        valid = false;
      }
    }

    function dragEnterEvent(e) {
      const location = e.target.id;
      const xNew = Number(location.slice(0, 1));
      const yNew = Number(location.slice(1));
      if (xStart === xNew || yStart === yNew) {
        if (xStart === xNew) {
          if (yStart > yNew) {
            if (yStart - (length - 1) >= 0) {
              direction = "W";
              valid = true;
              for (let i = 0; i < length; i += 1) {
                const square = document.getElementById(`${xNew}${yStart - i}`);
                if (valid) {
                  highlightSquare(square);
                }
              }
            }
          } else if (yStart < yNew) {
            if (yStart + (length - 1) < 10) {
              direction = "E";
              valid = true;
              for (let i = 0; i < length; i += 1) {
                const square = document.getElementById(`${xNew}${yStart + i}`);
                if (valid) {
                  highlightSquare(square);
                }
              }
            }
          }
        } else if (yStart === yNew) {
          if (xStart > xNew) {
            if (xStart - (length - 1) >= 0) {
              direction = "N";
              valid = true;
              for (let i = 0; i < length; i += 1) {
                const square = document.getElementById(`${xStart - i}${yNew}`);
                if (valid) {
                  highlightSquare(square);
                }
              }
            }
          } else if (xStart < xNew) {
            if (xStart + (length - 1) < 10) {
              direction = "S";
              valid = true;
              for (let i = 0; i < length; i += 1) {
                const square = document.getElementById(`${xStart + i}${yNew}`);
                if (valid) {
                  highlightSquare(square);
                }
              }
            }
          }
        }
      }
    }

    function dragEndEvent() {
      const highlightSquares = document.querySelectorAll(".drag-valid");
      if (valid) {
        highlightSquares.forEach((sq) => {
          sq.className = "ship";
        });
        addShip(xStart, yStart, direction, length);
        shipsPlaced += 1;
      } else {
        highlightSquares.forEach((sq) => {
          sq.className = "square empty";
        });
      }
    }

    const pSquares = playerBoard.querySelectorAll(".square");
    pSquares.forEach((square) => {
      square.addEventListener("dragstart", (e) => {
        e.stopImmediatePropagation();
        if (shipsPlaced < shipsNeeded.length) {
          const location = e.target.id;
          xStart = Number(location.slice(0, 1));
          yStart = Number(location.slice(1));
          length = shipsNeeded[shipsPlaced];

          e.target.classList.add(".drag-valid");
        }
      });
      square.addEventListener("dragenter", (e) => {
        e.stopImmediatePropagation();
        const highlightSquares = document.querySelectorAll(".drag-valid");
        highlightSquares.forEach((sq) => {
          sq.classList.remove("drag-valid");
        });
        valid = false;
        dragEnterEvent(e);
      });
    });
    playerBoard.addEventListener("dragend", (e) => {
      e.stopImmediatePropagation();
      dragEndEvent();
    });
  };

  const receiveAtack = (x, y) => {
    let result;
    const content = board[x][y];
    if (content === 0) {
      board[x][y] = 9;
      result = "miss";
    } else if (content === 9 || content < 0) {
      result = "repeat";
    } else {
      const ship = content;
      ships[ship].hit();
      if (ships[ship].isSunk()) {
        result = "sunk";
        activeShips -= 1;
        board.forEach((row, rowIndex) => {
          row.forEach((entry, columnIndex) => {
            if (entry === -content) {
              board[rowIndex][columnIndex] = -9;
            }
          });
        });
        board[x][y] = -9;
      } else {
        result = "hit";
        board[x][y] = -board[x][y];
      }
    }
    return result;
  };

  const moreShips = () => {
    if (numberOfShips < 8) {
      return true;
    }
    return false;
  };

  const getBoard = () => board;
  const isComp = () => comp;
  const getActiveShips = () => activeShips;
  return {
    initializeBoard,
    addShip,
    receiveAtack,
    moreShips,
    getBoard,
    isComp,
    getActiveShips,
    placeShips,
  };
};

const Player = () => {
  const GB = Gameboard();
  GB.initializeBoard();

  const compTurn = () => {
    let result;
    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      result = GB.receiveAtack(x, y);
    } while (result === "repeat");
  };

  const playerTurn = (square) => {
    const location = square.id;
    const x = location.slice(0, 1);
    const y = location.slice(1, 2);
    const result = GB.receiveAtack(x, y);
    if (result !== "repeat") {
      square = setSquare(GB, square, x, y);
    }

    return result;
  };
  return { GB, compTurn, playerTurn };
};

const gameController = () => {
  const player = Player();
  const fleet = [5, 4, 4, 3, 3, 3, 2, 2];

  const computer = Player();
  while (computer.GB.moreShips()) {
    const dir = Math.random() * 4;
    let direction;
    if (dir < 1) {
      direction = "N";
    } else if (dir < 2) {
      direction = "E";
    } else if (dir < 3) {
      direction = "S";
    } else {
      direction = "W";
    }

    const size = 0;

    computer.GB.addShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      direction,
      size
    );
  }
  printGame(player.GB);
  printGame(computer.GB);

  const compBoard = document.querySelector(".comp");
  const compSquares = compBoard.querySelectorAll(".square");
  compSquares.forEach((square) => {
    square.addEventListener("click", () => {
      const result = computer.playerTurn(square);
      if (result === "sunk") {
        compSquares.forEach((sq) => {
          const location = sq.id;
          const x = location.slice(0, 1);
          const y = location.slice(1, 2);
          if (computer.GB.getBoard()[x][y] === -9) {
            setSquare(computer.GB, sq, x, y);
          }
        });
        if (computer.GB.getActiveShips() === 0) {
          alert("Man triumphs over machine!");
        }
      }
      if (result !== "repeat") {
        player.compTurn();
        printGame(player.GB);
        if (player.GB.getActiveShips() === 0) {
          alert("COMPUTER BEATS PUNY HUMAN");
        }
      }
    });
  });
  player.GB.placeShips(fleet);
};

gameController();
