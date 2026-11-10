export function permutations(values) {
  if (values.length === 0) return [[]];
  return values.flatMap((v, i) =>
    permutations(values.filter((_, j) => i !== j)).map((p) => [v, ...p]),
  );
}
export function codeFeedback(secret, guess) {
  let exact = 0,
    shared = 0;
  for (let i = 0; i < secret.length; i++) if (secret[i] === guess[i]) exact++;
  for (const c of new Set(guess))
    shared += Math.min(
      [...secret].filter((x) => x === c).length,
      [...guess].filter((x) => x === c).length,
    );
  return { exact, misplaced: shared - exact };
}
export function allCodes(length) {
  let out = [""];
  for (let i = 0; i < length; i++)
    out = out.flatMap((s) =>
      "0123456789"
        .split("")
        .filter((c) => !s.includes(c))
        .map((c) => s + c),
    );
  return out;
}
export function codeCandidates(p) {
  return allCodes(p.length).filter((s) =>
    p.clues.every((c) => {
      const f = codeFeedback(s, c.guess);
      return f.exact === c.exact && f.misplaced === c.misplaced;
    }),
  );
}
export function orderHolds(order, c) {
  const a = order.indexOf(c.a),
    b = order.indexOf(c.b),
    d = order.indexOf(c.c);
  switch (c.kind) {
    case "before":
      return a < b;
    case "next":
      return a + 1 === b;
    case "distance":
      return Math.abs(a - b) === c.n;
    case "notpos":
      return a !== c.n;
    case "pos":
      return a === c.n;
    case "edge":
      return a === 0 || a === order.length - 1;
    case "notedge":
      return a !== 0 && a !== order.length - 1;
    case "between":
      return (a < b && b < d) || (d < b && b < a);
    case "notnext":
      return Math.abs(a - b) !== 1;
    default:
      throw Error("Nieznana reguła kolejności");
  }
}
export function orderSolutions(p) {
  return permutations(p.items.map((_, i) => i)).filter((order) =>
    p.clues.every((c) => orderHolds(order, c)),
  );
}
export function runs(row) {
  const out = [];
  let n = 0;
  for (const v of [...row, 0]) {
    if (v) n++;
    else if (n) {
      out.push(n);
      n = 0;
    }
  }
  return out;
}
export function nonogramClues(cells, n) {
  return {
    rows: Array.from({ length: n }, (_, r) =>
      runs(cells.slice(r * n, r * n + n)),
    ),
    cols: Array.from({ length: n }, (_, c) =>
      runs(Array.from({ length: n }, (_, r) => cells[r * n + c])),
    ),
  };
}
const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export function solveNonogram(p, limit = 2) {
  const n = p.n,
    options = p.rows.map((clue) =>
      Array.from({ length: 2 ** n }, (_, mask) =>
        Array.from({ length: n }, (_, i) => (mask >> i) & 1),
      ).filter((row) => same(runs(row), clue)),
    ),
    solutions = [],
    chosen = [];
  function compatible(col, depth) {
    let group = 0,
      count = 0;
    const target = p.cols[col];
    for (let r = 0; r < depth; r++) {
      if (chosen[r][col]) {
        count++;
        if (group >= target.length || count > target[group]) return false;
      } else if (count) {
        if (count !== target[group]) return false;
        group++;
        count = 0;
      }
    }
    if (depth === n)
      return (
        group + (count ? 1 : 0) === target.length &&
        (!count || count === target[group])
      );
    let needed = 0;
    if (count) {
      needed = target[group] - count;
      group++;
      if (group < target.length) needed++;
    }
    for (let i = group; i < target.length; i++)
      needed += target[i] + (i > group ? 1 : 0);
    return needed <= n - depth;
  }
  function search(r) {
    if (solutions.length >= limit) return;
    if (r === n) {
      solutions.push(chosen.flat());
      return;
    }
    for (const row of options[r]) {
      chosen[r] = row;
      if (
        Array.from({ length: n }, (_, c) => compatible(c, r + 1)).every(Boolean)
      )
        search(r + 1);
      if (solutions.length >= limit) return;
    }
  }
  search(0);
  return solutions;
}
export function rotateBits(bits, turns = 1) {
  let out = bits;
  for (let t = 0; t < turns; t++) {
    let v = 0;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        if ((out >> (r * 3 + c)) & 1) v |= 1 << (c * 3 + 2 - r);
    out = v;
  }
  return out;
}
export function matrixResult(a, b, operation, rotation = 0) {
  const x = rotateBits(a, rotation);
  return operation === "xor" ? x ^ b : operation === "or" ? x | b : x & b;
}
export function matrixPossibleAnswers(p) {
  const out = new Set();
  for (const op of ["xor", "or", "and"])
    for (let rot = 0; rot < 4; rot++)
      if (
        p.rows
          .slice(0, 2)
          .every((row) => matrixResult(row[0], row[1], op, rot) === row[2])
      )
        out.add(matrixResult(p.rows[2][0], p.rows[2][1], op, rot));
  return [...out];
}
const neg = (v) => v.map((x) => (x === 0 ? 0 : -x));
const equal = (a, b) => a.every((x, i) => x === b[i]);
export const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export function foldNet(net) {
  if (net.length !== 6 || new Set(net.map((x) => x.x + "," + x.y)).size !== 6)
    throw Error("Nieprawidłowa siatka");
  const frames = new Map([
      [net[0].id, { r: [1, 0, 0], u: [0, 1, 0], n: [0, 0, 1] }],
    ]),
    queue = [net[0]];
  for (let i = 0; i < queue.length; i++) {
    const tile = queue[i],
      f = frames.get(tile.id);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const next = net.find((t) => t.x === tile.x + dx && t.y === tile.y + dy);
      if (!next) continue;
      const frame =
        dx === 1
          ? { n: f.r, r: neg(f.n), u: f.u }
          : dx === -1
            ? { n: neg(f.r), r: f.n, u: f.u }
            : dy === -1
              ? { n: f.u, u: neg(f.n), r: f.r }
              : { n: neg(f.u), u: f.n, r: f.r };
      if (frames.has(next.id)) {
        if (!equal(frames.get(next.id).n, frame.n))
          throw Error("Siatka nie składa się w sześcian");
      } else {
        frames.set(next.id, frame);
        queue.push(next);
      }
    }
  }
  if (
    frames.size !== 6 ||
    new Set([...frames.values()].map((f) => f.n.join())).size !== 6
  )
    throw Error("Ścianki zachodzą na siebie");
  return frames;
}
export function cubeAnswer(p) {
  const f = foldNet(p.net),
    target =
      p.mode === "opposite"
        ? neg(f.get(p.front).n)
        : cross(f.get(p.up).n, f.get(p.front).n);
  const found = [...f].find(([, v]) => equal(v.n, target));
  if (!found) throw Error("Nieprawidłowa orientacja");
  return found[0];
}
export function lightEffect(n, i) {
  let mask = 0;
  const r = Math.floor(i / n),
    c = i % n;
  for (const [dr, dc] of [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const rr = r + dr,
      cc = c + dc;
    if (rr >= 0 && rr < n && cc >= 0 && cc < n) mask ^= 1 << (rr * n + cc);
  }
  return mask;
}
export function toggleLight(n, state, i) {
  return state ^ lightEffect(n, i);
}
export function lightSolutions(n, start) {
  const effects = Array.from({ length: n * n }, (_, i) => lightEffect(n, i)),
    found = [];
  let current = start,
    last = 0;
  if (current === 0) found.push(0);
  for (let k = 1; k < 2 ** (n * n); k++) {
    const gray = k ^ (k >> 1),
      diff = last ^ gray,
      bit = 31 - Math.clz32(diff);
    current ^= effects[bit];
    if (current === 0) found.push(gray);
    last = gray;
  }
  return found;
}
export function popcount(n) {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
}
export function shortestLights(n, state) {
  return lightSolutions(n, state).sort(
    (a, b) => popcount(a) - popcount(b) || a - b,
  )[0];
}
export function lightMoves(mask, n) {
  return Array.from({ length: n * n }, (_, i) => i).filter(
    (i) => (mask >> i) & 1,
  );
}
export function normalizeText(v) {
  return String(v ?? "")
    .toUpperCase()
    .replaceAll("Ł", "L")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "");
}
const mod = (n, m) => ((n % m) + m) % m;
export function crypt(text, method, key, decode = false) {
  let pos = 0;
  return text.toUpperCase().replace(/[A-Z]/g, (c) => {
    const x = c.charCodeAt(0) - 65,
      i = pos++;
    let y;
    if (method === "caesar") y = x + (decode ? -1 : 1) * key;
    else if (method === "vigenere") {
      const k = key[i % key.length].charCodeAt(0) - 65;
      y = x + (decode ? -k : k);
    } else if (method === "alternating") {
      const k = i % 2 ? -2 : 3;
      y = x + (decode ? -k : k);
    } else if (method === "affine") y = decode ? 21 * (x - 8) : 5 * x + 8;
    else throw Error("Nieznany szyfr");
    return String.fromCharCode(65 + mod(y, 26));
  });
}
export function defaultDraft(p) {
  if (p.type === "grid") return Array(p.items.length ** 2).fill(0);
  if (p.type === "nonogram") return Array(p.n * p.n).fill(0);
  if (p.type === "lights") return { mask: p.start, history: [] };
  if (p.type === "select") return [];
  return "";
}
export function cleanDraft(p, value) {
  const base = defaultDraft(p);
  if (p.type === "grid" || p.type === "nonogram")
    return Array.isArray(value) && value.length === base.length
      ? value.map((v) => (v === 1 ? 1 : v === -1 ? -1 : 0))
      : base;
  if (p.type === "lights") {
    if (
      !value ||
      !Number.isInteger(value.mask) ||
      value.mask < 0 ||
      value.mask >= 2 ** (p.n * p.n)
    )
      return base;
    const history = Array.isArray(value.history)
      ? value.history
          .filter((i) => Number.isInteger(i) && i >= 0 && i < p.n * p.n)
          .slice(0, 1000)
      : [];
    let mask = p.start;
    for (const i of history) mask = toggleLight(p.n, mask, i);
    return mask === value.mask ? { mask, history } : base;
  }
  if (p.type === "select")
    return Array.isArray(value)
      ? [...new Set(value.filter((x) => p.cards.some((c) => c.id === x)))]
      : base;
  return typeof value === "string" ? value.slice(0, 100) : base;
}
export function truthCandidates(p) {
  return p.people
    .map((_, i) => i)
    .filter(
      (i) =>
        p.claims.filter((c) => (i === c.target) !== c.negative).length ===
        p.trueCount,
    );
}
export function expected(p) {
  switch (p.type) {
    case "matrix":
      return String(p.options.indexOf(p.answer));
    case "cube":
      return cubeAnswer(p);
    case "code":
      return p.secret;
    case "cipher":
      return p.plain;
    case "truth":
      return String(p.answer);
    case "balance":
      return String(p.answer);
    case "select":
      return p.cards
        .filter((c) => c.role === "A" || c.role === "notB")
        .map((c) => c.id);
    case "grid":
      return p.solution;
    case "nonogram":
      return p.solution;
    case "lights":
      return 0;
    default:
      throw Error("Nieznany typ");
  }
}
export function checkAnswer(p, draft) {
  if (p.type === "grid") {
    const n = p.items.length,
      marks = Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) =>
          draft[r * n + c] === 1 ? c : -1,
        ).filter((v) => v >= 0),
      );
    if (
      marks.some((r) => r.length !== 1) ||
      new Set(marks.map((r) => r[0])).size !== n
    )
      return {
        ok: false,
        incomplete: true,
        message:
          "Zaznacz dokładnie jedno potwierdzenie w każdym wierszu i w każdej kolumnie.",
      };
    const order = Array.from({ length: n }, (_, pos) =>
      marks.findIndex((row) => row[0] === pos),
    );
    return { ok: p.clues.every((c) => orderHolds(order, c)) };
  }
  if (p.type === "nonogram")
    return { ok: p.solution.every((v, i) => (draft[i] === 1 ? 1 : 0) === v) };
  if (p.type === "lights") return { ok: draft.mask === 0 };
  if (p.type === "select") {
    if (!draft.length)
      return {
        ok: false,
        incomplete: true,
        message: "Wybierz karty, które trzeba odwrócić.",
      };
    return { ok: same([...draft].sort(), expected(p).sort()) };
  }
  if (!String(draft).trim())
    return {
      ok: false,
      incomplete: true,
      message: "Najpierw zaznacz lub wpisz odpowiedź.",
    };
  if (p.type === "balance")
    return { ok: Number(String(draft).trim().replace(",", ".")) === p.answer };
  if (p.type === "cipher")
    return { ok: normalizeText(draft) === normalizeText(expected(p)) };
  return { ok: String(draft).trim() === String(expected(p)) };
}
