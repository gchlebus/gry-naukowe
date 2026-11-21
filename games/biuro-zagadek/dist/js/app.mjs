import { folders, normalizeAnswer } from "./cases.mjs";
import { drawScene, sceneDescription, sceneSize, scenes } from "./scenes.mjs";
import { analyzeSudoku, findSudokuHint, relatedCells } from "./sudoku.mjs";

const view = document.querySelector("#view");
const duoButton = document.querySelector("#duo");
const storageKey = "biuro-zagadek-progress-v1";
const totalCases = folders.reduce((total, folder) => total + folder.cases.length, 0);
const validCaseIds = new Set(folders.flatMap(folder =>
  folder.cases.map((_, index) => `${folder.id}/${index + 1}`),
));
let saved;
try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
const solved = new Set(Array.isArray(saved?.solved) ? saved.solved.filter(id => validCaseIds.has(id)) : []);
let duo = saved?.duo === true;
let swapped = false;
let updateRoles = () => {};

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ solved: [...solved], duo })); } catch {}
}

duoButton.addEventListener("click", () => {
  duo = !duo;
  duoButton.setAttribute("aria-pressed", String(duo));
  save();
  updateRoles();
});
duoButton.setAttribute("aria-pressed", String(duo));

document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  document.querySelector("#desk").focus();
});

const symbols = { "★": "Gwiazda", "●": "Kółko", "▲": "Trójkąt", "◆": "Romb", "■": "Kwadrat" };
function token(value) {
  const name = symbols[value];
  return name ? `<span aria-hidden="true">${value}</span><span class="sr-only">${name}</span>` : value;
}

function openDesk() {
  view.innerHTML = `
    <section class="hero" aria-labelledby="title">
      <div class="hero-copy">
        <p class="eyebrow">Frania <span>&amp;</span> Fistaszek</p>
        <h1 id="title">Biuro<br> Zagadek<span class="title-period">.</span></h1>
        <p>Wejdźcie do biura dwojga detektywów. Porównajcie rysunki, odczytajcie szyfry i sprawdźcie, dokąd prowadzą poszlaki.</p>
        <a class="button primary" href="#akta">Wybierzcie sprawę</a>
      </div>
      <figure class="cover"><img src="./art/detektywi.webp" width="1240" height="827" alt="Kaczka Frania i Fistaszek z lupą pochylają się nad notatnikiem w biurze detektywów."></figure>
    </section>
    <section class="file-section" id="akta" aria-labelledby="files-title">
      <div class="section-heading">
        <h2 id="files-title" tabindex="-1">Akta spraw</h2>
        <span class="progress"><span aria-hidden="true">✦</span> Rozwiązane <strong>${solved.size} / ${totalCases}</strong></span>
      </div>
      <div class="folder-grid">
        ${folders.map(folder => {
          const count = folder.cases.filter((_, index) => solved.has(`${folder.id}/${index + 1}`)).length;
          return `<a class="folder ${folder.tone}" href="#${folder.id}">
            <span class="folder-icon" aria-hidden="true">${folder.icon}</span>
            <h3>${folder.name}</h3><p>${folder.summary}</p>
            <span class="folder-progress">${count} / ${folder.cases.length} rozwiązane</span>
          </a>`;
        }).join("")}
      </div>
    </section>`;
}

function openFolder(folder) {
  view.innerHTML = `
    <a class="back" href="#akta">Wróć do akt</a>
    <section class="paper folder-detail ${folder.tone}" aria-labelledby="title">
      <span class="folder-icon" aria-hidden="true">${folder.icon}</span>
      <h1 id="title">${folder.name}</h1>
      <p>${folder.summary}</p>
      <ol class="case-list">${folder.cases.map((item, index) => {
        const id = `${folder.id}/${index + 1}`;
        return `<li><a class="case-link" href="#${id}">
          <span><strong>${item.title}</strong><small>${item.level}</small></span>
          <span class="case-indicator">${solved.has(id) ? "✓ Rozwiązana" : "Otwórz"}</span>
        </a></li>`;
      }).join("")}</ol>
    </section>`;
}

function openCase(folder, index) {
  const item = folder.cases[index];
  const id = `${folder.id}/${index + 1}`;
  const nextCase = index + 1 < folder.cases.length ? `#${folder.id}/${index + 2}` : "#akta";
  let finished = false;
  view.innerHTML = `
    <a class="back" href="#${folder.id}">Wróć do „${folder.name}”</a>
    <article class="paper case-detail ${folder.tone}" aria-labelledby="title">
      <div class="case-heading"><p class="eyebrow">${folder.name}</p><span class="level">${item.level}</span></div>
      <h1 id="title">${item.title}</h1>
      <aside class="duo-note" aria-label="Role w trybie we dwoje" hidden>
        <div class="role-lines"></div><button class="button small" type="button">Zamień role</button>
      </aside>
      <div class="activity"></div>
      <div class="case-tools">
        <button class="button small hint-button" type="button">Podpowiedź</button>
      </div>
      <p class="hint" role="status" hidden></p>
      <p class="feedback" role="status"></p>
      <section class="success" tabindex="-1" hidden>
        <h2><span aria-hidden="true">✦</span> Sprawa rozwiązana!</h2>
        <p></p>
        <a class="button primary" href="${nextCase}">${nextCase === "#akta" ? "Wróć do akt" : "Następna sprawa"}</a>
      </section>
    </article>`;

  const roleNote = view.querySelector(".duo-note");
  const roleLines = view.querySelector(".role-lines");
  updateRoles = () => {
    roleNote.hidden = !duo;
    const roleA = Number(swapped);
    roleLines.innerHTML = `<p><b>Detektyw 1.</b> ${folder.roles[roleA]}</p>
      <p><b>Detektyw 2.</b> ${folder.roles[1 - roleA]}</p>`;
  };
  roleNote.querySelector("button").addEventListener("click", () => {
    swapped = !swapped;
    updateRoles();
  });
  updateRoles();

  const activity = view.querySelector(".activity");
  const feedback = view.querySelector(".feedback");
  const hint = view.querySelector(".hint");
  const hintButton = view.querySelector(".hint-button");
  const success = view.querySelector(".success");
  function report(message) {
    if (!finished) feedback.textContent = message;
  }
  function complete(message) {
    if (finished) return;
    finished = true;
    solved.add(id);
    save();
    for (const control of view.querySelectorAll(".activity button, .activity input, .case-tools button")) {
      control.disabled = true;
    }
    feedback.textContent = "";
    hint.hidden = true;
    success.querySelector("p").textContent = message;
    success.hidden = false;
    success.focus();
  }
  const renderers = {
    roznice: renderDifferences,
    zagadki: renderText,
    sudoku: renderSudoku,
    dedukcja: renderDeduction,
    szyfry: renderText,
    sekwencje: renderSequence,
  };
  const getHint = renderers[folder.id](activity, item, report, complete) ?? (() => item.hint);
  hintButton.addEventListener("click", () => {
    hint.hidden = false;
    hint.textContent = getHint();
  });
}

function renderText(area, item, report, complete) {
  const key = item.alphabet ? [...item.alphabet].map((letter, index) =>
    [String(index + 1), letter],
  ) : item.key;
  area.innerHTML = `
    <p class="prompt">${item.prompt}</p>
    ${item.code ? `
      <div class="code" aria-label="Wiadomość">${item.code.trim().split(/\s+/).map(token).join(" ")}</div>
      <details class="code-key" open><summary>Klucz do szyfru</summary>
        <dl>${key.map(([sign, value]) => `<div><dt>${token(sign)}</dt><dd>${value}</dd></div>`).join("")}</dl>
      </details>` : ""}
    <form class="answer-form">
      <label for="answer">${item.code ? "Hasło" : "Twoja odpowiedź"}</label>
      <div><input id="answer" name="answer" type="text" maxlength="80" autocomplete="off" spellcheck="false" required>
      <button class="button primary" type="submit">Sprawdź</button></div>
    </form>`;
  const form = area.querySelector("form");
  const input = form.elements.answer;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const answer = normalizeAnswer(input.value);
    if (item.answers.some(value => normalizeAnswer(value) === answer)) complete(item.explanation);
    else report(answer ? "Jeszcze nie. Spróbujcie innego pomysłu lub zajrzyjcie do podpowiedzi." : "Wpisz odpowiedź.");
  });
}

function renderSequence(area, item, report, complete) {
  area.innerHTML = `<p class="prompt">${item.prompt}</p>
    <ol class="sequence" aria-label="Wzór">${item.sequence.map(value => `<li>${token(value)}</li>`).join("")}<li class="missing">?</li></ol>
    <div class="choices" role="group" aria-label="Możliwe odpowiedzi">${item.options.map(value =>
      `<button class="button" type="button" data-value="${value}">${token(value)}</button>`,
    ).join("")}</div>`;
  area.querySelector(".choices").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.value === item.answer) {
      const missing = area.querySelector(".missing");
      missing.innerHTML = token(item.answer);
      missing.classList.add("found-value");
      complete(item.explanation);
    } else report("Ten element nie pasuje do reguły. Spróbuj jeszcze raz.");
  });
}

function renderDeduction(area, item, report, complete) {
  const marks = item.people.map(() => item.objects.map(() => 0));
  area.innerHTML = `<p class="prompt">${item.prompt}</p>
    <ol class="clues">${item.clues.map(clue => `<li>${clue}</li>`).join("")}</ol>
    <p id="deduction-help" class="helper">Klikaj w pola tabeli, żeby zaznaczyć ✓ (pasuje), × (odpada) lub wrócić do pustego pola.</p>
    <table class="deduction" aria-label="Tabela poszlak" aria-describedby="deduction-help">
      <thead><tr><td></td>${item.objects.map(obj => `<th scope="col">${obj}</th>`).join("")}</tr></thead>
      <tbody>${item.people.map((person, row) => `<tr><th scope="row">${person}</th>${item.objects.map((_, col) =>
        `<td><button type="button" data-row="${row}" data-col="${col}">·</button></td>`,
      ).join("")}</tr>`).join("")}</tbody>
    </table>
    <button class="button primary check" type="button">Sprawdź dopasowanie</button>`;
  function mark(button) {
    const { row, col } = button.dataset;
    const state = marks[row][col];
    button.dataset.mark = state;
    button.textContent = ["·", "✓", "×"][state];
    button.setAttribute("aria-label", `${item.people[row]}, ${item.objects[col]}. ${["Puste", "Pasuje", "Odpada"][state]}`);
  }
  const table = area.querySelector("table");
  table.querySelectorAll("button").forEach(mark);
  table.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const { row, col } = button.dataset;
    marks[row][col] = (marks[row][col] + 1) % 3;
    mark(button);
  });
  area.querySelector(".check").addEventListener("click", () => {
    const picks = marks.map(row => row.flatMap((status, col) => status === 1 ? [col] : []));
    if (picks.some(row => row.length !== 1) || new Set(picks.flat()).size !== item.people.length) {
      report("Zaznacz po jednym ✓ w każdym wierszu i w każdej kolumnie.");
    } else if (picks.every(([col], row) => col === item.solution[row])) {
      complete(item.explanation);
    } else report("Jedno z dopasowań nie zgadza się z poszlakami. Przeczytajcie je jeszcze raz.");
  });
}

function renderDifferences(area, item, report, complete) {
  const scene = scenes[item.scene];
  const [width, height] = sceneSize;
  const target = scene.places.filter(place => place[3]).length;
  const found = new Set();
  area.innerHTML = `<p class="prompt">Znajdź wszystkie różnice. Zaznaczaj je na dowolnym rysunku.</p>
    <p class="diff-count" aria-live="polite"><strong>0 / ${target}</strong> znalezione</p>
    <div class="pictures">${scene.titles.map((title, variant) => `
      <figure><figcaption>${title}</figcaption>
        <div class="scene" data-variant="${variant}">
          <canvas width="${width * 2}" height="${height * 2}" aria-hidden="true"></canvas>
          ${scene.places.map((place, spot) => `
            <button type="button" class="hotspot" data-spot="${spot}" aria-pressed="false" aria-label="${sceneDescription(place, variant)}"
              style="--x:${place[1] / width * 100}%; --y:${place[2] / height * 100}%"><span aria-hidden="true">✓</span></button>
          `).join("")}
        </div>
      </figure>`).join("")}</div>`;
  for (const picture of area.querySelectorAll(".scene")) {
    drawScene(picture.querySelector("canvas"), item.scene, Number(picture.dataset.variant));
    picture.addEventListener("click", event => {
      const button = event.target.closest(".hotspot");
      const spot = button ? Number(button.dataset.spot) : null;
      if (found.has(spot)) {
        report("Ta różnica jest już zaznaczona.");
        return;
      }
      const message = scene.places[spot]?.[3];
      if (!message) {
        report("W tym miejscu rysunki wyglądają tak samo. Szukajcie dalej.");
        return;
      }
      found.add(spot);
      area.querySelector(".diff-count strong").textContent = `${found.size} / ${target}`;
      for (const match of area.querySelectorAll(`[data-spot="${spot}"]`)) {
        match.classList.add("found");
        match.setAttribute("aria-pressed", "true");
      }
      if (found.size === target) complete("Wszystkie różnice zaznaczone na obu rysunkach.");
      else report(message);
    });
  }
  return () => {
    const place = scene.places.find((candidate, index) => candidate[3] && !found.has(index));
    const side = place[1] < width / 3 ? "po lewej" : place[1] > width * 2 / 3 ? "po prawej" : "na środku";
    return `Porównajcie rysunki ${side} ${place[2] < height / 2 ? "u góry" : "u dołu"}.`;
  };
}

function renderSudoku(area, item, report, complete) {
  const size = item.rows.length;
  const [boxRows, boxCols] = item.box;
  const givens = item.rows.join("").split("").map(Number);
  const values = [...givens];
  const peers = values.map((_, index) => relatedCells(index, size, item.box));
  const firstEmpty = values.indexOf(0);
  let selected = firstEmpty;
  let completeGrid = false;
  area.innerHTML = `<p class="prompt">Wstaw liczby od 1 do ${size}. Każda ma się pojawić raz w każdym wierszu, kolumnie i pogrubionym bloku.</p>
    <div class="sudoku" role="group" aria-label="Plansza sudoku ${size} na ${size}" style="--size:${size}">
      ${values.map((value, index) => {
        const row = Math.floor(index / size), col = index % size;
        const classes = [value ? "given" : "", row && row % boxRows === 0 ? "box-top" : "",
          col && col % boxCols === 0 ? "box-left" : ""].join(" ");
        return `<button type="button" class="${classes}" data-cell="${index}" tabindex="${index === selected ? 0 : -1}"></button>`;
      }).join("")}
    </div>
    <div class="digits" role="group" aria-label="Wybierz liczbę">
      ${Array.from({ length: size }, (_, index) => `<button type="button" data-digit="${index + 1}" class="button">${index + 1}</button>`).join("")}
      <button type="button" data-digit="0" class="button">Usuń</button>
    </div>
    <button class="button primary check" type="button">Sprawdź planszę</button>`;
  const grid = area.querySelector(".sudoku");
  const cells = [...grid.querySelectorAll("button")];
  const digits = [...area.querySelectorAll("[data-digit]")];

  function renderGrid() {
    for (const [index, cell] of cells.entries()) {
      const value = values[index];
      const active = selected === index;
      cell.textContent = value || "";
      cell.tabIndex = active ? 0 : -1;
      cell.classList.toggle("related", peers[selected].includes(index));
      cell.setAttribute("aria-pressed", String(active));
      const row = Math.floor(index / size) + 1;
      const col = index % size + 1;
      cell.setAttribute("aria-label", `Wiersz ${row}, kolumna ${col}. ${value || "Puste pole"}${givens[index] ? " (podana liczba)" : ""}`);
    }
    for (const button of digits) button.disabled = Boolean(givens[selected]) || completeGrid;
  }
  function select(index, focus = false) {
    selected = index;
    renderGrid();
    if (focus) cells[index].focus();
  }
  function conflicts() {
    const result = analyzeSudoku(values, peers);
    const conflictSet = new Set(result.conflicts);
    for (const [index, cell] of cells.entries()) {
      cell.classList.toggle("conflict", conflictSet.has(index));
    }
    return result;
  }
  function win() {
    completeGrid = true;
    complete("Wiersze, kolumny i bloki zawierają wszystkie liczby bez powtórek.");
  }
  function enter(digit) {
    if (givens[selected] || completeGrid) return;
    values[selected] = digit;
    renderGrid();
    const result = conflicts();
    if (result.complete) win();
    else report(result.conflicts.length ? "W zaznaczonych polach ta sama liczba występuje więcej niż raz." : "");
  }
  grid.addEventListener("click", event => {
    const cell = event.target.closest("button");
    if (cell) select(Number(cell.dataset.cell));
  });
  grid.addEventListener("keydown", event => {
    const moves = {
      ArrowUp: selected >= size ? selected - size : selected,
      ArrowDown: selected + size < values.length ? selected + size : selected,
      ArrowLeft: selected % size ? selected - 1 : selected,
      ArrowRight: selected % size < size - 1 ? selected + 1 : selected,
    };
    if (Object.hasOwn(moves, event.key)) {
      event.preventDefault();
      select(moves[event.key], true);
    } else if (/^[1-9]$/.test(event.key) && Number(event.key) <= size) {
      event.preventDefault();
      enter(Number(event.key));
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      enter(0);
    }
  });
  area.querySelector(".digits").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (button) enter(Number(button.dataset.digit));
  });
  area.querySelector(".check").addEventListener("click", () => {
    const result = conflicts();
    if (result.complete) win();
    else report(result.conflicts.length ? "W zaznaczonych polach są powtórki. Poprawcie je." : "Wpisane liczby nie powtarzają się. Zostały jeszcze puste pola.");
  });
  renderGrid();

  return () => {
    const result = analyzeSudoku(values, peers);
    if (result.conflicts.length) {
      const cell = result.conflicts.find(index => !givens[index]);
      select(cell);
      return "Popatrzcie na wybrane pole. Ta sama liczba jest też w jego wierszu, kolumnie lub bloku.";
    }
    const { cell, options } = findSudokuHint(values, peers, size);
    select(cell);
    const where = `Wiersz ${Math.floor(cell / size) + 1}, kolumna ${cell % size + 1}.`;
    if (options.length === 0) return `${where} Nic tu nie pasuje. Sprawdźcie wcześniejsze wpisy w tym wierszu, kolumnie i bloku.`;
    if (options.length === 1) return `${where} Tylko ${options[0]} pasuje w tym polu. Sprawdźcie dlaczego.`;
    return `${where} Sprawdźcie kandydatów: ${options.join(", ")}. Czy któraś z tych liczb może trafić tylko do tego pola w jego bloku?`;
  };
}

function goToRoute(focus = true) {
  const route = location.hash.slice(1);
  const [name, step] = route.split("/");
  const folder = folders.find(item => item.id === name);
  updateRoles = () => {};

  if (folder && route === name) openFolder(folder);
  else if (folder && validCaseIds.has(route)) {
    swapped = Number(step) % 2 === 0;
    openCase(folder, Number(step) - 1);
  } else openDesk();

  const target = view.querySelector(route === "akta" ? "#files-title" : "#title");
  target.tabIndex = -1;
  if (focus || route === "akta") {
    if (focus) target.focus({ preventScroll: true });
    if (route === "akta") target.scrollIntoView();
    else window.scrollTo(0, 0);
  }
}

addEventListener("hashchange", () => goToRoute());
goToRoute(false);
