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
    if (size === 0) {
      comp = true;
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
    activeShips = numberOfShips;
  };

  const receiveAtack = (x, y) => {
    let result;
    const content = board[x][y];
    if (content === 0) {
      board[x][y] = 8;
      result = "miss";
    } else if (content === 8 || content === 9 || content === -1) {
      result = "repeat";
    } else {
      const ship = content;
      ships[ship].hit();
      if (ships[ship].isSunk()) {
        result = "sunk";
        activeShips -= 1;
        board[x][y] = -1;
      } else {
        result = "hit";
        board[x][y] = 9;
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
    // if (result === "miss") {
    //   console.log("miss");
    // } else if (result === "hit") {
    //   console.log("HIT");
    // } else if (result === "sunk") {
    //   console.log("SHIP SUNK");
    // } else {
    //   alert("ERROR RETURNING ATTACK RESULT");
    // }
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

  console.log(human.GB.getBoard());

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
  console.log(computer.GB.getBoard());
  printGame(human.GB, computer.GB);
  let playerTurn = true;
  const playRound = () => {
    // do {
    if (playerTurn) {
      computer.compTurn();
    } else {
      human.compTurn();
    }
    playerTurn = !playerTurn;
    printGame(human.GB, computer.GB);
    // } while (human.GB.getActiveShips() > 0 && computer.GB.getActiveShips() > 0);
    if (human.GB.getActiveShips() === 0) {
      alert("COMPUTER BEATS PUNY HUMAN");
    } else if (computer.GB.getActiveShips() === 0) {
      alert("Man triumps over machine!");
    }
  };

  const btn = document.querySelector(".button");
  btn.addEventListener("click", () => {
    playRound();
  });
};

gameController();
