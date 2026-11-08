import { test } from "node:test";
import assert from "node:assert/strict";
import {
  facts,
  result,
  makeTask,
  optionsFor,
  makePairs,
  isPair,
  freshProgress,
  recordAnswer,
  nextTask,
  parseProgress,
  BADGES,
  taskText,
  type Operation,
  type Level,
} from "../lib/math.ts";
const operations: Operation[] = ["add", "subtract", "multiply", "divide"];
const levels: Level[] = [1, 2, 3];
test("all facts respect their range and give whole, nonnegative answers", () => {
  for (const op of operations)
    for (const level of levels) {
      const pool = facts(op, level);
      assert.ok(pool.length >= 4);
      for (const [a, b] of pool) {
        const value = result(op, a, b);
        assert.ok(Number.isInteger(value) && value >= 0 && value <= 100);
        assert.ok(b > 0);
        if (op === "add" || op === "subtract") {
          assert.ok(a <= [10, 50, 100][level - 1]);
          assert.ok(b <= [10, 50, 100][level - 1]);
          if (op === "add") assert.ok(value <= [10, 50, 100][level - 1]);
        } else {
          const groups = op === "multiply" ? a : b;
          assert.ok(groups <= [4, 5, 10][level - 1]);
          if (level === 1) assert.ok((op === "multiply" ? value : a) <= 20);
        }
      }
    }
});
test("answer choices include exactly one answer at range boundaries", () => {
  for (let answer = 0; answer <= 100; answer++)
    for (const rng of [() => 0, () => 0.999999, Math.random]) {
      const options = optionsFor(answer, rng);
      assert.equal(options.length, 4);
      assert.equal(new Set(options).size, 4);
      assert.ok(options.includes(answer));
      assert.ok(
        options.every((n) => n >= 0 && n <= 100 && Number.isInteger(n)),
      );
    }
});
test("new tasks avoid immediate repetition and use the selected context", () => {
  for (const op of operations)
    for (const level of levels) {
      let previous = makeTask(op, level, "berry", () => 0);
      for (let i = 0; i < 12; i++) {
        const t = makeTask(op, level, "bow", () => 0, previous);
        assert.equal(t.product, "bow");
        assert.notDeepEqual([t.a, t.b], [previous.a, previous.b]);
        assert.notEqual(t.id, previous.id);
        assert.ok(taskText(t).length > 30);
        previous = t;
      }
    }
});
test("wrong attempts, help, first try, and duplicate submissions score correctly", () => {
  let p = freshProgress();
  const t = makeTask("add", 1);
  p = recordAnswer(p, t, t.answer + 1);
  assert.equal(p.solved, 0);
  assert.equal(p.review.length, 1);
  p = recordAnswer(p, t, t.answer, 1, true);
  assert.deepEqual(p.skills["add:1"], {
    attempts: 2,
    correct: 1,
    firstTry: 0,
    withHelp: 1,
  });
  assert.equal(p.review.length, 1);
  assert.equal(recordAnswer(p, t, t.answer), p);
  const t2 = makeTask("divide", 2);
  p = recordAnswer(p, t2, t2.answer, 0, true);
  assert.equal(p.skills["divide:2"].firstTry, 0);
  const t3 = makeTask("multiply", 3);
  p = recordAnswer(p, t3, t3.answer);
  assert.equal(p.skills["multiply:3"].firstTry, 1);
});
test("missed facts return with a new identity and clear after successful review", () => {
  let p = freshProgress();
  const missed = makeTask("add", 1, "apple", () => 0);
  p = recordAnswer(p, missed, 99);
  for (let i = 0; i < 2; i++) {
    const t = makeTask("add", 1, "apple", () => 0.9);
    p = recordAnswer(p, t, t.answer);
  }
  const t = nextTask(p, undefined, () => 0);
  assert.equal(t.review, true);
  assert.notEqual(t.id, missed.id);
  assert.deepEqual([t.a, t.b], [missed.a, missed.b]);
  p = recordAnswer(p, t, t.answer);
  assert.equal(p.review.length, 0);
});
test("every matching deck has four unambiguous pairs across all modes", () => {
  for (const op of operations)
    for (const level of levels)
      for (const rng of [() => 0, () => 0.9999, Math.random]) {
        const deck = makePairs(op, level, "apple", rng);
        assert.equal(deck.length, 8);
        const expressions = deck.filter((c) => c.kind === "expression"),
          answers = deck.filter((c) => c.kind === "answer");
        assert.equal(new Set(answers.map((c) => c.value)).size, 4);
        for (const card of expressions) {
          assert.equal(deck.filter((c) => isPair(card, c)).length, 1);
          assert.equal(
            answers.filter((c) => Number(c.value) === card.task.answer).length,
            1,
          );
          assert.equal(isPair(card, card), false);
        }
      }
});
test("backup round trip preserves progress and sanitizes untrusted data", () => {
  let p = freshProgress();
  const t = makeTask("subtract", 1);
  p = recordAnswer(p, t, t.answer + 1);
  p = recordAnswer(p, t, t.answer, 1);
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  const dirty = {
    ...p,
    solved: 9999,
    volume: 100,
    review: [{ ...t, answer: 999 }],
    skills: {
      "subtract:1": { attempts: 2, correct: 999, firstTry: 999, withHelp: -5 },
    },
    operation: "evil",
    level: 9,
    product: "evil",
  };
  const clean = parseProgress(JSON.stringify(dirty));
  assert.equal(clean.solved, 2);
  assert.equal(clean.skills["subtract:1"].firstTry, 2);
  assert.equal(clean.skills["subtract:1"].withHelp, 0);
  assert.equal(clean.review.length, 0);
  assert.equal(clean.volume, 0.6);
  assert.equal(clean.operation, "add");
  assert.throws(() => parseProgress("{"));
  assert.throws(() => parseProgress('{"version":2}'));
});
test("four-operation badge requires actual success in each operation", () => {
  let p = freshProgress();
  const badge = BADGES.find((b) => b.id === "all")!;
  for (const [index, op] of operations.entries()) {
    assert.equal(badge.test(p), false);
    const t = makeTask(op, 1);
    p = recordAnswer(p, t, t.answer);
    assert.equal(badge.test(p), index === 3);
  }
});
