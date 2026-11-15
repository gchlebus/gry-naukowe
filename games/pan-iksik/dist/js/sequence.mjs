import { apply, equation, label, sums } from "./engine.mjs";

// A lesson film is a projection, never another source of game state.
// Every frame is an equivalent equation, including the intermediate operations.
export function explainChange(before, action) {
  const result = apply(before, action);
  const visual = (board) =>
    Object.fromEntries(
      ["left", "right"].map((side) => [
        side,
        board[side].map((t) => ({ ...t, key: t.id })),
      ]),
    );
  const frame = (board, title, text, extra = {}) => ({
    ...visual(board),
    title,
    text,
    ...extra,
  });
  const frames = [];
  if (action.type === "move") {
    const from = action.from,
      to = from === "left" ? "right" : "left";
    const t = before[from].find((t) => t.id === action.id);
    const inverse = { kind: t.kind, value: -t.value };
    const sourceName = from === "left" ? "lewej" : "prawej";
    const targetName = to === "left" ? "lewej" : "prawej";
    const first = frame(
      before,
      `Przyglądamy się ${label(t, true)}`,
      `Chcemy usunąć ${label(t, true)} z ${sourceName} strony. Zadbamy przy tym o równowagę.`,
      { highlight: [t.id] },
    );
    const balanced = structuredClone(before);
    for (const side of ["left", "right"])
      balanced[side].push({ ...inverse, id: `inverse-${side}` });
    const both = frame(
      balanced,
      result.operation,
      `Oba kolorowe kafelki pokazują to samo działanie: ${label(inverse, true)}. Robimy je jednocześnie po lewej i po prawej.`,
      {
        added: ["inverse-left", "inverse-right"],
        operation: label(inverse, true),
      },
    );
    const cancel = frame(
      balanced,
      `${label(t, true)} i ${label(inverse, true)} dają zero`,
      `Na ${sourceName} stronie te dwa składniki się znoszą. Zero możemy pominąć. Po ${targetName} zostaje ${label(inverse, true)}.`,
      {
        cancel: [t.id, `inverse-${from}`],
        zeroSide: from,
        operation: label(inverse, true),
      },
    );
    const last = frame(
      result.board,
      "Równanie po naszym ruchu",
      `Tak zapisujemy efekt w skrócie: ${label(t, true)} → ${label(inverse, true)}. Znak zmienił się, ponieważ wykonaliśmy działanie odwrotne po obu stronach.`,
      { shortcut: `${label(t, true)} → ${label(inverse, true)}` },
    );
    // The inverse tile on the other side survives the cancellation.
    last[to].find((v) => v.id === t.id).key = `inverse-${to}`;
    frames.push(first, both, cancel, last);
  } else if (action.type === "swap") {
    frames.push(
      frame(
        before,
        "Iksik przechodzi na lewą stronę",
        "Możemy zamienić miejscami całe strony równania. Patrz na zielone i złote kafelki.",
      ),
      frame(
        result.board,
        "Całe strony zamieniają się miejscami",
        "Każdy kafelek zachowuje swój znak. Zamiana stron nie jest przenoszeniem pojedynczego składnika.",
        { swap: true },
      ),
      frame(
        result.board,
        "Ta sama równość, czytana od drugiej strony",
        "Lewa i prawa strona nadal mają taką samą wartość. Znaki pozostały bez zmian.",
        { shortcut: "Znaki zostają takie same" },
      ),
    );
  } else if (action.type === "collect") {
    const grouped = structuredClone(before);
    for (const side of ["left", "right"])
      grouped[side].sort(
        (a, b) => (a.kind === "x" ? 0 : 1) - (b.kind === "x" ? 0 : 1),
      );
    frames.push(
      frame(
        before,
        "Szukamy podobnych składników",
        "Zielone Iksiki łączymy z Iksikami. Złote liczby łączymy z liczbami.",
      ),
      frame(
        grouped,
        "Każdy składnik idzie do swojej grupy",
        "Przesuwamy całe kafelki razem z ich znakami. Wartość każdej strony pozostaje taka sama.",
        { grouping: true },
      ),
      frame(
        result.board,
        "Z kilku kafelków robi się jeden",
        "Dodaliśmy współczynniki Iksików i policzyliśmy liczby. Jeśli grupa daje zero, możemy ją pominąć.",
        { merge: true, shortcut: "Iksiki z Iksikami · liczby z liczbami" },
      ),
    );
  } else {
    const factor = sums(before.left).x;
    const total = sums(before.right).n;
    const groupLabel = `${factor} ${factor <= 4 ? "równe grupy" : "równych grup"}`;
    frames.push(
      frame(
        before,
        `Iksiki w grupce: ${factor}`,
        `Szukamy wartości jednego x. Dlatego całą lewą i całą prawą stronę podzielimy przez ${factor}.`,
      ),
      frame(
        before,
        result.operation,
        `Nawias obejmuje całą stronę. Po prawej najpierw liczymy: ${equation({ left: before.right, right: [{ kind: "n", value: total }] })}.`,
        { divisor: factor },
      ),
    );
    // Current lessons use factors 2..5. Large imported coefficients still get
    // the whole-side division view without trying to draw thousands of tiles.
    if (factor <= 8) {
      const groups = { left: [], right: [] };
      for (let i = 0; i < factor; i++) {
        groups.left.push({ id: `group-l-${i}`, kind: "x", value: 1 });
        groups.right.push({
          id: `group-r-${i}`,
          kind: "n",
          value: total / factor,
        });
      }
      frames.push(
        frame(
          groups,
          `${groupLabel} po każdej stronie`,
          `${total} dzielimy na ${groupLabel}. Każda ma ${total / factor}. Wyróżniona para pokazuje jednego x i jego wartość.`,
          { groups: factor, groupLabel },
        ),
      );
    }
    frames.push(
      frame(
        result.board,
        "Zostaje jeden Iksik",
        `Wzięliśmy jedną z ${factor} równych grup po każdej stronie. Teraz x = ${sums(result.board.right).n}.`,
        {
          merge: true,
          shortcut: `Cała lewa : ${factor} · cała prawa : ${factor}`,
        },
      ),
    );
  }
  return {
    type: action.type,
    before: structuredClone(before),
    after: result.board,
    operation: result.operation,
    frames,
  };
}
