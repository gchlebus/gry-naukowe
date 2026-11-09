"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import CubeView from "../components/cube-view";
import SolverWorker from "../lib/solver.worker?worker";
import { Music, chime } from "../components/music";
import { FaceGrid, Net } from "../components/net";
import {
  COLORS,
  FACES,
  FACE_NAMES,
  FACE_TOP,
  DEFAULT_CENTERS,
  SOLVED,
  STORAGE_KEY,
  apply,
  blankNet,
  colored,
  freshSaved,
  inverse,
  moveText,
  netToState,
  parseSaved,
  type Centers,
  type Color,
  type Face,
  type Saved,
} from "../lib/cube";
import { STAGES, type StagePlan } from "../lib/solver";
import { confirmStage } from "../lib/progress";

type Mode = "home" | "capture" | "guide" | "lesson";
const ORDER: Face[] = ["F", "R", "B", "L", "U", "D"];
const FLOWERS = ["✿", "❀", "✾", "❁", "✽", "❃", "❋", "☀"];
const EXAMPLE = "R U F2 L' D B U2 R' F D2";

function Dot({ color }: { color: Color }) {
  return (
    <span
      className="color-dot"
      style={{ background: COLORS[color].hex }}
      aria-label={COLORS[color].name}
    >
      {COLORS[color].label}
    </span>
  );
}
function Holding({ centers }: { centers: Centers }) {
  return (
    <div className="holding">
      <span>
        <Dot color="y" /> góra
      </span>
      <span>
        <Dot color="w" /> dół
      </span>
      <span>
        <Dot color={centers.F} /> przód
      </span>
      <small>Trzymaj kostkę tak samo przez cały etap.</small>
    </div>
  );
}
function Anne({ children }: { children: React.ReactNode }) {
  return (
    <aside className="anne-note">
      <img
        src="/art/avonlea.png"
        alt="Rudowłosa Ania na ganku Zielonego Wzgórza"
      />
      <div>
        <span className="eyebrow">Ania podpowiada</span>
        <p>{children}</p>
      </div>
    </aside>
  );
}

export default function Page() {
  const [saved, setSaved] = useState<Saved>(freshSaved),
    [ready, setReady] = useState(false),
    [mode, setMode] = useState<Mode>("home");
  const [plans, setPlans] = useState<StagePlan[]>([]),
    [loading, setLoading] = useState(false),
    [loadStage, setLoadStage] = useState(0),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  const [draftCenters, setDraftCenters] = useState<Centers>({
      ...DEFAULT_CENTERS,
    }),
    [net, setNet] = useState<string[]>(() => blankNet(DEFAULT_CENTERS)),
    [face, setFace] = useState<Face>("F"),
    [paint, setPaint] = useState<Color>("w"),
    [history, setHistory] = useState<string[][]>([]),
    [example, setExample] = useState(false);
  const [animation, setAnimation] = useState<string | null>(null),
    [after, setAfter] = useState(false),
    [nonce, setNonce] = useState(0),
    [view, setView] = useState<Face>("F"),
    [undo, setUndo] = useState(false),
    [recover, setRecover] = useState(false);
  const [help, setHelp] = useState(false),
    [notice, setNotice] = useState(""),
    [celebrate, setCelebrate] = useState(""),
    [effects, setEffects] = useState(true),
    [lessonMove, setLessonMove] = useState("R");
  const fileRef = useRef<HTMLInputElement>(null),
    checkpointLock = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = parseSaved(raw);
        setSaved(s);
        setDraftCenters(s.centers);
        setNet(s.net);
        if (s.started) setMode("guide");
      }
    } catch {
      setNotice(
        "Nie udało się odczytać zapisu. Możesz rozpocząć nową przygodę.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        setNotice(
          "Przeglądarka nie pozwala zapisać postępów. Pobierz kopię w „Dla rodzica”.",
        );
      }
  }, [saved, ready]);
  useEffect(() => {
    if (!ready || !saved.started) return;
    setPlans([]);
    setLoading(true);
    setError("");
    let worker: Worker;
    try {
      worker = new SolverWorker();
    } catch {
      setLoading(false);
      setError(
        "Ta przeglądarka nie może uruchomić podpowiedzi. Otwórz grę w nowszej przeglądarce.",
      );
      return;
    }
    const finish = () => {
      clearTimeout(timeout);
      worker.terminate();
    };
    const timeout = setTimeout(() => {
      worker.terminate();
      setLoading(false);
      setError("Obliczanie trwa zbyt długo. Spróbuj ponownie.");
    }, 30000);
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === "progress") setLoadStage(m.stage);
      if (m.type === "done") {
        setPlans(m.plans);
        setSaved((s) => ({
          ...s,
          step: Math.min(s.step, m.plans[s.stage].moves.length),
        }));
        setLoading(false);
        finish();
      }
      if (m.type === "error") {
        setError(m.message);
        setLoading(false);
        finish();
      }
    };
    worker.onerror = () => {
      setError("Nie udało się uruchomić podpowiedzi. Spróbuj ponownie.");
      setLoading(false);
      finish();
    };
    worker.postMessage({ state: saved.state });
    return finish;
  }, [ready, saved.started, saved.state, retry]);
  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(""), 3800);
    return () => clearTimeout(t);
  }, [celebrate]);
  useEffect(() => {
    setAfter(false);
    setAnimation(null);
    setUndo(false);
    checkpointLock.current = false;
  }, [saved.stage, saved.step, mode, lessonMove]);
  const plan = plans[saved.stage],
    step = Math.min(saved.step, plan?.moves.length ?? 0),
    move = mode === "lesson" ? lessonMove : plan?.moves[step];
  const current = useMemo(
    () =>
      mode === "lesson"
        ? SOLVED
        : plan
          ? apply(plan.start, plan.moves.slice(0, step).join(" "))
          : SOLVED,
    [mode, plan, step],
  );
  const next = move ? apply(current, move) : current,
    details = move ? moveText(move, saved.centers) : null,
    finished = saved.confirmed.includes(7),
    allSolved = saved.state === SOLVED;
  const counts = Object.fromEntries(
    Object.keys(COLORS).map((c) => [c, net.filter((x) => x === c).length]),
  );
  function preview() {
    if (!move || animation) return;
    setAfter(false);
    setAnimation(move);
    setView(move[0] as Face);
    setNonce((n) => n + 1);
  }
  function resetPreview() {
    setAnimation(null);
    setAfter(false);
    setUndo(false);
    setRecover(false);
  }
  function capture(clear = false) {
    resetPreview();
    setError("");
    setDraftCenters(saved.centers);
    setNet(clear ? blankNet(saved.centers) : saved.net);
    setFace("F");
    setHistory([]);
    setExample(false);
    setMode("capture");
  }
  function setCenters(f: Face, c: Color) {
    const centers = { ...draftCenters, [f]: c };
    setDraftCenters(centers);
    setNet(blankNet(centers));
    setHistory([]);
    setExample(false);
    setError("");
  }
  function paintCell(i: number) {
    const idx = FACES.indexOf(face) * 9 + i;
    if (i === 4) return;
    setHistory((h) => [...h.slice(-99), net]);
    setNet((n) => n.map((v, j) => (j === idx ? paint : v)));
    setExample(false);
    setError("");
  }
  function exampleNet() {
    setDraftCenters({ ...DEFAULT_CENTERS });
    setNet(colored(apply(SOLVED, EXAMPLE), DEFAULT_CENTERS));
    setHistory([]);
    setExample(true);
    setError("");
  }
  function start() {
    const result = netToState(net, draftCenters);
    if (!result.state) {
      setError(result.error!);
      return;
    }
    setSaved((s) => ({
      ...s,
      state: result.state!,
      net: [...net],
      centers: { ...draftCenters },
      stage: result.state === SOLVED ? 7 : 0,
      step: 0,
      confirmed: [],
      started: true,
      example,
    }));
    setPlans([]);
    setRetry((n) => n + 1);
    resetPreview();
    setMode("guide");
    setError("");
  }
  function checkpoint() {
    if (checkpointLock.current) return;
    checkpointLock.current = true;
    const final = saved.stage === 7 || allSolved;
    const s = allSolved ? { ...saved, stage: 7 } : saved;
    if (!s.confirmed.includes(s.stage)) {
      setSaved(confirmStage(s));
      if (effects) chime(final);
      setCelebrate(
        final
          ? "Cała kostka ułożona! Brawo za cierpliwość!"
          : `${FLOWERS[s.stage]} Rozkwitł kolejny kwiat! Etap ${s.stage + 1} gotowy.`,
      );
    }
  }
  function exportSave() {
    const blob = new Blob([JSON.stringify(saved, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "moja-kostka-zielone-wzgorze.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importSave(file?: File) {
    if (!file) return;
    try {
      if (file.size > 30000) throw Error();
      const s = parseSaved(await file.text());
      setSaved(s);
      setNet(s.net);
      setDraftCenters(s.centers);
      setRetry((n) => n + 1);
      resetPreview();
      setMode(s.started ? "guide" : "home");
      setHelp(false);
      setNotice(
        "Wczytano zapis. Ustaw prawdziwą kostkę tak jak przed przerwą.",
      );
    } catch {
      setNotice("Ten plik nie jest poprawnym zapisem tej gry.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }
  const cube = (
    <CubeView
      state={after ? next : current}
      centers={saved.centers}
      view={view}
      animation={animation}
      nonce={nonce}
      onEnd={() => {
        setAnimation(null);
        setAfter(true);
      }}
    />
  );
  return (
    <div className="app-shell">
      <header className="site-header">
        <button
          className="brand"
          onClick={() => {
            resetPreview();
            setMode("home");
          }}
          aria-label="Strona główna"
        >
          <span className="brand-mark">❀</span>
          <span>
            Zielone Wzgórze<small>MAŁE RUCHY. WIELKIE ODKRYCIA.</small>
          </span>
        </button>
        <nav aria-label="Menu">
          <button
            className={mode === "lesson" ? "selected" : ""}
            onClick={() => {
              resetPreview();
              setMode("lesson");
            }}
          >
            Poznaj ruchy
          </button>
          <button onClick={() => setHelp(true)}>
            Dla rodzica <span aria-hidden>↗</span>
          </button>
        </nav>
      </header>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button aria-label="Zamknij wiadomość" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {mode === "home" && (
        <>
          <section className="hero">
            <img
              className="hero-art"
              src="/art/avonlea.png"
              alt="Ania w słomkowym kapeluszu na ganku, kwitnący sad i krajobraz Avonlea"
            />
            <div className="hero-shade" />
            <div className="hero-copy">
              <span className="eyebrow">
                <i /> PRZYGODA Z PRAWDZIWĄ KOSTKĄ 3×3
              </span>
              <h1>
                Kostka z<br />
                <em>Zielonego Wzgórza</em>
              </h1>
              <p>
                W ogrodzie Ani każde odkrycie zaczyna się od małego kroku. Twoja
                kostka też — od jednego obrotu.
              </p>
              <button
                className="primary"
                disabled={!ready}
                onClick={() => (saved.started ? setMode("guide") : capture())}
              >
                {saved.started
                  ? "Wróć do mojej przygody"
                  : "Ułóżmy moją kostkę"}{" "}
                <span>→</span>
              </button>
              <span className="hero-foot">
                Twoja kostka w dłoniach. Ania u Twojego boku.
              </span>
            </div>
            <span className="postcard">
              Pozdrowienia
              <br />
              <em>z Avonlea ♡</em>
            </span>
          </section>
          <section className="welcome-grid">
            <div>
              <span className="eyebrow">JEDEN OBRÓT NA RAZ</span>
              <h2>
                Własne tempo.
                <br />
                Prawdziwa satysfakcja.
              </h2>
              <p>
                Przepisz kolory swojej kostki. Pokażę Ci ruch, Ty wykonasz go w
                dłoniach. Po każdym etapie sprawdzimy wspólnie, co już umiesz.
              </p>
              <button
                className="text-button"
                onClick={() => {
                  resetPreview();
                  setMode("lesson");
                }}
              >
                Pierwszy raz? Poznaj ścianki i ruchy <span>↗</span>
              </button>
            </div>
            <div className="steps-preview">
              {[
                {
                  n: "01",
                  title: "Przygotuj kostkę",
                  text: "Żółty środek na górze, biały na dole.",
                },
                {
                  n: "02",
                  title: "Pokaż mi jej kolory",
                  text: "Sześć ścianek, bez aparatu i pośpiechu.",
                },
                {
                  n: "03",
                  title: "Zobacz, obróć, odkryj",
                  text: "Animowane podpowiedzi i osiem małych sukcesów.",
                },
              ].map((x) => (
                <div key={x.n}>
                  <b>{x.n}</b>
                  <span>
                    <h3>{x.title}</h3>
                    <p>{x.text}</p>
                  </span>
                  <span className="little-flower">❀</span>
                </div>
              ))}
            </div>
          </section>
          <div className="garden-line">
            <span>✿</span> W naszym ogrodzie cierpliwość też pięknie rośnie.{" "}
            <span>✿</span>
          </div>
        </>
      )}
      {mode === "capture" && (
        <main className="capture-page">
          <div className="page-heading">
            <div>
              <span className="eyebrow">ZACZYNAMY OD TWOJEJ KOSTKI</span>
              <h1>Pokaż Ani kolory</h1>
              <p>
                Poproś rodzica o pomoc przy pierwszym przepisywaniu. Kostki
                jeszcze nie mieszamy ani nie obracamy jej warstw.
              </p>
            </div>
            <button
              className="secondary"
              onClick={() => setMode(saved.started ? "guide" : "home")}
            >
              Wróć
            </button>
          </div>
          <details
            className="center-settings"
            open={new Set(Object.values(draftCenters)).size !== 6}
          >
            <summary>
              1. Ustaw kostkę i sprawdź kolory środków <span>⌄</span>
            </summary>
            <p>
              Żółty środek trzymaj u góry, biały na dole. Wybierz jeden bok jako
              przód. Patrząc na przód, sprawdź środek po prawej, z tyłu i po
              lewej. Zmiana środka czyści przepisywane pola.
            </p>
            <div className="center-choices">
              {FACES.map((f) => (
                <label key={f}>
                  <b>
                    {FACE_NAMES[f]} {f}
                  </b>
                  <select
                    aria-label={`Kolor środka: ${FACE_NAMES[f]}`}
                    disabled={f === "U" || f === "D"}
                    value={draftCenters[f]}
                    onChange={(e) => setCenters(f, e.target.value as Color)}
                  >
                    {Object.entries(COLORS).map(([c, v]) => (
                      <option key={c} value={c}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </details>
          <div className="capture-grid">
            <section className="card painter">
              <div className="card-title">
                <span className="eyebrow">2. PRZEPISZ KAŻDE POLE</span>
                <span>{net.filter(Boolean).length} / 54 pól</span>
              </div>
              <div className="face-tabs">
                {ORDER.map((f) => (
                  <button
                    key={f}
                    aria-pressed={face === f}
                    onClick={() => setFace(f)}
                    className={face === f ? "active" : ""}
                  >
                    <Dot color={draftCenters[f]} />
                    {FACE_NAMES[f]}{" "}
                    {net
                      .slice(FACES.indexOf(f) * 9, FACES.indexOf(f) * 9 + 9)
                      .every(Boolean)
                      ? "✓"
                      : ""}
                  </button>
                ))}
              </div>
              <h2>
                {FACE_NAMES[face]} <span className="muted">{face}</span>
              </h2>
              <p className="orientation-tip">
                Patrz prosto na tę ściankę. Jej <strong>górna krawędź</strong>{" "}
                ma dotykać ścianki: <Dot color={draftCenters[FACE_TOP[face]]} />
                <strong>{FACE_NAMES[FACE_TOP[face]].toLowerCase()}.</strong>
              </p>
              <div className="painting-board">
                <div className="top-neighbor">
                  ↑ {COLORS[draftCenters[FACE_TOP[face]]].name} środek za górną
                  krawędzią
                </div>
                <FaceGrid
                  face={face}
                  large
                  cells={net.slice(
                    FACES.indexOf(face) * 9,
                    FACES.indexOf(face) * 9 + 9,
                  )}
                  onPaint={paintCell}
                />
              </div>
              <p className="small center">
                Najpierw wybierz kolor, potem kliknij pole. Środek jest stały.
              </p>
              <div className="palette" aria-label="Wybierz kolor">
                {Object.entries(COLORS).map(([c, v]) => (
                  <button
                    key={c}
                    className={paint === c ? "active" : ""}
                    aria-pressed={paint === c}
                    aria-label={`Maluj: ${v.name}`}
                    onClick={() => setPaint(c as Color)}
                  >
                    <Dot color={c as Color} />
                    <span>
                      {v.name}
                      <small className={counts[c] > 9 ? "over-count" : ""}>
                        {counts[c]} / 9
                      </small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="button-row">
                <button
                  className="secondary"
                  disabled={!history.length}
                  onClick={() => {
                    setNet(history.at(-1)!);
                    setHistory((h) => h.slice(0, -1));
                  }}
                >
                  Cofnij kolor
                </button>
                <button
                  className="secondary"
                  onClick={() => {
                    setHistory((h) => [...h, net]);
                    setNet((n) =>
                      n.map((v, i) =>
                        Math.floor(i / 9) === FACES.indexOf(face) && i % 9 !== 4
                          ? ""
                          : v,
                      ),
                    );
                  }}
                >
                  Wyczyść tę ściankę
                </button>
                <button
                  className="primary"
                  disabled={
                    !net
                      .slice(
                        FACES.indexOf(face) * 9,
                        FACES.indexOf(face) * 9 + 9,
                      )
                      .every(Boolean)
                  }
                  onClick={() => setFace(ORDER[(ORDER.indexOf(face) + 1) % 6])}
                >
                  Następna ścianka →
                </button>
              </div>
            </section>
            <aside className="capture-side">
              <Anne>
                Środki to drogowskazy: nie zmieniają swoich miejsc. Biały kolor
                ma literkę B, a niebieski N. Możemy czytać kolory także po
                literkach!
              </Anne>
              <section className="card">
                <span className="eyebrow">TWOJA KOSTKA NA PAPIERZE</span>
                <Net
                  net={net}
                  centers={draftCenters}
                  active={face}
                  select={setFace}
                />
                <p className="small">
                  Litery U, R, F, D, L, B nazywają ścianki, a nie kolory.
                  Kliknij nazwę, aby ją poprawić.
                </p>
              </section>
              <section className="card ready-card">
                <h3>Wszystko przepisane?</h3>
                <p>
                  Sprawdzę kolory i przygotuję ruchy dokładnie do tego układu.
                </p>
                {example && (
                  <p className="example-label">
                    To przykładowa kostka na ekranie. Nie przedstawia Twojej
                    prawdziwej kostki.
                  </p>
                )}
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
                <button className="primary full" onClick={start}>
                  Sprawdź i rozpocznij →
                </button>
                <button className="text-button" onClick={exampleNet}>
                  Wypróbuj wirtualny przykład
                </button>
              </section>
            </aside>
          </div>
        </main>
      )}
      {(mode === "guide" || mode === "lesson") && (
        <main className="guide-page">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {mode === "lesson" ? "MAŁA SZKOŁA RUCHÓW" : "TWÓJ OGRÓD ODKRYĆ"}
              </span>
              <h1>
                {mode === "lesson"
                  ? "Poznaj swoją kostkę"
                  : finished
                    ? "Udało się. Cała kostka!"
                    : allSolved
                      ? "Twoja kostka już jest ułożona!"
                      : STAGES[saved.stage].title}
              </h1>
              <p>
                {mode === "lesson"
                  ? "Najpierw popatrz, potem spróbuj w dłoniach. Tu możesz ćwiczyć bez zapisywania przygody."
                  : finished
                    ? "Każdy mały obrót pomógł dotrzeć tutaj. To Twoja cierpliwość i Twoje odkrycie."
                    : `Etap ${saved.stage + 1} z 8 · ${STAGES[saved.stage].goal}`}
              </p>
            </div>
            <button
              className="secondary"
              onClick={() =>
                mode === "lesson"
                  ? setMode(saved.started ? "guide" : "home")
                  : capture(true)
              }
            >
              {mode === "lesson" ? "Wróć do przygody" : "Wpisz nowy układ"}
            </button>
          </div>
          {mode === "guide" && saved.example && (
            <div className="example-label demo-banner">
              Ćwiczysz na wirtualnym przykładzie. Aby ułożyć prawdziwą kostkę,
              wybierz „Wpisz nowy układ” i przepisz jej kolory.
            </div>
          )}
          <div className="guide-grid">
            <aside className="journey">
              <h2>Nasza ścieżka</h2>
              <ol>
                {STAGES.map((s, i) => (
                  <li
                    key={s.short}
                    className={
                      (saved.confirmed.includes(i) ? "complete " : "") +
                      (mode === "guide" && saved.stage === i ? "current" : "")
                    }
                  >
                    <span className="stage-flower">
                      {saved.confirmed.includes(i)
                        ? FLOWERS[i]
                        : String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{s.short}</strong>
                      <small>
                        {saved.confirmed.includes(i)
                          ? "Już potrafię!"
                          : i === saved.stage && mode === "guide"
                            ? "Tutaj jesteśmy"
                            : "Mały krok do celu"}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="pause-note">
                ☕
                <p>
                  Możesz zrobić przerwę.
                  <br />
                  Postęp zapisuje się tutaj automatycznie. Odłóż kostkę bez
                  mieszania.
                </p>
              </div>
            </aside>
            <section className="card cube-card">
              <div className="card-title">
                <span className="eyebrow">
                  {mode === "lesson"
                    ? "POKAZ NA UŁOŻONEJ KOSTCE"
                    : "KOSTKA NA EKRANIE"}
                </span>
                <span>
                  {animation
                    ? "Oglądamy ruch…"
                    : after
                      ? "Widok po ruchu"
                      : "Widok przed ruchem"}
                </span>
              </div>
              <Holding centers={saved.centers} />
              {cube}
              <div className="view-picker" aria-label="Obejrzyj ściankę">
                {FACES.map((f) => (
                  <button
                    key={f}
                    disabled={!!animation}
                    onClick={() => setView(f)}
                    aria-pressed={view === f}
                    title={`Obejrzyj: ${FACE_NAMES[f]}`}
                  >
                    <Dot color={saved.centers[f]} />
                    {f}
                  </button>
                ))}
              </div>
              <p className="small center">
                Przeciągnij kostkę na ekranie, aby ją obejrzeć. To zmienia tylko
                widok.
              </p>
              <details className="net-compare">
                <summary>
                  Porównaj kolory {after ? "po ruchu" : "przed ruchem"}
                </summary>
                <Net state={after ? next : current} centers={saved.centers} />
              </details>
              {mode === "guide" && loading ? (
                <div className="loading" role="status">
                  <span>❀</span> Ania szuka ścieżki… etap {loadStage + 1}/8
                </div>
              ) : mode === "guide" && error ? (
                <div role="alert" className="error">
                  {error}
                  <button
                    className="secondary"
                    onClick={() => setRetry((n) => n + 1)}
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              ) : mode === "guide" && finished ? (
                <div className="win-card">
                  <span className="win-flower">❀</span>
                  <h2>Ogród rozkwitł!</h2>
                  <p>
                    Ukończone przygody: <strong>{saved.wins}</strong>
                  </p>
                  <button className="primary" onClick={() => capture(true)}>
                    Nowa przygoda →
                  </button>
                </div>
              ) : mode === "guide" &&
                (allSolved || (plan && step === plan.moves.length)) ? (
                <div className="checkpoint">
                  <span className="eyebrow">ZATRZYMAJMY SIĘ I SPRAWDŹMY</span>
                  <h2>
                    {allSolved
                      ? "Sześć jednokolorowych ścianek?"
                      : plan?.moves.length
                        ? "Popatrz, ile już umiesz!"
                        : "Ten etap już masz gotowy!"}
                  </h2>
                  <p>
                    {allSolved
                      ? "Porównaj wszystkie ścianki swojej kostki z siatką poniżej."
                      : STAGES[saved.stage].goal}
                  </p>
                  <Net
                    state={plan?.end ?? saved.state}
                    centers={saved.centers}
                  />
                  <p className="small">
                    Gra nie widzi prawdziwej kostki. To Ty sprawdzasz, czy
                    wygląda tak samo.
                  </p>
                  <div className="button-row">
                    <button className="primary" onClick={checkpoint}>
                      {allSolved || saved.stage === 7
                        ? "Tak, kostka ułożona!"
                        : "Tak, etap gotowy!"}{" "}
                      ✿
                    </button>
                    <button
                      className="secondary"
                      onClick={() => setRecover(true)}
                    >
                      Wygląda inaczej
                    </button>
                  </div>
                </div>
              ) : (
                details && (
                  <div className="move-panel">
                    <div className="move-heading">
                      <span className="move-symbol">{move}</span>
                      <div>
                        <span className="eyebrow">
                          {mode === "lesson"
                            ? "JEDNA LITERA, JEDNA ŚCIANKA"
                            : `RUCH ${step + 1} Z ${plan?.moves.length ?? 0} W TYM ETAPIE`}
                        </span>
                        <h2>
                          {details.name} ścianka{" "}
                          <Dot color={saved.centers[details.face]} />
                        </h2>
                      </div>
                      <span className="turn-symbol" aria-hidden>
                        {details.turn === 2
                          ? "½"
                          : details.turn === -1
                            ? "↶"
                            : "↷"}
                      </span>
                    </div>
                    <p className="move-direction">
                      {details.turn === 2
                        ? "Obróć tę ściankę o pół obrotu (180°)."
                        : `Ćwierć obrotu (90°) ${details.direction}.`}
                    </p>
                    <p className="clock-tip">
                      <strong>Patrz prosto na obracaną ściankę</strong> — jak na
                      tarczę zegara. Obracaj tylko jej warstwę, nie całą kostkę.
                    </p>
                    <div className="button-row">
                      <button
                        className="secondary preview"
                        disabled={!!animation}
                        onClick={preview}
                      >
                        ▷ {after ? "Pokaż jeszcze raz" : "Zobacz ruch"}
                      </button>
                      {mode === "guide" && (
                        <button
                          className="primary"
                          disabled={!!animation}
                          onClick={() => {
                            setSaved((s) => ({ ...s, step: s.step + 1 }));
                            resetPreview();
                          }}
                        >
                          Zrobiłam ruch ✓
                        </button>
                      )}
                    </div>
                    {mode === "guide" && (
                      <div className="guide-actions">
                        <button
                          disabled={step === 0 || !!animation}
                          onClick={() => setUndo(true)}
                        >
                          ↶ Cofnij ostatni ruch
                        </button>
                        <button onClick={() => setRecover(true)}>
                          Moja kostka wygląda inaczej
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
              {mode === "lesson" && (
                <div className="lesson-selector">
                  <span className="eyebrow">WYBIERZ RUCH DO OBEJRZENIA</span>
                  <div>
                    {FACES.map((f) => (
                      <button
                        className={lessonMove[0] === f ? "active" : ""}
                        key={f}
                        onClick={() => {
                          setLessonMove(f + lessonMove.slice(1));
                          setView(f);
                        }}
                        disabled={!!animation}
                      >
                        {f} · {FACE_NAMES[f]}
                      </button>
                    ))}
                  </div>
                  <div>
                    {[
                      { v: "", t: "Zgodnie z zegarem" },
                      { v: "'", t: "Apostrof: odwrotnie" },
                      { v: "2", t: "Dwójka: pół obrotu" },
                    ].map((x) => (
                      <button
                        className={lessonMove.slice(1) === x.v ? "active" : ""}
                        key={x.v}
                        disabled={!!animation}
                        onClick={() => setLessonMove(lessonMove[0] + x.v)}
                      >
                        {x.t}
                      </button>
                    ))}
                  </div>
                  <p>
                    Każdy pokaz zaczyna się od ułożonej kostki. Ruch{" "}
                    <b>{lessonMove}</b> cofniesz ruchem{" "}
                    <b>{inverse(lessonMove)}</b>. Na prawdziwej kostce wykonaj
                    ruch i jego odwrotność, zanim wybierzesz następny.
                  </p>
                </div>
              )}
            </section>
            <aside className="guide-side">
              <Anne>
                {mode === "lesson"
                  ? "Środek mówi nam, jaki kolor ma dom na tej ściance. Krawędź ma dwa pola, a narożnik trzy. Apostrof przy literze oznacza ruch w przeciwną stronę."
                  : finished
                    ? "Ułożona kostka jest piękna. Ale jeszcze piękniejsze jest to, że próbowałaś, sprawdzałaś i nie poddawałaś się."
                    : STAGES[saved.stage].why}
              </Anne>
              <section className="card garden-card">
                <span className="eyebrow">TWÓJ OGRÓD CIERPLIWOŚCI</span>
                <div className="flower-bed">
                  {FLOWERS.map((f, i) => (
                    <span
                      key={i}
                      className={saved.confirmed.includes(i) ? "bloomed" : ""}
                      title={STAGES[i].short}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p>
                  Każdy sprawdzony etap to nowy kwiat. Nie ścigamy się z czasem.
                </p>
              </section>
              {mode === "guide" && plan && step < plan.moves.length && (
                <details className="card sequence">
                  <summary>Ścieżka tego etapu</summary>
                  <p>
                    To kolejne ruchy do powtórzenia. Gotowe części kostki mogą
                    się chwilowo zmieniać — sprawdzamy je po całym etapie.
                  </p>
                  <div>
                    {plan.moves.map((m, i) => (
                      <span
                        className={i === step ? "now" : i < step ? "past" : ""}
                        key={i}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </aside>
          </div>
        </main>
      )}
      <footer>
        <div>
          <span>❀</span> Kostka z Zielonego Wzgórza{" "}
          <small>Małe odkrycia, razem.</small>
        </div>
        <Music
          volume={saved.volume}
          setVolume={(volume) => setSaved((s) => ({ ...s, volume }))}
        />
        <label className="effects">
          <input
            type="checkbox"
            checked={effects}
            onChange={(e) => setEffects(e.target.checked)}
          />{" "}
          Dźwięki sukcesu
        </label>
      </footer>
      {celebrate && (
        <div className="celebration" role="status">
          <div className="celebration-label">{celebrate}</div>
          {Array.from({ length: 32 }, (_, i) => (
            <span
              aria-hidden
              key={i}
              style={
                {
                  "--x": `${(i * 37) % 100}%`,
                  "--delay": `${(i % 7) * 0.08}s`,
                  "--r": `${i * 27}deg`,
                } as CSSProperties
              }
            >
              {["✿", "❀", "✦", "♡"][i % 4]}
            </span>
          ))}
        </div>
      )}
      {undo && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="undo-title"
          >
            <span className="eyebrow">COFAMY RUCH W DŁONIACH</span>
            <h2 id="undo-title">Najpierw cofnij prawdziwą kostkę</h2>
            <p>
              Ostatnio wykonałaś <b>{plan?.moves[step - 1]}</b>. Teraz wykonaj
              jego odwrotność:{" "}
              <strong className="inline-move">
                {inverse(plan?.moves[step - 1] ?? "")}
              </strong>
              .
            </p>
            <p>
              {
                moveText(inverse(plan?.moves[step - 1] ?? "R"), saved.centers)
                  .direction
              }
              . Patrz prosto na tę samą ściankę. Dopiero potem cofnij wskazówkę.
            </p>
            <div className="button-row">
              <button
                className="primary"
                onClick={() => {
                  setSaved((s) => ({ ...s, step: Math.max(0, s.step - 1) }));
                  resetPreview();
                }}
              >
                Cofnęłam ruch na kostce
              </button>
              <button className="secondary" onClick={() => setUndo(false)}>
                Anuluj
              </button>
            </div>
          </section>
        </div>
      )}
      {recover && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recover-title"
          >
            <h2 id="recover-title">Spokojnie, odnajdziemy drogę.</h2>
            <p>
              Najpierw sprawdź trzymanie: żółty środek u góry, biały na dole,{" "}
              <b>{COLORS[saved.centers.F].name}</b> z przodu. Jeśli pomyliłaś
              ostatni obrót, możesz go cofnąć.
            </p>
            <p>
              Gdy nie wiesz, gdzie uciekł kolor, przepisz aktualny układ swojej
              kostki. Ania obliczy nową ścieżkę.
            </p>
            <div className="button-row">
              <button className="primary" onClick={() => capture(true)}>
                Przepisz aktualną kostkę
              </button>
              <button className="secondary" onClick={() => setRecover(false)}>
                Wróć do wskazówki
              </button>
            </div>
          </section>
        </div>
      )}
      {help && (
        <div className="modal-backdrop">
          <section
            className="modal parent-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="parent-title"
          >
            <button
              className="close-modal"
              aria-label="Zamknij informacje dla rodzica"
              onClick={() => setHelp(false)}
            >
              ×
            </button>
            <span className="eyebrow">WSPÓLNE ODKRYWANIE</span>
            <h2 id="parent-title">Kilka słów dla rodzica</h2>
            <p>
              Gra prowadzi przez układanie prawdziwej kostki <b>3×3</b>, z
              białym i żółtym kolorem naprzeciw siebie. Na początek pomóż
              przepisać jej sześć ścianek. Kolorowe środki ustalają orientację;
              pozostałe pola przepisujemy patrząc prosto na każdą ściankę, ze
              wskazanym sąsiadem u góry.
            </p>
            <p>
              To nauka warstwami: stokrotka, biały krzyż i narożniki, środkowa
              warstwa, żółty krzyż i góra, miejsca narożników i krawędzi. Gra
              dobiera ruchy do wpisanego układu. Nie szuka rekordowo krótkiego
              rozwiązania. Warto robić przerwy po etapach i rozmawiać o tym, co
              się zmieniło.
            </p>
            <p>
              <b>Potwierdzenie dziecka to sprawdzenie prawdziwej kostki.</b> Nie
              korzystamy z aparatu ani czujników. Przycisk „Zobacz ruch” tylko
              odtwarza animację; „Zrobiłam ruch” zapisuje wykonany obrót. Po
              przerwie nie mieszajcie kostki.
            </p>
            <p>
              Postęp zostaje w tej przeglądarce. Przed czyszczeniem danych
              pobierz kopię. Zapis nie zmienia ustawienia fizycznej kostki.
            </p>
            <div className="button-row">
              <button className="secondary" onClick={exportSave}>
                Pobierz zapis
              </button>
              <button
                className="secondary"
                onClick={() => fileRef.current?.click()}
              >
                Wczytaj zapis
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => void importSave(e.target.files?.[0])}
              />
            </div>
            <p className="small">
              Własna ilustracja i oryginalna muzyka w klimacie Ani i Avonlea. To
              niezależna gra edukacyjna, bez fragmentów serialu. Inspiracja
              metodą warstw:{" "}
              <a
                href="https://rubiks.com/solve-guide"
                target="_blank"
                rel="noreferrer"
              >
                poradnik Rubik’s
              </a>
              . Model kostki:{" "}
              <a
                href="https://github.com/ldez/cubejs"
                target="_blank"
                rel="noreferrer"
              >
                cubejs
              </a>{" "}
              (MIT).
            </p>
            <button className="primary" onClick={() => setHelp(false)}>
              Wracamy do zabawy →
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
