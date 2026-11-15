import { label, equation } from "./engine.mjs";
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export function mountMotion(root, plan, onFinish) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0,
    paused = media.matches,
    slow = false,
    timer = null,
    disposed = false;
  const animations = new Set();
  root.className = "equation-motion";
  root.setAttribute("aria-label", "Pokaz zmiany równania krok po kroku");
  root.innerHTML = `<section class="equation-board motion-board"><div class="board-top"><span>OBSERWUJ NASZ RUCH</span><span class="balance-badge">⚖ W równowadze</span></div><div class="motion-stage"></div><div class="motion-shortcut" aria-hidden="true"></div></section><section class="motion-panel"><div class="motion-top"><span class="eyebrow">MAŁY POKAZ · <span class="motion-count"></span></span><span class="motion-running"></span></div><div class="motion-dots" role="group" aria-label="Kroki pokazu">${plan.frames.map((f, i) => `<button data-motion-act="step" data-step="${i}" aria-label="Krok ${i + 1}: ${esc(f.title)}">${i + 1}</button>`).join('<span aria-hidden="true"></span>')}</div><div class="motion-narration" aria-live="polite" aria-atomic="true"><h3></h3><p></p></div><div class="motion-controls"><button class="secondary" data-motion-act="previous" aria-label="Poprzedni krok">←</button><button class="primary" data-motion-act="pause"></button><button class="secondary" data-motion-act="next" aria-label="Następny krok">→</button><button class="text-button motion-speed" data-motion-act="speed" aria-pressed="false">Wolniej</button><button class="text-button motion-finish" data-motion-act="finish">Zakończ pokaz ✓</button></div><p class="motion-tip">Możesz zatrzymać pokaz i wybierać kroki numerami.</p></section>`;
  const find = (s) => root.querySelector(s),
    stage = find(".motion-stage");
  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }
  function cancelAnimations() {
    for (const a of animations) a.cancel();
    animations.clear();
    root.querySelectorAll(".motion-ghost").forEach((n) => n.remove());
  }
  function animate(node, frames, duration) {
    if (media.matches || !node.animate) return;
    const a = node.animate(frames, {
      duration: duration * (slow ? 1.6 : 1),
      easing: "cubic-bezier(.22,.7,.25,1)",
      fill: "none",
    });
    animations.add(a);
    a.finished.then(
      () => {
        animations.delete(a);
        if (node.classList.contains("motion-ghost")) node.remove();
      },
      () => {},
    );
  }
  function schedule() {
    stopTimer();
    if (!paused && !disposed)
      timer = setTimeout(
        () => {
          if (index === plan.frames.length - 1) finish();
          else show(index + 1);
        },
        (index === plan.frames.length - 1 ? 2200 : 2600) * (slow ? 1.6 : 1),
      );
  }
  function controls() {
    find('[data-motion-act="previous"]').disabled = index === 0;
    find('[data-motion-act="next"]').setAttribute(
      "aria-label",
      index === plan.frames.length - 1 ? "Zakończ pokaz" : "Następny krok",
    );
    const pause = find('[data-motion-act="pause"]');
    pause.textContent = paused ? "▶ Odtwórz" : "Ⅱ Pauza";
    pause.setAttribute(
      "aria-label",
      paused ? "Odtwórz pokaz" : "Zatrzymaj pokaz",
    );
    find(".motion-running").textContent = paused
      ? "We własnym tempie"
      : "Iksik pokazuje…";
    find('[data-motion-act="speed"]').setAttribute(
      "aria-pressed",
      String(slow),
    );
    find('[data-motion-act="speed"]').textContent = slow
      ? "✓ Wolniej"
      : "Wolniej";
    root.querySelectorAll('[data-motion-act="step"]').forEach((b, i) => {
      b.setAttribute("aria-current", i === index ? "step" : "false");
      b.classList.toggle("is-done", i < index);
    });
  }
  function sideMarkup(f, side) {
    const terms = f[side]
      .map((t, i) => {
        const cancel = f.cancel?.includes(t.key),
          added = f.added?.includes(t.key),
          focus = f.highlight?.includes(t.key);
        const sign = i ? (t.value < 0 ? "−" : "+") : t.value < 0 ? "−" : "";
        return `<span class="motion-term ${t.kind === "x" ? "motion-x" : "motion-n"} ${cancel ? "motion-cancel" : ""} ${added ? "motion-added" : ""} ${focus ? "motion-selected" : ""} ${f.groups ? (i === 0 ? "motion-chosen" : "motion-other-group") : ""}" data-motion-key="${esc(t.key)}" data-kind="${t.kind}" data-side="${side}"><span class="motion-sign">${sign}</span><b>${label({ ...t, value: Math.abs(t.value) })}</b></span>`;
      })
      .join("");
    return `<div class="motion-side ${f.divisor ? "motion-dividing" : ""}"><span class="side-label">${side === "left" ? "LEWA" : "PRAWA"} STRONA</span><div class="motion-bracket"><div class="motion-terms">${terms || '<span class="zero">0</span>'}</div>${f.divisor ? `<span class="motion-divisor">: ${f.divisor}</span>` : ""}</div><div class="motion-under">${f.zeroSide === side ? '<span class="motion-zero">Razem 0 ✓</span>' : f.operation ? `<span class="motion-same">${esc(f.operation)} po tej stronie</span>` : f.groups ? esc(f.groupLabel) : f.grouping ? "Grupujemy podobne kafelki" : "&nbsp;"}</div></div>`;
  }
  function show(nextIndex) {
    if (disposed) return;
    stopTimer();
    cancelAnimations();
    const bounds = stage.getBoundingClientRect();
    const old = new Map(
      [...stage.querySelectorAll("[data-motion-key]")].map((n) => [
        n.dataset.motionKey,
        {
          node: n.cloneNode(true),
          rect: n.getBoundingClientRect(),
          kind: n.dataset.kind,
          side: n.dataset.side,
        },
      ]),
    );
    const f = plan.frames[nextIndex];
    index = nextIndex;
    stage.innerHTML = `${sideMarkup(f, "left")}<div class="motion-equals" aria-label="równa się">=</div>${sideMarkup(f, "right")}`;
    stage.setAttribute("aria-label", equation(f));
    find(".motion-count").textContent =
      `KROK ${index + 1} Z ${plan.frames.length}`;
    find(".motion-narration h3").textContent = f.title;
    find(".motion-narration p").textContent = f.text;
    find(".motion-shortcut").textContent =
      f.shortcut || "To samo działanie. Ta sama równowaga.";
    controls();
    const fresh = [...stage.querySelectorAll("[data-motion-key]")];
    if (old.size) {
      for (const node of fresh) {
        const rect = node.getBoundingClientRect(),
          prior = old.get(node.dataset.motionKey);
        if (prior) {
          const dx = prior.rect.left - rect.left,
            dy = prior.rect.top - rect.top;
          if (dx || dy)
            animate(
              node,
              f.swap
                ? [
                    { transform: `translate(${dx}px,${dy}px)` },
                    {
                      transform: `translate(${dx / 2}px,${dy / 2 + (prior.side === "left" ? -38 : 38)}px)`,
                      offset: 0.5,
                    },
                    { transform: "translate(0,0)" },
                  ]
                : [
                    { transform: `translate(${dx}px,${dy}px)` },
                    { transform: "translate(0,0)" },
                  ],
              f.swap ? 1100 : 750,
            );
          else if (f.cancel?.includes(node.dataset.motionKey))
            animate(
              node,
              [
                { transform: "scale(1)" },
                { transform: "scale(1.12)", offset: 0.45 },
                { transform: "scale(1)" },
              ],
              850,
            );
          old.delete(node.dataset.motionKey);
        } else {
          const sources = [...old.values()].filter(
            (p) => p.side === node.dataset.side && p.kind === node.dataset.kind,
          );
          const center =
            sources.length && (f.merge || f.groups)
              ? sources.reduce(
                  (s, p) => s + p.rect.left + p.rect.width / 2,
                  0,
                ) / sources.length
              : bounds.left + bounds.width / 2;
          animate(
            node,
            [
              {
                transform: `translate(${center - rect.left - rect.width / 2}px,-16px) scale(.45)`,
                opacity: 0,
              },
              { transform: "translate(0,0) scale(1)", opacity: 1 },
            ],
            900,
          );
        }
      }
      for (const prior of old.values()) {
        const node = prior.node,
          target =
            f.merge &&
            fresh.find(
              (n) =>
                n.dataset.side === prior.side && n.dataset.kind === prior.kind,
            ),
          rect = target?.getBoundingClientRect();
        node.classList.add("motion-ghost");
        node.setAttribute("aria-hidden", "true");
        Object.assign(node.style, {
          position: "absolute",
          left: `${prior.rect.left - bounds.left}px`,
          top: `${prior.rect.top - bounds.top}px`,
          width: `${prior.rect.width}px`,
          height: `${prior.rect.height}px`,
          margin: "0",
        });
        stage.append(node);
        animate(
          node,
          [
            { transform: "translate(0,0) scale(1)", opacity: 0.65 },
            {
              transform: `translate(${rect ? rect.left - prior.rect.left : 0}px,${rect ? rect.top - prior.rect.top : -15}px) scale(.2)`,
              opacity: 0,
            },
          ],
          700,
        );
        // No-animation environments must not retain the temporary ghost.
        if (media.matches || !node.animate) node.remove();
      }
    }
    schedule();
  }
  function finish() {
    if (disposed) return;
    destroy();
    onFinish();
  }
  function click(e) {
    const b = e.target.closest("[data-motion-act]");
    if (!b || b.disabled) return;
    const act = b.dataset.motionAct;
    if (
      act === "finish" ||
      (act === "next" && index === plan.frames.length - 1)
    )
      return finish();
    if (act === "pause") {
      paused = !paused;
      for (const a of animations) paused ? a.pause() : a.play();
      controls();
      schedule();
    }
    if (act === "speed") {
      slow = !slow;
      controls();
      schedule();
    }
    if (["previous", "next", "step"].includes(act)) {
      paused = true;
      show(
        act === "step"
          ? Number(b.dataset.step)
          : index + (act === "next" ? 1 : -1),
      );
    }
  }
  function visibility() {
    if (document.hidden) {
      paused = true;
      for (const a of animations) a.pause();
      controls();
      stopTimer();
    }
  }
  function reduced() {
    if (media.matches) {
      cancelAnimations();
      paused = true;
      controls();
      stopTimer();
    }
  }
  function destroy() {
    if (disposed) return;
    disposed = true;
    stopTimer();
    cancelAnimations();
    root.removeEventListener("click", click);
    document.removeEventListener("visibilitychange", visibility);
    media.removeEventListener("change", reduced);
  }
  root.addEventListener("click", click);
  document.addEventListener("visibilitychange", visibility);
  media.addEventListener("change", reduced);
  show(0);
  return { destroy };
}
