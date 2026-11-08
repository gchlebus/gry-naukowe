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
  createExecution,
  stepExecution,
  learningCode,
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
  const ex = createExecution(blocks);
  let w = initialWorld(l);
  while (ex.pc < ex.code.length) {
    const step = stepExecution(ex, w, l);
    w = step.world;
    if (step.done) break;
  }
  return { world: w, ...resultFor(w, l, blocks) };
}
const loop = (condition, children) => ({ ...b("while", children), condition });
const decide = (condition, children, otherwise) => ({
  ...b("ifelse", children),
  condition,
  otherwise,
});
const define = (name, children) => ({ ...b("define", children), name });
const call = (name) => ({ ...b("call"), name });
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
solutions.push(
  [loop("clear", seq("forward"))],
  [loop("notGoal", seq("forward"))],
  [loop("clear", seq("forward", "quack"))],
  [loop("clear", seq("forward"))],
  [b("repeat", [b("forward"), decide("flower", seq("quack"), seq("wait"))], 4)],
  [b("repeat", [decide("clear", seq("forward"), seq("left"))], 6)],
  [loop("notGoal", [decide("clear", seq("forward"), seq("left"))])],
  [
    define("powitanie", seq("quack", "quack")),
    call("powitanie"),
    call("powitanie"),
  ],
  [
    define("schodek", seq("forward", "left", "forward", "right")),
    call("schodek"),
    call("schodek"),
    call("schodek"),
  ],
  [
    define("schodek", seq("forward", "left", "forward", "right")),
    call("schodek"),
    call("schodek"),
  ],
  [
    define("spacer", [loop("clear", seq("forward"))]),
    call("spacer"),
    b("left"),
    call("spacer"),
  ],
  [
    define("decyzja", [
      decide("clear", [b("forward"), b("flower", seq("quack"))], seq("left")),
    ]),
    loop("notGoal", [call("decyzja")]),
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
test("chapter ranges cover all thirty-two stable lesson IDs once", () => {
  assert.equal(LESSONS.length, 32);
  assert.deepEqual(
    LESSONS.map((l) => l.id),
    Array.from({ length: 32 }, (_, i) => i + 1),
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
    validCompleted([1, 8, 9, 20, 20, 0, 33, "9", null]),
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
test("while checks its condition before the first body and after every repetition", () => {
  const l = LESSONS[21],
    atGoal = { ...initialWorld(l), x: l.goal[0], y: l.goal[1] };
  const ex = createExecution([loop("notGoal", seq("quack"))]);
  const step = stepExecution(ex, atGoal, l);
  assert.equal(step.done, true);
  assert.equal(step.world.quacks, 0);
  const r = execute([loop("notGoal", seq("forward"))], l);
  assert.equal(r.world.moves, 3);
  assert.equal(r.world.y, 1);
});
test("while detects empty, stationary and rotating infinite loops with a helpful error", () => {
  const l = LESSONS[20];
  for (const body of [[], seq("quack")])
    assert.throws(
      () => execute([loop("clear", body)], l),
      /Pętla while kręci się w kółko/,
    );
  assert.throws(
    () => execute([loop("notGoal", seq("left"))], l),
    /Pętla while kręci się w kółko/,
  );
});

test("if else chooses exactly one branch and can choose differently on the next call", () => {
  const branch = () => decide("flower", seq("quack"), seq("forward"));
  const r = execute([branch(), branch()], LESSONS[24]);
  assert.equal(r.world.moves, 1);
  assert.equal(r.world.quacks, 1);
  assert.equal(r.world.thenCount, 1);
  assert.equal(r.world.elseCount, 1);
});
test("function definitions do nothing until called and forward references are resolved", () => {
  const l = LESSONS[27];
  let r = execute([define("powitanie", seq("quack", "quack"))], l);
  assert.equal(r.world.quacks, 0);
  assert.equal(r.world.functionCalls, 0);
  r = execute(
    [
      call("powitanie"),
      define("powitanie", seq("quack", "quack")),
      call("powitanie"),
    ],
    l,
  );
  assert.equal(r.world.quacks, 4);
  assert.equal(r.world.functionCalls, 2);
  assert.equal(r.success, true);
});
test("one changed definition changes all its call sites", () => {
  const l = LESSONS[27],
    program = [define("echo", seq("quack")), call("echo"), call("echo")];
  assert.equal(execute(program, l).world.quacks, 2);
  const updated = [define("echo", seq("quack", "quack")), ...program.slice(1)];
  assert.equal(execute(updated, l).world.quacks, 4);
});
test("functions may call other functions and safely reuse while in another direction", () => {
  const bs = [
    define("maly", seq("quack")),
    define("duzy", [call("maly"), call("maly")]),
    call("duzy"),
  ];
  const r = execute(bs, LESSONS[27]);
  assert.equal(r.world.quacks, 2);
  assert.equal(r.world.functionCalls, 3);
  const walk = execute(solutions[30], LESSONS[30]);
  assert.equal(walk.success, true);
  assert.equal(walk.world.moves, 10);
  assert.equal(walk.world.functionCalls, 2);
});
test("missing, duplicate and recursive function definitions are rejected, even if unused", () => {
  assert.throws(() => compile([call("brak")]), /Najpierw stwórz funkcję/);
  assert.throws(
    () => compile([define("a", []), define("a", [])]),
    /Dwie funkcje/,
  );
  assert.throws(() => compile([define("a", [call("a")])]), /samą siebie/);
  assert.throws(
    () => compile([define("a", [call("b")]), define("b", [call("a")])]),
    /samą siebie/,
  );
  assert.throws(() => compile([define("a", [call("brak")])]), /Najpierw/);
});
test("expanded function graphs are bounded before running", () => {
  const defs = Array.from({ length: 12 }, (_, i) =>
    define(
      `f${i}`,
      i === 11 ? seq("quack") : [call(`f${i + 1}`), call(`f${i + 1}`)],
    ),
  );
  assert.throws(() => compile([...defs, call("f0")]), /256/);
});
test("imports validate both if else branches, function names and conditions", () => {
  assert.throws(
    () => validateProgram([decide("flower", [], [{ type: "exec" }])]),
    /Nie rozpoznaję/,
  );
  assert.throws(
    () => validateProgram([loop("anything", [])]),
    /Wybierz warunek/,
  );
  assert.throws(() => validateProgram([define("while", [])]), /Nazwij funkcję/);
  assert.throws(
    () => validateProgram([define("zla nazwa", [])]),
    /Nazwij funkcję/,
  );
  assert.throws(
    () => validateProgram([b("repeat", [define("ukryta", [])], 2)]),
    /głównym poziomie/,
  );
  assert.equal(
    countBlocks([decide("clear", seq("forward"), seq("left", "quack"))]),
    4,
  );
});
test("old twenty stars and new lesson programs survive the same storage format", () => {
  const stars = Array.from({ length: 20 }, (_, i) => i + 1);
  assert.deepEqual(validCompleted([...stars, 21, 28, 32, 32]), [
    ...stars,
    21,
    28,
    32,
  ]);
  for (const index of [20, 24, 27, 31]) {
    const restored = validateProgram(
      JSON.parse(JSON.stringify(solutions[index])),
    );
    assert.equal(execute(restored, LESSONS[index]).success, true);
  }
});
test("all educational Python previews parse as Python, with while, if else and def visible", () => {
  for (const bs of solutions) {
    const code = learningCode(bs);
    execFileSync(
      "python3",
      ["-c", "import ast,sys; ast.parse(sys.stdin.read())"],
      { input: code },
    );
  }
  assert.match(learningCode(solutions[20]), /while wolna_droga\(\):/);
  assert.match(learningCode(solutions[24]), /if na_kwiatku\(\):[\s\S]*else:/);
  assert.match(
    learningCode(solutions[27]),
    /def powitanie\(\):[\s\S]*powitanie\(\)/,
  );
});
test("hardware export flattens finite function calls and refuses board-dependent constructs", () => {
  const dir = mkdtempSync(join(tmpdir(), "kaczy-functions-"));
  try {
    const file = join(dir, "program.py");
    writeFileSync(file, pythonProgram(solutions[27]));
    const out = execFileSync("python3", [file], { encoding: "utf8" });
    assert.match(out, /quack, quack, quack, quack/);
    assert.match(out, /Nie wyslano polecen/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.throws(() => pythonProgram(solutions[20]), /planszy gry/);
  assert.throws(() => pythonProgram(solutions[24]), /planszy gry/);
});
test("continuous heading rotates the whole sprite by one quarter turn without wraparound", () => {
  const l = LESSONS[0];
  let w = initialWorld(l);
  assert.equal(w.angle, 90);
  for (let i = 0; i < 4; i++) w = advance(w, "right", l);
  assert.equal(w.dir, 1);
  assert.equal(w.angle, 450);
  w = advance(w, "left", l);
  assert.equal(w.dir, 0);
  assert.equal(w.angle, 360);
  w = advance(w, "forward", l);
  assert.deepEqual([w.x, w.y], [1, 3]);
});
