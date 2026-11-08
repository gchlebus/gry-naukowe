import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  LESSONS,
  CHAPTERS,
  conditionHolds,
  starterProgram,
  validCompleted,
  countBlocks,
  initialWorld,
  advance,
  compile,
  resultFor,
  validateProgram,
  pythonProgram,
} from "../lib/program.ts";
let id = 0;
const b = (type, children, count) => ({
  id: String(id++),
  type,
  ...(children ? { children } : {}),
  ...(count ? { count } : {}),
});
const seq = (...types) => types.map((type) => b(type));
function execute(blocks, l) {
  const instructions = compile(blocks);
  let w = initialWorld(l);
  for (let i = 0; i < instructions.length; i++) {
    const a = instructions[i];
    if (a.type === "check") {
      if (!conditionHolds(w, l, a.condition)) i += a.skip;
    } else {
      w = advance(w, a.type, l);
      if (w.bump) break;
    }
  }
  return { world: w, ...resultFor(w, l, blocks) };
}
const solutions = [
  seq("forward", "forward", "forward"),
  seq("forward", "forward", "left", "forward", "forward"),
  seq(
    "left",
    "forward",
    "right",
    "forward",
    "forward",
    "forward",
    "right",
    "forward",
  ),
  seq("forward", "forward", "quack", "quack"),
  [b("repeat", seq("forward"), 4)],
  [b("repeat", seq("forward", "left"), 4)],
  [b("repeat", [b("forward"), b("flower", seq("quack"))], 4)],
  seq(
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
    "right",
    "forward",
    "forward",
    "quack",
  ),
];
solutions.push(
  seq(
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
    "right",
    "forward",
    "forward",
  ),
  seq(
    "forward",
    "forward",
    "right",
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
  ),
  seq("forward", "forward", "left", "forward", "forward"),
  seq("forward", "forward", "left"),
  [b("repeat", seq("forward"), 3), b("left"), b("repeat", seq("forward"), 3)],
  [b("repeat", [b("forward"), b("flower", [b("repeat", seq("quack"), 2)])], 4)],
  seq(
    "left",
    "forward",
    "right",
    "forward",
    "right",
    "forward",
    "left",
    "forward",
    "forward",
    "forward",
    "forward",
  ),
  [b("repeat", [b("clear", seq("forward"))], 6)],
  seq(
    "forward",
    "right",
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
  ),
  [b("repeat", seq("forward", "right"), 4)],
  seq(
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
    "forward",
    "right",
    "forward",
    "forward",
    "left",
    "forward",
  ),
  [
    ...seq(
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "left",
    ),
    b("repeat", [b("clear", seq("forward"))], 4),
    b("quack"),
  ],
);
for (const l of LESSONS)
  test(`Mission ${l.id} is solvable and checks learning goal`, () => {
    const r = execute(solutions[l.id - 1], l);
    assert.equal(r.world.bump, false);
    assert.equal(r.success, true, r.message);
  });
test("turns are relative to heading", () => {
  let w = initialWorld(LESSONS[0]);
  w = advance(w, "left", LESSONS[0]);
  assert.equal(w.dir, 0);
  w = advance(w, "forward", LESSONS[0]);
  assert.deepEqual([w.x, w.y], [1, 3]);
});
test("rock and boundary stop movement", () => {
  let w = initialWorld(LESSONS[2]);
  w = advance(w, "forward", LESSONS[2]);
  w = advance(w, "forward", LESSONS[2]);
  assert.equal(w.bump, true);
  assert.equal(w.x, 2);
  w = { ...w, x: 5, dir: 1 };
  assert.equal(advance(w, "forward", LESSONS[0]).bump, true);
});
test("reaching goal without requested loop fails", () =>
  assert.equal(
    execute(seq("forward", "forward", "forward", "forward"), LESSONS[4])
      .success,
    false,
  ));
test("condition skips its whole nested body, then resumes", () => {
  const blocks = [b("flower", [b("repeat", seq("quack"), 3)]), b("forward")];
  const r = execute(blocks, LESSONS[6]);
  assert.equal(r.world.quacks, 0);
  assert.equal(r.world.x, 1);
});
test("quacking away from flowers does not satisfy flower mission", () => {
  const blocks = [
    b("flower", []),
    ...seq("quack", "quack", "forward", "forward", "forward", "forward"),
  ];
  assert.equal(execute(blocks, LESSONS[6]).success, false);
});
test("untrusted imports cannot inject commands, loops or huge trees", () => {
  assert.throws(() => validateProgram([{ type: "exec", code: "bad" }]));
  assert.throws(() =>
    validateProgram([{ type: "repeat", count: 999, children: [] }]),
  );
  assert.throws(() =>
    validateProgram(Array.from({ length: 70 }, () => ({ type: "forward" }))),
  );
  assert.throws(() =>
    compile([
      b("repeat", [b("repeat", [b("repeat", seq("forward"), 8)], 8)], 8),
    ]),
  );
});
test("empty repeat compiles safely", () =>
  assert.deepEqual(compile([b("repeat", [], 8)]), []));
test("export rejects simulated sensors", () =>
  assert.throws(() => pythonProgram([b("flower", seq("quack"))]), /Kwiatki/));
test("generated Python has valid syntax and defaults to no hardware access", () => {
  const dir = mkdtempSync(join(tmpdir(), "kaczy-test-"));
  try {
    const file = join(dir, "program.py");
    writeFileSync(
      file,
      pythonProgram([b("repeat", seq("forward", "quack"), 2)]),
    );
    execFileSync("python3", ["-m", "py_compile", file]);
    const out = execFileSync("python3", [file], { encoding: "utf8" });
    assert.match(out, /forward, quack, forward, quack/);
    assert.match(out, /Nie wyslano polecen/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("generated Python speaks documented JSON-RPC and always ends with stop", () => {
  const dir = mkdtempSync(join(tmpdir(), "kaczy-rpc-"));
  try {
    const file = join(dir, "program.py");
    writeFileSync(file, pythonProgram(seq("forward", "quack")));
    const out = execFileSync("python3", ["tests/mock_robot.py", file], {
      encoding: "utf8",
    });
    assert.match(out, /Mock robot protocol passed/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("chapter ranges cover all twenty stable lesson IDs once", () => {
  assert.equal(LESSONS.length, 20);
  assert.deepEqual(
    LESSONS.map((l) => l.id),
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
  assert.deepEqual(
    CHAPTERS.flatMap((c) =>
      LESSONS.filter((l) => l.id >= c.from && l.id <= c.to).map((l) => l.id),
    ),
    LESSONS.map((l) => l.id),
  );
});
test("progress migration preserves all old stars and accepts new ones without duplicates", () => {
  assert.deepEqual(
    validCompleted([1, 2, 3, 4, 5, 6, 7, 8]),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
  assert.deepEqual(
    validCompleted([1, 8, 9, 20, 20, 0, 21, "9", null]),
    [1, 8, 9, 20],
  );
});
test("old saved programs still validate and run identically", () => {
  const saved = JSON.parse(
    JSON.stringify({ format: "kaczy-kod-v1", blocks: solutions[0] }),
  );
  assert.equal(
    execute(validateProgram(saved.blocks), LESSONS[0]).success,
    true,
  );
});
test("debugging challenges start broken and provide independent editable copies", () => {
  for (const index of [10, 17]) {
    const l = LESSONS[index],
      a = starterProgram(l),
      c = starterProgram(l);
    assert.ok(a.length);
    assert.equal(execute(a, l).success, false);
    assert.notEqual(a[0].id, c[0].id);
    a[0].type = "wait";
    assert.notEqual(c[0].type, "wait");
  }
});
test("treasures are collected only once and must all be collected", () => {
  const l = LESSONS[8];
  let w = initialWorld(l);
  w = advance(w, "forward", l);
  w = advance(w, "right", l);
  w = advance(w, "right", l);
  w = advance(w, "forward", l);
  w = advance(w, "right", l);
  w = advance(w, "right", l);
  w = advance(w, "forward", l);
  assert.deepEqual(w.collected, ["1,4"]);
  assert.equal(resultFor({ ...w, x: 4, y: 2 }, l, []).success, false);
});
test("checkpoint order cannot be skipped", () => {
  const l = LESSONS[9];
  let w = { ...initialWorld(l), x: 2, y: 3, dir: 1 };
  w = advance(w, "forward", l);
  assert.equal(w.checkpoint, 0);
  assert.equal(resultFor({ ...w, x: 3, y: 1 }, l, []).success, false);
  w = { ...w, x: 1, y: 4, dir: 0 };
  w = advance(w, "forward", l);
  assert.equal(w.checkpoint, 1);
});
test("gate blocks movement until the key has been collected", () => {
  const l = LESSONS[14],
    w = { ...initialWorld(l), x: 2, y: 4 };
  assert.equal(advance(w, "forward", l).bump, true);
  assert.equal(advance({ ...w, hasKey: true }, "forward", l).bump, false);
  const key = advance({ ...initialWorld(l), x: 0, y: 3 }, "forward", l);
  assert.equal(key.hasKey, true);
});
test("clear condition respects heading, edges, rocks and locked gates", () => {
  const l = LESSONS[15];
  assert.equal(conditionHolds({ ...initialWorld(l), x: 3 }, l, "clear"), false);
  assert.equal(
    conditionHolds({ ...initialWorld(l), x: 3, dir: 0 }, l, "clear"),
    true,
  );
  assert.equal(conditionHolds({ ...initialWorld(l), x: 5 }, l, "clear"), false);
  const gate = LESSONS[14],
    w = { ...initialWorld(gate), x: 2, y: 4 };
  assert.equal(conditionHolds(w, gate, "clear"), false);
  assert.equal(conditionHolds({ ...w, hasKey: true }, gate, "clear"), true);
});
test("budgets count nested blocks and travelled squares, excluding turns", () => {
  assert.equal(countBlocks(solutions[12]), 5);
  const l = LESSONS[12];
  assert.equal(execute([...solutions[12], b("wait")], l).success, false);
  const r = execute(solutions[18], LESSONS[18]);
  assert.equal(r.world.moves, 8);
  assert.equal(
    resultFor({ ...r.world, moves: 9 }, LESSONS[18], solutions[18]).success,
    false,
  );
});
test("reaching the star with the wrong final heading is not enough", () => {
  const l = LESSONS[11];
  assert.equal(execute(seq("forward", "forward"), l).success, false);
  assert.equal(execute(solutions[11], l).success, true);
});
test("new simulated condition cannot be exported as a real robot sensor", () => {
  const bs = validateProgram([
    { type: "clear", children: [{ type: "forward" }] },
  ]);
  assert.equal(compile(bs)[0].condition, "clear");
  assert.throws(() => pythonProgram(bs), /planszę/);
});
