const playingGrid = (function() {
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
    return grid[row * 3 + col] === null;
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

  const reset = () => {
    for (let index = 0; index <= 8; index++) {
      grid[index] = null;
    }
  }
  return { playOne, playTwo, getSquare, isEmpty, rowWins, colWins, diagWins, reset };
})();

