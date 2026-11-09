import { test } from "node:test";
import assert from "node:assert/strict";
import {
  Cube,
  SOLVED,
  apply,
  inverse,
  validateState,
  netToState,
  colored,
  DEFAULT_CENTERS,
  stickerGeometry,
  FACES,
  NORMALS,
} from "../lib/cube.ts";
import { solveStages, stageDone, GENERATORS } from "../lib/solver.ts";
test("facelet mapping, inverse moves and renderer agree for each quarter turn", () => {
  const geometry = stickerGeometry();
  assert.equal(
    new Set(geometry.map((s) => s.position.join() + ":" + s.normal.join()))
      .size,
    54,
  );
  for (const f of FACES) {
    assert.equal(apply(SOLVED, `${f} ${f} ${f} ${f}`), SOLVED);
    const state = apply(SOLVED, f);
    const normal = NORMALS[f],
      axis = normal.findIndex((x) => x !== 0),
      sign = normal[axis];
    const labels = [...SOLVED];
    for (const s of geometry) {
      let p = [...s.position],
        n = [...s.normal];
      if (s.position[axis] * sign === 1) {
        const rotate = (v: number[]) => {
          const [x, y, z] = v;
          return axis === 0
            ? [x, sign * z, -sign * y]
            : axis === 1
              ? [-sign * z, y, sign * x]
              : [sign * y, -sign * x, z];
        };
        p = rotate(p);
        n = rotate(n);
      }
      const dest = geometry.find(
        (d) =>
          d.position.every((v, i) => v === p[i]) &&
          d.normal.every((v, i) => v === n[i]),
      )!;
      labels[dest.index] = SOLVED[s.index];
    }
    assert.equal(labels.join(""), state, f);
    assert.equal(apply(state, inverse(f)), SOLVED);
  }
});
test("validator rejects incomplete, duplicate and impossible cubes", () => {
  assert.equal(validateState(SOLVED), null);
  assert.ok(validateState(SOLVED.slice(1)));
  let s = [...SOLVED];
  [s[5], s[10]] = [s[10], s[5]];
  assert.ok(validateState(s.join("")));
  const c = new Cube();
  c.co[0] = 1;
  assert.ok(validateState(c.asString()));
  const e = new Cube();
  [e.ep[0], e.ep[1]] = [e.ep[1], e.ep[0]];
  assert.ok(validateState(e.asString()));
  assert.equal(
    netToState(colored(SOLVED, DEFAULT_CENTERS), DEFAULT_CENTERS).state,
    SOLVED,
  );
});
test("stage generators preserve completed previous layers", () => {
  for (let stage = 2; stage < 8; stage++)
    for (const alg of GENERATORS[stage]) {
      const c = new Cube().move(alg);
      assert.equal(stageDone(c, stage - 1), true, `${stage} ${alg}`);
    }
});
test("solver reaches every checkpoint and a solved cube from many legal scrambles", () => {
  const scrambles = [
    "R",
    "R U R' U'",
    "R U2 F' L D B2 R' U F2 D' L2 B U2 R2 F' D2 L' B2",
    "F R U R' U' F'",
    ...Array.from({ length: 16 }, (_, seed) => {
      let n = seed + 17;
      return Array.from({ length: 22 }, () => {
        n = (n * 1664525 + 1013904223) >>> 0;
        return FACES[n % 6] + ["", "2", "'"][(n >>> 12) % 3];
      }).join(" ");
    }),
  ];
  for (const scramble of scrambles) {
    let state = apply(SOLVED, scramble);
    assert.equal(validateState(state), null);
    const plans = solveStages(state);
    for (const p of plans) {
      assert.equal(p.start, state);
      state = apply(state, p.moves.join(" "));
      assert.equal(state, p.end);
      assert.ok(
        stageDone(Cube.fromString(state), p.id),
        `${scramble}: ${p.id}`,
      );
    }
    assert.equal(state, SOLVED);
  }
});
test("an already solved cube stays solved without extra moves", () => {
  assert.ok(
    solveStages(SOLVED).every((p) => p.moves.length === 0 && p.end === SOLVED),
  );
});
