/* eslint-disable import/extensions */
import printGame from "./printGame.js";
import setSquare from "./setSquare.js";

// Creates new ships to be stored in an array and returns functions to add damage and check whether it's sunken.
const Ship = (size) => {
  let damage = 0;
  const length = size;
  let sunk = false;

  // Adds damage to the ship if it's hit by Gameboard.receiveAttack.
  const hit = () => {
    damage += 1;
  };

  // Checks the existing damage against the size of the ship to determine whether it's sunken.
  const isSunk = () => {
    if (damage >= length) {
      sunk = true;
    }
    return sunk;
  };

  const getLength = () => length;
  return { hit, isSunk, getLength };
};

// Creates a Gameboard object. One is given to each player and is used to track the status of each player's game.
const Gameboard = () => {
  // Used to track the game board on the back end, becomes an array representation of the game in progress.
  const board = [];
  // Holds all Ship objects.
  const ships = [];
  // Used to track how many ships have been placed, as well as being used to number each new ship.
  let numberOfShips = 0;
  // Used during the course of the game to check how many ships are still in play.
  let activeShips;
  // Remains false for the player's board and true for the computer's board.
  let comp = false;

  // Fills board[] with a 2-dimensional array containing entirely 0's, used to indicate empty squares
  const initializeBoard = () => {
    for (let i = 0; i < 10; i += 1) {
      board[i] = [];
      for (let j = 0; j < 10; j += 1) {
        board[i][j] = 0;
      }
    }
  };

  // Takes the starting coordinates, direction, and size of a potential ship and attempts to place it in board.
  const addShip = (x, y, direction, size) => {
    let length = size;
    let valid = true;

    // A size of 0 is used to generate the CPU's ships. First sets comp to true (where it remains),
    // then determines the size of the ship based on how many have already been placed.
    if (size === 0) {
      comp = true;
      if (numberOfShips < 1) {
        length = 5;
      } else if (numberOfShips < 3) {
        length = 4;
      } else if (numberOfShips < 5) {
        length = 3;
      } else {
        length = 2;
      }
    }

    /* Checks whether a given ship placement is valid. First determines which direction the ship is facing, 
    then checks whether the ship would run off the edge of the board[], then checks whether there are existing
    ships in the way of the new ship's placement, and finally places the ship on the board. Each ship is given
    a number to help track them, starting with 1 and incrementing with each new ship, and is placed on the board[]
    as a line of this number. */
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
    // If the ship passes all of the above checks, creates a new Ship and places it in ships[].
    if (valid) {
      ships[numberOfShips] = Ship(length);
    }
    // The last time this is called, activeShips will equal the full number of ships placed.
    activeShips = numberOfShips;
  };

  // Used when for generating CPU ships
  const moreShips = () => {
    if (numberOfShips < 7) {
      return true;
    }
    return false;
  };

  // Used when placing player ships. Makes the page wait until all ships are placed before continuing.
  function allPlayerShips() {
    return new Promise(APS);

    function APS(resolve) {
      if (numberOfShips === 7) {
        resolve(true);
      }
      setTimeout(APS.bind(this, resolve), 500);
    }
  }

  function listShips() {
    let header;
    if (comp) {
      header = document.querySelector(".compHeader");
    } else {
      header = document.querySelector(".playerHeader");
    }
    const shipsList = header.querySelector(".shipsList");
    shipsList.innerText = "Remaining ships:";
    ships.forEach((ship) => {
      if (!ship.isSunk()) {
        shipsList.innerText += ` ${ship.getLength()}`;
      }
    });
  }

  // Used to place the player's ships in the DOM.
  const placeShips = (fleet) => {
    const shipsNeeded = fleet;
    const playerBoard = document.querySelector(".player");
    let xStart;
    let yStart;
    let direction;
    let length;
    let shipsPlaced = 0;
    let valid = false;

    // Used by dragEnterEvent to highlight divs that are valid locations for ships.
    function highlightSquare(square) {
      if (square.classList.contains("empty")) {
        square.classList.add("drag-valid");
        valid = true;
      } else {
        valid = false;
      }
    }

    function dragStartEvent(e) {
      if (e.target.classList.contains("empty")) {
        if (shipsPlaced < shipsNeeded.length) {
          const location = e.target.id;
          xStart = Number(location.slice(0, 1));
          yStart = Number(location.slice(1));
          length = shipsNeeded[shipsPlaced];

          e.target.classList.add("drag-start");
        }
      }
    }

    // Called whenever a user drags over another div.
    function dragEnterEvent(e) {
      e.stopPropagation();

      // Clears all previously hightlighted squares.
      const highlightSquares = document.querySelectorAll(".drag-valid");
      highlightSquares.forEach((sq) => {
        sq.classList.remove("drag-valid");
      });
      valid = false;

      // Takes the id of the div that has been entered and uses it to determine its coordinates.
      let ev;
      if (e.type === "dragenter") {
        ev = e.target;
      } else if (e.type === "touchmove") {
        ev = document.elementFromPoint(
          e.targetTouches[0].clientX,
          e.targetTouches[0].clientY
        );
      }
      const location = ev.id;
      const xNew = Number(location.slice(0, 1));
      const yNew = Number(location.slice(1));

      /* More nested if statements! To start, checks whether the new div is in line with the dragstart div.
      Then determines which axis (relative to dragstart) it lies on, whether it's above or below on the axis,
      and finally if the ship would run off the edge of the board. If the potential location passes all of the
      above checks, starts highlighting divs to indicate where the ship would lie. If it encounters a ship
      in the way, valid is switched back to false and all active divs are cleared. */
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

    /* Called when the user releases a drag. If (valid), indicating that the ship is in a valid location, 
     turns all highlighted divs into ships, then sends the ship to Gameboard. If all ships have been
     placed, removes all event listeners. */
    function dragEndEvent() {
      const highlightSquares = document.querySelectorAll(".drag-valid");
      const startSquare = document.querySelector(".drag-start");
      if (valid) {
        highlightSquares.forEach((sq) => {
          sq.className = "ship";
        });
        startSquare.className = "ship";
        addShip(xStart, yStart, direction, length);
        shipsPlaced += 1;
      }
      // If (!valid), clears all highlighted divs.
      else {
        highlightSquares.forEach((sq) => {
          sq.className = "square empty";
        });
        startSquare.className = "square empty";
      }

      if (shipsPlaced === fleet.length) {
        removeEventListeners();
      }
    }

    // Removes all event listeners for placing ships.
    const removeEventListeners = () => {
      const pSquares = playerBoard.querySelectorAll(".square");
      pSquares.forEach((square) => {
        square.setAttribute("draggable", "false");
        square.removeEventListener("dragstart", dragStartEvent);
        square.removeEventListener("touchstart", dragStartEvent);
        square.removeEventListener("dragenter", dragEnterEvent);
        square.removeEventListener("touchmove", dragEnterEvent);
      });
      playerBoard.removeEventListener("dragend", dragEndEvent);
      playerBoard.removeEventListener("touchend", dragEndEvent);
    };

    // Grabs all empty divs and adds drag and drop listeners to them.
    const pSquares = playerBoard.querySelectorAll(".square");
    pSquares.forEach((square) => {
      // When a drag is started, takes the selected div and saves its location along the x and y axes,
      // then highlights it.
      square.addEventListener("dragstart", dragStartEvent);
      square.addEventListener("touchstart", dragStartEvent);
      // When a new div is dragged over calls dragEnterEvent.
      square.addEventListener("dragenter", dragEnterEvent);
      square.addEventListener("touchmove", dragEnterEvent);
    });
    // When the drag ends, calls dragEndEvent.
    playerBoard.addEventListener("dragend", dragEndEvent);
    playerBoard.addEventListener("touchend", dragEndEvent);
  };

  // Used when one side attacks the other.
  const receiveAtack = (x, y) => {
    let result;

    // Checks board to see what is in the square that's being attacked.
    const content = board[x][y];
    // If the square is empty, assigns it the 'miss' value.
    if (content === 0) {
      board[x][y] = 9;
      result = "miss";
      // If the square has already been attacked, does nothing but return 'repeat'.
    } else if (content === 9 || content < 0) {
      result = "repeat";
      // If neither of the above conditions is met the square must contain a ship.
    } else {
      // Sends hit() to the ship.
      const ship = content;
      ships[ship].hit();
      // If the attack sinks the ship, reduces activeShips by 1 and replaces all squares the ship takes up
      // with the 'sunk' value.
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
        // If the attack doesn't sink the ship, replaces the 'ship' value with its negative to indicate it's been hit.
      } else {
        result = "hit";
        board[x][y] = -board[x][y];
      }
    }
    return result;
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
    allPlayerShips,
    listShips,
  };
};

// A Player object is generated for each side and contains their Gameboards
const Player = () => {
  const GB = Gameboard();
  GB.initializeBoard();
  // Used by the CPU to track where it last hit a ship
  const hit = [];

  // Called on the player's board to semi-randomly attack a square.
  const compTurn = () => {
    let result;
    let x;
    let y;
    let repeats = 0;
    // Loop to generate coordinates for attack. Repeats until it hits an unattacked square.
    do {
      // If the last attack hits a ship, tries attacking the spaces adjacent to its last attack until
      // it gets another hit or until it hits its 10th loop.
      if (hit.length > 0) {
        // Randomly assigns a 0 or 1 for the axis on which to shift.
        const axis = Math.floor(Math.random() * 2);
        let temp;
        // If the previous hit was on the edge of the board and the axis is perpendicular to the edge, makes the
        // next hit fall inside the board.
        if (hit[axis] === 0) {
          temp = 1;
        } else if (hit[axis] === 9) {
          temp = 8;
          // If the above isn't true, makes the next hit be either one greater or one lesser along the axis.
        } else {
          const direction = Math.random() - 0.5;
          if (direction < 0) {
            temp = hit[axis] - 1;
          } else {
            temp = hit[axis] + 1;
          }
        }
        // Assigns the coordinates for the next attack.
        if (axis < 1) {
          x = temp;
          y = hit[1];
        } else {
          x = hit[0];
          y = temp;
        }
        // If the previous attack wasn't a hit, generates random attack coordinates.
      } else {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
      /* Gets the result of the attack. If it's a hit, clears hit[] and assigns it the new coordinates. If
        it sunk a ship, or if the hit loop has occured 10 times, clears hit[]. If it's a repeat, increments
        repeats so that the hit loop doesn't occur infinitely */
      result = GB.receiveAtack(x, y);
      if (result === "hit") {
        hit.length = 0;
        hit.push(x, y);
      } else if (result === "sunk" || repeats === 10) {
        hit.length = 0;
      } else if (result === "repeat") {
        repeats += 1;
      }
    } while (result === "repeat");
  };

  // Called on the CPU to recieve an attack from the player.
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

// Initializes and controls the game flow.
async function gameController() {
  const playerHeader =
    document.querySelector(".playerHeader").firstElementChild;
  playerHeader.innerText = "YOUR BOARD";
  const compHeader = document.querySelector(".compHeader").firstElementChild;
  compHeader.innerText = "THE DASTARDLY COMPUTER";
  const cover = document.querySelector(".cover");
  cover.classList.add("hide");
  console.log(cover);

  // fleet controls the size and number of the player's ships.
  const fleet = [5, 4, 4, 3, 3, 2, 2];
  // Creates a Player for the player, prints their empty board, and allows them to place their ships.
  const player = Player();
  printGame(player.GB);

  // player.GB.addShip(0, 0, "S", 5);
  // player.GB.addShip(6, 0, "E", 4);
  // player.GB.addShip(0, 3, "S", 4);
  // player.GB.addShip(3, 4, "E", 3);
  // player.GB.addShip(9, 9, "W", 3);
  // player.GB.addShip(7, 4, "S", 2);
  // player.GB.addShip(5, 8, "S", 2);

  // Creates a Player for the CPU and generates its ships.
  const computer = Player();
  while (computer.GB.moreShips()) {
    // Randomly generates the direction the CPU's ships face.
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

    // Used to tell addShip that these ships are for the CPU.
    const size = 0;

    // Attempts to place a ship at the randomly generated location.
    computer.GB.addShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      direction,
      size
    );
  }
  printGame(computer.GB);
  player.GB.placeShips(fleet);
  await player.GB.allPlayerShips();
  player.GB.listShips();
  computer.GB.listShips();

  // Adds EventListeners to all unattacked divs on the computer's board.
  const compBoard = document.querySelector(".comp");
  compBoard.parentElement.append(cover);
  const compSquares = compBoard.querySelectorAll(".square");
  compSquares.forEach((square) => {
    square.addEventListener("click", () => {
      // When a listener is triggered, attacks the computer's board at the player's selected point.
      // If the player somehow manages to attack an attacked space, repeats until a fresh one is clicked.
      const result = computer.playerTurn(square);
      // If the attack sinks the computer's ship, goes through each square of the ship and displays it as sunk.
      if (result === "sunk") {
        compSquares.forEach((sq) => {
          const location = sq.id;
          const x = location.slice(0, 1);
          const y = location.slice(1, 2);
          if (computer.GB.getBoard()[x][y] === -9) {
            setSquare(computer.GB, sq, x, y);
          }
        });
        computer.GB.listShips();
        // If the last CPU ship has been sunken, congratulates the player!
        if (computer.GB.getActiveShips() === 0) {
          playerHeader.innerText = "YOU WIN";
          cover.classList.remove("hide");
        }
      }
      if (result !== "repeat") {
        // After the player has taken a valid turn, the computer takes its turn.
        player.compTurn();
        printGame(player.GB);
        player.GB.listShips();
        if (player.GB.getActiveShips() === 0) {
          playerHeader.innerText = "YOU LOSE";
          cover.classList.remove("hide");
        }
      }
    });
  });
}

document.querySelector(".newGame").addEventListener("click", () => {
  document.querySelector(".playerContainer").innerHTML = "";
  const cover = document.createElement("div");
  cover.className = "cover";
  document.querySelector(".playerContainer").append(cover);
  document.querySelector(".compContainer").innerHTML = "";
  gameController();
});

document.querySelector(".surrender").addEventListener("click", () => {
  const compShips = document.querySelectorAll(".compShip");
  compShips.forEach((square) => {
    square.className = "ship";
  });
  const cover = document.querySelector(".cover");
  cover.classList.remove("hide");
});
gameController();
