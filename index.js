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
  };
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
    return board;
  };

  const addShip = (x, y, direction, size) => {
    let valid = true;
    switch (direction) {
      case "S":
        for (let i = 0; i < size; i += 1) {
          if (board[x + i][y] !== 0) {
            valid = false;
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
};

const Player = () => {
  const board = Gameboard.initializeBoard;
  const activeShips = 6;

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
};
