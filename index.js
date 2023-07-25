import printGame from "./printGame.js";

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
  let activeShips = 6;

  const initializeBoard = () => {
    for (let i = 0; i < 10; i += 1) {
      board[i] = [];
      for (let j = 0; j < 10; j += 1) {
        board[i][j] = 0;
      }
    }
    // return board;
  };

  const addShip = (x, y, direction, size) => {
    if (size === 0) {
      if (numberOfShips < 1) {
        size = 5;
      } else if (numberOfShips < 3) {
        size = 4;
      } else if (numberOfShips < 5) {
        size = 3;
      } else {
        size = 2;
      }
    }
    console.log(x, y, direction, size);
    let valid = true;
    switch (direction) {
      case "S":
        if (x + size > 9) {
          valid = false;
          break;
        }
        for (let i = 0; i < size; i += 1) {
          if (board[x + i][y] !== 0) {
            valid = false;
            console.log("Ship collision!");
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < size; i += 1) {
            board[x + i][y] = numberOfShips;
          }
        }
        break;
      case "N":
        if (x - size < 0) {
          valid = false;
          break;
        }
        for (let i = 0; i < size; i += 1) {
          if (board[x - i][y] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < size; i += 1) {
            board[x - i][y] = numberOfShips;
          }
        }
        break;
      case "E":
        if (y + size > 9) {
          valid = false;
          break;
        }
        for (let i = 0; i < size; i += 1) {
          if (board[x][y + i] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < size; i += 1) {
            board[x][y + i] = numberOfShips;
          }
        }
        break;
      case "W":
        if (y - size < 0) {
          valid = false;
          break;
        }
        for (let i = 0; i < size; i += 1) {
          if (board[x][y - i] !== 0) {
            valid = false;
          }
        }
        if (valid) {
          numberOfShips += 1;
          for (let i = 0; i < size; i += 1) {
            board[x][y - i] = numberOfShips;
          }
        }
        break;

      default:
        console.error("Invalid direction");
        break;
    }
    ships[numberOfShips] = Ship(size);
  };

  const receiveAtack = (x, y) => {
    let result;
    if (board[x][y] === 0) {
      board[x][y] = 8;
      result = "miss";
    } else if (board[x][y] === 8 || board[x][y] === 9) {
      result = "repeat";
    } else {
      const ship = board[x][y];
      ships[ship].hit();
      if (ships[ship].isSunk()) {
        result = "sunk";
        activeShips -= 1;
      } else {
        result = "hit";
      }
    }
    return result;
  };

  const moreShips = () => {
    if (numberOfShips < 7) {
      return true;
    }
    return false;
  };
  return { initializeBoard, addShip, receiveAtack, board, moreShips };
};

const Player = () => {
  const GB = Gameboard();
  GB.initializeBoard();

  const compTurn = (enemyBoard) => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    let result;
    do {
      result = enemyBoard.receiveAtack(x, y);
    } while (result === "repeat");
    if (result === "miss") {
      alert("MISS");
    } else if (result === "hit") {
      alert("HIT");
    } else if (result === "sunk") {
      alert("SHIP SUNK");
    } else {
      alert("ERROR RETURNING ATTACK RESULT");
    }
  };
  return { GB, compTurn };
};

const gameController = () => {
  const human = Player();
  human.GB.addShip(0, 0, "S", 5);
  human.GB.addShip(6, 0, "S", 2);
  human.GB.addShip(0, 3, "S", 4);
  human.GB.addShip(3, 4, "E", 3);
  human.GB.addShip(9, 9, "W", 3);
  human.GB.addShip(7, 4, "S", 2);
  human.GB.addShip(0, 0, "S", 5);

  console.log(human.GB.board);

  const computer = Player();
  console.log(computer.GB);
  while (computer.GB.moreShips()) {
    const dir = Math.random() * 4;
    let direction;
    if (dir < 1) {
      direction = "N";
    } else if (dir < 2) {
      direction = "E";
    } else if (dir < 3) {
      direction = "S";
    } else if (dir < 4) {
      direction = "W";
    } else {
      console.error("Error assigning computer ship direction");
    }

    const size = 0;

    computer.GB.addShip(
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      direction,
      size
    );
  }
  console.log(computer.GB.board);
  printGame(human.GB, computer.GB);
  // let playerTurn = true;
  // do {
  //   if (playerTurn) {
  //     computer.board.receiveAtack(x, y);
  //   } else {
  //     human.compTurn(human.board);
  //   }
  //   playerTurn = !playerTurn;
  // } while (human.board.activeShips > 0 && computer.board.activeShips > 0);
  // if (human.board.activeShips === 0) {
  //   // Computer won, loser
  // } else if (computer.board.activeShips === 0) {
  //   // You won, winner!
  // } else {
  //   // I screwed something up
  // }
};

gameController();
