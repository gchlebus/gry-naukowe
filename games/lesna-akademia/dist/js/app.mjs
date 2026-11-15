import { TOPICS, BY_TOPIC, PLANTS, LAYERS, SHAPES, AXES } from "./data.mjs";
import {
  KEY,
  fresh,
  parseState,
  mastered,
  record,
  task,
  grade,
  complete,
  correctAnswer,
  shuffle,
  rng,
} from "./logic.mjs";
const $ = (s) => document.querySelector(s),
  main = $("#main"),
  modal = $("#modal");
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state = fresh(),
  round = null,
  q = null,
  draft = {},
  selectedToken = null,
  feedback = null,
  assisted = false,
  attempts = 0,
  warning = "",
  audio = null;
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = parseState(raw);
} catch {
  warning =
    "Nie udało się odczytać postępów. Możesz grać dalej i pobrać kopię w menu „Dla rodzica”.";
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    warning =
      "Ta przeglądarka nie zapisuje postępów. Kopię możesz pobrać w menu „Dla rodzica”.";
  }
  header();
}
function header() {
  $("#stars").textContent = `✦ ${state.stars}`;
  $("#stars").setAttribute("aria-label", `Zebrane listki: ${state.stars}`);
  $("#sound").setAttribute("aria-pressed", String(state.sound));
  $("#sound").setAttribute(
    "aria-label",
    state.sound ? "Wyłącz dźwięki" : "Włącz dźwięki",
  );
  $("#storage").hidden = !warning;
  $("#storage").textContent = warning;
}
function announce(s) {
  $("#live").textContent = s;
}
function goTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}
function home() {
  round = null;
  q = null;
  feedback = null;
  if (modal.open) modal.close();
  header();
  const masteredCount = TOPICS.filter((t) =>
    mastered(state.stats[t.id]),
  ).length;
  main.innerHTML = `<section class="hero"><div class="hero-copy"><span class="eyebrow"><i></i> MISJA: KARTKÓWKA</span><h1>Małe kroki.<br>Wielka <em>pewność.</em></h1><p>List od przyjaciółki, tajemnice lasu i liczby, które lubią się bawić. Przygotujmy się razem — spokojnie, po jednym odkryciu.</p><div class="hero-actions"><button class="primary" data-act="start" data-pack="A">Ruszamy z powtórką A <span>→</span></button><a class="text-button" href="#mapa">Wybiorę temat ↘</a></div><div class="hero-tags"><span>9 tematów</span><span>Bez limitu czasu</span><span>Od około 7 lat</span></div></div><div class="hero-art"><img src="./art/hero.svg" alt="Rudy lisek z listem na leśnej ścieżce, obok kartek z rachunkami i symetrią" width="680" height="440"><span class="art-label">Ciekawość jest Twoją supermocą.</span></div></section><section class="progress-strip" aria-label="Twoje postępy"><div class="progress-leaf">♧</div><div><b>Twój plecak odkryć</b><span>${masteredCount} z 9 tematów dobrze utrwalonych</span></div><div class="progress-track"><i style="width:${(masteredCount / 9) * 100}%"></i></div><p>Temat utrwalony = co najmniej 4 z ostatnich 5 zadań<br>poprawnie za pierwszym razem, bez podpowiedzi.</p></section><section id="mapa" class="learning-map"><div class="section-heading"><div><span class="eyebrow">WYBIERZ SWOJĄ ŚCIEŻKĘ</span><h2>Dziś oswoimy coś nowego.</h2></div><p>Krótka powtórka lub jeden wybrany temat.<br>Każdy mały krok się liczy.</p></div>${[
    "A",
    "B",
  ]
    .map(
      (pack) =>
        `<section class="course ${pack === "A" ? "course-a" : "course-b"}"><div class="course-heading"><span class="course-letter">${pack}</span><div><span class="eyebrow">${pack === "A" ? "17 LISTOPADA · POLSKI I PRZYRODA" : "MATEMATYKA"}</span><h3>${pack === "A" ? "Słowa, las i małe odkrycia" : "Liczby, kształty i sprytne pomysły"}</h3></div><button class="secondary" data-act="start" data-pack="${pack}">Krótka powtórka ${pack} →</button></div><div class="topic-grid">${TOPICS.filter(
          (t) => t.pack === pack,
        )
          .map((t) => topicCard(t))
          .join(
            "",
          )}</div><div class="exam-row"><div><b>Sprawdź się bez podpowiedzi</b><span>Próbna kartkówka ${pack === "A" ? "· 12 zadań" : "· 8 zadań"}. Wynik i wyjaśnienia zobaczysz na końcu.</span></div><button class="text-button" data-act="exam" data-pack="${pack}">Próbna kartkówka ${pack} ↗</button></div></section>`,
    )
    .join(
      "",
    )}</section><section class="gentle-note"><span>✧</span><div><h2>Nie musisz umieć wszystkiego od razu.</h2><p>Pomyłka podpowiada, co jeszcze poćwiczyć. Lisek zostanie z Tobą na każdym kroku.</p></div></section>`;
}
function topicCard(t) {
  const s = state.stats[t.id],
    done = mastered(s);
  return `<button class="topic-card ${t.color}" data-act="topic" data-topic="${t.id}"><span class="topic-top"><span class="topic-icon">${t.icon}</span><span class="topic-state">${done ? "✓ Utrwalone" : s.seen ? `${s.recent.filter(Boolean).length}/${s.recent.length} ostatnio` : "Odkryj temat"}</span></span><span class="topic-name">${t.name}</span><span class="topic-desc">${t.desc}</span><span class="topic-bottom">${t.short} <b>→</b></span></button>`;
}
function start(pack, mode = "practice", topic = null) {
  if (modal.open) modal.close();
  const topics = topic
      ? [BY_TOPIC.get(topic)]
      : TOPICS.filter((t) => t.pack === pack),
    seed = crypto.getRandomValues(new Uint32Array(1))[0],
    list = [];
  for (const t of topics) {
    let count = topic ? 5 : mode === "exam" ? (t.id === "rosliny" ? 4 : 2) : 1;
    for (let i = 0; i < count; i++)
      list.push({ topic: t.id, serial: state.stats[t.id].seen + i });
  }
  round = {
    mode,
    pack: topic ? BY_TOPIC.get(topic).pack : pack,
    topic,
    seed,
    queue: topic ? list : shuffle(list, rng(seed)),
    index: 0,
    results: [],
    locked: false,
  };
  nextQuestion();
  goTop();
}
function nextQuestion() {
  const d = round.queue[round.index];
  q = task(
    d.topic,
    d.serial,
    round.mode === "exam" ? 2 : state.stats[d.topic].level,
    round.seed,
  );
  draft = {};
  selectedToken = null;
  feedback = null;
  assisted = false;
  attempts = 0;
  round.locked = false;
  play();
}
function choiceButton(id, text, selected, extra = "") {
  return `<button type="button" class="answer-choice ${selected ? "selected" : ""}" data-act="choice" data-choice="${esc(id)}" aria-pressed="${!!selected}">${extra}${esc(text)}<span class="choice-check" aria-hidden="true">${selected ? "✓" : ""}</span></button>`;
}
function plantImage(id) {
  const p = PLANTS.find((p) => p.id === id);
  return `<img src="./art/${id}.svg" alt="${esc(p.feature)}" width="400" height="440">`;
}
function coin(v, act = false, i = 0) {
  return `<${act ? "button" : "span"} ${act ? 'type="button" data-act="coin" data-value="' + v + '" aria-label="Dołóż monetę ' + v + ' zł"' : ""} class="coin coin-${v}" ${!act ? 'aria-label="Moneta ' + v + ' zł"' : ""}><b>${v}</b><small>zł</small></${act ? "button" : "span"}>`;
}
function shapeSvg(shapeId, axis = null) {
  const shape = SHAPES.find((s) => s.id === shapeId),
    lines = {
      v: [50, 4, 50, 96],
      h: [4, 50, 96, 50],
      d: [4, 4, 96, 96],
      a: [4, 96, 96, 4],
    },
    l = lines[axis];
  return `<svg class="shape-art" viewBox="0 0 100 100" role="img" aria-label="Figura do badania osi symetrii"><defs><pattern id="shape-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0 H0 V10" fill="none" stroke="#dfe5d6" stroke-width=".4"/></pattern></defs><rect width="100" height="100" rx="5" fill="url(#shape-grid)"/><polygon points="${shape.points.map(([x, y]) => `${10 + (x * 80) / 6},${10 + (y * 80) / 6}`).join(" ")}" fill="#b7cbb0" stroke="#628369" stroke-width=".9"/>${l ? `<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" stroke="#b98256" stroke-width="1.3" stroke-dasharray="3 2"/>` : ""}</svg>`;
}
function mirrorGrid(question, answer, solution = false) {
  return `<div class="mirror-grid" data-axis="${question.axis}" role="group" aria-label="Kratki lustrzanego odbicia">${Array.from(
    { length: 36 },
    (_, i) => {
      const r = Math.floor(i / 6),
        c = i % 6,
        locked = question.axis === "v" ? c < 3 : r < 3,
        filled = locked
          ? question.cells.includes(i)
          : solution
            ? question.correct.includes(i)
            : answer.cells?.includes(i);
      return `<button type="button" data-act="cell" data-index="${i}" class="mirror-cell ${locked ? "locked" : "editable"} ${filled ? "filled" : ""}" ${locked || solution ? "disabled" : ""} aria-label="Wiersz ${r + 1}, kolumna ${c + 1}${locked ? ", pole wzoru" : ""}${filled ? ", zaznaczone" : ""}" ${!locked ? 'aria-pressed="' + !!filled + '"' : ""}>${filled ? '<span aria-hidden="true">' + (locked ? "●" : "◆") + "</span>" : ""}</button>`;
    },
  ).join("")}</div>`;
}
function questionView() {
  switch (q.kind) {
    case "assign": {
      const used = new Set(draft.slots?.filter((x) => x != null) || []);
      return `<div class="assignment ${q.scene}"><div class="token-bank" role="group" aria-label="Kafelki do ułożenia">${q.items.map((t) => `<button type="button" class="token ${selectedToken === t.id ? "selected" : ""}" data-act="token" data-token="${t.id}" aria-pressed="${selectedToken === t.id}" ${used.has(t.id) ? "disabled" : ""} draggable="true">${esc(t.text)}</button>`).join("")}</div><p class="assignment-instruction">${selectedToken !== null ? "Kafelek wybrany. Teraz kliknij pasujące miejsce." : "Wybierz kafelek, a potem miejsce. Kliknięcie wypełnionego miejsca odkłada kafelek."}</p><div class="assignment-paper">${q.scene === "forest" ? '<img class="forest-art" src="./art/forest.svg" alt="Przekrój lasu: cztery piętra oznaczone numerami od góry do dołu" width="400" height="440">' : ""}<div class="slots">${q.slots
        .map((name, i) => {
          const selected = draft.slots?.[i],
            item = q.items.find((t) => t.id === selected);
          return `<button type="button" class="slot slot-${i} ${item ? "is-filled" : ""}" data-act="slot" data-slot="${i}"><small>${esc(name)}</small><span>${item ? esc(item.text) : "Tutaj pasuje…"}</span></button>`;
        })
        .join("")}</div></div></div>`;
    }
    case "copy":
      return `<div class="copy-model"><span class="eyebrow">TWÓJ WZÓR</span><p>${esc(q.text)}</p></div><label class="input-label" for="copy-text">Przepisz tutaj</label><textarea id="copy-text" name="text" rows="3" maxlength="400" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Pisz spokojnie, po jednym wyrazie…">${esc(draft.text)}</textarea><p class="field-note">Polskie litery, wielkie litery i znaki przestankowe też są ważne.</p>`;
    case "grammar":
      return `<div class="word-stage">${q.context ? "<span>" + esc(q.context) + "</span>" : ""}<strong>${esc(q.word)}</strong></div><div class="grammar-columns"><div><h3>Jaka część mowy?</h3>${["rzeczownik", "czasownik"].map((p) => `<button type="button" class="answer-choice ${draft.part === p ? "selected" : ""}" data-act="part" data-part="${p}" aria-pressed="${draft.part === p}">${p === "rzeczownik" ? "Rzeczownik" : "Czasownik"}</button>`).join("")}</div><div><h3>Jaka liczba?</h3>${[
        [false, "Pojedyncza"],
        [true, "Mnoga"],
      ]
        .map(
          ([v, s]) =>
            `<button type="button" class="answer-choice ${draft.plural === v ? "selected" : ""}" data-act="plural" data-plural="${v}" aria-pressed="${draft.plural === v}">${s}</button>`,
        )
        .join("")}</div></div>`;
    case "word":
      return `<div class="word-stage">${q.context ? "<span>" + esc(q.context) + "</span>" : ""}<strong>${esc(q.word)}</strong></div><label class="input-label" for="word-input">Twój wyraz</label><input id="word-input" name="text" maxlength="60" autocomplete="off" spellcheck="false" value="${esc(draft.text)}" placeholder="Wpisz zmieniony wyraz">`;
    case "plant-name":
      return `<div class="plant-name"><div class="plant-large">${plantImage(q.plant)}</div><div class="choices">${q.options.map((o) => choiceButton(o.id, o.text, draft.choice === o.id)).join("")}</div></div>`;
    case "plant-pick":
      return `<div class="plant-options">${q.options.map((o, i) => choiceButton(o.id, "Ilustracja " + String.fromCharCode(65 + i), draft.choice === o.id, plantImage(o.id))).join("")}</div>`;
    case "choice":
      return `<div class="choices two-columns">${q.options.map((o) => choiceButton(o.id, o.text, draft.choice === o.id)).join("")}</div>`;
    case "mirror":
      return `<div class="mirror-layout">${mirrorGrid(q, draft)}<div class="mirror-legend"><span><i class="legend-source"></i> Gotowy wzór</span><span><i class="legend-draw"></i> Twoje odbicie</span><p>Zaznaczaj i odznaczaj kratki kliknięciem. Złota linia jest osią symetrii.</p><button type="button" class="text-button" data-act="clear-grid">Wyczyść swoje kratki ↶</button></div></div>`;
    case "axis":
      return `<div class="axis-layout">${shapeSvg(q.shape, draft.choice)}<div class="axis-choices">${AXES.map((o) => choiceButton(o.id, o.name, draft.choice === o.id)).join("")}</div></div>`;
    case "story":
      return `<div class="story-steps"><label class="input-label" for="calculation"><span>1</span> Zapisz działanie z wynikiem</label><input id="calculation" name="calculation" maxlength="40" autocomplete="off" placeholder="np. 24 + 9 = 33" value="${esc(draft.calculation)}"><label class="input-label" for="sentence"><span>2</span> Napisz odpowiedź całym zdaniem</label><textarea id="sentence" name="sentence" rows="2" maxlength="240" placeholder="Odpowiedź: …" spellcheck="false">${esc(draft.sentence)}</textarea><p class="field-note">Podaj liczbę, to, co liczysz, oraz jednostkę, jeśli jest potrzebna. Pamiętaj o wielkiej literze i kropce.</p></div>`;
    case "coins":
      return `<div class="coin-goal"><span>DO ZAPŁATY</span><strong>${q.correct} <small>zł</small></strong></div><div class="coin-picker" role="group" aria-label="Wybierz monety">${[1, 2, 5].map((v) => coin(v, true)).join("")}</div><div class="coin-purse" aria-live="polite"><span>Twoje monety</span><div>${draft.coins?.length ? draft.coins.map((v, i) => coin(v, false, i)).join("") : "<p>Dołóż monetę, klikając ją powyżej.</p>"}</div><b>Razem: ${(draft.coins || []).reduce((a, b) => a + b, 0)} zł</b></div><button type="button" class="text-button" data-act="undo-coin" ${!draft.coins?.length ? "disabled" : ""}>↶ Zabierz ostatnią monetę</button>`;
    case "money-count":
      return `<div class="wallet-coins">${q.coins.map((v, i) => coin(v, false, i)).join("")}</div>${numberInput("Ile złotych jest razem?", "zł")}`;
    case "change":
      return `<div class="receipt"><span>MAŁY LEŚNY SKLEPIK</span><p>Zeszyt <b>${q.cost} zł</b></p><p>Zapłacono <b>${q.pay} zł</b></p><p class="receipt-total">Reszta <b>? zł</b></p></div>${numberInput("Ile złotych reszty?", "zł")}`;
    case "arithmetic":
      return `<div class="arithmetic-stage"><span>${q.a}</span><b>${q.op === "+" ? "+" : "−"}</b><span>${q.b}</span><b>=</b><span class="number-question">?</span></div>${numberInput("Twój wynik")}`;
  }
}
function numberInput(label, unit = "") {
  return `<label class="input-label" for="number-answer">${label}</label><div class="number-answer"><input id="number-answer" name="text" inputmode="numeric" maxlength="3" autocomplete="off" value="${esc(draft.text)}" aria-label="${label}">${unit ? "<span>" + unit + "</span>" : ""}</div>`;
}
function play() {
  header();
  const t = BY_TOPIC.get(q.topic),
    n = round.index + 1;
  main.innerHTML = `<div class="play-top"><button class="text-button" data-act="home">← Mapa nauki</button><span>${round.mode === "exam" ? "Próbna kartkówka" : "Trening"} ${round.pack} <i>·</i> ${t.short}</span><span>${n} / ${round.queue.length}</span></div><div class="round-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${round.queue.length}" aria-valuenow="${round.index}" aria-label="Postęp rundy"><i style="width:${(round.index / round.queue.length) * 100}%"></i></div><div class="play-heading"><div><span class="eyebrow">${round.mode === "exam" ? "SPRÓBUJ SAMODZIELNIE" : "JEDEN MAŁY KROK"}</span><h1>${t.name}</h1></div><span class="topic-icon ${t.color}">${t.icon}</span></div><div class="play-layout"><section class="task-card"><div class="task-top"><span class="eyebrow">ZADANIE ${String(n).padStart(2, "0")}</span>${round.mode === "exam" ? "<span>Wynik zobaczysz na końcu</span>" : '<button class="text-button" data-act="hint">Przypomnij zasadę ✧</button>'}</div><h2 class="task-prompt">${esc(q.prompt)}</h2><form id="task-form"><fieldset ${round.locked ? "disabled" : ""}><legend class="sr">Twoja odpowiedź</legend>${questionView()}</fieldset>${feedbackView()}<div class="task-actions">${round.locked ? `<button class="primary" type="button" data-act="next">${round.index + 1 === round.queue.length ? "Zobacz podsumowanie" : "Następne odkrycie"} <span>→</span></button>` : `<button class="primary" type="submit">${round.mode === "exam" ? "Zapisz odpowiedź" : attempts ? "Sprawdź jeszcze raz" : "Sprawdź"} <span>✓</span></button><button class="text-button" type="button" data-act="reveal">${round.mode === "exam" ? "Pomiń to zadanie" : "Nie wiem — pokaż mi"}</button>`}</div></form></section><aside class="companion"><div class="fox-portrait"><img src="./art/hero.svg" alt="Lisek — Twój przewodnik" width="680" height="440"></div><span class="eyebrow">LISTEK · TWÓJ PRZEWODNIK</span><h3>${round.mode === "exam" ? "Spokojnie. Znasz drogę." : "Spróbujmy razem."}</h3><p>${round.mode === "exam" ? "Nie ma limitu czasu. Na końcu obejrzymy odpowiedzi i wybierzemy, co jeszcze poćwiczyć." : "Możesz się pomylić, poprosić o wskazówkę i spróbować jeszcze raz."}</p><div class="notebook-note"><span>MAŁA PODPOWIEDŹ</span><p>${round.mode === "exam" ? "Przeczytaj polecenie jeszcze raz. Sprawdź swoją odpowiedź przed zapisaniem." : "Dokładność jest ważniejsza niż pośpiech. Pomyłki pomagają się uczyć."}</p></div></aside></div>`;
}
function feedbackView() {
  if (!feedback) return "";
  if (round.mode === "exam" && round.locked)
    return '<div class="feedback neutral" id="feedback" role="status"><b>Odpowiedź zapisana.</b><p>Wynik i wyjaśnienie pokażemy w podsumowaniu.</p></div>';
  return `<div class="feedback ${feedback.ok ? "good" : round.locked ? "solution" : "retry"}" id="feedback" role="status"><b>${esc(feedback.message)}</b>${feedback.diff && !feedback.ok ? `<div class="copy-comparison"><span>SPRAWDŹ WZÓR W ZAZNACZONYCH MIEJSCACH</span><p>${feedback.diff.parts.map((p) => (p.type === "same" ? esc(p.expected) : `<mark title="${esc(p.type === "extra" ? "Nadmiarowy znak: " + p.actual : "Powinno być: " + (p.expected === " " ? "spacja" : p.expected))}">${esc(p.type === "extra" ? "[" + p.actual + "]" : p.expected === " " ? "␣" : p.expected)}</mark>`)).join("")}</p><small>Kolor oznacza zmianę lub brak. Znak w nawiasach [ ] jest nadmiarowy.</small></div>` : ""}${feedback.ok || round.locked ? `<p>${esc(q.explain)}</p>` : ""}${round.locked && !feedback.ok ? `<div class="solution-answer"><b>Przykładowe rozwiązanie</b><p>${esc(correctAnswer(q))}</p>${q.kind === "mirror" ? mirrorGrid(q, {}, true) : q.kind === "axis" ? shapeSvg(q.shape, q.correct[0]) : ""}</div>` : ""}</div>`;
}
function finishQuestion(ok, first) {
  if (round.locked) return;
  if (round.mode !== "exam") record(state, q.topic, ok, first);
  round.results.push({
    q: structuredClone(q),
    answer: structuredClone(draft),
    ok,
    first,
  });
  round.locked = true;
  if (round.mode !== "exam") save();
}
function submit() {
  if (round.locked) return;
  if (!complete(q, draft)) {
    announce(
      "Najpierw uzupełnij odpowiedź albo wybierz „Pomiń” lub „Nie wiem”.",
    );
    feedback = {
      ok: false,
      message: "Uzupełnij odpowiedź, a potem ją sprawdzimy.",
    };
    play();
    return;
  }
  const result = grade(q, draft);
  if (round.mode === "exam") {
    finishQuestion(result.ok, result.ok);
    feedback = result;
  } else {
    feedback = result;
    if (result.ok) {
      finishQuestion(true, attempts === 0 && !assisted);
      celebrate();
    } else attempts++;
  }
  play();
  announce(round.mode === "exam" ? "Odpowiedź zapisana." : feedback.message);
  if (round.locked) $('[data-act="next"]')?.focus({ preventScroll: true });
  else {
    $("#feedback")?.scrollIntoView({ block: "nearest", behavior: "instant" });
    main.querySelector("textarea,input")?.focus({ preventScroll: true });
  }
}
function summary() {
  const r = round;
  if (r.mode === "exam" && !r.recorded) {
    for (const x of r.results) record(state, x.q.topic, x.ok, x.first);
    r.recorded = true;
    save();
  }
  const first = r.results.filter((x) => x.first).length,
    ok = r.results.filter((x) => x.ok).length,
    repeat = [
      ...new Set(r.results.filter((x) => !x.first).map((x) => x.q.topic)),
    ];
  main.innerHTML = `<section class="summary"><span class="summary-star">✦</span><span class="eyebrow">${r.mode === "exam" ? "PRÓBNA KARTKÓWKA" : "PLECAK PEŁEN ODKRYĆ"}</span><h1>Dobra robota.<br>Każdy krok się liczy.</h1><p class="summary-score"><strong>${first} <small>/ ${r.results.length}</small></strong><span>poprawnie za pierwszym razem<br>bez podpowiedzi</span></p><p>${r.mode === "exam" ? `Sprawdziliśmy ${r.results.length} zadań. ` : `Udało Ci się rozwiązać ${ok} z ${r.results.length} zadań. `}${repeat.length ? "Wiemy już, co warto jeszcze poćwiczyć." : "Wspaniała, uważna praca!"}</p><div class="summary-actions"><button class="primary" data-act="home">Wróć na mapę <span>→</span></button><button class="secondary" data-act="again">Jeszcze jedna runda ↻</button></div>${repeat.length ? `<div class="repeat-topics"><h2>Następny mały krok</h2><div>${repeat.map((id) => `<button class="secondary" data-act="topic" data-topic="${id}">${BY_TOPIC.get(id).short} →</button>`).join("")}</div></div>` : ""}<section class="review"><h2>Nasze zadania i wyjaśnienia</h2>${r.results.map((x, i) => `<details><summary><span class="review-icon">${x.first ? "✓" : "↻"}</span><span>${i + 1}. ${BY_TOPIC.get(x.q.topic).short} <small>${x.first ? "Samodzielnie" : x.ok ? "Z pomocą lub po poprawce" : "Warto powtórzyć"}</small></span></summary><div class="review-body"><p>${esc(x.q.prompt)}</p><b>${esc(correctAnswer(x.q))}</b><p>${esc(x.q.explain)}</p>${x.q.kind === "mirror" ? mirrorGrid(x.q, {}, true) : x.q.kind === "axis" ? shapeSvg(x.q.shape, x.q.correct[0]) : ""}</div></details>`).join("")}</section></section>`;
  goTop();
  announce(
    `Runda zakończona. Samodzielnie poprawnie: ${first} z ${r.results.length}.`,
  );
}
function modalOpen(content) {
  modal.innerHTML = `<div class="modal-body"><button class="modal-close" data-act="close" aria-label="Zamknij pomoc">×</button>${content}</div>`;
  if (!modal.open) modal.showModal();
}
function hint() {
  if (!q || round.locked || round.mode === "exam") return;
  assisted = true;
  const t = BY_TOPIC.get(q.topic);
  modalOpen(
    `<span class="eyebrow">PRZYPOMNIJMY SOBIE</span><h2>${t.short}</h2><p>${esc(t.rule)}</p>${q.topic === "rosliny" ? `<div class="plant-guide">${PLANTS.map((p) => `<div>${plantImage(p.id)}<b>${p.name}</b><p>${p.feature}</p></div>`).join("")}</div>` : q.topic === "las" ? `<div class="forest-guide"><img src="./art/forest.svg" alt="Cztery warstwy lasu z numerami"><ol>${LAYERS.map((l) => "<li>" + l + "</li>").join("")}</ol></div>` : ""}<button class="primary" data-act="close">Wracam do zadania →</button>`,
  );
}
function guide() {
  modalOpen(
    `<span class="eyebrow">DLA DZIECKA I RODZICA</span><h2>Spokojna powtórka przed kartkówką</h2><p>Dziewięć tematów odpowiada podanej liście. Dział A: list, przepisywanie, warstwy lasu, rzeczowniki i czasowniki w obu liczbach oraz cztery rośliny uprawne. Dział B: symetria, zadania tekstowe, pełne złote i rachunki do 100.</p><h3>Dwa sposoby nauki</h3><p><b>Trening:</b> 5 zadań z wybranego tematu lub krótka runda A/B. Można poprawiać odpowiedzi, przypomnieć zasadę i obejrzeć rozwiązanie. <b>Próbna kartkówka:</b> 12 zadań A albo 8 zadań B. Odpowiedzi zapisujemy bez ujawniania wyniku; omówienie jest na końcu. To ćwiczenie, bez limitu czasu i bez oceny szkolnej.</p><p>Trudność kolejnych zadań treningowych dopasowuje się do ostatnich odpowiedzi. Po dwóch samodzielnych sukcesach wzrasta o jeden poziom, a po zadaniu wymagającym pomocy lub poprawki maleje. Próbna kartkówka ma stały poziom 2. Rachunki zaczynają się od czterech przykładów podanych przez rodzica.</p><p><b>Odpowiedzi zdaniem:</b> gra sprawdza liczbę, jednostkę, słowo odnoszące się do pytania, początek i zakończenie zdania. Dopuszcza różny szyk słów. Nie zastępuje sprawdzenia całej gramatyki przez rodzica. Warto kilka zdań przepisać też do zeszytu — pisanie ręczne wymaga osobnego ćwiczenia.</p><h3>Postępy na tym urządzeniu</h3><p>W treningu zapisujemy wynik każdego rozwiązanego lub odsłoniętego zadania. Wyniki próbnej kartkówki zapisujemy dopiero w podsumowaniu. Rozpoczęta runda jest w pamięci karty: odświeżenie lub powrót na mapę ją kończy, ale zachowuje wcześniej zapisane wyniki treningu i zakończonych kartkówek. Każdy adres i urządzenie ma osobny zapis. Nie wysyłamy odpowiedzi na serwer. Kopię można pobrać i wczytać poniżej; wczytanie zastępuje bieżący zapis.</p><div class="backup"><button class="secondary" data-act="export">Pobierz zapis JSON ↓</button><label class="secondary file-label">Wczytaj zapis<input id="import" type="file" accept=".json,application/json"></label></div><p class="fine">Przyrodę zweryfikowano w materiałach <a href="https://zpe.gov.pl/a/jakie-bogactwa-kryja-lasy/DOzDRZhuZ" target="_blank" rel="noopener">ZPE: las</a> i <a href="https://zpe.gov.pl/a/w-sadzie-i-na-polu/D10pKMQe4" target="_blank" rel="noopener">ZPE: pole</a>. Rysunki są autorskimi schematami, nie fotografiami. Nie każda odmiana rośliny wygląda identycznie.</p><p class="fine">Klawiatura: Tab wybiera przyciski, Enter lub spacja je uruchamia. W zadaniach z pisaniem Enter w polu wielowierszowym tworzy nową linię; użyj przycisku „Sprawdź”. Terminu części B nie pokazujemy z powodu sprzeczności dnia tygodnia i daty w notatce; zakres ćwiczeń jest kompletny.</p>`,
  );
}
function celebrate() {
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $("#confetti").innerHTML = Array.from(
      { length: 14 },
      (_, i) =>
        `<i style="--x:${20 + ((i * 37) % 60)}%;--turn:${i * 39}deg;--delay:${(i % 4) * 0.06}s">✦</i>`,
    ).join("");
    setTimeout(() => ($("#confetti").innerHTML = ""), 1600);
  }
  if (state.sound) {
    try {
      audio ??= new AudioContext();
      void audio.resume();
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = audio.createOscillator(),
          g = audio.createGain(),
          t = audio.currentTime + i * 0.1;
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.045, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        o.connect(g).connect(audio.destination);
        o.start(t);
        o.stop(t + 0.4);
      });
    } catch {}
  }
}
function changed() {
  const active = document.activeElement,
    keys = [
      "act",
      "token",
      "choice",
      "part",
      "plural",
      "index",
      "value",
      "slot",
    ],
    selector = active?.dataset
      ? keys
          .filter((k) => active.dataset[k] !== undefined)
          .map(
            (k) => "[data-" + k + '="' + CSS.escape(active.dataset[k]) + '"]',
          )
          .join("")
      : "";
  feedback = null;
  play();
  if (selector) main.querySelector(selector)?.focus({ preventScroll: true });
}
function placeToken(i) {
  if (!q || q.kind !== "assign" || round.locked) return;
  draft.slots ??= [];
  if (selectedToken !== null) {
    draft.slots[i] = selectedToken;
    selectedToken = null;
  } else draft.slots[i] = null;
  changed();
}
document.addEventListener("input", (e) => {
  if (!round || round.locked || !e.target.name) return;
  draft[e.target.name] = e.target.value;
  $("#feedback")?.setAttribute("hidden", "");
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "task-form") {
    e.preventDefault();
    submit();
  }
});
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const act = el.dataset.act;
  if (act === "home") {
    home();
    goTop();
  } else if (act === "start") start(el.dataset.pack);
  else if (act === "exam") start(el.dataset.pack, "exam");
  else if (act === "topic") start(null, "practice", el.dataset.topic);
  else if (act === "guide") guide();
  else if (act === "close") modal.close();
  else if (act === "hint") hint();
  else if (act === "sound") {
    state.sound = !state.sound;
    save();
  } else if (act === "again") start(round.pack, round.mode, round.topic);
  else if (act === "next") {
    if (!round?.locked) return;
    round.index++;
    if (round.index === round.queue.length) summary();
    else {
      nextQuestion();
      goTop();
    }
  } else if (act === "export") {
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json",
        }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = "lesna-akademia-zapis.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else if (round && !round.locked) {
    if (act === "choice") {
      draft.choice = el.dataset.choice;
      changed();
    } else if (act === "part") {
      draft.part = el.dataset.part;
      changed();
    } else if (act === "plural") {
      draft.plural = el.dataset.plural === "true";
      changed();
    } else if (act === "token") {
      selectedToken =
        selectedToken === el.dataset.token ? null : el.dataset.token;
      changed();
    } else if (act === "slot") placeToken(Number(el.dataset.slot));
    else if (act === "cell") {
      const i = Number(el.dataset.index);
      draft.cells ??= [];
      draft.cells = draft.cells.includes(i)
        ? draft.cells.filter((c) => c !== i)
        : [...draft.cells, i];
      changed();
    } else if (act === "clear-grid") {
      draft.cells = [];
      changed();
    } else if (act === "coin") {
      draft.coins ??= [];
      if (draft.coins.length < 30) draft.coins.push(Number(el.dataset.value));
      changed();
      if (draft.coins.length === 30)
        announce(
          "Masz już 30 monet. Zamień część drobnych na monety 2 zł lub 5 zł.",
        );
    } else if (act === "undo-coin") {
      draft.coins?.pop();
      changed();
    } else if (act === "reveal") {
      finishQuestion(false, false);
      feedback = {
        ok: false,
        message:
          round.mode === "exam"
            ? "Zadanie pominięte."
            : "Przyjrzyjmy się rozwiązaniu. Potem spróbujesz podobnego zadania.",
      };
      play();
      announce(feedback.message);
    }
  }
});
document.addEventListener("dragstart", (e) => {
  const b = e.target.closest('[data-act="token"]');
  if (!b || b.disabled || round?.locked) return;
  selectedToken = b.dataset.token;
  e.dataTransfer.setData("text/plain", selectedToken);
  e.dataTransfer.effectAllowed = "move";
});
document.addEventListener("dragover", (e) => {
  if (e.target.closest('[data-act="slot"]') && selectedToken !== null)
    e.preventDefault();
});
document.addEventListener("drop", (e) => {
  const b = e.target.closest('[data-act="slot"]');
  if (!b || selectedToken === null) return;
  e.preventDefault();
  placeToken(Number(b.dataset.slot));
});
document.addEventListener("dragend", () => {
  selectedToken = null;
});
document.addEventListener("change", async (e) => {
  if (e.target.id !== "import") return;
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 50000) throw Error("Plik jest za duży.");
    state = parseState(await file.text());
    save();
    modal.close();
    home();
    goTop();
    announce("Wczytano postępy Leśnej Akademii.");
  } catch (error) {
    let p = modal.querySelector(".import-error");
    if (!p) {
      p = document.createElement("p");
      p.className = "import-error";
      p.setAttribute("role", "status");
      modal.querySelector(".backup").after(p);
    }
    p.textContent = error.message;
  }
});
window.addEventListener("pagehide", save);
home();
