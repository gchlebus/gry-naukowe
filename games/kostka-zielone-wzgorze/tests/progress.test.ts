import { test } from "node:test";
import assert from "node:assert/strict";
import { freshSaved, parseSaved, SOLVED } from "../lib/cube.ts";
import { confirmStage } from "../lib/progress.ts";

test("checkpoints grow the garden once and completion awards one solved cube", () => {
  let s = { ...freshSaved(), started: true, step: 12 };
  for (let stage = 0; stage < 8; stage++) {
    assert.equal(s.stage, stage);
    s = confirmStage(s);
    assert.equal(s.confirmed.length, stage + 1);
    assert.equal(s.wins, stage === 7 ? 1 : 0);
  }
  assert.equal(s.stage, 7);
  assert.equal(confirmStage(s).wins, 1);
  assert.equal(confirmStage(s).confirmed.length, 8);
});
test("restore preserves real cube state, clamps controls, rejects corrupt active states", () => {
  const s = {
    ...freshSaved(),
    started: true,
    state: SOLVED,
    stage: 3,
    step: 8,
    confirmed: [0, 1, 2],
    volume: 0.2,
  };
  assert.deepEqual(parseSaved(JSON.stringify(s)), s);
  const guarded = parseSaved(
    JSON.stringify({
      ...s,
      stage: 999,
      step: -2,
      confirmed: [-1, 0, 0, 8, "1"],
      volume: 99,
      wins: -20,
    }),
  );
  assert.equal(guarded.stage, 7);
  assert.equal(guarded.step, 0);
  assert.deepEqual(guarded.confirmed, [0]);
  assert.equal(guarded.volume, 0.6);
  assert.equal(guarded.wins, 0);
  assert.throws(() => parseSaved(JSON.stringify({ ...s, state: "broken" })));
  assert.throws(() => parseSaved("{"));
});
