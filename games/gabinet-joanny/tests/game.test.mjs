import { test } from "node:test";
import assert from "node:assert/strict";
import { PUZZLES, CHAPTERS } from "../dist/js/puzzles.mjs";
import * as E from "../dist/js/engine.mjs";
import {
  freshState,
  parseState,
  record,
  solvedState,
  summary,
} from "../dist/js/state.mjs";
import { esc } from "../dist/js/ui.mjs";
const of = (type) => PUZZLES.filter((p) => p.type === type);
function answer(p) {
  if (p.type === "grid") {
    const a = E.defaultDraft(p),
      n = p.items.length;
    p.solution.forEach((item, pos) => (a[item * n + pos] = 1));
    return a;
  }
  if (p.type === "nonogram") return p.solution.map((v) => (v ? 1 : -1));
  if (p.type === "lights")
    return { mask: 0, history: E.lightMoves(p.optimal, p.n) };
  return E.expected(p);
}
test("catalog contains 32 independent cases in four chapters and ten families", () => {
  assert.equal(PUZZLES.length, 32);
  assert.equal(new Set(PUZZLES.map((p) => p.id)).size, 32);
  assert.equal(new Set(PUZZLES.map((p) => p.type)).size, 10);
  for (const c of CHAPTERS)
    assert.equal(PUZZLES.filter((p) => p.chapter === c.id).length, 8);
  for (const d of [1, 2, 3]) assert.ok(PUZZLES.some((p) => p.difficulty === d));
});
test("all digit locks have one solution, enough clues and preserve leading zero", () => {
  for (const p of of("code")) {
    assert.deepEqual(E.codeCandidates(p), [p.secret]);
    assert.ok(p.clues.length >= 4);
    assert.ok(
      p.clues.every(
        (c) => new Set(c.guess).size === p.length && c.guess !== p.secret,
      ),
    );
  }
  assert.deepEqual(E.codeFeedback("112", "121"), { exact: 1, misplaced: 2 });
  const p = PUZZLES.find((p) => p.id === "m-code");
  assert.equal(p.secret, "0816");
  assert.equal(E.checkAnswer(p, "816").ok, false);
  assert.equal(E.checkAnswer(p, "0816").ok, true);
});
test("ordering constraints admit exactly one complete arrangement", () => {
  for (const p of of("grid"))
    assert.deepEqual(E.orderSolutions(p), [p.solution]);
  const p = of("grid")[0],
    a = answer(p);
  a[0] = 1;
  assert.equal(E.checkAnswer(p, a).incomplete, true);
  assert.ok(of("grid").at(-1).items.length === 6);
});
test("nonogram solver finds the unique authored image, not just matching dimensions", () => {
  for (const p of of("nonogram")) {
    assert.deepEqual(E.solveNonogram(p), [p.solution], p.id);
    assert.equal(E.checkAnswer(p, Array(p.n * p.n).fill(1)).ok, false);
  }
  assert.deepEqual(E.solveNonogram({ n: 1, rows: [[1]], cols: [[1]] }), [[1]]);
  assert.deepEqual(E.solveNonogram({ n: 1, rows: [[1]], cols: [[]] }), []);
  assert.equal(
    E.solveNonogram({ n: 2, rows: [[1], [1]], cols: [[1], [1]] }).length,
    2,
  );
});
test("matrix examples determine one result across all twelve permitted rules", () => {
  assert.equal(E.rotateBits(1), 4);
  assert.equal(E.rotateBits(1, 4), 1);
  for (const p of of("matrix")) {
    assert.deepEqual(E.matrixPossibleAnswers(p), [p.answer]);
    assert.equal(new Set(p.options).size, 4);
    assert.ok(p.options.includes(p.answer));
    assert.equal(
      E.checkAnswer(p, String((p.options.indexOf(p.answer) + 1) % 4)).ok,
      false,
    );
  }
});
test("cube nets fold to six right-handed, distinct faces and correct opposites", () => {
  const base = of("cube")[0],
    f = E.foldNet(base.net);
  assert.deepEqual(
    [...f.values()].map((v) => E.cross(v.r, v.u).map((x) => x || 0)),
    [...f.values()].map((v) => v.n),
  );
  for (const [a, b] of [
    ["A", "E"],
    ["B", "D"],
    ["C", "F"],
  ]) {
    assert.deepEqual(
      f.get(a).n.map((x) => (x === 0 ? 0 : -x)),
      f.get(b).n.map((x) => (x === 0 ? 0 : x)),
    );
  }
  for (const p of of("cube")) assert.ok(p.options.includes(E.cubeAnswer(p)));
  assert.throws(() => E.foldNet([{ id: "A", x: 0, y: 0 }]));
});
test("rune boards begin unsolved; optimal solutions and undo obey the physical rule", () => {
  assert.equal(E.lightEffect(4, 0), (1 << 0) | (1 << 1) | (1 << 4));
  for (const p of of("lights")) {
    assert.notEqual(p.start, 0, p.id);
    const optimum = E.shortestLights(p.n, p.start);
    assert.equal(E.popcount(optimum), p.minimum);
    let state = p.start;
    for (const i of E.lightMoves(optimum, p.n))
      state = E.toggleLight(p.n, state, i);
    assert.equal(state, 0);
    for (let i = 0; i < p.n * p.n; i++)
      assert.equal(
        E.toggleLight(p.n, E.toggleLight(p.n, p.start, i), i),
        p.start,
      );
    assert.deepEqual(E.cleanDraft(p, answer(p)), answer(p));
  }
  const p = of("lights").find((p) => p.n === 3),
    seen = new Set([p.start]),
    queue = [[p.start, 0]];
  let distance;
  for (let h = 0; h < queue.length; h++) {
    const [s, d] = queue[h];
    if (s === 0) {
      distance = d;
      break;
    }
    for (let i = 0; i < 9; i++) {
      const n = E.toggleLight(3, s, i);
      if (!seen.has(n)) {
        seen.add(n);
        queue.push([n, d + 1]);
      }
    }
  }
  assert.equal(distance, p.minimum);
});
test("cipher examples and inverses agree for the complete Latin alphabet", () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const p of of("cipher")) {
    assert.equal(E.crypt(p.plain, p.method, p.key), p.cipher);
    assert.equal(E.crypt(p.cipher, p.method, p.key, true), p.plain);
    assert.equal(
      E.crypt(E.crypt(alphabet, p.method, p.key), p.method, p.key, true),
      alphabet,
    );
  }
  assert.equal(E.crypt("DOM", "caesar", 7), "KVT");
  assert.equal(E.crypt("ALA KOT", "alternating", null), "DJD IRR");
  assert.equal(E.crypt("ALA", "alternating", null), "DJD");
  assert.equal(E.crypt("KOT", "alternating", null), "NMW");
  assert.equal(E.normalizeText("Księżyc"), "KSIEZYC");
});
test("truth statements and weighing equations have the stated unique solution", () => {
  for (const p of of("truth"))
    assert.deepEqual(E.truthCandidates(p), [p.answer]);
  const p = of("balance")[0],
    solutions = [];
  for (let A = 0; A <= 23; A++)
    for (let B = 0; B <= 23; B++)
      for (let C = 0; C <= 23; C++)
        if (A + B === 17 && B + C === 23 && A + C === 20)
          solutions.push({ A, B, C });
  assert.deepEqual(solutions, [p.weights]);
  assert.equal(E.checkAnswer(p, "-19").ok, false);
  assert.equal(E.checkAnswer(p, "019").ok, true);
});
test("all cases accept their solution; empty or wrong responses do not pass", () => {
  for (const p of PUZZLES) {
    assert.equal(E.checkAnswer(p, answer(p)).ok, true, p.id);
    assert.equal(E.checkAnswer(p, E.defaultDraft(p)).ok, false, p.id);
  }
  for (const p of of("select")) {
    assert.equal(
      E.checkAnswer(
        p,
        p.cards.map((c) => c.id),
      ).ok,
      false,
    );
    assert.equal(
      E.checkAnswer(
        p,
        p.cards
          .filter((c) => c.role === "A" || c.role === "B")
          .map((c) => c.id),
      ).ok,
      false,
    );
  }
});
test("progress rewards are idempotent, hints and revealed solutions affect only their own case", () => {
  let s = freshState();
  const p = PUZZLES[0];
  s.progress[p.id] = { ...record(s, p.id), hints: 2 };
  s = solvedState(s, p);
  assert.equal(summary(s).seals, 1);
  s = solvedState(s, p);
  assert.equal(summary(s).seals, 1);
  const q = PUZZLES[1];
  s.progress[q.id] = { ...record(s, q.id), revealed: true, status: "read" };
  s = solvedState(s, q);
  assert.equal(summary(s).seals, 1);
  assert.equal(summary(s).solved, 2);
  s.notes[p.id] = "Hipoteza <bez wykonywania kodu>";
  s.bookmarks = [q.id];
  s.answers[p.id] = answer(p);
  s.view = "puzzle";
  s.paused = true;
  assert.deepEqual(parseState(JSON.stringify(s)), s);
});
test("a complete journey round-trips and sanitizes invalid imported drafts", () => {
  let s = freshState();
  for (const p of PUZZLES) {
    s.answers[p.id] = answer(p);
    s = solvedState(s, p);
  }
  assert.equal(summary(s).solved, 32);
  assert.equal(summary(s).seals, 96);
  assert.equal(summary(parseState(JSON.stringify(s))).solved, 32);
  const p = of("lights")[0];
  s.answers[p.id] = { mask: 0, history: [] };
  const restored = parseState(JSON.stringify(s));
  assert.deepEqual(restored.answers[p.id], E.defaultDraft(p));
  assert.throws(() => parseState("{"));
  assert.throws(() => parseState('{"version":9}'));
  assert.equal(esc('<img onerror="x">'), "&lt;img onerror=&quot;x&quot;&gt;");
});

test("published catalog matches its deterministic authoring source", async () => {
  const source = await import("../scripts/puzzle-source.mjs");
  assert.deepEqual(source.PUZZLES, PUZZLES);
});
