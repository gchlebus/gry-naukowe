import {
  PUZZLES,
  BY_ID,
  CHAPTERS,
  TYPES,
  PROFESSOR_NOTES,
} from "./puzzles.mjs";
import {
  defaultDraft,
  checkAnswer,
  expected,
  cleanDraft,
  toggleLight,
} from "./engine.mjs";
import {
  KEY,
  freshState,
  parseState,
  record,
  draft,
  solvedState,
  summary,
} from "./state.mjs";
import { instruction, hints, answerLabel, explanation } from "./content.mjs";
import { esc, icon, dots, timeLabel, level, levelDots } from "./ui.mjs";
const $ = (s) => document.querySelector(s),
  main = $("#main"),
  modal = $("#modal");
let state = freshState(),
  storageWarning = "",
  toastTimer,
  feedback = null,
  focusMode = false,
  runningSince = null,
  ticks = 0,
  melody = null,
  audioContext = null,
  master = null,
  musicTimer = null;
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = parseState(raw);
} catch {
  storageWarning =
    "Nie udało się odczytać poprzedniego zapisu. Możesz rozpocząć od nowa lub wczytać pobraną kopię.";
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageWarning =
      "Przeglądarka nie zapisuje zmian. W „Zapis i zasady” możesz pobrać kopię postępów.";
    renderStorage();
  }
}
function renderStorage() {
  const n = $("#storage-alert");
  n.hidden = !storageWarning;
  n.textContent = storageWarning;
}
function toast(text) {
  const n = $("#toast");
  n.textContent = text;
  n.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => n.classList.remove("visible"), 3500);
}
function current() {
  return BY_ID.get(state.currentId);
}
function canTick() {
  return (
    state.view === "puzzle" &&
    !state.paused &&
    !document.hidden &&
    record(state, state.currentId).status === "new"
  );
}
function markTime() {
  runningSince = canTick() ? performance.now() : null;
}
function flushTime() {
  if (runningSince !== null) {
    const r = record(state, state.currentId);
    state.progress[state.currentId] = {
      ...r,
      elapsed:
        r.elapsed +
        Math.max(0, Math.min(60000, performance.now() - runningSince)),
    };
  }
  markTime();
}
function header() {
  const s = summary(state);
  $("#note-count").textContent = s.notes ? String(s.notes) : "";
  document.body.classList.toggle("playing", state.view === "puzzle");
  const b = $("#sound-button");
  b.setAttribute("aria-pressed", String(!!melody));
  b.setAttribute(
    "aria-label",
    melody ? "Wyłącz melodię gabinetu" : "Włącz melodię gabinetu",
  );
  b.querySelector(".sound-label").textContent = melody
    ? "Melodia gra"
    : "Włącz melodię";
}
function filtered() {
  const f = state.filters;
  return PUZZLES.filter(
    (p) =>
      (f.chapter === "all" || p.chapter === f.chapter) &&
      (f.difficulty === "all" || p.difficulty === Number(f.difficulty)) &&
      (f.type === "all" || p.type === f.type) &&
      (f.status === "all" ||
        (f.status === "new" && record(state, p.id).status !== "solved") ||
        (f.status === "solved" && record(state, p.id).status === "solved") ||
        (f.status === "bookmarked" && state.bookmarks.includes(p.id))),
  );
}
function chapterOf(p) {
  return CHAPTERS.find((c) => c.id === p.chapter);
}
function puzzleCard(p) {
  const r = record(state, p.id),
    c = chapterOf(p),
    status =
      r.status === "solved"
        ? "Rozwiązane"
        : r.status === "read"
          ? "Rozwiązanie odkryte"
          : r.elapsed > 0
            ? "W toku"
            : "Do otwarcia";
  return `<button class="case-card ${r.status === "solved" ? "done" : ""}" data-action="open" data-id="${p.id}" style="--case-color:${c.color}"><div class="case-card-top"><span class="case-id">AKTA ${String(p.number).padStart(2, "0")}</span><span class="case-status ${r.status}">${r.status === "solved" ? icon("check", 13) : ""}${status}</span></div><span class="case-kind">${esc(TYPES[p.type])}</span><h3>${esc(p.title)}</h3><div class="case-card-bottom"><span>${levelDots(p.difficulty)} ${level(p.difficulty)}</span><span>${icon("arrow", 17)}</span></div>${state.bookmarks.includes(p.id) ? '<span class="card-bookmark" title="Zakładka">◆</span>' : ""}</button>`;
}
function renderHome() {
  delete main.dataset.caseId;
  const s = summary(state),
    unfinished =
      PUZZLES.find((p) => record(state, p.id).status !== "solved") ??
      PUZZLES[0],
    last = record(state, state.currentId),
    resume = last.elapsed > 0 && last.status !== "solved";
  main.innerHTML = `
<section class="hero"><div class="hero-copy"><span class="eyebrow"><i></i> OSOBISTE ZAPROSZENIE DLA JOANNY</span><h1>Niektóre tajemnice<br/>czekają właśnie<br/><em>na Twój umysł.</em></h1><p>Eliksiry Snape’a, światło Księżyca i odrobina odwagi Super Pig. A na końcu sprawa, której nie wolno zlekceważyć: kartofle.</p><div class="hero-actions"><button class="primary" data-action="open" data-id="${resume ? state.currentId : unfinished.id}">${icon("key", 17)} ${resume ? "Kontynuuj ostatnie akta" : "Otwórz pierwsze akta"} ${icon("arrow", 17)}</button><button class="text-button" data-action="random">${icon("shuffle", 16)} Zdaj się na przypadek</button></div><div class="hero-note"><span>32</span> autorskie zagadki <i>·</i> 10 rodzajów wyzwań <i>·</i> własne tempo</div></div><div class="hero-picture"><img src="./art/gabinet.png" alt="Mistrz eliksirów Snape w nocnej bibliotece. Na biurku księżycowy klejnot, figurka Super Pig i dwa kartofle." width="1536" height="1024" fetchpriority="high"><span class="picture-caption">BIBLIOTEKA OTWARTA PO ZMROKU <span>☽</span></span></div></section>
<section class="welcome-line"><div><span class="eyebrow">SZANOWNA MAŁŻONKO, WITAJ W SWOIM GABINECIE</span><h2>Dobra zagadka zasługuje na chwilę ciszy.</h2></div><div class="archive-progress"><div class="progress-ring" style="--progress:${(s.solved / 32) * 100}%"><span>${s.solved}<small>/ 32</small></span></div><span>Rozwiązane akta<strong>${s.seals} z 96 pieczęci</strong></span></div></section>
<section class="chapter-grid" aria-label="Cztery rozdziały">${CHAPTERS.map(
    (c) => {
      const done = PUZZLES.filter(
        (p) => p.chapter === c.id && record(state, p.id).status === "solved",
      ).length;
      return `<button class="chapter-card ${state.filters.chapter === c.id ? "active" : ""}" data-action="chapter" data-id="${c.id}" style="--chapter-color:${c.color}" aria-pressed="${state.filters.chapter === c.id}"><div><span class="chapter-roman">${c.roman}</span><span class="chapter-icon">${icon(c.icon, 37)}</span></div><span class="chapter-world">${esc(c.world)}</span><h3>${esc(c.title)}</h3><p>${esc(c.subtitle)}</p><div class="chapter-meter"><span style="width:${(done / 8) * 100}%"></span></div><small>${done} / 8 akt rozwiązanych ${icon("arrow", 14)}</small></button>`;
    },
  ).join("")}</section>
<section class="case-archive" id="archive"><div class="section-heading"><div><span class="eyebrow">PODEJRZENIA ZOSTAWIAMY PRZY DRZWIACH. DOWODY ZABIERAMY ZE SOBĄ.</span><h2>Archiwum akt</h2></div><button class="text-button" data-action="reset-filters">Wszystkie rozdziały ${icon("reset", 15)}</button></div><div class="filterbar"><label>Rozdział<select data-filter="chapter" aria-label="Filtr rozdziału"><option value="all">Cała kolekcja</option>${CHAPTERS.map((c) => `<option value="${c.id}" ${state.filters.chapter === c.id ? "selected" : ""}>${esc(c.title)}</option>`).join("")}</select></label><label>Wyzwanie<select data-filter="type" aria-label="Rodzaj zagadki"><option value="all">Wszystkie rodzaje</option>${Object.entries(
    TYPES,
  )
    .map(
      ([id, title]) =>
        `<option value="${id}" ${state.filters.type === id ? "selected" : ""}>${esc(title)}</option>`,
    )
    .join(
      "",
    )}</select></label><label>Trudność<select data-filter="difficulty" aria-label="Poziom trudności"><option value="all">Każdy poziom</option>${[1, 2, 3].map((n) => `<option value="${n}" ${state.filters.difficulty === String(n) ? "selected" : ""}>${level(n)}</option>`).join("")}</select></label><label>Status<select data-filter="status" aria-label="Status akt">${[
    ["all", "Wszystkie"],
    ["new", "Do rozwiązania"],
    ["solved", "Rozwiązane"],
    ["bookmarked", "Z zakładką"],
  ]
    .map(
      ([id, label]) =>
        `<option value="${id}" ${state.filters.status === id ? "selected" : ""}>${label}</option>`,
    )
    .join(
      "",
    )}</select></label></div><div class="case-count" role="status">Wybrane akta: ${filtered().length} / 32</div><div class="case-grid">${filtered().map(puzzleCard).join("") || '<div class="empty-filter">W tym wyborze jest cisza. Zmień filtry, aby otworzyć inne akta.</div>'}</div></section>
<section class="personal-dedication"><span>☽</span><p>Dla Joanny Bukowskiej-Chlebus.<br/><em>Z miłością. I z pełnym szacunkiem dla kartofli.</em></p><span>✦</span></section>${s.solved === 32 ? '<section class="collection-complete"><span>✦</span><h2>Archiwum nie ma już przed Tobą tajemnic.</h2><p>Szanowna Małżonko, 32 teczki są zamknięte. Pozostaje otworzyć coś dobrego.</p></section>' : ""}`;
}
function options(items, value) {
  return `<div class="answer-options">${items.map((item, i) => `<button type="button" class="answer-option ${String(value) === String(item.id) ? "selected" : ""}" data-action="option" data-value="${esc(item.id)}" aria-pressed="${String(value) === String(item.id)}" data-focus-key="option-${esc(item.id)}"><span class="option-letter">${"ABCD"[i] ?? i + 1}</span>${item.art ?? ""}<span>${esc(item.label ?? "")}</span></button>`).join("")}</div>`;
}
function nonoTable(p, values, readonly = false) {
  const cols = p.cols.map((c) => c.length),
    max = Math.max(...cols),
    n = p.n;
  return `<div class="nonogram-scroll"><table class="nonogram ${readonly ? "solution-nonogram" : ""}" aria-label="${readonly ? "Poprawny obraz" : "Plansza nonogramu"}"><thead>${Array.from({ length: max }, (_, r) => `<tr>${r === 0 ? `<th rowspan="${max}" class="nono-corner" aria-label="Numery grup">☽</th>` : ""}${p.cols.map((c, i) => `<th scope="col" class="col-clue ${i % 5 === 4 ? "fifth" : ""}">${c.length === 0 && r === max - 1 ? "0" : (c[r - (max - c.length)] ?? "")}</th>`).join("")}</tr>`).join("")}</thead><tbody>${p.rows
    .map(
      (row, r) =>
        `<tr><th scope="row" class="row-clue">${row.join(" ") || "0"}</th>${Array.from(
          { length: n },
          (_, c) => {
            const i = r * n + c,
              v = values[i];
            return `<td class="${c % 5 === 4 ? "fifth" : ""} ${r % 5 === 4 ? "fifth-row" : ""}">${readonly ? `<span class="nono-cell ${v === 1 ? "filled" : ""}"></span>` : `<button class="nono-cell ${v === 1 ? "filled" : v === -1 ? "crossed" : ""}" type="button" data-action="nono" data-index="${i}" data-focus-key="nono-${i}" aria-label="Wiersz ${r + 1}, kolumna ${c + 1}: ${v === 1 ? "pełne" : v === -1 ? "wykluczone" : "puste"}">${v === -1 ? "×" : ""}</button>`}</td>`;
          },
        ).join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
}
function puzzleBody(p, a) {
  switch (p.type) {
    case "code":
      return `<div class="code-evidence"><div class="code-evidence-head"><span>Próba</span><span>Na miejscu</span><span>Poza miejscem</span></div>${p.clues.map((c, i) => `<div class="code-row"><span class="code-digits" aria-label="Próba ${i + 1}: ${c.guess}">${[...c.guess].map((x) => `<b>${x}</b>`).join("")}</span><span class="feedback-exact">${c.exact}</span><span>${c.misplaced}</span></div>`).join("")}</div><label class="answer-label" for="answer-input">Twój kod <span>${p.length} cyfry · bez powtórzeń</span></label><input id="answer-input" data-input="answer" class="answer-input code-input" inputmode="numeric" autocomplete="off" maxlength="${p.length}" placeholder="${"·".repeat(p.length)}" value="${esc(a)}">`;
    case "matrix":
      return `<div class="matrix-board" aria-label="Matryca z brakującym prawym dolnym polem">${p.rows.flatMap((row, r) => row.map((bits, c) => `<div class="matrix-cell ${r === 2 && c === 2 ? "missing" : ""}">${r === 2 && c === 2 ? "<span>?</span>" : dots(bits, true)}</div>`)).join("")}</div><span class="answer-label">Który wariant uzupełnia matrycę?</span>${options(
        p.options.map((bits, i) => ({
          id: String(i),
          art: dots(bits),
          label: "Wariant " + "ABCD"[i],
        })),
        a,
      )}`;
    case "grid": {
      const n = p.items.length;
      return `<ol class="evidence-list">${p.clues.map((c) => `<li>${esc(c.text)}</li>`).join("")}</ol><div class="logic-grid-scroll"><table class="logic-grid" aria-label="Tabela kolejności"><thead><tr><th>Element / miejsce</th>${p.items.map((_, i) => `<th scope="col">${i + 1}</th>`).join("")}</tr></thead><tbody>${p.items
        .map(
          (item, r) =>
            `<tr><th scope="row">${esc(item)}</th>${p.items
              .map((_, c) => {
                const i = r * n + c,
                  v = a[i];
                return `<td><button type="button" data-action="grid" data-index="${i}" data-focus-key="grid-${i}" aria-label="${esc(item)}, miejsce ${c + 1}: ${v === 1 ? "potwierdzone" : v === -1 ? "wykluczone" : "nieustalone"}" class="logic-cell ${v === 1 ? "confirmed" : v === -1 ? "excluded" : ""}">${v === 1 ? "●" : v === -1 ? "×" : ""}</button></td>`;
              })
              .join("")}</tr>`,
        )
        .join(
          "",
        )}</tbody></table></div><p class="board-help">Klikaj: × wykluczenie → ● potwierdzenie → puste. Strzałki na klawiaturze przesuwają fokus.</p>`;
    }
    case "cipher":
      return `<div class="cipher-example"><span class="eyebrow">NOTATKA PRZY KLUCZU</span><strong>${esc(p.example)}</strong></div><div class="cipher-message" aria-label="Szyfrogram ${esc(p.cipher)}">${[...p.cipher].map((c) => `<span>${c}</span>`).join("")}</div><div class="alphabet-strip">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div><label class="answer-label" for="answer-input">Odczytana wiadomość</label><input id="answer-input" data-input="answer" class="answer-input" autocomplete="off" spellcheck="false" maxlength="50" placeholder="Wpisz odczytane słowo" value="${esc(a)}">`;
    case "cube": {
      const xs = p.net.map((t) => t.x),
        ys = p.net.map((t) => t.y),
        minX = Math.min(...xs),
        minY = Math.min(...ys);
      return `<div class="cube-net" style="--cols:${Math.max(...xs) - minX + 1};--rows:${Math.max(...ys) - minY + 1}" aria-label="Siatka sześcianu">${p.net.map((t, i) => `<div class="net-tile tile-${i}" style="grid-column:${t.x - minX + 1};grid-row:${t.y - minY + 1}"><strong>${t.id}</strong><span>${["☽", "✧", "◇", "○", "△", "✦"][i]}</span></div>`).join("")}</div><p class="cube-question">${esc(instruction(p))}</p>${options(
        p.options.map((id) => ({ id, label: "Ścianka " + id })),
        a,
      )}`;
    }
    case "select":
      return `<div class="rule-box"><span class="eyebrow">REGUŁA DO SPRAWDZENIA</span><strong>${esc(p.rule)}</strong></div><div class="logic-cards">${p.cards.map((c, i) => `<button type="button" data-action="select" data-value="${c.id}" data-focus-key="select-${c.id}" aria-pressed="${a.includes(c.id)}" class="logic-card ${a.includes(c.id) ? "selected" : ""}"><span class="logic-card-face">${c.icon ? icon(c.icon, 54) : esc(c.label)}</span><span>${esc(c.label)}</span><i>${a.includes(c.id) ? icon("check", 15) : "+"}</i></button>`).join("")}</div><p class="board-help">Możesz zaznaczyć więcej niż jedną kartę.</p>`;
    case "truth":
      return `<div class="testimonies">${p.claims.map((c, i) => `<div><span>${i + 1}</span><p><b>${esc(c.speaker)}</b>${esc(c.text)}</p></div>`).join("")}</div><span class="answer-label">Kto przełożył księgę?</span>${options(
        p.people.map((label, i) => ({ id: String(i), label })),
        a,
      )}`;
    case "balance":
      return `<div class="balance-evidence">${p.equations.map((c) => `<div><span class="crate">${c.a}</span><b>+</b><span class="crate">${c.b}</span><b>=</b><strong>${c.total} <small>kg</small></strong></div>`).join("")}</div><label class="answer-label" for="answer-input">2 × C − A = ? <span>w kilogramach</span></label><input id="answer-input" data-input="answer" class="answer-input number-input" inputmode="numeric" maxlength="12" autocomplete="off" placeholder="Wpisz liczbę" value="${esc(a)}">`;
    case "nonogram":
      return (
        nonoTable(p, a) +
        `<p class="board-help">Pełne → × → puste. Prawy przycisk: ×. Strzałki na klawiaturze przesuwają fokus.</p>`
      );
    case "lights":
      return `<div class="rune-board" style="--n:${p.n}" aria-label="Plansza przełączanych run">${Array.from(
        { length: p.n * p.n },
        (_, i) => {
          const on = !!((a.mask >> i) & 1);
          return `<button type="button" class="rune ${on ? "lit" : ""}" data-action="light" data-index="${i}" data-focus-key="light-${i}" aria-pressed="${on}" aria-label="Runa, wiersz ${Math.floor(i / p.n) + 1}, kolumna ${(i % p.n) + 1}: ${on ? "aktywna" : "wygaszona"}"><span>${["◇", "✧", "☽", "△"][i % 4]}</span></button>`;
        },
      ).join(
        "",
      )}</div><div class="board-toolbar"><span>Przełączenia: <b>${a.history.length}</b></span><button type="button" data-action="undo-light" ${a.history.length ? "" : "disabled"}>${icon("back", 14)} Cofnij przełączenie</button></div>`;
  }
}
function solutionMarkup(p) {
  return `<div class="solution-heading"><span class="eyebrow">UZASADNIENIE</span><h3>${esc(answerLabel(p))}</h3></div><ol class="solution-steps">${explanation(
    p,
  )
    .map((x) => `<li>${esc(x)}</li>`)
    .join(
      "",
    )}</ol>${p.type === "nonogram" ? nonoTable(p, p.solution, true) : ""}`;
}
function renderPuzzle() {
  const p = current(),
    r = record(state, p.id),
    c = chapterOf(p),
    a = draft(state, p),
    active = document.activeElement?.dataset.focusKey,
    activeAction = document.activeElement?.dataset.action;
  const sameCase = main.dataset.caseId === p.id;
  const rulesOpen = sameCase ? (main.querySelector(".instructions")?.open ?? ["code","matrix","nonogram"].includes(p.type)) : ["code","matrix","nonogram"].includes(p.type);
  const solutionOpen = sameCase ? (main.querySelector(".solution")?.open ?? r.status === "read") : r.status === "read";
  main.dataset.caseId = p.id;
  main.innerHTML = `<div class="case-breadcrumb"><button data-action="home">${icon("back", 15)} Wróć do archiwum</button><span>${esc(c.title)} <i>/</i> Akta ${String(p.number).padStart(2, "0")}</span><button data-action="bookmark" aria-pressed="${state.bookmarks.includes(p.id)}" class="bookmark-button">${icon("bookmark", 16)} ${state.bookmarks.includes(p.id) ? "Z zakładką" : "Odłóż na później"}</button></div><div class="case-heading"><div><span class="eyebrow">${esc(TYPES[p.type]).toUpperCase()} <i>·</i> ${levelDots(p.difficulty)} ${level(p.difficulty).toUpperCase()}</span><h1>${esc(p.title)}</h1></div><button class="focus-button" data-action="focus" aria-pressed="${focusMode}">${icon("focus", 18)} ${focusMode ? "Pełny widok" : "Tryb skupienia"}</button></div><div class="workspace ${focusMode ? "focused" : ""}"><article class="puzzle-paper"><div class="paper-topline"><span>AKTA ${String(p.number).padStart(2, "0")} <i>·</i> ${esc(c.world)}</span><span class="timer">${icon("clock", 13)} <span id="case-time">${timeLabel(r.elapsed)}</span><button data-action="pause" aria-label="${state.paused ? "Wznów czas pracy" : "Wstrzymaj czas pracy"}" ${r.status !== "new" ? "disabled" : ""}>${icon(state.paused ? "play" : "pause", 13)}</button></span></div><p class="case-story">${esc(p.story)}</p><details class="instructions" ${rulesOpen ? "open" : ""}><summary>Zasady tych akt ${icon("hint", 14)}</summary><p>${esc(instruction(p))}</p></details><form id="answer-form"><div class="puzzle-body ${p.type}">${puzzleBody(p, a)}</div><div class="answer-actions"><button type="submit" class="primary">Sprawdź wniosek ${icon("arrow", 17)}</button><button type="button" class="reset-draft" data-action="reset-draft">${icon("reset", 15)} ${["grid", "nonogram", "lights"].includes(p.type) ? "Plansza początkowa" : "Wyczyść odpowiedź"}</button></div></form>${feedback ? `<div class="answer-feedback ${feedback.ok ? "correct" : feedback.incomplete ? "neutral" : "wrong"}" role="status">${icon(feedback.ok ? "check" : "notes", 18)}<p>${esc(feedback.message)}</p></div>` : ""}${r.status === "solved" ? `<div class="solved-panel"><div class="solved-seal">${icon("seal", 42)}</div><div><span class="eyebrow">AKTA ROZWIĄZANE</span><h3>Wniosek zgodny z przesłankami.</h3><p>${r.revealed ? "Rozwiązanie po zapoznaniu się z uzasadnieniem." : r.hints ? `Wykorzystane podpowiedzi: ${r.hints}. Pieczęcie: ${r.seals} / 3.` : "Samodzielne rozwiązanie. Trzy pieczęcie do kolekcji."}</p></div><button data-action="next" class="secondary">Kolejne akta ${icon("arrow", 16)}</button></div>` : ""}${r.status === "solved" || r.revealed ? `<details class="solution" ${solutionOpen ? "open" : ""}><summary>Pokaż uzasadnienie ${icon("eye", 17)}</summary>${solutionMarkup(p)}</details>` : ""}</article><aside class="case-sidebar"><section class="mentor-card"><div class="mentor-image"><img src="./art/gabinet.png" alt="Mistrz eliksirów w nocnym gabinecie"></div><div><span class="eyebrow">Z MARGINESU PROFESORA SNAPE’A</span><p>${esc(PROFESSOR_NOTES[(p.number - 1) % PROFESSOR_NOTES.length])}</p><small>Głos gabinetu · tekst autorski</small></div></section><section class="hint-card"><div class="side-heading"><h2>Mała wskazówka</h2><span>${r.hints} / 2</span></div><p>Odsłaniaj tylko tyle, ile potrzebujesz. Każda podpowiedź zmniejsza liczbę pieczęci za te akta o jedną.</p>${hints(
    p,
  )
    .slice(0, r.hints)
    .map(
      (h, i) =>
        `<div class="hint-text"><b>${i + 1}</b><span>${esc(h)}</span></div>`,
    )
    .join(
      "",
    )}<button class="secondary full" data-action="hint" ${r.hints === 2 || r.status === "solved" ? "disabled" : ""}>${icon("hint", 16)} ${r.hints ? "Jeszcze jedna wskazówka" : "Odsłoń wskazówkę"}</button><button data-action="reveal" class="reveal-button">${icon("eye", 15)} ${r.status === "solved" || r.revealed ? "Przejdź do uzasadnienia" : "Odkryj rozwiązanie"}</button>${r.revealed && r.status !== "solved" ? '<small class="revealed-note">Akta mają status „rozwiązanie odkryte”. Możesz rozwiązać je później dla treningu.</small>' : ""}</section><section class="notebook-card"><label for="case-notes">${icon("notes", 17)} Twój margines</label><textarea id="case-notes" data-input="notes" maxlength="5000" rows="6" placeholder="Hipotezy, wykluczenia, małe olśnienia…">${esc(state.notes[p.id] ?? "")}</textarea><small>Notatki zapisują się tutaj automatycznie.</small></section></aside></div>`;
  if (active) {
    const node = [...main.querySelectorAll("[data-focus-key]")].find(
      (n) => n.dataset.focusKey === active,
    );
    node?.focus({ preventScroll: true });
  } else if (activeAction) {
    [...main.querySelectorAll("[data-action]")]
      .find((n) => n.dataset.action === activeAction)
      ?.focus({ preventScroll: true });
  }
  header();
}
function render() {
  header();
  renderStorage();
  state.view === "puzzle" ? renderPuzzle() : renderHome();
  markTime();
}
function openPuzzle(id) {
  if (!BY_ID.has(id)) return;
  flushTime();
  state.currentId = id;
  state.view = "puzzle";
  state.paused = false;
  feedback = null;
  save();
  render();
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}
function goHome() {
  flushTime();
  state.view = "home";
  feedback = null;
  save();
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}
function verify() {
  const p = current(),
    answer = draft(state, p),
    result = checkAnswer(p, answer),
    r = record(state, p.id);
  flushTime();
  if (result.ok) {
    state = solvedState(state, p);
    feedback = {
      ok: true,
      message: "Poprawnie. Wszystkie przesłanki są spełnione.",
    };
    if (r.status !== "solved") {
      toast("Akta zamknięte. Dobra dedukcja.");
      chime();
    }
  } else if (result.incomplete)
    feedback = { ...result, message: result.message };
  else {
    state.progress[p.id] = { ...record(state, p.id), attempts: r.attempts + 1 };
    feedback = {
      ok: false,
      message:
        "Ten wniosek nie pasuje do wszystkich warunków. Zostaw hipotezę w notatkach i sprawdź przesłanki jeszcze raz.",
    };
  }
  save();
  renderPuzzle();
  markTime();
}
function reveal() {
  const p = current(),
    r = record(state, p.id);
  if (r.status === "solved" || r.revealed) {
    $(".solution")?.setAttribute("open", "");
    $(".solution")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    return;
  }
  flushTime();
  state.progress[p.id] = {
    ...record(state, p.id),
    status: "read",
    revealed: true,
    seals: 0,
  };
  save();
  feedback = null;
  renderPuzzle();
  markTime();
  $(".solution")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
}
function showModal(title, body) {
  modal.innerHTML = `<div class="modal-content"><button class="modal-close" data-action="close-modal" aria-label="Zamknij okno">${icon("close", 20)}</button><span class="eyebrow">GABINET JOANNY</span><h2 id="modal-title">${esc(title)}</h2>${body}</div>`;
  modal.showModal();
}
function journal() {
  const entries = PUZZLES.filter(
    (p) => state.notes[p.id] || state.bookmarks.includes(p.id),
  );
  showModal(
    "Notatnik Joanny",
    `<p class="modal-intro">Odłożone akta i myśli zapisane na marginesie.</p>${entries.length ? `<div class="journal-list">${entries.map((p) => `<article><span class="eyebrow">AKTA ${String(p.number).padStart(2, "0")} · ${esc(TYPES[p.type])}</span><button data-action="open" data-id="${p.id}"><h3>${esc(p.title)}</h3>${icon("arrow", 17)}</button><p>${esc(state.notes[p.id] || "Odłożone z zakładką.").replaceAll("\n", "<br>")}</p></article>`).join("")}</div>` : '<div class="empty-journal">' + icon("notes", 38) + "<p>Każde akta mają własny margines. Możesz też odłożyć je zakładką, aby wrócić później.</p></div>"}`,
  );
}
function about() {
  showModal(
    "Kilka słów przed północą",
    `<div class="about-copy"><p>Ten gabinet należy do <strong>Joanny Bukowskiej-Chlebus</strong>. Czekają tu 32 autorskie łamigłówki w czterech rozdziałach: Harry Potter i Snape, Czarodziejka z Księżyca, Super Pig oraz prywatny departament kartofli.</p><p>Wybieraj dowolną kolejność. Każde akta zawierają wszystkie potrzebne przesłanki. Są trzy poziomy trudności, dwie podpowiedzi oraz pełne uzasadnienie. Trzy pieczęcie oznaczają rozwiązanie bez podpowiedzi; każda wskazówka odejmuje jedną. Odkrycie rozwiązania przed odpowiedzią daje status „odkryte”. Próby i czas nie odbierają pieczęci.</p><p>Przy planszach działają strzałki na klawiaturze. Enter lub spacja wybiera pole. Notatki i zakładki pomagają wrócić do hipotez. Przycisk pauzy zatrzymuje czas; ukrycie karty również go zatrzymuje. Zegar jest pomocą, nie limitem.</p><p>Postępy i notatki są zapisywane w tej przeglądarce. Inny adres lub urządzenie ma osobny zapis. Przed czyszczeniem danych pobierz kopię. Wczytanie pliku zastąpi obecne postępy.</p><div class="backup-actions"><button class="secondary" data-action="export">${icon("download", 17)} Pobierz zapis JSON</button><label class="secondary file-label">Wczytaj zapis<input type="file" id="import-file" accept=".json,application/json"></label></div><label class="volume-label">Głośność melodii<input type="range" data-input="volume" min="0" max="40" value="${Math.round(state.volume * 100)}" aria-label="Głośność melodii"></label><p class="small">Wszystkie zagadki, notatki profesora i ilustracja powstały do tej gry. Inspiracje: światy Harry’ego Pottera, Czarodziejki z Księżyca oraz Super Pig. Nie korzystamy z filmowych kadrów ani oryginalnych nagrań. Melodia jest własną, delikatną kompozycją syntezowaną w przeglądarce.</p><button class="primary full" data-action="close-modal">Otwórzmy te akta ${icon("arrow", 17)}</button></div>`,
  );
}
function exportSave() {
  flushTime();
  const url = URL.createObjectURL(
      new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = "gabinet-joanny-zapis.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function getAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
    master = audioContext.createGain();
    master.gain.value = state.volume;
    master.connect(audioContext.destination);
  }
  return audioContext;
}
const voices = new Set();
function note(freq, t, duration, gain = 0.11) {
  const ctx = getAudio(),
    o = ctx.createOscillator(),
    g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.025);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  o.connect(g).connect(master);
  voices.add(o);
  o.onended = () => voices.delete(o);
  o.start(t);
  o.stop(t + duration + 0.1);
}
function loopMusic() {
  const ctx = getAudio(),
    base = ctx.currentTime + 0.05;
  [261.63, 329.63, 392, 293.66, 349.23, 440, 329.63, 246.94].forEach((f, i) => {
    note(f, base + i * 1.55, 2.8, 0.14);
    if (i % 2 === 0) note(f / 2, base + i * 1.55, 4, 0.07);
  });
}
function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
  melody = false;
  for (const voice of voices) { try { voice.stop(); } catch {} }
  voices.clear();
  if (audioContext) void audioContext.suspend();
  header();
}
async function toggleMusic() {
  if (melody) {
    stopMusic();
    state.sound = false;
  } else {
    try {
      const ctx = getAudio();
      await ctx.resume();
      master.gain.value = state.volume;
      melody = true;
      state.sound = true;
      loopMusic();
      musicTimer = setInterval(loopMusic, 13200);
    } catch {
      toast("Przeglądarka nie uruchomiła melodii. Spróbuj ponownie.");
      melody = false;
    }
  }
  save();
  header();
}
function chime() {
  if (!state.sound) return;
  try {
    const ctx = getAudio();
    void ctx.resume();
    [392, 493.88, 587.33].forEach((f, i) =>
      note(f, ctx.currentTime + i * 0.15, 0.6, 0.18),
    );
  } catch {}
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const action = b.dataset.action,
    p = current();
  if (action === "close-modal") {
    modal.close();
    return;
  }
  if (action === "open") {
    if (modal.open) modal.close();
    openPuzzle(b.dataset.id);
    return;
  }
  if (action === "home") {
    goHome();
    return;
  }
  if (action === "journal") {
    journal();
    return;
  }
  if (action === "about") {
    about();
    return;
  }
  if (action === "sound") {
    void toggleMusic();
    return;
  }
  if (action === "export") {
    exportSave();
    return;
  }
  if (action === "chapter") {
    state.filters.chapter =
      state.filters.chapter === b.dataset.id ? "all" : b.dataset.id;
    save();
    renderHome();
    $("#archive").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    return;
  }
  if (action === "reset-filters") {
    state.filters = freshState().filters;
    save();
    renderHome();
    return;
  }
  if (action === "random") {
    const pool = filtered().filter(
        (p) => record(state, p.id).status !== "solved",
      ),
      choice = (pool.length ? pool : PUZZLES)[
        Math.floor(Math.random() * (pool.length || PUZZLES.length))
      ];
    openPuzzle(choice.id);
    return;
  }
  if (state.view !== "puzzle") return;
  if (action === "bookmark") {
    state.bookmarks = state.bookmarks.includes(p.id)
      ? state.bookmarks.filter((id) => id !== p.id)
      : [...state.bookmarks, p.id];
    save();
    renderPuzzle();
    return;
  }
  if (action === "focus") {
    focusMode = !focusMode;
    renderPuzzle();
    return;
  }
  if (action === "pause") {
    flushTime();
    state.paused = !state.paused;
    save();
    renderPuzzle();
    markTime();
    return;
  }
  if (action === "hint") {
    const r = record(state, p.id);
    if (r.hints < 2 && r.status !== "solved") {
      state.progress[p.id] = { ...r, hints: r.hints + 1 };
      save();
      renderPuzzle();
    }
    return;
  }
  if (action === "reveal") {
    reveal();
    return;
  }
  if (action === "next") {
    const after =
      PUZZLES.slice(p.number).find(
        (q) => record(state, q.id).status !== "solved",
      ) ?? PUZZLES.find((q) => record(state, q.id).status !== "solved");
    after ? openPuzzle(after.id) : goHome();
    return;
  }
  if (action === "reset-draft") {
    state.answers[p.id] = defaultDraft(p);
    feedback = null;
    save();
    renderPuzzle();
    return;
  }
  const a = cleanDraft(p, draft(state, p));
  if (action === "option") state.answers[p.id] = b.dataset.value;
  if (action === "select")
    state.answers[p.id] = a.includes(b.dataset.value)
      ? a.filter((v) => v !== b.dataset.value)
      : [...a, b.dataset.value];
  if (action === "grid") {
    const i = Number(b.dataset.index);
    a[i] = a[i] === 0 ? -1 : a[i] === -1 ? 1 : 0;
    state.answers[p.id] = a;
  }
  if (action === "nono") {
    const i = Number(b.dataset.index);
    a[i] = a[i] === 0 ? 1 : a[i] === 1 ? -1 : 0;
    state.answers[p.id] = a;
  }
  if (action === "light") {
    const i = Number(b.dataset.index);
    if (a.history.length >= 1000) {
      toast("Zacznij od planszy początkowej, aby kontynuować.");
      return;
    }
    state.answers[p.id] = {
      mask: toggleLight(p.n, a.mask, i),
      history: [...a.history, i],
    };
  }
  if (action === "undo-light" && a.history.length) {
    const last = a.history.at(-1);
    state.answers[p.id] = {
      mask: toggleLight(p.n, a.mask, last),
      history: a.history.slice(0, -1),
    };
  }
  feedback = null;
  save();
  renderPuzzle();
});
document.addEventListener("contextmenu", (e) => {
  const b = e.target.closest('[data-action="nono"]');
  if (!b || state.view !== "puzzle") return;
  e.preventDefault();
  const p = current(),
    a = [...draft(state, p)],
    i = Number(b.dataset.index);
  a[i] = a[i] === -1 ? 0 : -1;
  state.answers[p.id] = a;
  feedback = null;
  save();
  renderPuzzle();
});
document.addEventListener("input", (e) => {
  const node = e.target;
  if (node.dataset.input === "answer") {
    state.answers[state.currentId] = node.value;
    feedback = null;
    save();
  }
  if (node.dataset.input === "notes") {
    state.notes[state.currentId] = node.value.slice(0, 5000);
    save();
    $("#note-count").textContent = summary(state).notes || "";
  }
  if (node.dataset.input === "volume") {
    state.volume = Math.max(0, Math.min(0.4, Number(node.value) / 100));
    if (master) master.gain.value = state.volume;
    save();
  }
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "answer-form") {
    e.preventDefault();
    verify();
  }
});
document.addEventListener("change", async (e) => {
  const node = e.target;
  if (node.dataset.filter) {
    state.filters[node.dataset.filter] = node.value;
    save();
    renderHome();
  }
  if (node.id === "import-file") {
    const file = node.files?.[0];
    if (!file) return;
    try {
      if (file.size > 512000) throw Error("Plik jest za duży.");
      const parsed = parseState(await file.text());
      flushTime();
      state = parsed;
      save();
      modal.close();
      feedback = null;
      render();
      toast("Wczytano zapis gabinetu.");
    } catch (error) {
      toast(error.message || "Nie udało się wczytać zapisu.");
    }
    node.value = "";
  }
});
document.addEventListener("keydown", (e) => {
  const b = e.target.closest("[data-index]");
  if (
    !b ||
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
  )
    return;
  const p = current(),
    n = p.type === "grid" ? p.items.length : p.n;
  if (!n) return;
  e.preventDefault();
  const i = Number(b.dataset.index),
    r = Math.floor(i / n),
    c = i % n,
    rr = e.key === "ArrowUp" ? r - 1 : e.key === "ArrowDown" ? r + 1 : r,
    cc = e.key === "ArrowLeft" ? c - 1 : e.key === "ArrowRight" ? c + 1 : c;
  if (rr >= 0 && rr < n && cc >= 0 && cc < n)
    main
      .querySelector(
        `[data-action="${b.dataset.action}"][data-index="${rr * n + cc}"]`,
      )
      ?.focus();
});
modal.addEventListener("click", (e) => {
  const r = modal.getBoundingClientRect();
  if (
    e.target === modal &&
    (e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom)
  )
    modal.close();
});
document.addEventListener("visibilitychange", () => {
  flushTime();
  if (document.hidden) {
    save();
    if (melody) stopMusic();
  }
  markTime();
});
window.addEventListener("pagehide", () => {
  flushTime();
  save();
});
setInterval(() => {
  flushTime();
  const n = $("#case-time");
  if (n) n.textContent = timeLabel(record(state, state.currentId).elapsed);
  if (++ticks % 10 === 0 && state.view === "puzzle") save();
}, 1000);
render();
