import { test } from "node:test";
import assert from "node:assert/strict";
import { TOPICS, PLANTS, SHAPES, STORIES } from "../dist/js/data.mjs";
import * as E from "../dist/js/logic.mjs";
function answer(q) {
  switch (q.kind) {
    case "assign":
      return { slots: q.correct };
    case "copy":
      return { text: q.text };
    case "grammar":
      return { part: q.part, plural: q.plural };
    case "word":
      return { text: q.correct };
    case "mirror":
      return { cells: q.correct };
    case "axis":
      return { choice: q.correct[0] };
    case "story":
      return {
        calculation: `${q.a}${q.op}${q.b}=${q.result}`,
        sentence: q.answer,
      };
    case "coins": {
      let n = q.correct,
        coins = [];
      for (const v of [5, 2, 1])
        while (n >= v) {
          coins.push(v);
          n -= v;
        }
      return { coins };
    }
    case "arithmetic":
    case "money-count":
    case "change":
      return { text: String(q.correct) };
    default:
      return { choice: q.correct };
  }
}
test("all nine curriculum topics and every task format have valid solvable content across levels", () => {
  assert.equal(TOPICS.length, 9);
  assert.equal(TOPICS.filter((t) => t.pack === "A").length, 5);
  assert.equal(TOPICS.filter((t) => t.pack === "B").length, 4);
  const kinds = new Set();
  for (const t of TOPICS)
    for (const level of [1, 2, 3])
      for (let serial = 0; serial < 70; serial++) {
        const q = E.task(t.id, serial, level, 17);
        kinds.add(q.kind);
        const a = answer(q);
        assert.ok(E.complete(q, a), q.id);
        assert.equal(
          E.grade(q, a).ok,
          true,
          `${q.id}: ${E.grade(q, a).message}`,
        );
        assert.ok(E.correctAnswer(q));
      }
  assert.equal(kinds.size, 14);
});
test("arithmetic always stays within 0..100 and starts with the four supplied examples", () => {
  const examples = [
    [63, 9, "+", 72],
    [73, 6, "-", 67],
    [78, 35, "-", 43],
    [43, 24, "+", 67],
  ];
  for (let i = 0; i < 4; i++) {
    const q = E.task("rachunki", i);
    assert.deepEqual([q.a, q.b, q.op, q.correct], examples[i]);
  }
  for (const level of [1, 2, 3])
    for (let seed = 0; seed < 100; seed++)
      for (let serial = 4; serial < 34; serial++) {
        const q = E.task("rachunki", serial, level, seed);
        assert.ok(q.a >= 0 && q.a <= 100);
        assert.ok(q.b >= 1 && q.b <= 99);
        assert.ok(q.correct >= 0 && q.correct <= 100);
        assert.equal(q.correct, q.op === "+" ? q.a + q.b : q.a - q.b);
        assert.equal(E.grade(q, { text: "-1" }).ok, false);
        if (level === 1) {
          assert.equal(Math.floor(q.a / 10), Math.floor(q.correct / 10));
        }
      }
});
test("copying distinguishes Polish letters, case and punctuation while accepting NFC and ordinary whitespace", () => {
  const q = E.task("pisanie", 0);
  assert.equal(E.grade(q, { text: q.text }).ok, true);
  assert.equal(E.grade(q, { text: q.text.toLowerCase() }).ok, false);
  assert.equal(E.grade(q, { text: q.text.replace("Ż", "Z") }).ok, false);
  assert.equal(E.grade(q, { text: q.text.slice(0, -1) }).ok, false);
  assert.equal(E.grade(q, { text: q.text.normalize("NFD") }).ok, true);
  const d = E.copyDiff("Wiewiórka zbiera orzechy.", "Wiewióka zbiera orzechy.");
  assert.equal(d.distance, 1);
  assert.equal(d.parts.filter((x) => x.type === "missing").length, 1);
  assert.equal(d.parts.filter((x) => x.type !== "same").length, 1);
  assert.equal(E.copyDiff("Żółty liść.", " Żółty   liść.\n").distance, 0);
});
test("letters and forest matching reject misplaced, duplicate or missing labels", () => {
  for (const t of ["list", "las"]) {
    const q = E.task(t, 0),
      a = answer(q);
    assert.equal(E.grade(q, { slots: [...a.slots].reverse() }).ok, false);
    assert.equal(E.complete(q, { slots: a.slots.slice(1) }), false);
    assert.equal(
      E.grade(q, { slots: a.slots.map(() => a.slots[0]) }).ok,
      false,
    );
  }
});
test("mirror patterns have exactly the reflected cells, and extra marks are errors", () => {
  for (const axis of ["v", "h"])
    for (let i = 0; i < 36; i++)
      assert.equal(E.mirrorCell(E.mirrorCell(i, axis), axis), i);
  for (let i = 0; i < 80; i += 2) {
    const q = E.task("symetria", i, 3, 22);
    assert.equal(q.cells.length, q.correct.length);
    assert.equal(new Set(q.correct).size, q.correct.length);
    assert.ok(q.cells.every((c) => !q.correct.includes(c)));
    assert.deepEqual(
      q.correct,
      [...q.cells.map((c) => E.mirrorCell(c, q.axis))].sort((a, b) => a - b),
    );
    assert.equal(E.grade(q, { cells: q.correct.slice(1) }).ok, false);
    const extra = Array.from({ length: 36 }, (_, i) => i).find(
      (i) => !q.cells.includes(i) && !q.correct.includes(i),
    );
    assert.equal(E.grade(q, { cells: [...q.correct, extra] }).ok, false);
  }
});
test("declared symmetry axes match actual reflection geometry; multiple correct axes are accepted", () => {
  const reflect = {
    v: ([x, y]) => [6 - x, y],
    h: ([x, y]) => [x, 6 - y],
    d: ([x, y]) => [y, x],
    a: ([x, y]) => [6 - y, 6 - x],
  };
  for (const shape of SHAPES) {
    const vertices = new Set(shape.points.map((p) => p.join(",")));
    const found = Object.entries(reflect)
      .filter(([, fn]) =>
        shape.points.every((p) => vertices.has(fn(p).join(","))),
      )
      .map(([id]) => id);
    assert.deepEqual(
      found.sort(),
      shape.axes.filter((x) => x !== "none").sort(),
      shape.id,
    );
  }
  const square = E.task("symetria", 9);
  assert.equal(square.shape, "square");
  for (const axis of ["v", "h", "d", "a"])
    assert.equal(E.grade(square, { choice: axis }).ok, true);
  assert.equal(E.grade(square, { choice: "none" }).ok, false);
});
test("word problems require the stated calculation and a contextual answer, not just a lucky number", () => {
  for (let i = 0; i < STORIES.length; i++) {
    const q = E.task("zadania", i),
      good = answer(q);
    assert.equal(E.grade(q, good).ok, true);
    assert.equal(
      E.grade(q, { ...good, calculation: `${q.a}+999=${q.result}` }).ok,
      false,
    );
    assert.equal(E.grade(q, { ...good, sentence: String(q.result) }).ok, false);
    assert.equal(
      E.grade(q, { ...good, sentence: `Mam ${q.result} smoków.` }).ok,
      false,
    );
  }
  const q = E.task("zadania", 0);
  assert.equal(
    E.grade(q, {
      calculation: "60 − 26 = 34",
      sentence: "W warzywniaku było 34 kg marchwi.",
    }).ok,
    true,
  );
  assert.equal(
    E.grade(q, { calculation: "26 − 60 = 34", sentence: q.answer }).ok,
    false,
  );
  assert.equal(
    E.grade(q, { calculation: "60-26=34", sentence: "Było 34 marchwi." }).ok,
    false,
  );
  assert.equal(
    E.grade(q, { calculation: "60-26=34", sentence: "było 34 kg marchwi." }).ok,
    false,
  );
});
test("money accepts equivalent sets of real denominations and exact change", () => {
  const q = { ...E.task("pieniadze", 0), correct: 7 };
  assert.equal(E.grade(q, { coins: [5, 2] }).ok, true);
  assert.equal(E.grade(q, { coins: [2, 2, 2, 1] }).ok, true);
  assert.equal(E.grade(q, { coins: [7] }).ok, false);
  assert.equal(E.grade(q, { coins: [5, 1] }).ok, false);
  for (let i = 0; i < 40; i++) {
    const q = E.task("pieniadze", i, 3, 8);
    assert.ok(q.correct > 0 && q.correct <= 50);
    if (q.kind === "change") assert.equal(q.correct, q.pay - q.cost);
  }
});
test("the first five plant exercises include all four requested plants", () => {
  const seen = new Set();
  for (let i = 0; i < 5; i++) {
    const q = E.task("rosliny", i);
    seen.add(q.plant || q.correct);
  }
  assert.deepEqual([...seen].sort(), PLANTS.map((p) => p.id).sort());
});
test("adaptation is bounded and mastery needs recent independent answers; imported state is validated", () => {
  const s = E.fresh();
  E.record(s, "rachunki", true, true);
  assert.equal(s.stats.rachunki.level, 2);
  E.record(s, "rachunki", true, true);
  assert.equal(s.stats.rachunki.level, 3);
  E.record(s, "rachunki", true, false);
  assert.equal(s.stats.rachunki.level, 2);
  assert.equal(s.stars, 3);
  for (let i = 0; i < 5; i++) E.record(s, "rachunki", true, true);
  assert.equal(E.mastered(s.stats.rachunki), true);
  assert.equal(s.stats.rachunki.recent.length, 5);
  for (let i = 0; i < 10; i++) E.record(s, "rachunki", false, false);
  assert.equal(s.stats.rachunki.level, 1);
  assert.equal(E.mastered(s.stats.rachunki), false);
  assert.deepEqual(E.parseState(JSON.stringify(s)), s);
  assert.throws(() => E.parseState('{"v":4}'));
  assert.throws(() => E.parseState("null"));
  const bad = E.parseState(
    JSON.stringify({
      v: 1,
      stars: -2,
      stats: {
        rachunki: {
          level: 500,
          seen: -3,
          recent: [true, "true", null, false],
          streak: 3,
        },
      },
    }),
  );
  assert.equal(bad.stars, 0);
  assert.equal(bad.stats.rachunki.level, 2);
  assert.deepEqual(bad.stats.rachunki.recent, [true, false]);
});

test("grammar mixes nouns, verbs and both numbers from the first practice round", () => {
  const types = new Set(),
    numbers = new Set();
  for (let i = 0; i < 5; i++) {
    const q = E.task("gramatyka", i);
    if (q.kind === "grammar") {
      types.add(q.part);
      numbers.add(q.plural);
    }
  }
  assert.deepEqual([...types].sort(), ["czasownik", "rzeczownik"]);
  assert.equal(numbers.size, 2);
  const q = E.task("zadania", 0);
  assert.equal(
    E.grade(q, {
      calculation: "60-26=34",
      sentence: "W warzywniaku było 34 kilogramy marchwi.",
    }).ok,
    true,
  );
});
