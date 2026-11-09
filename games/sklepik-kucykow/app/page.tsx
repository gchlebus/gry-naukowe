"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Volume2,
  VolumeX,
  Music2,
  Star,
  Sparkles,
  Heart,
  Flower2,
  Sun,
  Crown,
  ShoppingBasket,
  Store,
  Layers3,
  Award,
  Lightbulb,
  RotateCcw,
  X,
  Download,
  Upload,
  BookOpen,
  Plus,
  Equal,
  CheckCheck,
} from "lucide-react";
import {
  OPERATIONS,
  LEVELS,
  PRODUCTS,
  PONIES,
  BADGES,
  STORAGE_KEY,
  freshProgress,
  prepareRound,
  easierRound,
  parseProgress,
  nextTask,
  makePairs,
  recordAnswer,
  isPair,
  taskText,
  hintText,
  inverseText,
  word,
  type Progress,
  type Task,
  type Operation,
  type Level,
  type Product,
  type PairCard,
} from "../lib/math";
const INITIAL: Task = {
  id: "welcome",
  operation: "add",
  level: 1,
  product: "apple",
  a: 3,
  b: 2,
  answer: 5,
  options: [4, 5, 6, 7],
  pony: 0,
};
const SYMBOLS: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};
function Item({ type, className = "" }: { type: Product; className?: string }) {
  return (
    <svg
      className={`item-art ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      {type === "apple" ? (
        <>
          <path
            d="M41 27q-8-11-18-9C2 23 13 57 25 65q9 7 16 1 10 6 17-1 18-18 9-35-7-17-26-3"
            fill="#d997a4"
          />
          <path
            d="M39 26q-4-16 3-21"
            stroke="#8d7859"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M42 17Q47 0 64 8q-3 17-22 9" fill="#a6b983" />
          <path
            d="M24 31q-6 7-3 16"
            stroke="#f7d6d6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M44 65h7"
            stroke="#c38394"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : type === "cupcake" ? (
        <>
          <path d="m16 44 8 25h33l8-25" fill="#cab6df" />
          <path
            d="m27 48 4 18m8-18v18m12-18-3 18"
            stroke="#b29bca"
            strokeWidth="2"
          />
          <path
            d="M14 44q-5-12 11-17-1-11 13-12 10-1 12 10 17 0 16 15 9 10-5 13-12 2-18-4-9 7-19 1-12 2-10-6"
            fill="#f1dbbd"
          />
          <path
            d="M31 29q5 5 12 0"
            stroke="#dfc49e"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="42" cy="14" r="7" fill="#c9849a" />
          <path
            d="m41 8 4-5"
            stroke="#90a06e"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : type === "bow" ? (
        <>
          <path d="m30 37-5 28 16-10 15 12-6-30" fill="#e3b8b7" />
          <path
            d="M37 32Q9 3 8 27q-2 29 29 16m7-11Q70 2 73 27q3 29-30 16"
            fill="#ddabbf"
          />
          <path
            d="m30 35-16-7m34 8 15-9"
            stroke="#c78aa8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="33" y="28" width="14" height="19" rx="6" fill="#bd89a6" />
        </>
      ) : (
        <>
          <path
            d="M14 28q0-16 25-12 29-5 28 13-4 24-26 41Q20 56 14 28"
            fill="#d38f9f"
          />
          <path
            d="m40 20-14 3 4-10-14-3 17-4 8-6 6 8 17 1-13 8 4 10-14-7"
            fill="#a6b781"
          />
          {[
            [27, 32],
            [48, 31],
            [39, 42],
            [24, 46],
            [52, 45],
            [35, 57],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`m${x} ${y} 0 3`}
              stroke="#f6d9ba"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </>
      )}
    </svg>
  );
}
function Pony({ index = 0 }: { index?: number }) {
  const p = PONIES[index];
  return (
    <svg viewBox="0 0 100 100" className="pony-avatar" aria-hidden="true">
      <circle cx="50" cy="50" r="49" fill={p.color} opacity=".14" />
      <path d="M24 48Q15 9 50 17q38-5 29 52L63 82 28 70Z" fill={p.mane} />
      <path
        d="m39 40 1-22q17 0 18 20l17 6q12 6 7 18-5 10-21 10L39 85 29 71l8-15"
        fill={p.color}
      />
      <path d="M29 52Q18 15 52 23q-7 17-23 29" fill={p.mane} />
      <circle cx="61" cy="46" r="5" fill="#735369" />
      <circle cx="62" cy="44" r="1.5" fill="#fffaf2" />
      <path
        d="M67 62q7 3 10-2"
        stroke="#a7728b"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="73" cy="54" r="2" fill="#b58399" />
    </svg>
  );
}
function Dots({
  count,
  cross = 0,
  tone = "rose",
}: {
  count: number;
  cross?: number;
  tone?: string;
}) {
  return (
    <div
      className="frames"
      aria-label={`${count} kropek${cross ? `, ${cross} przekreślonych` : ""}`}
    >
      {Array.from({ length: Math.ceil(count / 10) }, (_, frame) => (
        <div className="ten-frame" key={frame}>
          {Array.from({ length: Math.min(10, count - frame * 10) }, (_, i) => {
            const n = frame * 10 + i;
            return (
              <span
                key={i}
                className={`dot ${tone} ${n < cross ? "crossed" : ""}`}
              >
                {n < cross ? "×" : ""}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
function VisualAid({
  task: t,
  dealt,
  onDeal,
}: {
  task: Task;
  dealt: number;
  onDeal: () => void;
}) {
  return (
    <div className="visual-aid">
      <div className="aid-heading">
        <span>POLICZ NA OBRAZKACH</span>
        <Flower2 size={17} />
      </div>
      <p>{hintText(t)}</p>
      {t.operation === "add" ? (
        <div className="sum-aid">
          <Dots count={t.a} />
          <Plus size={20} />
          <Dots count={t.b} tone="sage" />
        </div>
      ) : t.operation === "subtract" ? (
        <Dots count={t.a} cross={t.b} tone="gold" />
      ) : t.operation === "multiply" ? (
        <div className="group-aid">
          {Array.from({ length: t.a }, (_, i) => (
            <div className="basket-aid" key={i}>
              <ShoppingBasket size={20} />
              <Dots count={t.b} tone="lilac" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="group-aid division">
            {Array.from({ length: t.b }, (_, i) => (
              <div className="basket-aid" key={i}>
                <span>Koszyk {i + 1}</span>
                {dealt > i ? (
                  <Dots
                    count={Math.floor(dealt / t.b) + (dealt % t.b > i ? 1 : 0)}
                    tone="sage"
                  />
                ) : (
                  <span className="empty-basket">
                    <ShoppingBasket size={25} />
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="deal-footer">
            <span>Do rozłożenia: {t.a - dealt}</span>
            <button disabled={dealt >= t.a} onClick={onDeal}>
              <Plus size={15} />
              Po jednej do każdego
            </button>
          </div>
        </>
      )}
    </div>
  );
}
function BadgeIcon({ name, size = 25 }: { name: string; size?: number }) {
  const Icon =
    (
      {
        flower: Flower2,
        sun: Sun,
        heart: Heart,
        sparkles: Sparkles,
        star: Star,
        crown: Crown,
      } as const
    )[name as "star"] ?? Star;
  return <Icon size={size} />;
}
function saveFile(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
type Quiz = {
  task: Task;
  answer: string;
  attempts: number;
  help: boolean;
  usedHelp: boolean;
  dealt: number;
  status: "asking" | "correct";
  message: string;
};
function quiz(task: Task): Quiz {
  return {
    task,
    answer: "",
    attempts: 0,
    help: false,
    usedHelp: false,
    dealt: 0,
    status: "asking",
    message: "",
  };
}
export default function Home() {
  const [p, setP] = useState<Progress>(freshProgress);
  const [q, setQ] = useState<Quiz>(() => quiz(INITIAL));
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"shop" | "pairs" | "badges">("shop");
  const [modal, setModal] = useState<"parents" | "help" | null>(null);
  const [notice, setNotice] = useState("");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [effects, setEffects] = useState(true);
  const [musicPanel, setMusicPanel] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [deck, setDeck] = useState<PairCard[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [pairMessage, setPairMessage] = useState("");
  const [pairWrong, setPairWrong] = useState(false);
  const pairAttempts = useRef<Record<string, number>>({});
  const music = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const answerInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let progress = freshProgress();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) progress = parseProgress(raw);
    } catch {
      setNotice(
        "Nie udało się odczytać zapisu. Możesz nadal grać i zapisać nową kopię.",
      );
    }
    progress = prepareRound(progress);
    setP(progress);
    setQ(quiz(nextTask(progress)));
    setDeck(makePairs(progress.operation, progress.level, progress.product));
    setLoaded(true);
    return () => {
      window.speechSynthesis?.cancel();
      if(context.current && context.current.state!=="closed")void context.current.close().catch(()=>{});
      context.current=null;
    };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      setNotice(
        "Pamięć przeglądarki jest niedostępna. Pobierz kopię postępów w panelu rodzica.",
      );
    }
    if (music.current) music.current.volume = p.volume;
  }, [p, loaded]);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) {
        music.current?.pause();
        setMusicPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);
  useEffect(() => {
    if (!modal) return;
    const old = document.activeElement as HTMLElement | null,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".modal button:not(:disabled),.modal a[href],.modal input:not([hidden])",
          ),
        );
        const first = items[0],
          last = items[items.length - 1];
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
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      old?.focus();
    };
  }, [modal]);
  function chime() {
    if (!effects) return;
    try {
      const ac = context.current && context.current.state!=="closed" ? context.current : new AudioContext();
      context.current = ac;
      void ac.resume().catch(()=>{});
      [523.25, 659.25, 783.99].forEach((frequency, i) => {
        const osc = ac.createOscillator(),
          gain = ac.createGain(),
          start = ac.currentTime + i * 0.09;
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.035, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.34);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {}
  }
  async function toggleMusic() {
    if (!music.current) return;
    if (musicPlaying) {
      music.current.pause();
      setMusicPlaying(false);
      setP((v) => ({ ...v, music: false }));
    } else
      try {
        music.current.volume = p.volume;
        await music.current.play();
        setMusicPlaying(true);
        setP((v) => ({ ...v, music: true }));
      } catch {
        setNotice("Muzyka nie mogła się uruchomić. Kliknij nutkę jeszcze raz.");
      }
  }
  function speak() {
    if (!("speechSynthesis" in window)) {
      setNotice(
        "Ta przeglądarka nie ma lektora. Przeczytajcie zamówienie razem.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(taskText(q.task));
    u.lang = "pl-PL";
    u.rate = 0.88;
    if (music.current) music.current.volume = p.volume * 0.2;
    u.onend = u.onerror = () => {
      if (music.current) music.current.volume = p.volume;
    };
    window.speechSynthesis.speak(u);
  }
  function resetPairs(progress = p) {
    progress = prepareRound(progress);
    setP(progress);
    setDeck(makePairs(progress.operation, progress.level, progress.product));
    setSelected([]);
    setMatched([]);
    setPairWrong(false);
    setPairMessage("");
    pairAttempts.current = {};
  }
  function choose(op = p.operation, level?: Level, product = p.product) {
    const progress = prepareRound({
      ...p,
      operation: op,
      level: level ?? p.level,
      product,
      adaptive: level ? { ...p.adaptive, enabled: false } : p.adaptive,
    });
    setP(progress);
    setQ(quiz(nextTask(progress, q.task)));
    resetPairs(progress);
    setMobileMenu(false);
  }
  function check() {
    if (q.status === "correct") return;
    if (!/^\d{1,3}$/.test(q.answer) || Number(q.answer) > 100) {
      setQ((v) => ({
        ...v,
        message: "Wybierz kartę z odpowiedzią albo wpisz liczbę od 0 do 100.",
      }));
      return;
    }
    const answer = Number(q.answer),
      right = answer === q.task.answer;
    setP((v) => recordAnswer(v, q.task, answer, q.attempts, q.usedHelp));
    if (right) {
      chime();
      setQ((v) => ({
        ...v,
        status: "correct",
        message: "Właśnie tak! Dziękuję za pomoc.",
      }));
    } else
      setQ((v) => ({
        ...v,
        attempts: v.attempts + 1,
        message:
          "Jeszcze nie tym razem. Policz spokojnie — możesz skorzystać z obrazków.",
      }));
  }
  function next() {
    const progress = prepareRound(p);
    setP(progress);
    setQ(quiz(nextTask(progress, q.task)));
    answerInput.current?.blur();
  }
  function chooseCard(card: PairCard) {
    if (matched.includes(card.task.id) || pairWrong) return;
    if (selected.includes(card.id)) {
      setSelected([]);
      return;
    }
    if (!selected.length) {
      setSelected([card.id]);
      setPairMessage("Teraz znajdź drugą kartę do pary.");
      return;
    }
    const first = deck.find((c) => c.id === selected[0])!;
    if (first.kind === card.kind) {
      setSelected([card.id]);
      setPairMessage("Połącz jedną kartę z działaniem i jedną z wynikiem.");
      return;
    }
    const expression = first.kind === "expression" ? first : card,
      answer = first.kind === "answer" ? first : card,
      prior = pairAttempts.current[expression.task.id] ?? 0;
    const right = isPair(first, card);
    setP((v) =>
      recordAnswer(v, expression.task, Number(answer.value), prior, false),
    );
    if (right) {
      setMatched((v) => [...v, expression.task.id]);
      setSelected([]);
      setPairMessage("Piękna para! Poszukaj następnej.");
      chime();
    } else {
      pairAttempts.current[expression.task.id] = prior + 1;
      setSelected([first.id, card.id]);
      setPairWrong(true);
      setPairMessage(
        "Te karty jeszcze nie pasują. Spróbuj obliczyć działanie jeszcze raz.",
      );
    }
  }
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 150000) throw Error("Plik jest za duży.");
      const progress = prepareRound(parseProgress(await file.text()));
      setP(progress);
      setQ(quiz(nextTask(progress)));
      resetPairs(progress);
      setNotice("Postępy wczytane. Możecie grać dalej!");
      setModal(null);
    } catch {
      setModal(null);
      setNotice(
        "Nie rozpoznaję pliku. Wybierz kopię zapisaną w Sklepiku Kucyków.",
      );
    }
    if (importInput.current) importInput.current.value = "";
  }
  const pony = PONIES[q.task.pony],
    meta = OPERATIONS[p.operation],
    earned = BADGES.filter((b) => b.test(p));
  const dayCount =
    q.status === "correct" && p.solved % 6 === 0 ? 6 : p.solved % 6;
  const modes = Object.keys(OPERATIONS) as Operation[];
  const correctness = Object.values(p.skills).reduce(
    (n, s) => n + s.firstTry,
    0,
  );
  return (
    <div className="shell">
      <audio
        ref={music}
        src="/audio/sklepik.mp3"
        loop
        preload="none"
        onError={() => {
          if (musicPlaying) {
            setNotice(
              "Nie udało się odtworzyć muzyki. Możesz grać dalej bez dźwięku.",
            );
            setMusicPlaying(false);
          }
        }}
      />
      <header className="topbar">
        <a
          className="brand"
          href="/"
          aria-label="Sklepik Kucyków — strona główna"
        >
          <span className="brand-pony">
            <Pony />
          </span>
          <span>
            Sklepik Kucyków<small>LICZYMY Z RADOŚCIĄ</small>
          </span>
        </a>
        <nav className="topnav" aria-label="Widok gry">
          <button
            className={view === "shop" ? "active" : ""}
            onClick={() => setView("shop")}
          >
            <Store size={17} />
            Sklepik
          </button>
          <button
            className={view === "pairs" ? "active" : ""}
            onClick={() => setView("pairs")}
          >
            <Layers3 size={17} />
            Karty w pary
          </button>
          <button
            className={view === "badges" ? "active" : ""}
            onClick={() => setView("badges")}
          >
            <Award size={17} />
            Moje odznaki
          </button>
        </nav>
        <div className="header-right">
          <span className="star-total">
            <Star size={16} fill="currentColor" />
            {p.solved}
          </span>
          <div className="music-wrap">
            <button
              className={`music-button ${musicPlaying ? "playing" : ""}`}
              aria-label={musicPlaying ? "Wyłącz muzykę" : "Włącz muzykę"}
              title={musicPlaying ? "Wyłącz muzykę" : "Włącz muzykę"}
              onClick={() => void toggleMusic()}
            >
              <Music2 size={19} />
              <span>{musicPlaying ? "Muzyka gra" : "Muzyka"}</span>
            </button>
            <button
              className="music-settings"
              aria-expanded={musicPanel}
              aria-label="Głośność muzyki"
              onClick={() => setMusicPanel(!musicPanel)}
            >
              <ChevronDown size={13} />
            </button>
            {musicPanel && (
              <div className="music-popover">
                <label htmlFor="music-volume">
                  Głośność muzyki
                  <input
                    id="music-volume"
                    aria-label="Głośność muzyki"
                    type="range"
                    min="0"
                    max="60"
                    value={Math.round(p.volume * 100)}
                    onChange={(e) =>
                      setP((v) => ({
                        ...v,
                        volume: Number(e.target.value) / 100,
                      }))
                    }
                  />
                </label>
                <small>Instrumentalny motyw z Suno</small>
                <button onClick={() => setEffects(!effects)}>
                  {effects ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  Dźwięki odpowiedzi: {effects ? "tak" : "nie"}
                </button>
              </div>
            )}
          </div>
          <button className="parent-button" onClick={() => setModal("parents")}>
            <Heart size={16} />
            Dla rodzica
          </button>
        </div>
      </header>
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="side-label">CZYM SIĘ DZIŚ BAWIMY?</div>
        <div className="operation-list">
          {modes.map((op) => (
            <button
              key={op}
              aria-pressed={p.operation === op}
              className={`operation ${p.operation === op ? "selected" : ""}`}
              onClick={() => {
                choose(op);
                setView("shop");
              }}
            >
              <span className="operation-symbol">{SYMBOLS[op]}</span>
              <span>
                <b>{OPERATIONS[op].name}</b>
                <small>{OPERATIONS[op].title}</small>
              </span>
              {p.operation === op && <span className="operation-dot" />}
            </button>
          ))}
        </div>
        <div className="side-divider" />
        <div className="side-label">POZIOM TRUDNOŚCI</div>
        <button
          className={`auto-level ${p.adaptive.enabled ? "enabled" : ""}`}
          aria-pressed={p.adaptive.enabled}
          onClick={() => {
            const progress = prepareRound({
              ...p,
              adaptive: { ...p.adaptive, enabled: !p.adaptive.enabled },
            });
            setP(progress);
            setQ(quiz(nextTask(progress)));
            resetPairs(progress);
          }}
        >
          <Sparkles size={15} />
          {p.adaptive.enabled
            ? "Dobieramy automatycznie"
            : "Włącz automatyczny dobór"}
        </button>
        <div className="levels">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              aria-pressed={p.level === l.id}
              className={p.level === l.id ? "chosen" : ""}
              onClick={() => choose(p.operation, l.id)}
            >
              <span className="level-petals">
                {Array.from({ length: l.id }, (_, i) => (
                  <Flower2
                    size={12}
                    key={i}
                    fill={p.level === l.id ? "#e8c8d7" : "none"}
                  />
                ))}
              </span>
              <span>{l.name}</span>
              {p.level === l.id && <Check size={13} />}
            </button>
          ))}
        </div>
        <p className="level-range">
          {p.adaptive.enabled
            ? "Zadania dopasowują się do Twoich odpowiedzi. Wybór poziomu ręcznie przełącza na tryb ręczny. "
            : "Tryb ręczny. "}
          {LEVELS[p.level - 1].range}
        </p>
        <div className="daily-card">
          <div>
            <Sun size={19} />
            <b>Mały cel na dziś</b>
          </div>
          <p>Pomóż sześciu klientom.</p>
          <div className="six-dots">
            {Array.from({ length: 6 }, (_, i) => (
              <span className={i < dayCount ? "filled" : ""} key={i}>
                <Check size={11} />
              </span>
            ))}
          </div>
          <small>{dayCount} z 6 zamówień w tej serii</small>
        </div>
        <button className="how-button" onClick={() => setModal("help")}>
          <BookOpen size={16} />
          Jak się bawić?
        </button>
        <p className="side-footer">
          Każdy pomysł ma znaczenie. <Heart size={11} />
        </p>
      </aside>
      <main>
        <div className="mobile-controls">
          <button onClick={() => setMobileMenu(!mobileMenu)}>
            <Store size={16} />
            {meta.name} · poziom {p.level}
            <ChevronDown size={15} />
          </button>
          <div>
            <button
              onClick={() => setView(view === "pairs" ? "shop" : "pairs")}
            >
              <Layers3 size={16} />
              {view === "pairs" ? "Sklepik" : "Karty"}
            </button>
            <button aria-label="Moje odznaki" onClick={() => setView("badges")}>
              <Award size={17} />
            </button>
          </div>
        </div>
        <section className="welcome">
          <div>
            <div className="eyebrow">
              <span />
              MAŁE ZAKUPY, WIELKIE ODKRYCIA
            </div>
            <h1>
              {view === "shop" ? (
                <>
                  Witaj w naszym <em>sklepiku.</em>
                </>
              ) : view === "pairs" ? (
                <>
                  Dwie karty. <em>Jedna para.</em>
                </>
              ) : (
                <>
                  Twoja kolekcja <em>małych sukcesów.</em>
                </>
              )}
            </h1>
            <p>
              {view === "shop"
                ? "Kucyki już czekają. Pomożesz im policzyć zakupy?"
                : view === "pairs"
                  ? "Połącz działanie z jego wynikiem. Możesz liczyć tak, jak lubisz."
                  : "Każde zamówienie to trochę więcej pewności. Zobacz, co już potrafisz!"}
            </p>
          </div>
          <div className="welcome-seal">
            <Flower2 size={27} />
            <span>
              Bez pośpiechu.<small>W Twoim tempie.</small>
            </span>
          </div>
        </section>
        {notice && (
          <div className="notice" role="status">
            <Lightbulb size={18} />
            <p>{notice}</p>
            <button
              aria-label="Zamknij powiadomienie"
              onClick={() => setNotice("")}
            >
              <X size={17} />
            </button>
          </div>
        )}
        {view === "shop" ? (
          <>
            <div className="shop-layout">
              <section className="order-card">
                <div className="order-top">
                  <span>
                    <span className="order-dot" />
                    ZAMÓWIENIE DLA PRZYJACIÓŁKI
                  </span>
                  <span className="tiny-level">POZIOM {p.level}</span>
                </div>
                <div className="customer">
                  <Pony index={q.task.pony} />
                  <div>
                    <span>{pony.name}</span>
                    <p>{pony.hello}</p>
                  </div>
                  <button
                    className="listen"
                    aria-label="Przeczytaj zamówienie"
                    onClick={speak}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                <div className="order-body">
                  <div className="order-type">
                    <span className={`operation-mini op-${p.operation}`}>
                      {meta.symbol}
                    </span>
                    {meta.title}
                    {q.task.review && <small>Wracamy do tego pomysłu</small>}
                  </div>
                  <h2>{taskText(q.task)}</h2>
                  <div
                    className="equation"
                    aria-label={`Działanie: ${q.task.a} ${meta.symbol} ${q.task.b} równa się znak zapytania`}
                  >
                    <span className="number-tile">{q.task.a}</span>
                    <span className="math-sign">{meta.symbol}</span>
                    <span className="number-tile second">{q.task.b}</span>
                    <Equal className="equals" size={21} />
                    <span
                      className={`number-tile mystery ${q.status === "correct" ? "solved" : ""}`}
                    >
                      {q.status === "correct" ? q.task.answer : "?"}
                    </span>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      check();
                    }}
                  >
                    <label className="answer-label" htmlFor="answer">
                      Twoja odpowiedź
                    </label>
                    <div className="answer-options">
                      {q.task.options.map((n) => (
                        <button
                          type="button"
                          key={n}
                          aria-pressed={q.answer === String(n)}
                          disabled={q.status === "correct"}
                          className={
                            q.answer === String(n) ? "selected-answer" : ""
                          }
                          onClick={() =>
                            setQ((v) => ({
                              ...v,
                              answer: String(n),
                              message: "",
                            }))
                          }
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className="answer-line">
                      <div className="answer-input">
                        <input
                          id="answer"
                          ref={answerInput}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={3}
                          value={q.answer}
                          disabled={q.status === "correct"}
                          placeholder="lub wpisz liczbę"
                          aria-label="Twoja odpowiedź"
                          onChange={(e) =>
                            setQ((v) => ({
                              ...v,
                              answer: e.target.value.replace(/[^0-9]/g, ""),
                              message: "",
                            }))
                          }
                        />
                        <span>
                          {p.operation === "subtract"
                            ? "monet"
                            : p.operation === "divide"
                              ? "w koszyku"
                              : "razem"}
                        </span>
                      </div>
                      {q.status === "correct" ? (
                        <button
                          type="button"
                          className="primary next"
                          onClick={(e) => {
                            e.preventDefault();
                            next();
                          }}
                        >
                          Następny klient <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button type="submit" className="primary">
                          Sprawdź <Check size={19} />
                        </button>
                      )}
                    </div>
                  </form>
                  <div
                    className={`answer-feedback ${q.status === "correct" ? "correct" : ""}`}
                    role="status"
                    aria-live="polite"
                  >
                    {q.message &&
                      (q.status === "correct" ? (
                        <Sparkles size={18} />
                      ) : (
                        <Lightbulb size={18} />
                      ))}
                    <span>
                      {q.message ||
                        "Możesz wybrać kartę lub wpisać swoją odpowiedź."}
                    </span>
                  </div>
                  {q.status === "asking" &&
                    q.attempts >= 2 &&
                    p.adaptive.enabled && (
                      <button
                        className="outline-button"
                        onClick={() => {
                          const progress = easierRound(p);
                          setP(progress);
                          setQ(quiz(nextTask(progress, q.task)));
                        }}
                      >
                        Spróbujmy prostszego zadania <ArrowRight size={15} />
                      </button>
                    )}
                  {q.status === "correct" &&
                    p.adaptive.enabled &&
                    p.adaptive.levels[p.operation] !== p.level && (
                      <p className="adaptive-message">
                        {p.adaptive.levels[p.operation] > p.level
                          ? "Świetnie! Kolejne zamówienie będzie małym krokiem dalej."
                          : "Teraz zrobimy trochę mniejszy krok. Obrazki zawsze mogą pomóc."}
                      </p>
                    )}
                  {q.status === "correct" && (
                    <div className="inverse">
                      <span>DZIAŁANIA SĄ PRZYJACIÓŁMI</span>
                      <p>{inverseText(q.task)}</p>
                      <small>Tak możesz sprawdzić wynik.</small>
                    </div>
                  )}
                  <button
                    aria-expanded={q.help}
                    className={`hint-toggle ${q.help ? "on" : ""}`}
                    onClick={() =>
                      setQ((v) => ({ ...v, help: !v.help, usedHelp: true }))
                    }
                  >
                    <Lightbulb size={18} />
                    {q.help ? "Schowaj obrazki" : "Policzmy na obrazkach"}
                    <ChevronDown size={15} />
                  </button>
                  {q.help && (
                    <VisualAid
                      task={q.task}
                      dealt={q.dealt}
                      onDeal={() =>
                        setQ((v) => ({
                          ...v,
                          dealt: Math.min(v.task.a, v.dealt + v.task.b),
                        }))
                      }
                    />
                  )}
                </div>
                <div className="receipt-bottom" />
              </section>
              <section className="illustration-column">
                <div className="shop-scene">
                  <img
                    src="/art/sklepik.png"
                    alt="Figa i Lawendka przy drewnianej ladzie bajkowego sklepiku z jabłkami, babeczkami i kokardkami"
                    fetchPriority="high"
                  />
                  <div className="scene-label">
                    <span />
                    SKLEPIK OTWARTY NA DOBRE POMYSŁY
                  </div>
                </div>
                <div className="shelf-heading">
                  <h2>Co dziś pakujemy?</h2>
                  <span>Wybierz swój ulubiony towar</span>
                </div>
                <div className="product-shelf">
                  {(Object.keys(PRODUCTS) as Product[]).map((item) => (
                    <button
                      key={item}
                      aria-pressed={p.product === item}
                      className={`product ${PRODUCTS[item].color} ${p.product === item ? "chosen-product" : ""}`}
                      onClick={() => choose(p.operation, undefined, item)}
                    >
                      <Item type={item} />
                      <span>{PRODUCTS[item].name}</span>
                      {p.product === item && (
                        <span className="product-check">
                          <Check size={11} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="friend-tip">
                  <span className="tip-flower">
                    <Flower2 size={24} />
                  </span>
                  <div>
                    <b>W sklepiku liczymy po swojemu.</b>
                    <p>
                      Na palcach, na obrazkach albo w głowie.
                      <br />
                      Każdy sposób jest dobry, gdy rozumiesz wynik.
                    </p>
                  </div>
                </div>
                {q.status === "correct" && p.solved % 6 === 0 && (
                  <div className="break-card">
                    <Sun size={28} />
                    <div>
                      <b>Sześć zamówień! Piękna praca.</b>
                      <p>Może pora na przeciągnięcie się i małą przerwę?</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
            <div className="bottom-note">
              <span>
                <span className="save-dot" />
                Postępy zapisują się w tej przeglądarce.
              </span>
              <button onClick={() => setModal("parents")}>
                Małe obliczenia. Dużo wspólnej radości.
                <Heart size={13} />
              </button>
            </div>
          </>
        ) : view === "pairs" ? (
          <section className="pairs-section">
            <div className="pairs-intro">
              <div>
                <span className="eyebrow">MAŁA ZABAWA W DOPASOWYWANIE</span>
                <h2>Znajdź cztery matematyczne pary</h2>
                <p>
                  {meta.name} · {LEVELS[p.level - 1].name}. Wybierz działanie i
                  pasującą liczbę.
                </p>
              </div>
              <button className="outline-button" onClick={() => resetPairs()}>
                <RotateCcw size={16} />
                Nowe rozdanie
              </button>
            </div>
            <div className="pair-deck">
              {deck.map((card) => (
                <button
                  key={card.id}
                  aria-pressed={
                    selected.includes(card.id) || matched.includes(card.task.id)
                  }
                  className={`pair-card ${card.kind} ${matched.includes(card.task.id) ? "matched" : ""} ${selected.includes(card.id) ? "turned" : ""} ${pairWrong && selected.includes(card.id) ? "not-yet" : ""}`}
                  disabled={matched.includes(card.task.id) || pairWrong}
                  onClick={() => chooseCard(card)}
                >
                  <span>{card.kind === "expression" ? "POLICZ" : "WYNIK"}</span>
                  <strong>{card.value}</strong>
                  {matched.includes(card.task.id) ? (
                    <CheckCheck size={23} />
                  ) : (
                    <Flower2 size={22} />
                  )}
                </button>
              ))}
            </div>
            <div
              className={`pair-feedback ${pairWrong ? "wrong" : ""}`}
              role="status"
            >
              <Lightbulb size={19} />
              <p>
                {matched.length === 4
                  ? "Wszystkie pary razem! Możesz wybrać nowe rozdanie albo wrócić do sklepiku."
                  : pairMessage ||
                    "Karty mają różne kolory: połącz działanie z wynikiem."}
              </p>
              {pairWrong && (
                <button
                  onClick={() => {
                    setSelected([]);
                    setPairWrong(false);
                    setPairMessage("Spróbujmy spokojnie jeszcze raz.");
                  }}
                >
                  Spróbuj inną parę <ArrowRight size={15} />
                </button>
              )}
            </div>
            <div className="pair-progress">
              {matched.length}/4 pary <Heart size={15} />
            </div>
          </section>
        ) : (
          <section className="badges-view">
            <div className="stats-ribbon">
              <div>
                <strong>{p.solved}</strong>
                <span>dobrych obliczeń</span>
              </div>
              <div>
                <strong>{earned.length}/6</strong>
                <span>zdobytych odznak</span>
              </div>
              <div>
                <strong>{correctness}</strong>
                <span>samodzielnie za pierwszym razem</span>
              </div>
            </div>
            <div className="badge-grid">
              {BADGES.map((b) => (
                <article
                  key={b.id}
                  className={`badge-card ${b.test(p) ? "earned" : ""}`}
                >
                  <span className="badge-art">
                    <BadgeIcon name={b.icon} size={34} />
                  </span>
                  <h2>{b.name}</h2>
                  <p>{b.description}</p>
                  <small>
                    {b.test(p) ? (
                      <>
                        <Check size={13} />
                        Zdobyta!
                      </>
                    ) : (
                      "Jeszcze trochę wspólnych przygód"
                    )}
                  </small>
                </article>
              ))}
            </div>
            <button
              className="primary back-to-shop"
              onClick={() => setView("shop")}
            >
              <ShoppingBasket size={18} />
              Wracam do sklepiku
            </button>
          </section>
        )}
      </main>
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
              className="close-button"
              aria-label="Zamknij"
              onClick={() => setModal(null)}
            >
              <X size={22} />
            </button>
            <div className="modal-icon">
              {modal === "parents" ? (
                <Heart size={27} />
              ) : (
                <BookOpen size={27} />
              )}
            </div>
            <div className="eyebrow">LICZYMY Z RADOŚCIĄ</div>
            <h2 id="modal-title">
              {modal === "parents"
                ? "Małe kroki do wielkiej pewności"
                : "Pierwsze zakupy? To proste!"}
            </h2>
            {modal === "parents" ? (
              <>
                <p>
                  Zacznijcie od 5–10 minut. Zapytaj: „Skąd wiesz?” albo „Pokaż
                  mi swój sposób”. Obrazki i palce pomagają zrozumieć liczby —
                  można z nich korzystać na każdym poziomie.
                </p>
                <div className="parent-callout">
                  <b>Co ćwiczymy?</b>Dodawanie łączy zbiory, odejmowanie
                  pokazuje resztę, mnożenie to równe grupy, a dzielenie to
                  rozkładanie po równo. Działania odwrotne pokazują, jak
                  sprawdzić wynik. Trudniejsze obliczenia po pomyłce wracają w
                  kolejnych zamówieniach.
                </div>
                <div className="parent-callout">
                  <b>Automatyczny dobór trudności</b>Każde działanie ma własny
                  poziom. 5 samodzielnych pierwszych odpowiedzi w ostatnich 6
                  zadaniach podnosi poziom o jeden. Dwie kolejne pomyłki lub
                  zadania z podpowiedzią obniżają go o jeden. Jedno zadanie
                  liczy się do doboru tylko raz. Zmiana obowiązuje od kolejnego
                  zamówienia lub nowego rozdania kart. Wybór poziomu ręcznie
                  wyłącza automat; można go włączyć przyciskiem nad poziomami.
                  Po dwóch błędnych próbach dostępne jest też prostsze zadanie.
                </div>
                <h3>Postępy według działania i poziomu</h3>
                <div className="progress-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Działanie</th>
                        {LEVELS.map((l) => (
                          <th key={l.id}>Poziom {l.id}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modes.map((op) => (
                        <tr key={op}>
                          <th>{OPERATIONS[op].name}</th>
                          {[1, 2, 3].map((l) => {
                            const s = p.skills[`${op}:${l}`];
                            return (
                              <td key={l}>
                                <b>{s.correct}</b>
                                <small>
                                  {s.attempts} prób · {s.firstTry} samodzielnie
                                </small>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="small-copy">
                  „Samodzielnie” oznacza poprawną pierwszą odpowiedź bez
                  otwarcia obrazkowej podpowiedzi. Pozostałe odpowiedzi też są
                  sukcesem i liczą się do odznak. To informacja do wspólnej
                  nauki, nie ocena dziecka.
                </p>
                <div className="backup-actions">
                  <button
                    onClick={() =>
                      saveFile(
                        JSON.stringify(p, null, 2),
                        "sklepik-kucykow-postepy.json",
                      )
                    }
                  >
                    <Download size={17} />
                    Zapisz postępy
                  </button>
                  <button onClick={() => importInput.current?.click()}>
                    <Upload size={17} />
                    Wczytaj kopię
                  </button>
                  <input
                    hidden
                    ref={importInput}
                    type="file"
                    accept=".json,application/json"
                    onChange={(e) => void restore(e.target.files?.[0])}
                  />
                </div>
                <div className="parent-callout privacy">
                  Postępy są przechowywane lokalnie, w tej przeglądarce i pod
                  tym adresem. Nie zbieramy imienia dziecka. Do przeniesienia
                  wyników na inne urządzenie użyj kopii. Muzyka rusza po
                  kliknięciu nutki i zatrzymuje się po schowaniu strony.
                </div>
                <p className="small-copy">
                  Inspiracja: uczenie przez zabawę, liczenie na reprezentacjach
                  graficznych i stopniowanie trudności, opisane przez{" "}
                  <a
                    href="https://kartygrabowskiego.pl/blog/najczesciej-zadawane-pytania-o-karty-grabowskiego-dodawanie-i-odejmowanie"
                    target="_blank"
                    rel="noreferrer"
                  >
                    twórców Kart Grabowskiego ↗
                  </a>
                  . To nasza własna gra, z własnymi zadaniami i ilustracjami.
                </p>
              </>
            ) : (
              <>
                <ol className="how-list">
                  <li>
                    <b>Wybierz działanie i poziom.</b> Zacznij od tego, co jest
                    ciekawe. Każdy poziom jest dostępny od początku.
                  </li>
                  <li>
                    <b>Przeczytaj zamówienie.</b> Możesz też nacisnąć głośniczek
                    i posłuchać.
                  </li>
                  <li>
                    <b>Wybierz liczbę lub wpisz odpowiedź.</b> Kliknij
                    „Sprawdź”. Pomyłka daje kolejną okazję do policzenia.
                  </li>
                  <li>
                    <b>Poproś o obrazki.</b> Kropki, grupy i koszyczki pokazują,
                    jak działa obliczenie.
                  </li>
                  <li>
                    <b>Wpadnij na karty w pary.</b> Połącz kartę z działaniem i
                    kartę z wynikiem. Każda para jest jednym obliczeniem.
                  </li>
                </ol>
                <button className="primary" onClick={() => setModal(null)}>
                  Otwieramy sklepik! <ArrowRight size={18} />
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
