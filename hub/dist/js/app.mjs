const cards = [...document.querySelectorAll(".game-card")],
  filters = [...document.querySelectorAll("[data-filter]")],
  counter = document.querySelector("#result-count");
function filter(id) {
  if (!filters.some((b) => b.dataset.filter === id)) id = "all";
  for (const b of filters)
    b.setAttribute("aria-pressed", String(b.dataset.filter === id));
  let count = 0;
  for (const card of cards) {
    card.hidden = id !== "all" && card.dataset.category !== id;
    if (!card.hidden) count++;
  }
  counter.textContent = `Wybrane gry: ${count} / ${cards.length}`;
  const url = new URL(location.href);
  if (id === "all") url.searchParams.delete("kategoria");
  else url.searchParams.set("kategoria", id);
  history.replaceState(null, "", url);
}
for (const button of filters)
  button.addEventListener("click", () => filter(button.dataset.filter));
filter(new URL(location.href).searchParams.get("kategoria") || "all");
const links = [...document.querySelectorAll("a[data-game]")],
  key = "gry-naukowe-ostatnia-gra-v1";
try {
  const id = localStorage.getItem(key),
    link = links.find((l) => l.dataset.game === id);
  if (link) {
    const last = document.querySelector("#last-game");
    last.href = link.href;
    last.textContent = `Ostatnio otwierana: ${link.querySelector("h3").textContent} →`;
    last.hidden = false;
  }
} catch {}
for (const link of links)
  link.addEventListener("click", () => {
    try {
      localStorage.setItem(key, link.dataset.game);
    } catch {}
  });
