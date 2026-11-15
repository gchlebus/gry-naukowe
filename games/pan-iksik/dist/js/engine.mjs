function term(v, id) {
  if (typeof v === "number" && Number.isSafeInteger(v))
    return { id, kind: "n", value: v };
  if (typeof v === "string" && /^-?\d*x$/.test(v)) {
    const c = v.slice(0, -1);
    return { id, kind: "x", value: c === "" ? 1 : c === "-" ? -1 : Number(c) };
  }
  throw Error("Nieprawidłowy składnik.");
}
export function initial(lesson) {
  return {
    left: lesson.left.map((v, i) => term(v, `l${i}`)),
    right: lesson.right.map((v, i) => term(v, `r${i}`)),
  };
}
export function sums(side) {
  return side.reduce((a, t) => ({ ...a, [t.kind]: a[t.kind] + t.value }), {
    x: 0,
    n: 0,
  });
}
export function value(side, x) {
  const s = sums(side);
  return s.x * x + s.n;
}
export function solution(board) {
  const l = sums(board.left),
    r = sums(board.right),
    a = l.x - r.x,
    b = r.n - l.n;
  if (!a) throw Error("Równanie nie ma jednego rozwiązania.");
  return b / a;
}
export function label(t, withSign = false) {
  const v = Math.abs(t.value),
    body = t.kind === "x" ? (v === 1 ? "x" : `${v}x`) : String(v);
  return (t.value < 0 ? "−" : withSign ? "+" : "") + body;
}
export function expression(side) {
  if (!side.length) return "0";
  return side
    .map(
      (t, i) =>
        (i ? (t.value < 0 ? " − " : " + ") : t.value < 0 ? "−" : "") +
        label({ ...t, value: Math.abs(t.value) }),
    )
    .join("");
}
export function equation(b) {
  return `${expression(b.left)} = ${expression(b.right)}`;
}
export function ready(b) {
  return (
    b.left.length === 1 &&
    b.left[0].kind === "x" &&
    b.left[0].value === 1 &&
    b.right.every((t) => t.kind === "n")
  );
}
function compact(side, prefix) {
  const s = sums(side),
    kinds = [...new Set(side.map((t) => t.kind))];
  return kinds
    .filter((k) => s[k] !== 0)
    .map((k) => ({ id: prefix + k, kind: k, value: s[k] }));
}
export function actions(b) {
  const result = [];
  const lx = sums(b.left).x,
    rx = sums(b.right).x;
  for (const from of ["left", "right"])
    for (const t of b[from]) {
      if (!t.value) continue;
      if (
        (from === "left" && t.kind === "n") ||
        (t.kind === "x" && (from === "right" || t.value < 0 || rx !== 0))
      )
        result.push({ type: "move", from, id: t.id });
    }
  if (lx === 0 && rx !== 0) result.push({ type: "swap" });
  const merged = { left: compact(b.left, "cl"), right: compact(b.right, "cr") };
  if (["left", "right"].some((k) => merged[k].length !== b[k].length))
    result.push({ type: "collect" });
  if (
    b.left.length === 1 &&
    b.left[0].kind === "x" &&
    lx > 1 &&
    rx === 0 &&
    Number.isInteger(sums(b.right).n / lx)
  )
    result.push({ type: "divide" });
  return result;
}
export function apply(b, a) {
  if (!actions(b).some((x) => JSON.stringify(x) === JSON.stringify(a)))
    throw Error("Ten ruch nie jest teraz dostępny.");
  const next = structuredClone(b);
  let operation, detail, balance;
  if (a.type === "move") {
    const to = a.from === "left" ? "right" : "left",
      i = next[a.from].findIndex((t) => t.id === a.id),
      t = next[a.from].splice(i, 1)[0],
      op = { ...t, value: -t.value };
    next[to].push(op);
    const verb = t.value > 0 ? "Odejmujemy" : "Dodajemy",
      magnitude = label({ ...t, value: Math.abs(t.value) });
    operation = `${verb} ${magnitude} po obu stronach`;
    detail = `Składnik ${label(t, true)} znika z ${a.from === "left" ? "lewej" : "prawej"} strony. Po drugiej stronie zapisujemy ${label(op, true)}. Zmieniamy znak, bo wykonujemy działanie odwrotne po obu stronach.`;
    balance = `(${expression(b.left)}) ${label(op, true)} = (${expression(b.right)}) ${label(op, true)}`;
  } else if (a.type === "swap") {
    [next.left, next.right] = [next.right, next.left];
    operation = "Zamieniamy strony równania";
    detail =
      "Jeśli lewa strona jest równa prawej, prawa też jest równa lewej. Przy tej zamianie znaki składników się nie zmieniają.";
    balance = `${expression(b.right)} = ${expression(b.left)}`;
  } else if (a.type === "collect") {
    next.left = compact(b.left, "cl");
    next.right = compact(b.right, "cr");
    operation = "Łączymy podobne składniki";
    detail =
      "Liczby łączymy z liczbami, a Iksiki z Iksikami. Wartość każdej strony zostaje taka sama.";
    balance = equation(next);
  } else {
    const factor = sums(b.left).x;
    next.left = [{ id: "dx", kind: "x", value: 1 }];
    next.right = [{ id: "dn", kind: "n", value: sums(b.right).n / factor }];
    operation = `Dzielimy obie strony przez ${factor}`;
    detail = `${factor}x oznacza ${factor} × x. Aby został jeden x, dzielimy całą lewą i całą prawą stronę przez ${factor}. To nie jest przenoszenie składnika.`;
    balance = `(${expression(b.left)}) : ${factor} = (${expression(b.right)}) : ${factor}`;
  }
  return { board: next, operation, detail, balance };
}
export function recommend(b) {
  if (ready(b)) return null;
  const all = actions(b),
    l = sums(b.left),
    r = sums(b.right);
  if (l.x === 0 && r.x !== 0) return all.find((a) => a.type === "swap");
  if (b.left.filter((t) => t.kind === "x").length > 1)
    return all.find((a) => a.type === "collect");
  if (l.x < 0)
    return all.find(
      (a) =>
        a.type === "move" &&
        a.from === "left" &&
        b.left.find((t) => t.id === a.id)?.kind === "x",
    );
  if (l.x > 0 && r.x > 0) {
    const from = l.x > r.x ? "right" : "left";
    return all.find(
      (a) =>
        a.type === "move" &&
        a.from === from &&
        b[from].find((t) => t.id === a.id)?.kind === "x",
    );
  }
  return (
    all.find(
      (a) =>
        a.type === "move" &&
        a.from === "left" &&
        b.left.find((t) => t.id === a.id)?.kind === "n",
    ) ||
    all.find((a) => a.type === "divide") ||
    all.find((a) => a.type === "collect") ||
    all[0]
  );
}
export function replay(lesson, steps = []) {
  let board = initial(lesson);
  const log = [];
  for (const step of steps) {
    const result = apply(board, step);
    log.push({ ...result, before: equation(board) });
    board = result.board;
  }
  return { board, log };
}
export function check(lesson, answer) {
  const text = String(answer).trim();
  if (!/^-?\d{1,4}$/.test(text)) return { valid: false, ok: false };
  const x = Number(text),
    b = initial(lesson),
    left = value(b.left, x),
    right = value(b.right, x);
  return { valid: true, ok: left === right, x, left, right };
}
