"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Mail,
  Music2,
  Pause,
  Play,
  RotateCcw,
  ArrowRight,
  Star,
  Check,
  Heart,
  Volume2,
  BookOpen,
  X,
  Download,
  Upload,
  Keyboard,
  Sparkles,
  Timer,
  Target,
  Flag,
} from "lucide-react";
import {
  LESSONS,
  FINGERS,
  ROWS,
  keyGuide,
  newRun,
  stroke,
  backspace,
  pause,
  resume,
  metrics,
  freshProgress,
  parseProgress,
  finish,
  recommended,
  targetTempo,
  STORAGE_KEY,
  type Finger,
  type Run,
  type Progress,
} from "../lib/typing";
const TRACKS = [
  { title: "Listy przez łąkę", file: "/audio/laka.mp3" },
  { title: "Gwiezdne listy", file: "/audio/gwiazdy.mp3" },
];
function Pony({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 120" className={className} aria-hidden="true">
      <path d="M47 68Q1 27 7 86q16-22 38-7" fill="#a99ac6" />
      <path
        d="m52 76-6 32 12 0 12-28m24-4 7 32 12 0-4-36"
        stroke="#dba9be"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse cx="77" cy="70" rx="37" ry="25" fill="#e4b6c9" />
      <path
        d="M88 66Q75 36 93 19l14-7 17 8 13 22q10 20-16 22l-13 13"
        fill="#e4b6c9"
      />
      <path
        d="M94 34Q70 33 81 12q12-12 31-1 11-5 18 7-22-8-25 25"
        fill="#a99ac6"
      />
      <path d="m111 17 2-15 12 16" fill="#e4b6c9" />
      <circle cx="120" cy="35" r="4" fill="#695469" />
      <circle cx="121" cy="34" r="1" fill="white" />
      <path d="M127 51q6 2 10-2" fill="none" stroke="#b9809e" strokeWidth="2" />
      <rect x="58" y="48" width="31" height="31" rx="5" fill="#c39c75" />
      <rect x="61" y="50" width="27" height="20" rx="2" fill="#fff8e9" />
      <path d="m62 52 12 9 12-9" stroke="#c8a7b5" fill="none" />
    </svg>
  );
}
function Meadow({ ratio }: { ratio: number }) {
  return (
    <div
      className="meadow"
      aria-label={`Kucyk pokonał ${Math.round(ratio * 100)} procent trasy`}
    >
      <svg
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="1000" height="220" fill="#f2f1eb" />
        <circle cx="824" cy="48" r="25" fill="#efd5a4" />
        <path d="M0 135Q180 55 390 135T790 120T1080 140V230H0" fill="#dfe5d1" />
        <path d="M0 179Q210 110 470 166T1010 150V230H0" fill="#ccd7bd" />
        <path
          d="M-10 227Q470 102 1010 218"
          stroke="#eee2c9"
          strokeWidth="29"
          fill="none"
        />
        {[50, 230, 390, 580, 770].map((x, i) => (
          <g key={x} transform={`translate(${x},${i % 2 ? 164 : 183})`}>
            <path d="M0 13v-18m-5 8 5 4 6-5" stroke="#99ab87" strokeWidth="2" />
            <circle cy="-8" r="6" fill={i % 2 ? "#e2b8c9" : "#f4e7c9"} />
            <circle cy="-8" r="2" fill="#c7a25c" />
          </g>
        ))}
        <g transform="translate(915,80)">
          <rect x="22" y="55" width="8" height="71" rx="3" fill="#b9a28c" />
          <path d="M0 25Q0 0 25 0h12q24 0 24 25v40H0Z" fill="#c392a8" />
          <path d="M9 25q0-16 17-16t17 16v32H9Z" fill="#e5bccd" />
          <rect x="13" y="24" width="27" height="5" rx="2" fill="#ab7992" />
          <path d="M49 14V-7h13v15H49" fill="#bb8c9b" />
        </g>
      </svg>
      <Pony className="running-pony" />
      <div className="pony-track" style={{ left: `${4 + ratio * 76}%` }}>
        <Pony />
      </div>
      <span className="route-start">Twoja poczta</span>
      <span className="route-end">Skrzynka przyjaciółki</span>
    </div>
  );
}
function Hands({ finger }: { finger: Finger }) {
  return (
    <div className="hands" aria-label={`Teraz: ${FINGERS[finger].name}`}>
      {["l", "r"].map((side) => (
        <svg key={side} viewBox="0 0 230 140" aria-hidden="true">
          <path
            d="M43 130V87Q33 55 45 56l17 19V48Q62 35 74 35h78q13 0 13 16v41l-8 38"
            fill="#f2e7de"
            stroke="#dfd0c7"
            strokeWidth="1.5"
          />
          {(side === "l"
            ? ["lp", "lr", "lm", "li"]
            : ["ri", "rm", "rr", "rp"]
          ).map((f, i) => {
            const x = side === "l" ? 62 + i * 27 : 62 + i * 27;
            return (
              <g key={f}>
                <rect
                  x={x}
                  y={[37, 15, 8, 25][side === "l" ? i : 3 - i]}
                  width="24"
                  height={82 - [37, 15, 8, 25][side === "l" ? i : 3 - i]}
                  rx="12"
                  fill={FINGERS[f as Finger].color}
                  opacity={finger === f ? 1 : 0.32}
                  stroke={finger === f ? "#69556f" : "none"}
                  strokeWidth="2"
                />
                <text
                  x={x + 12}
                  y="69"
                  textAnchor="middle"
                  fill="#665766"
                  fontSize="12"
                  fontFamily="sans-serif"
                >
                  {FINGERS[f as Finger].home}
                </text>
              </g>
            );
          })}
          <path
            d={
              side === "l"
                ? "M63 103 34 80q-10-9-15 1-3 7 6 19l24 28"
                : "M160 103 188 80q10-9 15 1 3 7-6 19l-24 28"
            }
            fill={FINGERS.thumb.color}
            opacity={finger === "thumb" ? 1 : 0.3}
          />
          <text x="115" y="125" textAnchor="middle" fill="#a18b94" fontSize="9">
            {side === "l" ? "LEWA DŁOŃ" : "PRAWA DŁOŃ"}
          </text>
        </svg>
      ))}
    </div>
  );
}
function KeyboardGuide({ char }: { char: string }) {
  const g = keyGuide(char || "f");
  return (
    <div className="keyboard-guide">
      <div className="finger-message">
        <span
          className="finger-dot"
          style={{ background: FINGERS[g.finger].color }}
        />
        <b>
          {char === " "
            ? "Spacja — kciuk"
            : `${FINGERS[g.finger].name} → ${g.base.toUpperCase()}`}
        </b>
        {g.alt && <span>+ prawy Alt / Option</span>}
        {g.shift && (
          <span>+ {g.shiftSide === "left" ? "lewy" : "prawy"} Shift</span>
        )}
      </div>
      <div className="keyboard" aria-label="Mapa klawiatury QWERTY">
        {ROWS.map((row, i) => (
          <div className={`key-row row-${i}`} key={row}>
            {[...row].map((k) => {
              const f = keyGuide(k).finger;
              return (
                <span
                  key={k}
                  className={`key ${g.base === k ? "next-key" : ""} ${k === "f" || k === "j" ? "home-key" : ""}`}
                  style={
                    { "--key-color": FINGERS[f].color } as React.CSSProperties
                  }
                >
                  {k.toUpperCase()}
                  <i />
                </span>
              );
            })}
          </div>
        ))}
        <div className="key-row modifiers">
          <span
            className={`modifier ${g.shift && g.shiftSide === "left" ? "lit" : ""}`}
          >
            Shift
          </span>
          <span className={`space-key ${char === " " ? "lit" : ""}`}>
            Spacja · kciuk
          </span>
          <span className={`modifier ${g.alt ? "lit" : ""}`}>Alt / ⌥</span>
          <span
            className={`modifier ${g.shift && g.shiftSide === "right" ? "lit" : ""}`}
          >
            Shift
          </span>
        </div>
      </div>
      <Hands finger={g.finger} />
      <p className="home-note">
        Domki palców: <b>A S D F</b> i <b>J K L ;</b>. Po każdym ruchu wróć do
        domku.
      </p>
    </div>
  );
}
function download(p: Progress) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "kucykowa-poczta-postepy.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export default function Home() {
  const [p, setP] = useState<Progress>(freshProgress),
    [loaded, setLoaded] = useState(false),
    [lesson, setLesson] = useState(0),
    [run, setRun] = useState<Run>(() => newRun(LESSONS[0].texts[0])),
    [now, setNow] = useState(0),
    [goal, setGoal] = useState(6),
    [message, setMessage] = useState(""),
    [modal, setModal] = useState<"help" | "parent" | null>(null),
    [track, setTrack] = useState(0),
    [playing, setPlaying] = useState(false),
    [volume, setVolume] = useState(0.22),
    [wrong, setWrong] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    audio = useRef<HTMLAudioElement>(null),
    file = useRef<HTMLInputElement>(null),
    live = useRef(run),
    completed = useRef(false),
    composition = useRef(false),
    lastComposition = useRef("");
  live.current = run;
  useEffect(() => {
    let saved = freshProgress();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = parseProgress(raw);
    } catch {
      setMessage("Nie udało się odczytać zapisu. Możesz nadal ćwiczyć.");
    }
    setP(saved);
    setLesson(saved.lesson);
    setGoal(targetTempo(saved, LESSONS[saved.lesson].id));
    setRun(newRun(LESSONS[saved.lesson].texts[0]));
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      } catch {
        setMessage(
          "Pamięć przeglądarki jest niedostępna. Zapisz kopię w panelu rodzica.",
        );
      }
  }, [p, loaded]);
  useEffect(() => {
    const timer = setInterval(() => setNow(performance.now()), 200);
    const hidden = () => {
      if (document.hidden) {
        setRun((r) => pause(r, performance.now()));
        audio.current?.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, []);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (!modal) return;
    const prior = document.activeElement as HTMLElement | null;
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".modal button,.modal a[href]",
          ),
        );
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      prior?.focus();
    };
  }, [modal]);
  function startLesson(i: number, progress = p) {
    const l = LESSONS[i],
      variants = l.texts.filter((t) => t !== live.current.text),
      text =
        variants[Math.floor(Math.random() * variants.length)] ?? l.texts[0];
    completed.current = false;
    setLesson(i);
    setP({ ...progress, lesson: i });
    const r = newRun(text);
    live.current = r;
    setRun(r);
    setGoal(targetTempo(progress, l.id));
    setMessage("");
    setWrong(false);
    input.current?.focus();
  }
  function accept(char: string) {
    const r = live.current;
    if (r.status === "paused" || r.status === "done") return;
    const t = performance.now(),
      next = stroke(r, char, t);
    if (next === r) return;
    live.current = next;
    setRun(next);
    setNow(t);
    setWrong(next.errors > r.errors);
    setMessage(
      next.errors > r.errors
        ? "Jeszcze raz spokojnie. Wpisz podświetlony znak."
        : "",
    );
    if (next.status === "done" && !completed.current) {
      completed.current = true;
      setP((v) => finish(v, next, LESSONS[lesson].id, goal));
    }
  }
  function keydown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || composition.current) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setRun((r) => pause(r, performance.now()));
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      const r = backspace(live.current);
      live.current = r;
      setRun(r);
      setWrong(false);
      return;
    }
    if (e.metaKey || (e.ctrlKey && !e.altKey)) return;
    if (e.key.length === 1) {
      e.preventDefault();
      lastComposition.current = "";
      if (!e.repeat) accept(e.key);
    }
  }
  async function toggleMusic() {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else
      try {
        audio.current.volume = volume;
        await audio.current.play();
        setPlaying(true);
      } catch {
        setMessage(
          "Nie udało się włączyć muzyki. Spróbuj nacisnąć nutkę ponownie.",
        );
      }
  }
  function pickTrack(i: number) {
    setTrack(i);
    setPlaying(false);
  }
  async function restore(f?: File) {
    if (!f) return;
    try {
      if (f.size > 50000) throw Error();
      const saved = parseProgress(await f.text());
      setModal(null);
      startLesson(saved.lesson, saved);
      setMessage("Postępy wczytane. Listy czekają!");
    } catch {
      setModal(null);
      setMessage("Wybierz kopię postępów z Kucykowej Poczty.");
    }
    if (file.current) file.current.value = "";
  }
  const l = LESSONS[lesson],
    m = metrics(run, now),
    done = run.status === "done",
    nextIndex = recommended(p, lesson),
    record = p.records[l.id],
    stars = done
      ? 1 +
        (m.accuracy >= 95 ? 1 : 0) +
        (m.accuracy >= 95 && m.wpm >= goal ? 1 : 0)
      : 0;
  return (
    <div className="app">
      <audio
        ref={audio}
        src={TRACKS[track].file}
        preload="none"
        onEnded={() => {
          setTrack((i) => (i + 1) % TRACKS.length);
          setPlaying(false);
          setMessage(
            "Utwór się skończył. Kliknij nutkę, aby posłuchać kolejnego.",
          );
        }}
        onError={() => {
          setPlaying(false);
          setMessage("Muzyka jest chwilowo niedostępna. Listy nadal czekają.");
        }}
      />
      <header>
        <a className="brand" href="/">
          <span className="logo">
            <Mail size={25} />
          </span>
          <span>
            Kucykowa Poczta<small>MAŁE PALCE, WIELKIE LISTY</small>
          </span>
        </a>
        <nav>
          <button
            onClick={() => {
              setRun((r) => pause(r, performance.now()));
              setModal("help");
            }}
          >
            <BookOpen size={16} />
            Jak ułożyć palce?
          </button>
          <button
            onClick={() => {
              setRun((r) => pause(r, performance.now()));
              setModal("parent");
            }}
          >
            <Heart size={16} />
            Dla rodzica
          </button>
        </nav>
        <button
          className={`music-toggle ${playing ? "playing" : ""}`}
          onClick={() => void toggleMusic()}
          aria-label={playing ? "Wyłącz muzykę" : "Włącz muzykę"}
        >
          <Music2 size={19} />
          <span>{playing ? "Muzyka gra" : "Włącz muzykę"}</span>
        </button>
      </header>
      <div className="page">
        <section className="intro">
          <div>
            <p className="eyebrow">
              <span />
              SZKOŁA MAŁYCH LISTONOSZEK
            </p>
            <h1>
              Każda literka to <em>krok do przyjaźni.</em>
            </h1>
            <p>Pisz uważnie. Złap swój rytm. Dostarcz list razem z Figą.</p>
          </div>
          <div className="delivered">
            <Mail size={23} />
            <b>{p.delivered}</b>
            <span>dostarczonych listów</span>
          </div>
        </section>
        <div className="lesson-select">
          <label htmlFor="lesson">Dzisiejsza trasa</label>
          <select
            id="lesson"
            value={lesson}
            onChange={(e) => startLesson(Number(e.target.value))}
          >
            {LESSONS.map((l, i) => (
              <option value={i} key={l.id}>
                {i + 1}. {l.name} {(p.records[l.id]?.stars ?? 0) > 0 ? "★" : ""}
              </option>
            ))}
          </select>
          <span className="lesson-keys">{l.keys}</span>
          <span className="lesson-position">
            TRASA {lesson + 1} / {LESSONS.length}
          </span>
        </div>
        <div className="game-layout">
          <main>
            <section className="route-card">
              <div className="route-heading">
                <span>
                  <Flag size={15} />
                  {l.place}
                </span>
                <span>
                  {run.index} / {run.text.length} znaków
                </span>
              </div>
              <Meadow ratio={run.index / run.text.length} />
              <div className="route-progress">
                <span
                  style={{ width: `${(run.index / run.text.length) * 100}%` }}
                />
              </div>
            </section>
            <section className={`letter-card ${wrong ? "has-error" : ""}`}>
              <div className="letter-top">
                <span>
                  <Mail size={16} />
                  LIST DO PRZYJACIÓŁKI
                </span>
                <span>
                  {done
                    ? "DOSTARCZONY"
                    : run.status === "paused"
                      ? "PRZERWA"
                      : "PRZEPISZ DOKŁADNIE"}
                </span>
              </div>
              <div
                className="practice-text"
                aria-label={`Tekst do przepisania: ${run.text}`}
              >
                {[...run.text].map((c, i) => (
                  <span
                    key={i}
                    className={
                      i < run.index ? "typed" : i === run.index ? "current" : ""
                    }
                  >
                    {c === " " ? (i === run.index ? "␣" : " ") : c}
                  </span>
                ))}
              </div>
              {done ? (
                <div className="result" role="status">
                  <div className="result-stars">
                    {[1, 2, 3].map((n) => (
                      <Star
                        size={25}
                        key={n}
                        fill={n <= stars ? "currentColor" : "none"}
                        className={n <= stars ? "earned" : ""}
                      />
                    ))}
                  </div>
                  <h2>List dotarł. Dobra robota!</h2>
                  <p>
                    {m.accuracy >= 95
                      ? m.wpm >= goal
                        ? "Dokładnie i w dobrym rytmie. Figa dziękuje!"
                        : "Piękna dokładność! Następnym razem poszukamy równie spokojnego, płynnego rytmu."
                      : "Brawo za ukończenie! Powtórz trasę wolniej i skup się na podświetlonych literkach."}
                  </p>
                  <div className="result-numbers">
                    <span>
                      <b>{(m.ms / 1000).toFixed(1)} s</b>czas
                    </span>
                    <span>
                      <b>{m.accuracy.toFixed(1)}%</b>dokładność
                    </span>
                    <span>
                      <b>{Math.round(m.wpm)}</b>słów / min
                    </span>
                  </div>
                  <button
                    className="primary"
                    onClick={() => startLesson(nextIndex)}
                  >
                    {nextIndex > lesson
                      ? "Następna trasa"
                      : "Jeszcze jeden list"}
                    <ArrowRight size={17} />
                  </button>
                  <small>
                    {nextIndex > lesson
                      ? "Dwa dokładne listy — czas poznać kolejne klawisze."
                      : "Dwa listy z dokładnością co najmniej 95% otwierają propozycję kolejnej trasy."}
                  </small>
                </div>
              ) : (
                <>
                  <label className="input-label" htmlFor="typing">
                    Kliknij tutaj i pisz na klawiaturze
                  </label>
                  <input
                    id="typing"
                    ref={input}
                    className="typing-input"
                    aria-label="Pole do pisania"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder={
                      run.status === "paused"
                        ? "Przerwa — naciśnij Wznów"
                        : "Wpisuj po jednym podświetlonym znaku…"
                    }
                    disabled={!loaded || run.status === "paused"}
                    onKeyDown={keydown}
                    onPaste={(e) => {
                      e.preventDefault();
                      setMessage("List piszemy samodzielnie, po jednym znaku.");
                    }}
                    onDrop={(e) => e.preventDefault()}
                    onCompositionStart={() => {
                      composition.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      composition.current = false;
                      lastComposition.current = e.data;
                      accept(e.data);
                      e.currentTarget.value = "";
                    }}
                    onChange={(e) => {
                      if (composition.current) return;
                      const value = e.target.value;
                      e.target.value = "";
                      if (value && value !== lastComposition.current)
                        accept(value);
                      lastComposition.current = "";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.value = "";
                      document
                        .querySelector(".finger-card")
                        ?.scrollIntoView({ block: "end" });
                    }}
                    onBlur={(e) => {
                      if (
                        e.relatedTarget instanceof HTMLElement &&
                        e.relatedTarget.closest(".practice-actions")
                      )
                        return;
                      setRun((r) => pause(r, performance.now()));
                    }}
                  />
                  <div className="practice-actions">
                    <span>
                      {run.status === "ready"
                        ? "Czas ruszy z pierwszą literą."
                        : run.status === "paused"
                          ? "Zegar odpoczywa razem z Tobą."
                          : "Podświetlony znak czeka na Ciebie."}
                    </span>
                    {run.status === "paused" ? (
                      <button
                        onClick={() => {
                          const r = resume(live.current, performance.now());
                          live.current = r;
                          setRun(r);
                          setTimeout(() => input.current?.focus(), 0);
                        }}
                      >
                        <Play size={15} />
                        Wznów
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setRun((r) => pause(r, performance.now()))
                        }
                        disabled={run.status === "ready"}
                      >
                        <Pause size={15} />
                        Przerwa
                      </button>
                    )}
                    <button
                      aria-label="Zacznij trasę od nowa"
                      onClick={() => startLesson(lesson)}
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </>
              )}
              <div className={`feedback ${wrong ? "error" : ""}`} role="status">
                {message ||
                  (!done
                    ? "Równe, spokojne kroki są lepsze niż wyścig z pomyłkami."
                    : "Możesz odpocząć i rozluźnić dłonie.")}
              </div>
            </section>
            {!done && (
              <section className="finger-card">
                <div className="card-heading">
                  <Keyboard size={18} />
                  <h2>Palce znają drogę</h2>
                  <button
                    onClick={() => {
                      setRun((r) => pause(r, performance.now()));
                      setModal("help");
                    }}
                  >
                    Pokaż ułożenie <ArrowRight size={13} />
                  </button>
                </div>
                <KeyboardGuide char={run.text[run.index]} />
                <p className="lesson-tip">{l.tip}</p>
              </section>
            )}
          </main>
          <aside>
            <section className="stats-card">
              <p className="eyebrow">TWÓJ SPOKOJNY GALOP</p>
              <div className="metric">
                <span>
                  <Timer size={17} />
                  Czas
                </span>
                <b>
                  {(m.ms / 1000).toFixed(1)}
                  <small> s</small>
                </b>
              </div>
              <div className="metric">
                <span>
                  <Target size={17} />
                  Dokładność
                </span>
                <b>
                  {m.accuracy.toFixed(0)}
                  <small>%</small>
                </b>
              </div>
              <div className="metric">
                <span>
                  <Sparkles size={17} />
                  Tempo
                </span>
                <b>
                  {Math.round(m.wpm)}
                  <small> słów/min</small>
                </b>
              </div>
              <p className="stats-foot">
                1 słowo = 5 znaków, także spacji.
                <br />
                Przerwy nie wliczają się do czasu.
              </p>
            </section>
            <section className="goal-card">
              <div>
                <Star size={19} />
                <h2>Trzy małe sukcesy</h2>
              </div>
              <p>
                <Check size={14} />
                Dostarcz cały list
              </p>
              <p>
                <Target size={14} />
                Napisz co najmniej 95% dokładnie
              </p>
              <p>
                <Sparkles size={14} />
                Przy 95% dokładności złap {goal} słów/min
              </p>
              <small>
                Tempo dobieramy do Twojego rekordu na tej trasie. Najpierw
                dokładność, potem płynność.
              </small>
              {record && (
                <div className="personal-best">
                  Twój dokładny rekord{" "}
                  <b>{Math.round(record.bestWpm)} słów/min</b>
                </div>
              )}
            </section>
            <section className="playlist">
              <div>
                <Music2 size={17} />
                <h2>Melodie w podróży</h2>
              </div>
              {TRACKS.map((song, i) => (
                <button
                  key={song.file}
                  className={track === i ? "selected-song" : ""}
                  aria-pressed={track === i}
                  onClick={() => pickTrack(i)}
                >
                  <span>0{i + 1}</span>
                  <span>
                    {song.title}
                    <small>
                      {i ? "Fortepian pod gwiazdami" : "Marimba na łące"}
                    </small>
                  </span>
                  {track === i && <Check size={14} />}
                </button>
              ))}
              <label>
                <Volume2 size={15} />
                Głośność
                <input
                  aria-label="Głośność muzyki"
                  type="range"
                  min="0"
                  max="60"
                  value={volume * 100}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                />
              </label>
              <small>Dwa motywy z Suno. Kliknij nutkę, aby słuchać.</small>
            </section>
            <div className="kind-note">
              <Heart size={19} />
              <p>
                Figa kibicuje Twoim palcom.
                <br />
                Nie musisz być najszybsza.
              </p>
            </div>
          </aside>
        </div>
        <footer>
          <span>
            <span />
            Postępy zostają w tej przeglądarce.
          </span>
          <span>Klawiatura QWERTY · polski programisty / Polski Pro</span>
        </footer>
      </div>
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="close"
              aria-label="Zamknij"
              onClick={() => setModal(null)}
            >
              <X size={23} />
            </button>
            <span className="modal-icon">
              {modal === "help" ? <Keyboard size={28} /> : <Heart size={28} />}
            </span>
            <p className="eyebrow">KUCYKOWA POCZTA</p>
            <h2 id="modal-title">
              {modal === "help"
                ? "Każdy palec ma swój domek."
                : "Małe ćwiczenia, duża radość."}
            </h2>
            {modal === "help" ? (
              <>
                <p>
                  Połóż lewe palce na <b>A S D F</b>, prawe na <b>J K L ;</b>.
                  Wskazujące leżą na wypustkach F i J, a kciuki nad spacją.
                </p>
                <Hands finger="li" />
                <div className="finger-legend">
                  {Object.entries(FINGERS).map(([id, f]) => (
                    <span key={id}>
                      <i style={{ background: f.color }} />
                      {f.name}: <b>{f.home}</b>
                    </span>
                  ))}
                </div>
                <ol>
                  <li>
                    Usiądź wygodnie i rozluźnij barki. Nie dociskaj dłoni do
                    krawędzi biurka.
                  </li>
                  <li>
                    Naciśnij klawisz palcem w tym samym kolorze. Potem wróć do
                    domku.
                  </li>
                  <li>
                    Duże litery: Shift małym palcem przeciwnej dłoni. Polskie
                    znaki: prawy Alt (na Macu Option w układzie Polski Pro) i
                    litera; <b>ź to X</b>.
                  </li>
                  <li>
                    Pomyłka zatrzymuje kucyka na tej samej literce. Wpisz
                    poprawny znak. Backspace cofa o jeden wpisany znak.
                  </li>
                  <li>
                    Zrób przerwę, gdy dłonie są zmęczone. Rodzic może sprawdzić
                    ułożenie palców — gra nie widzi, którego używasz.
                  </li>
                </ol>
                <button className="primary" onClick={() => setModal(null)}>
                  Palce gotowe! <Check size={17} />
                </button>
              </>
            ) : (
              <>
                <p>
                  Najlepiej ćwiczyć na fizycznej klawiaturze, po kilka minut.
                  Najpierw dokładność i ułożenie palców, dopiero potem tempo.
                  Pomiar czasu nie jest odliczaniem: list może czekać.
                </p>
                <div className="parent-box">
                  Po dwóch listach z dokładnością ≥95% gra proponuje kolejne
                  klawisze. Każdą trasę można też wybrać ręcznie. Nagroda za
                  tempo wymaga ≥95% dokładności; cel to około 5% ponad własnym
                  dokładnym rekordem, od 6 do 45 słów/min.
                </div>
                <h3>Co mierzymy?</h3>
                <p>
                  Czas od pierwszego znaku do ostatniego, bez przerw; tempo to
                  liczba przepisanych znaków podzielona przez 5 i czas w
                  minutach. Dokładność to poprawne naciśnięcia / wszystkie
                  naciśnięcia znaków. Pomyłki pozostają w statystyce również po
                  poprawieniu. Klawisze funkcyjne i przytrzymanie litery nie
                  dodają punktów. Wklejanie jest wyłączone.
                </p>
                <p>
                  Zmiana karty, wyjście z pola lub otwarcie pomocy zatrzymuje
                  zegar. Po powrocie wybierz „Wznów”. Rozpoczęta trasa nie
                  zapisuje się po odświeżeniu.
                </p>
                <div className="backup">
                  <button onClick={() => download(p)}>
                    <Download size={16} />
                    Zapisz postępy
                  </button>
                  <button onClick={() => file.current?.click()}>
                    <Upload size={16} />
                    Wczytaj kopię
                  </button>
                  <input
                    hidden
                    ref={file}
                    type="file"
                    accept="application/json,.json"
                    onChange={(e) => void restore(e.target.files?.[0])}
                  />
                </div>
                <p>
                  Wyniki są lokalne, bez imienia dziecka i wysyłania tekstu na
                  serwer. Różne urządzenia/adresy mają osobne zapisy. Import
                  zastępuje zapis wybraną kopią.
                </p>
                <h3>
                  Ukończone trasy: {Object.keys(p.records).length} /{" "}
                  {LESSONS.length}
                </h3>
                <p>
                  Podpowiedzi opierają się na klasycznym układzie QWERTY i
                  domkach palców opisanych w{" "}
                  <a
                    href="https://typingclub.typingclub.com/m/edclubdocs/media/pdf/typing-jungle-handbook.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    podręczniku TypingClub
                  </a>
                  . Gra nie potrafi rozpoznać, którym palcem został naciśnięty
                  klawisz.
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
