/* ************** */
/* * GAME BOARD * */
/* ************** */

// Constants - avoid "magic numbers"
const DRAW = 9;
const AI = 0;
const HUMAN = 1;
const BEST_OF_5 = 2;
const NULL_FUNCTION = () => null;

const GameBoard = (function() {
  const grid = new Array(9);
  let turns = 0;
  let gameState = 0;
  let currentMode = HUMAN;  // Defaults to HUMAN

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
    turns++;
  };

  const playTwo = (row, col) => {
    assert(row, col);
    grid[row * 3 + col] = 2;
    turns++;
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

  const reset = (resetMode = false) => {
    resetBoard();
    turns = 0;
    gameState = 0;
    if (resetMode) {
      currentMode = null;
    }
  }

  const isDraw = () => turns >= 9;

  const getGameState = () => gameState;
  const updateGameState = (winner) => gameState = winner;

  const updateCurrentMode = (mode) => currentMode = mode;
  const getCurrentMode = () => currentMode;

  return { playOne, playTwo, getSquare, isEmpty,
    rowWins, colWins, diagWins, anyWins,
    resetBoard, isDraw, getGameState, updateGameState,
    updateCurrentMode, getCurrentMode, reset };
})();

/* ******** */
/* * GAME * */
/* ******** */

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

/* ************** */
/* * GAME BOARD * */
/* ************** */

const Game = (function() {
  const _container = document.querySelector(".grid-container");
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

    const _nthCell = document.querySelector(`.grid-container div:nth-child(${row * 3 + col + 1})`);
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

    const _nthCell = document.querySelector(`.grid-container div:nth-child(${Number(row) * 3 + Number(col) + 1})`);
    _nthCell.appendChild(_svg);
  };

  const reset = (c = true) => {
    emptyGrid();
    _turnCounter = 0;
    _currentPlayer = 1;
    _isFilled = false;
    if (c) { _container.classList.add("vanish"); }
  };

  return { fillUpGrid, emptyGrid, getTurnCount, incrementTurnCount,
    getPlayer, changePlayer, addCross, addCircle, reset };
})();

const Logic = (function() {
  const gameLogic = function(e) {
    if (GameBoard.getGameState() == 0) {
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
          GameBoard.updateGameState(win);
          MainMenu.winMessage(GameBoard.getGameState());
          MainMenu.endOptions(GameBoard.getCurrentMode());
        }
        const draw = GameBoard.isDraw() && !win;
        if (draw) {
          GameBoard.updateGameState(DRAW);
          MainMenu.winMessage(GameBoard.getGameState());
          MainMenu.endOptions(GameBoard.getCurrentMode());
        }
        Game.changePlayer();
        }
      }
    }

  const LogicVsHuman = function(e) {
    GameBoard.updateCurrentMode(HUMAN);

    MainMenu.deleteMainMenu(addGrid = true);
    Game.fillUpGrid(gameLogic);
  }

  const LogicVsAI = NULL_FUNCTION;   // Empty WIP
  const LogicBestOutOf5 = NULL_FUNCTION;   // Empty WIP

  const ChooseLogic = (mode) => {
    const wrap = () => {
      const prevState = GameBoard.getGameState();
      Game.reset(false);
      GameBoard.reset();
      MainMenu.hideEndMessage(prevState);
    };

    let f = NULL_FUNCTION;
    switch (mode) {
      case HUMAN:
        f = LogicVsHuman;
        break;
      case AI:
        f = LogicVsAI;
        break;
      case BEST_OF_5:
        f = LogicBestOutOf5;
        break;
    }
    return () => {
      wrap();
      f();
    }
  };

  const Reset = function() {
    MainMenu.reset();
    Game.reset();
    GameBoard.reset();
    MainMenu.generateMainMenu(Logic.LogicVsHuman);
  }

  return { LogicVsHuman, LogicVsAI, LogicBestOutOf5, ChooseLogic, Reset }
}());

const MainMenu = (function() {
  const generateMainMenu = function(vsHumanEventListener, vsAIEventListener, bestOfFiveEventListener) {
    const _vsHuman = document.querySelector("button.PvP");
    const _vsAI = document.querySelector("button.PvE");
    const _bestOfFive = document.querySelector("button.best-of-5");

    _vsHuman.addEventListener("click", vsHumanEventListener);
    _vsAI.addEventListener("click", vsAIEventListener);
    _bestOfFive.addEventListener("click", bestOfFiveEventListener);
  };

  const deleteMainMenu = function(addGrid = false) {
    const _titleContainer = document.querySelector("div.title-container");
    if (_titleContainer) _titleContainer.classList.add("vanish");

    if (addGrid) {
      const _gridContainer = document.querySelector("div.grid-container");
      const _asideList = document.querySelectorAll("aside");
      if (_gridContainer) _gridContainer.classList.remove("vanish");
      for (const aside of _asideList) {
        aside.classList.remove("vanish");
      }
    }
  };

  const resetMainMenu = () => {
    const _titleContainer = document.querySelector("div.title-container");
    if (_titleContainer) _titleContainer.classList.remove("vanish");
    const _gridContainer = document.querySelector("div.grid-container");
    const _asideList = document.querySelectorAll("aside");
    if (_gridContainer) _gridContainer.classList.add("vanish");
    for (const aside of _asideList) {
      aside.classList.add("vanish");
    }
  };

  const winMessage = (gameState) => {
    if (gameState == DRAW) {
      const _drawMessage = document.querySelector("div.draw");
      _drawMessage.classList.remove("vanish");
    } else if (gameState != 0) {
      const _winDiv = document.querySelector("div.win");
      const _winMessage = document.querySelector("div.win figure")
      _winMessage.innerHTML = `CONGRATULATIONS!<br>PLAYER ${gameState} HAS WON!`;
      _winDiv.classList.remove("vanish");
    }
  };

  const endOptions = (mode) => {
    const replay = document.querySelectorAll("button.play-again");
    replay.forEach(function(e) {e.addEventListener("click", Logic.ChooseLogic(mode))});

    const mainMenu = document.querySelectorAll("button.main-menu");
    mainMenu.forEach(function (e) {e.addEventListener("click", Logic.Reset)});
  };

  const hideEndMessage = (mode) => {
    if (mode == DRAW) {
      const _drawMessage = document.querySelector("div.draw");
      _drawMessage.classList.add("vanish");
    } else if (mode != 0) {
      const _winDiv = document.querySelector("div.win");
      _winDiv.classList.add("vanish");
    }
  };

  const reset = () => {
    const gameState = GameBoard.getGameState();
    hideEndMessage(gameState);
    resetMainMenu();
  };

  return { generateMainMenu, deleteMainMenu, winMessage, endOptions, hideEndMessage, reset };
})();

MainMenu.generateMainMenu(Logic.LogicVsHuman);

