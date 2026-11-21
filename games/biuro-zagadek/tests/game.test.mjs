import assert from "node:assert/strict";
import test from "node:test";
import { folders, normalizeAnswer } from "../dist/js/cases.mjs";
import { sceneDescription, scenes } from "../dist/js/scenes.mjs";
import { analyzeSudoku, findSudokuHint, relatedCells } from "../dist/js/sudoku.mjs";

const sudoku = folders.find(folder => folder.id === "sudoku");
for (const { rows, box, level } of sudoku.cases) {
  test(`Sudoku ${level} ma dokładnie jedno rozwiązanie`, () => {
    const size = rows.length;
    const board = rows.join("").split("").map(Number);
    const peers = board.map((_, cell) => relatedCells(cell, size, box));
    assert.equal(analyzeSudoku(board, peers).conflicts.length, 0);

    function countSolutions() {
      const next = findSudokuHint(board, peers, size);
      if (!next) return Number(analyzeSudoku(board, peers).complete);
      let count = 0;
      for (const candidate of next.options) {
        board[next.cell] = candidate;
        count += countSolutions();
        board[next.cell] = 0;
        if (count > 1) break;
      }
      return count;
    }
    assert.equal(countSolutions(), 1);
  });
}

test("Sudoku zgłasza konflikt w bloku o wymiarach 2 × 3", () => {
  const board = Array(36).fill(0);
  board[0] = board[8] = 3;
  const peers = board.map((_, cell) => relatedCells(cell, 6, [2, 3]));
  assert.deepEqual(analyzeSudoku(board, peers), { conflicts: [0, 8], complete: false });
  board[8] = 0;
  assert.deepEqual(analyzeSudoku(board, peers), { conflicts: [], complete: false });
});

test("Odpowiedzi przyjmują polskie znaki, dowolną wielkość liter i końcową interpunkcję", () => {
  assert.equal(normalizeAnswer("  MÓJ   CIEŃ! "), "moj cien");
  assert.equal(normalizeAnswer("mój CIEŃ."), normalizeAnswer("moj cien"));
  assert.equal(normalizeAnswer("Żółć"), "zolc");
});

test("Każda zaznaczalna różnica ma odpowiednik w opisie drugiego rysunku", () => {
  const counts = [];
  for (const { places } of Object.values(scenes)) {
    counts.push(places.filter(place => place[3]).length);
    for (const place of places) {
      assert.equal(sceneDescription(place, 0) !== sceneDescription(place, 1), Boolean(place[3]));
    }
  }
  assert.deepEqual(counts, [4, 5, 6]);
});

test("Hasła wszystkich szyfrów wynikają z ich kluczy", () => {
  const [symbols, numbers, shifted] = folders.find(folder => folder.id === "szyfry").cases;
  const symbolKey = new Map(symbols.key);
  const words = [
    symbols.code.trim().split(/\s+/).map(symbol => symbolKey.get(symbol)).join(""),
    numbers.code.trim().split(/\s+/).map(number => numbers.alphabet[Number(number) - 1]).join(""),
    shifted.code.trim().split(/\s+/).map(letter => shifted.alphabet.at(shifted.alphabet.indexOf(letter) - 1)).join(""),
  ];
  assert.deepEqual(words.map(normalizeAnswer), [symbols, numbers, shifted].map(item => item.answers[0]));
});
