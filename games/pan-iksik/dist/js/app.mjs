import { CHAPTERS, LESSONS, BY_ID } from "./lessons.mjs";
import {
  initial,
  sums,
  label,
  expression,
  equation,
  ready,
  actions,
  apply,
  recommend,
  replay,
  check,
} from "./engine.mjs";
import { KEY, fresh, parse } from "./state.mjs";
import { mascot, landscape } from "./art.mjs";
const $ = (s) => document.querySelector(s),
  main = $("#main"),
  modal = $("#modal");
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state = fresh(),
  pending = null,
  message = "",
  hint = false,
  win = false,
  warning = "",
  chapterFilter = 0,
  dragged = null,
  audio = null;
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = parse(raw);
} catch {
  warning =
    "Nie udało się odczytać zapisu. Możesz grać dalej lub wczytać kopię w menu „Jak grać?”.";
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    warning =
      "Przeglądarka nie zapisuje postępów. Pobierz kopię w menu „Jak grać?”.";
  }
  $("#storage").hidden = !warning;
  $("#storage").textContent = warning;
}
function announce(text) {
  $("#live").textContent = text;
}
function current() {
  return BY_ID.get(state.lesson);
}
function progress() {
  return state.done.length;
}
function header() {
  $("#stars").textContent = `★ ${progress()} / 30`;
  $("#sound").setAttribute("aria-pressed", String(state.sound));
  $("#sound").setAttribute(
    "aria-label",
    state.sound ? "Wyłącz dźwięki" : "Włącz dźwięki",
  );
  $("#storage").hidden = !warning;
  $("#storage").textContent = warning;
}
function open(id) {
  if (!BY_ID.has(id)) return;
  if (modal.open) modal.close();
  if (state.lesson !== id || win) {
    state.steps = [];
  }
  state.lesson = id;
  state.page = "play";
  pending = null;
  message = "";
  hint = false;
  win = false;
  save();
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}
function home() {
  state.page = "home";
  pending = null;
  save();
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}
function chapterCards() {
  return CHAPTERS.map((c) => {
    const done = LESSONS.filter(
      (l) => l.chapter === c.id && state.done.includes(l.id),
    ).length;
    return `<button class="chapter-card ${c.color}" data-act="chapter" data-id="${c.id}"><span class="chapter-symbol">${c.icon}</span><span class="eyebrow">ROZDZIAŁ ${c.id} · ${done} / 6</span><h3>${c.title}</h3><p>${c.subtitle}</p><span class="chapter-go">Odkryj zadania <b>↗</b></span></button>`;
  }).join("");
}
function homeView() {
  main.innerHTML = `<section class="hero"><div class="hero-copy"><span class="eyebrow"><i></i> WITAJ W MIASTECZKU NIEWIADOMYCH</span><h1>Każda liczba ma<br>swoją <em>tajemnicę.</em></h1><p>Poznaj Pana Iksika i pomóż mu odkryć, jaka liczba ukrywa się pod <b>x</b>. Przesuwaj składniki, dbaj o równowagę i zbieraj małe olśnienia.</p><div class="hero-actions"><button class="primary" data-act="start">${state.steps.length ? "Wracamy do przygody" : "Ruszamy z Iksikiem"} <span>→</span></button><button class="text-button" data-act="map">Zobacz mapę przygód <span>↗</span></button></div><div class="hero-tags"><span>✦ 30 małych przygód</span><span>♡ We własnym tempie</span><span>↶ Możesz cofać ruchy</span></div></div><div class="hero-art">${landscape()}<span class="floating-number one">+ 3</span><span class="floating-number two">10</span><span class="speech">Cześć! Co kryje moje x?</span><div class="hero-mascot">${mascot()}</div><span class="equation-sticker"><b>x</b> + 3 = 10 <span>?</span></span><span class="little-star">✧</span></div></section><section class="intro-line"><div><span class="eyebrow">JEDNA WIELKA ZASADA</span><h2>Obie strony lubią równowagę.</h2></div><p>To samo działanie po obu stronach.<br>Ta sama wartość x. I gotowe!</p></section><section class="chapter-grid" aria-label="Pięć rozdziałów">${chapterCards()}</section><section class="how"><span>01 <b>Wybierz składnik</b></span><span>02 <b>Zrób to po obu stronach</b></span><span>03 <b>Odkryj wartość x</b></span></section>`;
}
function actionKey(a) {
  return a.type === "move" ? `${a.from}-${a.id}` : a.type;
}
function hintText(b) {
  const a = recommend(b);
  if (!a)
    return "Po lewej został sam x! Policz prawą stronę i wpisz, jaką liczbę ukrywa Iksik.";
  if (a.type === "swap")
    return "Iksik jest po prawej. Wybierz „Zamień strony”. Znaki przy tej zamianie zostają takie same.";
  if (a.type === "collect")
    return "Wybierz „Połącz składniki”. Liczby policzymy razem, a Iksiki zbierzemy w jedną grupkę.";
  if (a.type === "divide")
    return `Po lewej jest ${sums(b.left).x} × x. Wybierz „Podziel obie strony”, aby poznać wartość jednego x.`;
  const t = b[a.from].find((t) => t.id === a.id);
  return `Wybierz ${label(t, true)} po ${a.from === "left" ? "lewej" : "prawej"} stronie. ${t.value > 0 ? "Odejmiemy" : "Dodamy"} ${label({ ...t, value: Math.abs(t.value) })} po obu stronach.`;
}
function sideMarkup(b, side) {
  const all = actions(b),
    sideName = side === "left" ? "Lewa" : "Prawa";
  return `<section class="equation-side ${side}" data-side="${side}" aria-label="${sideName} strona równania"><span class="side-label">${sideName.toUpperCase()} STRONA</span><div class="terms">${
    b[side].length
      ? b[side]
          .map((t, i) => {
            const a = all.find(
                (a) => a.type === "move" && a.from === side && a.id === t.id,
              ),
              enabled = !!a && !pending && !win;
            return `<button class="term ${t.kind === "x" ? "x-term" : "number-term"} ${enabled ? "movable" : ""} ${hint && a && actionKey(a) === actionKey(recommend(b) || {}) ? "hint-term" : ""}" ${!enabled ? "disabled" : ""} data-act="term" data-side="${side}" data-id="${t.id}" aria-label="${sideName} strona: ${label(t, true)}${a ? ", wybierz do przeniesienia" : ""}">${i > 0 ? `<span class="term-sign">${t.value < 0 ? "−" : "+"}</span>` : t.value < 0 ? '<span class="term-sign">−</span>' : ""}<span>${label({ ...t, value: Math.abs(t.value) })}</span>${enabled ? '<small class="drag-grip" draggable="true" aria-hidden="true">↗</small>' : ""}</button>`;
          })
          .join("")
      : '<span class="zero">0</span>'
  }</div><div class="side-foot">${side === "left" ? "Tu chcemy zostawić samo x." : "Tu zbieramy liczby."}</div></section>`;
}
function actionPanel(b) {
  if (win) return "";
  if (pending) {
    const p = apply(b, pending);
    return `<div class="move-preview" role="region" aria-label="Zaplanowany ruch"><span class="eyebrow">SPRAWDŹMY, DLACZEGO TO DZIAŁA</span><h3>${esc(p.operation)}</h3><div class="balance-line">${esc(p.balance)}</div><p>${esc(p.detail)}</p><div class="preview-actions"><button class="primary" data-act="confirm">Zrób to po obu stronach <span>✓</span></button><button class="text-button" data-act="cancel">Jeszcze chwilkę</button></div></div>`;
  }
  if (ready(b))
    return `<form id="answer-form" class="answer-panel"><div><span class="eyebrow">IKSIK JEST JUŻ SAM PO LEWEJ!</span><h3>Jaką liczbą jest x?</h3><p>Policz prawą stronę. Potem sprawdzimy Twój pomysł.</p></div><div class="answer-row"><label for="answer">x =</label><input id="answer" name="answer" inputmode="numeric" type="text" autocomplete="off" maxlength="5" aria-label="Wartość x"><button class="primary" type="submit">Sprawdź <span>→</span></button></div></form>`;
  const specials = actions(b).filter((a) => a.type !== "move");
  return `<div class="next-action"><span class="step-dot">${state.steps.length + 1}</span><p>${hintText(b)}</p></div><div class="special-actions">${specials.map((a) => `<button class="secondary" data-act="special" data-type="${a.type}">${a.type === "swap" ? "⇄ Zamień strony" : a.type === "collect" ? "⊕ Połącz składniki" : `÷ Podziel obie strony przez ${sums(b.left).x}`}</button>`).join("")}</div>`;
}
function substitute(side, x) {
  if (!side.length) return "0";
  return side
    .map((t, i) => {
      const v = Math.abs(t.value),
        body =
          t.kind === "x" ? (v === 1 ? String(x) : `${v} × ${x}`) : String(v);
      return (
        (i ? (t.value < 0 ? " − " : " + ") : t.value < 0 ? "−" : "") + body
      );
    })
    .join("");
}
function winPanel(l, x) {
  const r = check(l, x),
    b = initial(l),
    next = LESSONS[l.number % LESSONS.length];
  return `<section class="win-panel"><span class="win-star">★</span><span class="eyebrow">MAŁE OLŚNIENIE!</span><h2>Tak! x = ${x}</h2><p>Podstawiamy ${x} zamiast każdego x w <b>początkowym równaniu</b>.</p><div class="substitution"><span>${substitute(b.left, x)}</span><b>=</b><span>${substitute(b.right, x)}</span></div><div class="check-equal">${r.left} = ${r.right} <span>✓ Obie strony się zgadzają!</span></div><p>${progress() === 30 ? "Wszystkie 30 przygód odkryte. Jesteś przyjacielem równowagi!" : "Kolejna tajemnica odkryta. Dobra robota, odkrywco!"}</p><div class="win-actions"><button class="primary" data-act="open" data-id="${next.id}">${l.number === 30 ? "Zagrajmy jeszcze raz" : "Kolejna przygoda"} →</button><button class="text-button" data-act="map">Mapa przygód</button></div></section>`;
}
function playView() {
  const l = current(),
    { board: b, log } = replay(l, state.steps),
    c = CHAPTERS[l.chapter - 1];
  main.innerHTML = `<div class="play-top"><button class="text-button" data-act="map">← Mapa przygód</button><span>${c.title} <i>•</i> Zadanie ${l.number} z 30</span><button class="text-button" data-act="reset">↻ Od początku</button></div><div class="play-heading"><div><span class="eyebrow">PRZYGODA ${String(l.number).padStart(2, "0")}</span><h1>${l.title}</h1></div><span class="lesson-badge">${c.icon}</span></div><div class="play-layout"><div class="workspace"><section class="problem-story"><span>✉</span><p>${l.story}</p></section><section class="equation-board ${pending ? "planning" : ""}" aria-label="Twoje równanie"><div class="board-top"><span>NASZE RÓWNANIE</span><span class="balance-badge">⚖ W równowadze</span></div><div class="equation-row">${sideMarkup(b, "left")}<div class="equals" aria-label="równa się">=</div>${sideMarkup(b, "right")}</div><p class="board-caption">${win ? "Zagadka rozwiązana!" : ready(b) ? "Po lewej samo x. Teraz policz prawą stronę." : "Kliknij składnik. Możesz też przeciągnąć go za strzałkę na drugą stronę."}</p></section>${win ? winPanel(l, sums(b.right).n) : actionPanel(b)}${message ? `<p class="feedback" role="status">${esc(message)}</p>` : ""}<div class="workspace-actions"><button class="text-button" data-act="undo" ${!state.steps.length || win ? "disabled" : ""}>↶ Cofnij ruch</button><span>Bez pośpiechu. Każdy ruch można cofnąć.</span></div>${log.length ? `<details class="history" ${state.steps.length <= 3 ? "open" : ""}><summary>Nasza droga · ${state.steps.length} ${state.steps.length === 1 ? "ruch" : "ruchy"}</summary><ol>${log.map((r) => `<li><small>${esc(r.operation)}</small><span>${esc(equation(r.board))}</span></li>`).join("")}</ol></details>` : ""}</div><aside class="companion"><div class="character ${win ? "happy" : ""}">${mascot(win)}</div><span class="name-tag">PAN IKSIK <span>twój kompan odkryć</span></span><div class="companion-note"><span>MAŁA PODPOWIEDŹ</span><p>${win ? "Zostawiliśmy samo x i sprawdziliśmy wynik. Właśnie tak pracują odkrywcy!" : hint ? hintText(b) : "Nie musisz znać odpowiedzi od razu. Zróbmy jeden mały krok."}</p><button class="secondary" data-act="hint" ${win ? "disabled" : ""}>${hint ? "Podświetl właściwy ruch" : "Pomóż mi, Iksiku"} ✧</button></div><div class="rule-card"><b>Zapamiętaj</b><p>Gdy dodajemy lub odejmujemy coś po jednej stronie, robimy <strong>to samo po drugiej</strong>.</p><span>Tak dbamy o równowagę.</span></div></aside></div>`;
  if (win) $("#answer")?.blur();
}
function render() {
  header();
  state.page === "home" ? homeView() : playView();
}
function map() {
  modal.innerHTML = `<div class="modal-body"><button class="modal-close" data-act="close" aria-label="Zamknij mapę">×</button><span class="eyebrow">KAŻDA PRZYGODA JEST OTWARTA</span><h2>Dokąd idziemy z Iksikiem?</h2><div class="map-tabs"><button data-act="filter" data-id="0" aria-pressed="${chapterFilter === 0}">Wszystkie</button>${CHAPTERS.map((c) => `<button data-act="filter" data-id="${c.id}" aria-pressed="${chapterFilter === c.id}">${c.id}. ${c.title}</button>`).join("")}</div><div class="lesson-list">${LESSONS.filter(
    (l) => !chapterFilter || l.chapter === chapterFilter,
  )
    .map(
      (l) =>
        `<button data-act="open" data-id="${l.id}" class="lesson-choice"><span>${String(l.number).padStart(2, "0")}</span><span><strong>${l.title}</strong><small>${equation(initial(l))}</small></span><b>${state.done.includes(l.id) ? "★" : "→"}</b></button>`,
    )
    .join("")}</div></div>`;
  if (!modal.open) modal.showModal();
}
function about() {
  modal.innerHTML = `<div class="modal-body about"><button class="modal-close" data-act="close" aria-label="Zamknij okno">×</button><span class="eyebrow">DLA MAŁYCH ODKRYWCÓW I RODZICÓW</span><h2>Jak pomóc Panu Iksikowi?</h2><p><b>x to tajemnicza liczba.</b> Nasz cel: zostawić samo x po lewej stronie i obliczyć prawą.</p><ol><li>Kliknij składnik lub przeciągnij go na drugą stronę.</li><li>Przeczytaj, jakie działanie wykonamy <b>po obu stronach</b>, i zatwierdź ruch.</li><li>Gdy po lewej zostanie samo x, wpisz jego wartość. Sprawdzimy ją w początkowym równaniu.</li></ol><p>Przeniesienie <b>+3</b> oznacza odjęcie 3 po obu stronach: po drugiej stronie pojawia się <b>−3</b>. Przy zamianie całych stron znaki się nie zmieniają. <b>2x oznacza 2 × x</b>; dzielenie obu stron jest osobnym działaniem.</p><p>30 zadań w pięciu rozdziałach. Wszystkie są dostępne od razu; zacznij od pierwszego. Za każdą rozwiązaną przygodę dostajesz jedną gwiazdkę. Podpowiedzi i pomyłki nie odbierają gwiazdek. W trudniejszych zadaniach mogą pojawić się ujemne składniki.</p><p>Postępy zapisują się w tej przeglądarce. Inny adres lub urządzenie ma osobny zapis. Pobierz kopię przed wyczyszczeniem danych. Wczytanie kopii zastępuje bieżący zapis.</p><div class="backup"><button class="secondary" data-act="export">Pobierz zapis JSON ↓</button><label class="secondary file-label">Wczytaj zapis<input type="file" id="import" accept=".json,application/json"></label></div><p class="fine">Gra działa lokalnie, nie wysyła odpowiedzi i nie wymaga konta ani dodatkowych usług. Ilustracje i dźwięki są autorskie. Klawiatura: Tab wybiera przycisk, Enter lub spacja go uruchamia. Na telefonie wystarczy dotykać składników.</p></div>`;
  if (!modal.open) modal.showModal();
}
function celebrate() {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $("#confetti").innerHTML = Array.from(
      { length: 32 },
      (_, i) =>
        `<i style="--left:${(i * 31) % 100}%;--delay:${(i % 7) * 0.05}s;--color:${["#e2ae5f", "#75a28b", "#beabd1", "#e8a17b"][i % 4]};--turn:${i * 47}deg"></i>`,
    ).join("");
    setTimeout(() => ($("#confetti").innerHTML = ""), 2200);
  }
  if (state.sound) {
    try {
      audio ??= new AudioContext();
      void audio.resume();
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = audio.createOscillator(),
          g = audio.createGain(),
          t = audio.currentTime + i * 0.12;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.07, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        o.connect(g).connect(audio.destination);
        o.start(t);
        o.stop(t + 0.5);
      });
    } catch {}
  }
}
function prepare(a) {
  pending = a;
  message = "";
  playView();
  announce(apply(replay(current(), state.steps).board, a).operation);
  $(".move-preview")?.scrollIntoView({
    block: "nearest",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const a = el.dataset.act;
  const { board: b } = replay(current(), state.steps);
  if (a === "home") home();
  else if (a === "start") open(state.lesson);
  else if (a === "map") {
    chapterFilter = 0;
    map();
  } else if (a === "chapter") {
    chapterFilter = Number(el.dataset.id);
    map();
  } else if (a === "filter") {
    chapterFilter = Number(el.dataset.id);
    map();
  } else if (a === "open") open(el.dataset.id);
  else if (a === "close") modal.close();
  else if (a === "about") about();
  else if (a === "sound") {
    state.sound = !state.sound;
    save();
    header();
    announce(state.sound ? "Dźwięki włączone." : "Dźwięki wyłączone.");
  } else if (a === "term") {
    const action = actions(b).find(
      (x) =>
        x.type === "move" &&
        x.from === el.dataset.side &&
        x.id === el.dataset.id,
    );
    if (action) prepare(action);
  } else if (a === "special") prepare({ type: el.dataset.type });
  else if (a === "cancel") {
    pending = null;
    playView();
  } else if (a === "confirm") {
    if (state.steps.length >= 64) {
      message =
        "Zróbmy mały porządek: cofnij ruch albo zacznij zadanie od początku.";
      pending = null;
      playView();
      return;
    }
    if (pending) {
      state.steps.push(pending);
      pending = null;
      message = "";
      save();
      playView();
      announce(equation(replay(current(), state.steps).board));
      $("#answer")?.focus({ preventScroll: true });
    }
  } else if (a === "undo") {
    state.steps.pop();
    pending = null;
    message = "";
    hint = false;
    win = false;
    save();
    playView();
  } else if (a === "reset") {
    state.steps = [];
    pending = null;
    message = "";
    win = false;
    hint = false;
    save();
    render();
  } else if (a === "hint") {
    hint = true;
    playView();
    announce(hintText(b));
  } else if (a === "export") {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = "pan-iksik-zapis.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
document.addEventListener("submit", (e) => {
  if (e.target.id !== "answer-form") return;
  e.preventDefault();
  const b = replay(current(), state.steps).board;
  if (!ready(b)) return;
  const answer = $("#answer").value,
    result = check(current(), answer);
  if (!result.valid) {
    message = "Wpisz jedną całą liczbę, a sprawdzimy Twój pomysł.";
  } else if (!result.ok) {
    message = `Sprawdźmy Twój pomysł x = ${result.x}: lewa strona daje ${result.left}, a prawa ${result.right}. Jeszcze się różnią. Spróbuj policzyć prawą stronę naszego równania.`;
  } else {
    if (!state.done.includes(state.lesson)) state.done.push(state.lesson);
    win = true;
    message = "";
    save();
    header();
    celebrate();
    announce(`Brawo! x = ${result.x}. Obie strony są równe.`);
  }
  playView();
  if (!win) {
    $("#answer").value = answer;
    $("#answer").focus();
  } else
    $(".win-panel")?.scrollIntoView({ block: "nearest", behavior: "instant" });
});
document.addEventListener("change", async (e) => {
  if (e.target.id !== "import") return;
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 100000) throw Error("Plik jest za duży.");
    state = parse(await file.text());
    pending = null;
    win = false;
    hint = false;
    message = "";
    save();
    modal.close();
    render();
    announce("Wczytano zapis Pana Iksika.");
  } catch (error) {
    announce(error.message);
    let node = modal.querySelector(".import-message");
    if (!node) {
      node = document.createElement("p");
      node.className = "import-message";
      node.setAttribute("role", "status");
      modal.querySelector(".backup").after(node);
    }
    node.textContent = error.message;
  }
  e.target.value = "";
});
document.addEventListener("dragstart", (e) => {
  const t = e.target.closest('.drag-grip[draggable="true"]')?.closest(".term");
  if (!t) return;
  dragged = { type: "move", from: t.dataset.side, id: t.dataset.id };
  e.dataTransfer.setData("text/plain", t.dataset.id);
  e.dataTransfer.effectAllowed = "move";
  document.body.classList.add("dragging");
});
document.addEventListener("dragover", (e) => {
  const target = e.target.closest(".equation-side");
  if (target && dragged && target.dataset.side !== dragged.from) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
});
document.addEventListener("drop", (e) => {
  const target = e.target.closest(".equation-side");
  if (target && dragged && target.dataset.side !== dragged.from) {
    e.preventDefault();
    prepare(dragged);
  }
  dragged = null;
  document.body.classList.remove("dragging");
});
document.addEventListener("dragend", () => {
  dragged = null;
  document.body.classList.remove("dragging");
});
window.addEventListener("pagehide", save);
render();
