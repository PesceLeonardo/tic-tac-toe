const playingGrid = (function() {
  const grid = [[null, null, null],
                [null, null, null],
                [null, null, null]];
  const playOne = (i, j) => { grid[i][j] = 1; };
  const playTwo = (i, j) => { grid[i][j] = 2; };
  const getSquare = (i, j) => grid[i][j];
  const isEmpty = (i, j) => {
    if (grid[i][j] === null) return true;
    return false;
  };
  return { playOne, playTwo, getSquare, isEmpty };
})();

