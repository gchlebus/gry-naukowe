import { test } from "node:test";
import assert from "node:assert/strict";
import { LESSONS, CHAPTERS } from "../dist/js/lessons.mjs";
import * as E from "../dist/js/engine.mjs";
import { fresh, parse } from "../dist/js/state.mjs";
test("30 lessons cover five chapters, including all eight arithmetic patterns from the photo", () => {
  assert.equal(LESSONS.length, 30);
  assert.equal(new Set(LESSONS.map((l) => l.id)).size, 30);
  for (const c of CHAPTERS)
    assert.equal(LESSONS.filter((l) => l.chapter === c.id).length, 6);
  for (const equation of [
    "x + 8 = 78",
    "60 + x = 69",
    "65 + x = 72",
    "x + 22 = 45",
    "85 − x = 79",
    "90 − x = 82",
    "58 − x = 48",
    "40 − x = 33",
  ])
    assert.ok(
      LESSONS.some((l) => E.equation(E.initial(l)) === equation),
      equation,
    );
});
test("every original problem has exactly one nonnegative whole-number solution", () => {
  for (const l of LESSONS) {
    const b = E.initial(l),
      x = E.solution(b);
    assert.ok(Number.isInteger(x) && x >= 0);
    assert.equal(E.value(b.left, x), E.value(b.right, x));
    assert.equal(E.check(l, x).ok, true);
    assert.equal(E.check(l, x + 1).ok, false);
  }
});
test("recommended routes solve all lessons and every possible next action preserves the original solution", () => {
  for (const l of LESSONS) {
    let b = E.initial(l),
      x = E.solution(b);
    const steps = [];
    while (!E.ready(b) && steps.length < 20) {
      for (const a of E.actions(b)) {
        const result = E.apply(b, a).board;
        assert.equal(E.solution(result), x, `${l.id} ${JSON.stringify(a)}`);
        assert.equal(E.value(result.left, x), E.value(result.right, x));
      }
      const a = E.recommend(b);
      assert.ok(a, l.id);
      steps.push(a);
      b = E.apply(b, a).board;
    }
    assert.ok(E.ready(b), l.id);
    assert.equal(E.sums(b.right).n, x);
    assert.deepEqual(E.replay(l, steps).board, b);
  }
});
test("moving is the inverse operation on both sides, never a naked sign change", () => {
  const l = LESSONS[1],
    b = E.initial(l),
    copy = structuredClone(b),
    result = E.apply(b, { type: "move", from: "left", id: "l1" });
  assert.deepEqual(b, copy);
  assert.equal(E.equation(result.board), "x = 78 − 8");
  assert.equal(result.balance, "(x + 8) −8 = (78) −8");
  assert.match(result.operation, /Odejmujemy 8/);
  const minus = E.apply(E.initial(LESSONS[6]), {
    type: "move",
    from: "left",
    id: "l1",
  });
  assert.equal(E.equation(minus.board), "x = 9 + 4");
});
test("unknown subtrahend can be solved without negative intermediates", () => {
  let b = E.initial(LESSONS[8]);
  const a = E.recommend(b);
  assert.deepEqual(a, { type: "move", from: "left", id: "l1" });
  b = E.apply(b, a).board;
  assert.equal(E.equation(b), "85 = 79 + x");
  b = E.apply(b, E.recommend(b)).board;
  assert.equal(E.equation(b), "79 + x = 85");
  b = E.apply(b, E.recommend(b)).board;
  assert.equal(E.equation(b), "x = 85 − 79");
});
test("division acts on the entire sides and is offered only when ready", () => {
  let b = E.initial(LESSONS[20]);
  assert.equal(
    E.actions(b).some((a) => a.type === "divide"),
    false,
  );
  b = E.apply(b, E.recommend(b)).board;
  assert.equal(E.equation(b), "2x = 18 − 4");
  b = E.apply(b, { type: "divide" }).board;
  assert.equal(E.equation(b), "x = 7");
  assert.throws(() => E.apply(E.initial(LESSONS[0]), { type: "divide" }));
});
test("collecting cancels inverse terms and combines like kinds only", () => {
  const b = {
    left: [
      { id: "a", kind: "x", value: 3 },
      { id: "b", kind: "x", value: -2 },
      { id: "c", kind: "n", value: 5 },
      { id: "d", kind: "n", value: -5 },
    ],
    right: [{ id: "e", kind: "n", value: 7 }],
  };
  const c = E.apply(b, { type: "collect" }).board;
  assert.equal(E.equation(c), "x = 7");
  assert.equal(E.ready(c), true);
});
test("bad answers and corrupted or oversized histories cannot execute arbitrary actions", () => {
  assert.equal(E.check(LESSONS[0], "7x").valid, false);
  assert.equal(E.check(LESSONS[0], "7.0").valid, false);
  assert.equal(E.check(LESSONS[0], "").valid, false);
  assert.equal(E.check(LESSONS[0], " 7 ").ok, true);
  const s = fresh();
  s.page = "play";
  s.steps = [E.recommend(E.initial(LESSONS[0]))];
  s.done = ["iks-1", "iks-1", "missing"];
  const r = parse(JSON.stringify(s));
  assert.deepEqual(r.done, ["iks-1"]);
  assert.equal(r.steps.length, 1);
  assert.deepEqual(
    E.replay(LESSONS[0], r.steps).board,
    E.replay(LESSONS[0], s.steps).board,
  );
  assert.throws(() => parse('{"v":9}'));
  assert.equal(
    parse(JSON.stringify({ ...s, steps: [{ type: "hacked" }] })).steps.length,
    0,
  );
});
