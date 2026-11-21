export function relatedCells(index, size, [height, width]) {
  const row = Math.floor(index / size);
  const col = index % size;
  return Array.from({ length: size * size }, (_, cell) => cell).filter(cell => {
    if (cell === index) return false;
    const otherRow = Math.floor(cell / size);
    const otherCol = cell % size;
    return otherRow === row || otherCol === col ||
      (Math.floor(otherRow / height) === Math.floor(row / height) &&
       Math.floor(otherCol / width) === Math.floor(col / width));
  });
}

export function analyzeSudoku(values, peers) {
  const conflicts = values.flatMap((value, cell) =>
    value && peers[cell].some(peer => values[peer] === value) ? [cell] : [],
  );
  return { conflicts, complete: conflicts.length === 0 && values.every(Boolean) };
}

export function findSudokuHint(values, peers, size) {
  const digits = Array.from({ length: size }, (_, i) => i + 1);
  const open = values.flatMap((value, cell) => value ? [] : [{
    cell,
    options: digits.filter(digit => !peers[cell].some(peer => values[peer] === digit)),
  }]);
  return open.find(item => item.options.length === 0)
    ?? open.find(item => item.options.length === 1)
    ?? open.sort((a, b) => a.options.length - b.options.length)[0];
}
