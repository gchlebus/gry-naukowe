import { test } from "node:test";
import assert from "node:assert/strict";
import {
  freshProgress,
  freshAdaptive,
  adapt,
  makeTask,
  recordAnswer,
  parseProgress,
  prepareRound,
  easierRound,
} from "../lib/math.ts";
test("five independent successes in six observations raise only that operation", () => {
  let a = freshAdaptive();
  for (let i = 0; i < 6; i++) a = adapt(a, makeTask("multiply", 1), i !== 2);
  assert.equal(a.levels.multiply, 2);
  assert.equal(a.levels.add, 1);
  assert.equal(a.history.multiply.length, 0);
});
test("two different struggling tasks lower the level; retries count once", () => {
  let a = freshAdaptive();
  a.levels.divide = 3;
  const t = makeTask("divide", 3);
  a = adapt(a, t, false);
  a = adapt(a, t, false);
  assert.equal(a.levels.divide, 3);
  a = adapt(a, makeTask("divide", 3), false);
  assert.equal(a.levels.divide, 2);
});
test("help, wrong-first and manual mode cannot drive a promotion", () => {
  let p = freshProgress();
  for (let i = 0; i < 9; i++) {
    const t = makeTask("add", 1);
    p = recordAnswer(p, t, t.answer, 0, true);
  }
  assert.equal(p.adaptive.levels.add, 1);
  p.adaptive.enabled = false;
  const a = p.adaptive;
  assert.equal(adapt(a, makeTask("add", 1), true), a);
});
test("queued cards at an old level do not change the new-level calibration", () => {
  let a = freshAdaptive();
  a.levels.add = 2;
  a = adapt(a, makeTask("add", 1), false);
  assert.deepEqual(a.history.add, []);
});
test("old backups keep stars, migrate without losing counts, and default to auto", () => {
  const p = freshProgress();
  const t = makeTask("add", 3);
  const saved = recordAnswer(p, t, t.answer);
  const old = JSON.parse(JSON.stringify(saved));
  delete old.adaptive;
  old.level = 3;
  const loaded = parseProgress(JSON.stringify(old));
  assert.equal(loaded.solved, 1);
  assert.equal(loaded.adaptive.enabled, true);
  assert.equal(prepareRound(loaded).level, 3);
  assert.deepEqual(parseProgress(JSON.stringify(saved)), saved);
});
test("an easier task updates its operation and persists; all levels are bounded", () => {
  let p = freshProgress();
  p.adaptive.levels.add = 3;
  p = prepareRound(p);
  p = easierRound(p);
  assert.equal(p.level, 2);
  p = easierRound(p);
  p = easierRound(p);
  assert.equal(p.level, 1);
  const raw = JSON.parse(JSON.stringify(p));
  raw.adaptive.levels.add = 99;
  assert.equal(parseProgress(JSON.stringify(raw)).adaptive.levels.add, 1);
});
