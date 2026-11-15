import { test } from "node:test";
import assert from "node:assert/strict";
import { LESSONS } from "../dist/js/lessons.mjs";
import * as E from "../dist/js/engine.mjs";
import { explainChange } from "../dist/js/sequence.mjs";
const bare = (f) =>
  Object.fromEntries(
    ["left", "right"].map((side) => [
      side,
      f[side].map(({ id, kind, value }) => ({ id, kind, value })),
    ]),
  );
test("all animation frames preserve the solution for every offered action on all 30 routes", () => {
  const types = new Set();
  for (const lesson of LESSONS) {
    let board = E.initial(lesson);
    const solution = E.solution(board);
    for (let i = 0; !E.ready(board) && i < 20; i++) {
      for (const action of E.actions(board)) {
        const copy = structuredClone(board),
          plan = explainChange(board, action);
        types.add(action.type);
        assert.deepEqual(
          board,
          copy,
          "a film cannot change the saved equation",
        );
        for (const frame of plan.frames) {
          assert.equal(
            E.solution(frame),
            solution,
            `${lesson.id}: ${frame.title}`,
          );
          assert.equal(
            E.value(frame.left, solution),
            E.value(frame.right, solution),
          );
          const terms = [...frame.left, ...frame.right];
          assert.equal(
            new Set(terms.map((t) => t.key)).size,
            terms.length,
            "tracking keys must be unique",
          );
          for (const key of [
            ...(frame.cancel || []),
            ...(frame.added || []),
            ...(frame.highlight || []),
          ])
            assert.ok(terms.some((t) => t.key === key));
        }
        assert.deepEqual(
          bare(plan.frames.at(-1)),
          E.apply(board, action).board,
        );
      }
      board = E.apply(board, E.recommend(board)).board;
    }
    assert.ok(E.ready(board));
  }
  assert.deepEqual([...types].sort(), ["collect", "divide", "move", "swap"]);
});
test("both sides receive the same inverse and only a pair whose sum is zero is crossed out", () => {
  for (const lesson of [LESSONS[0], LESSONS[6], LESSONS[8], LESSONS[29]]) {
    const board = E.initial(lesson),
      action = E.recommend(board),
      plan = explainChange(board, action);
    const added = plan.frames[1],
      canceled = plan.frames[2];
    const left = added.left.find((t) => t.key === "inverse-left");
    const right = added.right.find((t) => t.key === "inverse-right");
    assert.equal(left.kind, right.kind);
    assert.equal(left.value, right.value);
    const pair = canceled[action.from].filter((t) =>
      canceled.cancel.includes(t.key),
    );
    assert.equal(pair.length, 2);
    assert.equal(pair[0].kind, pair[1].kind);
    assert.equal(pair[0].value + pair[1].value, 0);
  }
});
test("division groups the total of a compound right side and does not divide just its last term", () => {
  const initial = E.initial(LESSONS[20]);
  const board = E.apply(initial, E.recommend(initial)).board;
  assert.equal(E.equation(board), "2x = 18 − 4");
  const plan = explainChange(board, { type: "divide" });
  assert.equal(plan.frames[1].divisor, 2);
  const groups = plan.frames.find((f) => f.groups);
  assert.deepEqual(
    groups.left.map((t) => t.value),
    [1, 1],
  );
  assert.deepEqual(
    groups.right.map((t) => t.value),
    [7, 7],
  );
  assert.equal(E.equation(plan.frames.at(-1)), "x = 7");
});
test("swapping sides retains every sign; invalid animation requests are rejected", () => {
  const board = {
    left: [{ id: "a", kind: "n", value: -3 }],
    right: [
      { id: "b", kind: "x", value: 1 },
      { id: "c", kind: "n", value: -5 },
    ],
  };
  const plan = explainChange(board, { type: "swap" });
  assert.deepEqual(bare(plan.frames[1]), {
    left: board.right,
    right: board.left,
  });
  assert.throws(() => explainChange(E.initial(LESSONS[0]), { type: "divide" }));
});
