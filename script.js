const GameBoard = (function() {
  const grid = new Array(9);

  function assert(...indices) {
    for (const index of indices) {
      console.assert(
        typeof index === "number" &&
        index >= 0 && index <= 2
      );
    }
  }

  const playOne = (row, col) => {
    assert(row, col);
    grid[row * 3 + col] = 1;
  };

  const playTwo = (row, col) => {
    assert(row, col);
    grid[row * 3 + col] = 2;
  };

  const getSquare = (row, col) => {
    assert(row, col);
    return grid[row * 3 + col];
  };

  const isEmpty = (row, col) => {
    assert(row, col);
    return !grid[row * 3 + col];
  };

  const rowWins = (row) => {
    assert(row);
    if (
      !isEmpty(row, 0) &&
      grid[row * 3] === grid[row * 3 + 1] &&
      grid[row * 3] === grid[row * 3 + 2]
    ) return grid[row * 3];
    return false;
  };

  const colWins = (col) => {
    assert(col);
    if (
      !isEmpty(0, col) &&
      grid[col] === grid[3 + col] &&
      grid[col] === grid[6 + col]
    ) return grid[col];
    return false;
  };

  const diagWins = () => {
    if (
      grid[0] === grid[4] &&
      grid[0] === grid[8]
    ) return grid[0];
    if (
      grid[2] === grid[4] &&
      grid[2] === grid[6]
    ) return grid[2]
    return false;
  };

  const anyWins = () => {
    let _win = 0;
    for (let row = 0; row <= 2; row++) {
      _win = rowWins(row);
      if (_win) return _win;
    }
    for (let col = 0; col <= 2; col++) {
      _win = colWins(col);
      if (_win) return _win;
    }
    _win = diagWins();
    return _win;
  }

  const resetBoard = () => {
    for (let index = 0; index <= 8; index++) {
      grid[index] = null;
    }
  };

  return { playOne, playTwo, getSquare, isEmpty, rowWins, colWins, diagWins, anyWins, resetBoard };
})();

function Player(name, ID, isAIOn) {
  console.assert(
    typeof name === "string" &&
    typeof isAI === "boolean"
  );

  const _name = name;
  const _id = ID;
  const _isAI = isAIOn;
  let _wins = 0;

  const getName = () => _name;
  const getID = () => _id;
  const isAI = () => _isAI;
  const getWins = () => _wins;
  const hasWon = () => { _wins++ };

  const resetWins = () => { _wins = 0 };

  return { isAI, getName, getID, getWins, hasWon, resetWins };
}

const Game = (function() {
  const _container = document.querySelector(".container");
  let _isFilled = false;
  let _turnCounter = 0;
  let _currentPlayer = 1;

  function assert(...indices) {
    for (const index of indices) {
      console.assert(
        typeof index === "number" &&
        index >= 0 && index <= 2
      );
    }
  }

  const fillUpGrid = (callBack) => {
    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 2; col++){
        const _div = document.createElement("div");
        _div.setAttribute("data-row", `${row}`);
        _div.setAttribute("data-col", `${col}`);
        _div.addEventListener("click", callBack);
        _container.appendChild(_div);
      }
    }
    _isFilled = true;
  };

  const emptyGrid = () => {
    if (_isFilled) {
      _container.innerHTML = "";
    }
  };

  const getTurnCount = () => _turnCounter;
  const incrementTurnCount = () => { _turnCounter++; };

  const getPlayer = () => _currentPlayer;
  const changePlayer = () => { _currentPlayer *= -1; }

  const addCross = (row, col) => {
    assert(row, col);

    const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    _svg.setAttribute("viewBox", "0 0 10 10");

    const _path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    _path.setAttribute("d",
      "M 1 2 C 0 1 1 0 2 1 L 5 4 L 8 1 C 9 0 10 1 9 2 L 6 5 L 9 8 C 10 9 9 10 8 9 L 5 6 L 2 9 C 1 10 0 9 1 8 L 4 5 Z");
    _svg.appendChild(_path);

    const _nthCell = document.querySelector(`.container div:nth-child(${row * 3 + col + 1})`);
    _nthCell.appendChild(_svg);
  };

  const addCircle = (row, col) => {
    assert(row, col);

    const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    _svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    _svg.setAttribute("viewBox", "0 0 10 10");

    const _circleOut = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    _circleOut.setAttribute("cx", "5");
    _circleOut.setAttribute("cy", "5");
    _circleOut.setAttribute("r", `${6 - Math.sqrt(2)}`);
    _circleOut.classList.add("out");
    _svg.appendChild(_circleOut);

    const _circleIn = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    _circleIn.setAttribute("cx", "5");
    _circleIn.setAttribute("cy", "5");
    _circleIn.setAttribute("r", `${6 - 2 * Math.sqrt(2)}`);
    _circleIn.classList.add("in");
    _svg.appendChild(_circleIn);

    const _nthCell = document.querySelector(`.container div:nth-child(${Number(row) * 3 + Number(col) + 1})`);
    _nthCell.appendChild(_svg);
  };

  return { fillUpGrid, emptyGrid, getTurnCount, incrementTurnCount, getPlayer, changePlayer, addCross, addCircle };
})();

Game.fillUpGrid(function(e) {
  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);

  if (GameBoard.isEmpty(row, col)) {
    if (Game.getPlayer() > 0) {
      Game.addCross(row, col);
      GameBoard.playOne(row, col);

    } else {
      Game.addCircle(row, col);
      GameBoard.playTwo(row, col);
    }
    const win = GameBoard.anyWins();
    if (win) {
      alert(`Player ${win} has won!`);
    }
    Game.changePlayer();
  }

});

