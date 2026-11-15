import {
  TOPICS,
  LETTERS,
  LETTER_SLOTS,
  COPY_TEXTS,
  LAYERS,
  FOREST_QUESTIONS,
  WORDS,
  PLANTS,
  SHAPES,
  STORIES,
} from "./data.mjs";
export const KEY = "lesna-akademia-v1";
export const clean = (s) =>
  String(s ?? "")
    .normalize("NFC")
    .replace(/\s+/gu, " ")
    .trim();
export const numberValue = (s) =>
  /^\d{1,3}$/.test(clean(s)) ? Number(clean(s)) : null;
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(items, random) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function fresh() {
  return {
    v: 1,
    stars: 0,
    sound: false,
    stats: Object.fromEntries(
      TOPICS.map((t) => [t.id, { seen: 0, recent: [], level: 2, streak: 0 }]),
    ),
  };
}
export function parseState(raw) {
  const p = JSON.parse(raw),
    s = fresh();
  if (!p || p.v !== 1) throw Error("To nie jest zapis Leśnej Akademii.");
  s.stars =
    Number.isSafeInteger(p.stars) && p.stars >= 0
      ? Math.min(p.stars, 100000)
      : 0;
  s.sound = p.sound === true;
  for (const t of TOPICS) {
    const v = p.stats?.[t.id];
    if (!v) continue;
    s.stats[t.id] = {
      seen:
        Number.isSafeInteger(v.seen) && v.seen >= 0
          ? Math.min(v.seen, 100000)
          : 0,
      recent: Array.isArray(v.recent)
        ? v.recent.filter((x) => typeof x === "boolean").slice(-5)
        : [],
      level: [1, 2, 3].includes(v.level) ? v.level : 2,
      streak: [0, 1].includes(v.streak) ? v.streak : 0,
    };
  }
  return s;
}
export function mastered(stat) {
  return stat.recent.length === 5 && stat.recent.filter(Boolean).length >= 4;
}
export function record(state, topic, ok, first) {
  const s = state.stats[topic];
  s.seen++;
  s.recent.push(!!first);
  s.recent = s.recent.slice(-5);
  if (first) {
    s.streak++;
    if (s.streak >= 2) {
      s.level = Math.min(3, s.level + 1);
      s.streak = 0;
    }
  } else {
    s.level = Math.max(1, s.level - 1);
    s.streak = 0;
  }
  if (ok) state.stars++;
}
export function arithmeticHelp(a, b, op) {
  const result = op === "+" ? a + b : a - b,
    unit = a % 10;
  if (b < 10 && op === "+" && unit + b >= 10) {
    const n = 10 - unit;
    return `${a} + ${b} = ${a} + ${n} + ${b - n} = ${a + n} + ${b - n} = ${result}. Najpierw dopełniamy do dziesiątki.`;
  }
  if (b < 10 && op === "-" && unit < b) {
    if (unit === 0)
      return `${a} − ${b} = ${a - 10} + ${10 - b} = ${result}. Z ostatniej dziesiątki zostaje ${10 - b}.`;
    return `${a} − ${b} = ${a} − ${unit} − ${b - unit} = ${a - unit} − ${b - unit} = ${result}. Najpierw schodzimy do dziesiątki.`;
  }
  if (b >= 10) {
    const tens = Math.floor(b / 10) * 10,
      u = b % 10,
      m = op === "+" ? a + tens : a - tens;
    return `${a} ${op === "+" ? "+" : "−"} ${b} = ${a} ${op === "+" ? "+" : "−"} ${tens} ${op === "+" ? "+" : "−"} ${u} = ${m} ${op === "+" ? "+" : "−"} ${u} = ${result}. Najpierw dziesiątki, potem jedności.`;
  }
  return `${a} ${op === "+" ? "+" : "−"} ${b} = ${result}. Możesz przesuwać się na osi liczbowej po jednym kroku.`;
}
export function mirrorCell(index, axis, size = 6) {
  const r = Math.floor(index / size),
    c = index % size;
  return axis === "v" ? r * size + (size - 1 - c) : (size - 1 - r) * size + c;
}
export function task(topic, serial = 0, level = 2, seed = 1) {
  const random = rng(
      seed + serial * 131 + TOPICS.findIndex((t) => t.id === topic) * 1709,
    ),
    pick = (a) => a[Math.floor(random() * a.length)],
    n = (lo, hi) => lo + Math.floor(random() * (hi - lo + 1));
  const base = { topic, serial, level, id: `${topic}-${serial}-${seed}` };
  if (topic === "list") {
    const parts = LETTERS[serial % LETTERS.length];
    return {
      ...base,
      kind: "assign",
      scene: "letter",
      prompt:
        "Ułóż list. Wybierz kafelek i kliknij miejsce, do którego pasuje.",
      slots: LETTER_SLOTS,
      items: shuffle(
        parts.map((text, i) => ({ id: String(i), text })),
        random,
      ),
      correct: parts.map((_, i) => String(i)),
      explain:
        "Miejscowość i data są na górze. Potem: zwrot do adresata, treść, pożegnanie i podpis.",
    };
  }
  if (topic === "pisanie") {
    const pool =
      level === 1
        ? COPY_TEXTS.slice(0, 4)
        : level === 2
          ? COPY_TEXTS.slice(0, 8)
          : COPY_TEXTS;
    return {
      ...base,
      kind: "copy",
      prompt: "Przepisz tekst dokładnie. Zwróć uwagę na każdą literkę i znaki.",
      text: pool[serial % pool.length],
      explain:
        "Sprawdzaj po jednym wyrazie. Zachowaj polskie znaki, wielkie litery i znaki przestankowe.",
    };
  }
  if (topic === "las") {
    if (serial % 3 === 0)
      return {
        ...base,
        kind: "assign",
        scene: "forest",
        prompt: "Podpisz warstwy lasu. Zacznij od tej, która jest najwyżej.",
        slots: [
          "1 · Najwyżej",
          "2 · Niżej",
          "3 · Tuż nad ściółką",
          "4 · Najniżej",
        ],
        items: shuffle(
          LAYERS.map((text, i) => ({ id: String(i), text })),
          random,
        ),
        correct: ["0", "1", "2", "3"],
        explain: "Od góry: korony drzew → podszyt → runo leśne → ściółka.",
      };
    const q = FOREST_QUESTIONS[(serial - 1) % FOREST_QUESTIONS.length];
    return {
      ...base,
      kind: "choice",
      prompt: q[0],
      options: shuffle(
        LAYERS.map((text, i) => ({ id: String(i), text })),
        random,
      ),
      correct: String(q[1]),
      explain: q[2],
    };
  }
  if (topic === "gramatyka") {
    const nouns = WORDS.filter((w) => w[2] === "rzeczownik").slice(
        0,
        level === 1 ? 6 : 10,
      ),
      verbs = WORDS.filter((w) => w[2] === "czasownik").slice(
        0,
        level === 1 ? 4 : 10,
      ),
      pool = [];
    for (let i = 0; i < Math.max(nouns.length, verbs.length); i++) {
      if (nouns[i]) pool.push(nouns[i]);
      if (verbs[i]) pool.push(verbs[i]);
    }
    const word = pool[serial % pool.length],
      plural = Math.floor(serial / 2) % 2 === 1;
    const original = word[plural ? 1 : 0],
      verb = word[2] === "czasownik";
    if (serial % 3 !== 2)
      return {
        ...base,
        kind: "grammar",
        prompt: "Rozpoznaj część mowy i liczbę wyróżnionego wyrazu.",
        word: original,
        context: verb
          ? plural
            ? "One " + original + "."
            : "Ona " + original + "."
          : null,
        part: word[2],
        plural,
        explain: `„${original}” to ${word[2]} w liczbie ${plural ? "mnogiej" : "pojedynczej"}. ${verb ? "Czasownik mówi, co ktoś robi lub co się z nim dzieje." : "Rzeczownik odpowiada na pytania kto? co?"}`,
      };
    return {
      ...base,
      kind: "word",
      prompt: `Zmień na liczbę ${plural ? "pojedynczą" : "mnogą"}. Wpisz tylko wyróżniony wyraz${original.includes(" ") ? " z „się”" : ""}.`,
      word: original,
      context: verb
        ? plural
          ? "One " + original + "."
          : "Ona " + original + "."
        : null,
      correct: word[plural ? 0 : 1],
      explain: `${word[0]} → ${word[1]}. Pierwszy wyraz jest w liczbie pojedynczej, a drugi w mnogiej.`,
    };
  }
  if (topic === "rosliny") {
    const plant = PLANTS[serial % PLANTS.length];
    return (serial + Math.floor(serial / 4)) % 2 === 0
      ? {
          ...base,
          kind: "plant-name",
          prompt: "Co to za roślina? Przyjrzyj się jej budowie.",
          plant: plant.id,
          options: shuffle(
            PLANTS.map((p) => ({ id: p.id, text: p.name })),
            random,
          ),
          correct: plant.id,
          explain: plant.note,
        }
      : {
          ...base,
          kind: "plant-pick",
          prompt: `Znajdź na ilustracjach: ${plant.name.toLowerCase()}.`,
          options: shuffle(
            PLANTS.map((p) => ({ id: p.id, text: p.feature })),
            random,
          ),
          correct: plant.id,
          explain: plant.note,
        };
  }
  if (topic === "symetria") {
    if (serial % 2 === 0) {
      const axis = level === 1 ? "v" : serial % 4 === 0 ? "v" : "h";
      let cells = [];
      const candidates = Array.from({ length: 36 }, (_, i) => i).filter((i) =>
        axis === "v" ? i % 6 < 3 : Math.floor(i / 6) < 3,
      );
      cells = shuffle(candidates, random).slice(0, level + 3);
      return {
        ...base,
        kind: "mirror",
        prompt: `Dorysuj lustrzane odbicie po drugiej stronie ${axis === "v" ? "pionowej" : "poziomej"} osi.`,
        axis,
        cells: cells.sort((a, b) => a - b),
        correct: cells.map((i) => mirrorCell(i, axis)).sort((a, b) => a - b),
        explain:
          "Każda zaznaczona kratka ma parę po drugiej stronie osi, w tej samej odległości. Nie dodawaj innych kratek.",
      };
    }
    const shape = SHAPES[Math.floor(serial / 2) % SHAPES.length];
    return {
      ...base,
      kind: "axis",
      prompt:
        "Wybierz jedną poprawną oś symetrii figury. Jeśli jej nie ma, zaznacz „Brak osi”.",
      shape: shape.id,
      correct: shape.axes,
      explain: shape.axes.includes("none")
        ? "Ten równoległobok nie ma osi symetrii. Po złożeniu wzdłuż żadnej z pokazanych linii połówki się nie pokryją."
        : `To ${shape.name}. Po złożeniu wzdłuż zaznaczonej poprawnej osi obie części pokryją się. Figura może mieć więcej niż jedną poprawną oś.`,
    };
  }
  if (topic === "zadania") {
    const q = STORIES[serial % STORIES.length];
    return {
      ...base,
      kind: "story",
      prompt: q.text,
      ...q,
      result: q.op === "+" ? q.a + q.b : q.a - q.b,
      explain:
        arithmeticHelp(q.a, q.b, q.op) + " Przykładowa odpowiedź: " + q.answer,
    };
  }
  if (topic === "pieniadze") {
    const kind = serial % 3;
    if (kind === 0) {
      const target =
        level === 1 ? n(4, 10) : level === 2 ? n(11, 25) : n(26, 40);
      return {
        ...base,
        kind: "coins",
        prompt: `Odlicz dokładnie ${target} zł. Możesz użyć monet 1 zł, 2 zł i 5 zł.`,
        correct: target,
        explain: `Wszystkie monety razem mają dać ${target} zł. Różne zestawy monet mogą być poprawne.`,
      };
    }
    if (kind === 1) {
      const coins = Array.from({ length: level + 3 }, () => pick([1, 2, 5]));
      return {
        ...base,
        kind: "money-count",
        prompt: "Ile pieniędzy jest w portmonetce? Policz wszystkie monety.",
        coins,
        correct: coins.reduce((a, b) => a + b, 0),
        unit: "zł",
        explain:
          coins.join(" + ") + " = " + coins.reduce((a, b) => a + b, 0) + " zł.",
      };
    }
    const pay = level === 1 ? 10 : level === 2 ? 20 : 50,
      cost = n(level === 1 ? 2 : level === 2 ? 7 : 21, pay - 2);
    return {
      ...base,
      kind: "change",
      prompt: `Zeszyt kosztuje ${cost} zł. Płacisz ${pay} zł. Ile reszty otrzymasz?`,
      pay,
      cost,
      correct: pay - cost,
      unit: "zł",
      explain: `Reszta to zapłacona kwota minus koszt: ${pay} − ${cost} = ${pay - cost} zł.`,
    };
  }
  if (topic === "rachunki") {
    const examples = [
      [63, 9, "+"],
      [73, 6, "-"],
      [78, 35, "-"],
      [43, 24, "+"],
    ];
    let a, b, op;
    if (serial < 4) [a, b, op] = examples[serial];
    else {
      op = pick(["+", "-"]);
      if (level === 1) {
        a = 10 * n(1, 2) + n(1, 8);
        b = op === "+" ? n(1, 9 - (a % 10)) : n(1, a % 10);
      } else if (level === 2) {
        a = n(20, 89);
        b = n(2, 9);
      } else {
        a = n(30, 89);
        b = n(11, Math.min(op === "+" ? 100 - a : a - 1, 49));
      }
      if (op === "+" && a + b > 100) b = 100 - a;
    }
    return {
      ...base,
      kind: "arithmetic",
      prompt: "Policz. Jeśli potrzebujesz, rozbij liczbę na mniejsze części.",
      a,
      b,
      op,
      correct: op === "+" ? a + b : a - b,
      explain: arithmeticHelp(a, b, op),
    };
  }
  throw Error("Nieznany temat.");
}
export function copyDiff(expected, actual) {
  const a = [...clean(expected)],
    b = [...clean(actual)],
    dp = Array.from(
      { length: a.length + 1 },
      () => new Uint16Array(b.length + 1),
    );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  let i = a.length,
    j = b.length,
    parts = [];
  while (i || j) {
    if (
      i &&
      j &&
      dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
    ) {
      parts.push({
        type: a[i - 1] === b[j - 1] ? "same" : "wrong",
        expected: a[--i],
        actual: b[--j],
      });
    } else if (i && dp[i][j] === dp[i - 1][j] + 1)
      parts.push({ type: "missing", expected: a[--i], actual: "" });
    else parts.push({ type: "extra", expected: "", actual: b[--j] });
  }
  return { distance: dp[a.length][b.length], parts: parts.reverse() };
}
export function checkCalculation(text, q) {
  const s = clean(text).replace(/[−–]/g, "-").replace(/\s/g, "");
  const m = s.match(/^(\d{1,3})([+-])(\d{1,3})=(\d{1,3})$/);
  if (!m) return false;
  const a = Number(m[1]),
    b = Number(m[3]),
    r = Number(m[4]);
  return (
    m[2] === q.op &&
    r === q.result &&
    ((a === q.a && b === q.b) || (q.op === "+" && a === q.b && b === q.a))
  );
}
export function checkSentence(text, q) {
  const s = clean(text),
    lower = s.toLocaleLowerCase("pl");
  if (!new RegExp(`(^|[^0-9])${q.result}([^0-9]|$)`).test(s))
    return "W odpowiedzi podaj poprawną liczbę.";
  if (
    q.unit &&
    !new RegExp(`(^|[^\\p{L}])${q.unit}([^\\p{L}]|$)`, "u").test(lower) &&
    !(q.unit === "kg" && /kilogram\p{L}*/u.test(lower)) &&
    !(q.unit === "zł" && /złot\p{L}*/u.test(lower))
  )
    return `Dopisz jednostkę: ${q.unit}.`;
  if (!q.stems.some((stem) => lower.includes(stem)))
    return " Napisz też, czego dotyczy wynik. Spójrz jeszcze raz na pytanie.";
  if ((s.match(/\p{L}+/gu) || []).length < 2)
    return "Napisz odpowiedź zdaniem, nie tylko sam wynik.";
  if (/^\p{Ll}/u.test(s)) return "Zacznij odpowiedź wielką literą.";
  if (!/[.!]$/.test(s)) return "Zakończ odpowiedź kropką.";
  return "";
}
export function complete(q, a) {
  switch (q.kind) {
    case "assign":
      return q.slots.every((_, i) => a.slots?.[i] != null);
    case "copy":
    case "word":
      return clean(a.text).length > 0;
    case "grammar":
      return !!a.part && a.plural !== undefined;
    case "mirror":
      return (a.cells?.length || 0) > 0;
    case "story":
      return !!clean(a.calculation) && !!clean(a.sentence);
    case "coins":
      return (a.coins?.length || 0) > 0;
    case "change":
    case "money-count":
    case "arithmetic":
      return !!clean(a.text);
    default:
      return !!a.choice;
  }
}
export function grade(q, a) {
  let ok = false,
    detail = "",
    diff;
  switch (q.kind) {
    case "assign":
      ok = q.correct.every((id, i) => a.slots?.[i] === id);
      detail = ok
        ? "Każdy kafelek trafił na swoje miejsce."
        : "Nie wszystkie miejsca pasują. Sprawdź kolejność i spróbuj ponownie.";
      break;
    case "copy":
      diff = copyDiff(q.text, a.text || "");
      ok = diff.distance === 0;
      detail = ok
        ? "Dokładnie tak! Wszystkie litery i znaki się zgadzają."
        : `Sprawdź zaznaczone miejsca. Liczba różnic: ${diff.distance}.`;
      break;
    case "grammar":
      ok = a.part === q.part && a.plural === q.plural;
      detail = ok
        ? "Część mowy i liczba rozpoznane!"
        : "Sprawdź obie odpowiedzi: co nazywa wyraz i czy dotyczy jednej osoby lub rzeczy, czy wielu.";
      break;
    case "word":
      ok = clean(a.text).toLocaleLowerCase("pl") === q.correct;
      break;
    case "mirror": {
      const chosen = [...new Set(a.cells || [])].sort((a, b) => a - b);
      ok =
        chosen.length === q.correct.length &&
        chosen.every((v, i) => v === q.correct[i]);
      break;
    }
    case "axis":
      ok = q.correct.includes(a.choice);
      break;
    case "story": {
      const calc = checkCalculation(a.calculation, q),
        sentence = checkSentence(a.sentence, q);
      ok = calc && !sentence;
      detail = !calc
        ? "Sprawdź działanie. Zapisz je razem z wynikiem, np. 24 + 9 = 33."
        : sentence;
      break;
    }
    case "coins":
      ok =
        (a.coins || []).every((c) => [1, 2, 5].includes(c)) &&
        (a.coins || []).reduce((s, c) => s + c, 0) === q.correct;
      break;
    case "arithmetic":
    case "money-count":
    case "change":
      ok = numberValue(a.text) === q.correct;
      break;
    default:
      ok = a.choice === q.correct;
  }
  return {
    ok,
    message:
      detail ||
      (ok
        ? "Dobra robota! To poprawna odpowiedź."
        : "Jeszcze jeden mały krok. Sprawdź swój pomysł i spróbuj ponownie."),
    explain: q.explain,
    ...(diff ? { diff } : {}),
  };
}
export function correctAnswer(q) {
  switch (q.kind) {
    case "assign":
      return q.correct
        .map((id) => q.items.find((i) => i.id === id).text)
        .join(" → ");
    case "copy":
      return q.text;
    case "grammar":
      return `${q.part}, liczba ${q.plural ? "mnoga" : "pojedyncza"}`;
    case "word":
      return q.correct;
    case "mirror":
      return "Lustrzane kratki po drugiej stronie osi.";
    case "axis":
      return q.explain;
    case "story":
      return `${q.a} ${q.op === "+" ? "+" : "−"} ${q.b} = ${q.result}. ${q.answer}`;
    case "coins":
      return `${q.correct} zł w dowolnym poprawnym zestawie monet.`;
    case "arithmetic":
      return `${q.a} ${q.op === "+" ? "+" : "−"} ${q.b} = ${q.correct}`;
    case "money-count":
    case "change":
      return `${q.correct} zł`;
    default:
      return q.options.find((x) => x.id === q.correct)?.text || "";
  }
}
