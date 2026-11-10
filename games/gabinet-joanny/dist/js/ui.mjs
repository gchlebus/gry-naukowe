export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const drawings = {
  flask:
    '<path d="M9 3h6m-5 0v7L4 20q8 3 16 0l-6-10V3M7 15h10"/><path d="m10 17 1 1m4 1h0"/>',
  moon: '<path d="M17 3C0 1-1 22 16 22 8 17 8 8 17 3Z"/><path d="m19 7 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>',
  pig: '<path d="M6 7 3 3v8m15-4 3-4v8"/><ellipse cx="12" cy="13" rx="9" ry="8"/><ellipse cx="12" cy="16" rx="4" ry="3"/><circle cx="8" cy="11" r="3"/><circle cx="16" cy="11" r="3"/><path d="M11 11h2m-2 5h0m2 0h0"/>',
  potato:
    '<path d="M9 3C2 4-1 15 6 20c7 7 19-3 15-11-2-6-7-8-12-6Z"/><path d="m7 8 1-1m6 0 1 1m3 5-1 1m-9 1 1 1m4 3 1-1"/>',
  arrow: '<path d="M3 12h17m-6-6 6 6-6 6"/>',
  back: '<path d="M21 12H4m6-6-6 6 6 6"/>',
  bookmark: '<path d="M6 3h12v19l-6-5-6 5Z"/>',
  check: '<path d="m4 12 5 5L21 4"/>',
  close: '<path d="m5 5 14 14M5 19 19 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v7l4 2"/>',
  hint: '<path d="M8 17c0-5-5-5-3-11 3-8 16-3 14 4-1 3-3 3-3 7ZM8 20h8m-6 3h4"/>',
  notes: '<path d="M5 2h14v20H5ZM8 7h8m-8 5h8m-8 5h5"/>',
  shuffle:
    '<path d="M3 5h3l12 14h3m-3-3 3 3-3 3M3 19h3l4-5m4-4 4-5h3m-3-3 3 3-3 3"/>',
  key: '<circle cx="7" cy="9" r="5"/><path d="m11 13 10 9m-4-4 3-3m-6 0 2-2"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  triangle: '<path d="m12 3 10 18H2Z"/>',
  circle: '<circle cx="12" cy="12" r="8"/>',
  gold: '<rect x="3" y="3" width="18" height="18" rx="3" fill="#b99b59" stroke="#b99b59"/>',
  silver:
    '<rect x="3" y="3" width="18" height="18" rx="3" fill="#b7c1c8" stroke="#b7c1c8"/>',
  redseal:
    '<circle cx="12" cy="10" r="7" fill="#b16868" stroke="#b16868"/><path d="m8 16-2 6 6-3 6 3-2-6"/>',
  blueseal:
    '<circle cx="12" cy="10" r="7" fill="#698aab" stroke="#698aab"/><path d="m8 16-2 6 6-3 6 3-2-6"/>',
  pearl:
    '<circle cx="12" cy="12" r="8" fill="#f0e7d8"/><path d="M8 7q2-2 4-1"/>',
  stone: '<path d="m5 4 11-1 7 10-7 8-12-1-3-10Z" fill="#9fa6a1"/>',
  pause: '<path d="M8 5v14m8-14v14"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  download: '<path d="M12 2v14m-5-5 5 5 5-5M3 16v6h18v-6"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2 8M3 4v7h7"/>',
  focus: '<path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5"/>',
  seal: '<path d="m12 2 3 3 4 1 1 4 2 3-3 3-1 4-4 1-3 2-3-3-4-1-1-4-2-3 3-3 1-4 4-1Z"/><path d="m7 12 3 3 7-7"/>',
};
export function icon(name, size = 20) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawings[name] ?? drawings.seal}</svg>`;
}
export function dots(bits, large = false) {
  return `<svg class="dot-pattern ${large ? "large" : ""}" viewBox="0 0 72 72" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<circle cx="${16 + (i % 3) * 20}" cy="${16 + Math.floor(i / 3) * 20}" r="${(bits >> i) & 1 ? 6 : 2}" class="${(bits >> i) & 1 ? "full-dot" : "empty-dot"}"/>`).join("")}</svg>`;
}
export function timeLabel(ms) {
  const t = Math.floor(ms / 1000);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
export function level(n) {
  return ["Rozgrzewka", "Wymagające", "Mistrzowskie"][n - 1];
}
export function levelDots(n) {
  return `<span class="level-dots" aria-hidden="true">${[1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
}
