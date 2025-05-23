const playingGrid = (function() {
  const grid = [[null, null, null],
                [null, null, null],
                [null, null, null]];

  function assert(...indices) {
    for (const index of indices) {
      console.assert(
        typeof index === "number" &&
        index >= 0 && index <= 2
      );
    }
  }

  const playOne = (i, j) => {
    assert(i, j);
    grid[i][j] = 1;
  };

  const playTwo = (i, j) => {
    assert(i, j);
    grid[i][j] = 2;
  };

  const getSquare = (i, j) => {
    assert(i, j);
    return grid[i][j];
  };

  const isEmpty = (i, j) => {
    assert(i, j);
    return grid[i][j] === null;
  };

  const rowWins = (row) => {
    assert(row);
    if (
      !isEmpty(row, 0) &&
      grid[row][0] === grid[row][1] &&
      grid[row][0] === grid[row][2]
    ) return grid[row][0];
    return false;
  };

  const colWins = (col) => {
    assert(col);
    if (
      !isEmpty(0, col) &&
      grid[0][col] === grid[1][col] &&
      grid[0][col] === grid[2][col]
    ) return grid[0][col];
    return false;
  };

  const diagWins = () => {
    if (
      grid[0][0] === grid[1][1] &&
      grid[0][0] === grid[2][2]
    ) return grid[0][0];
    if (
      grid[0][2] === grid[1][1] &&
      grid[0][2] === grid[2][0]
    ) return grid[0][2]
    return false;
  };

  const reset = () => {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        assert(i, j);
        grid[i][j] = null;
      }
    }
  }
  return { playOne, playTwo, getSquare, isEmpty, rowWins, colWins, diagWins, reset };
})();

