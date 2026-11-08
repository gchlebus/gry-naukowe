"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  CornerUpLeft,
  CornerUpRight,
  Volume2,
  VolumeX,
  Play,
  Square,
  RotateCcw,
  Footprints,
  Repeat2,
  Flower2,
  Timer,
  Plus,
  Trash2,
  X,
  Star,
  Check,
  Lightbulb,
  ChevronRight,
  BookOpen,
  Sparkles,
  Code2,
  Download,
  Upload,
  Heart,
  Flag,
  Map,
  Settings2,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import {
  LESSONS,
  CHAPTERS,
  chapterFor,
  starterProgram,
  validCompleted,
  conditionHolds,
  childBlocks,
  createExecution,
  stepExecution,
  learningCode,
  type Execution,
  type Condition,
  FREE,
  initialWorld,
  advance,
  compile,
  countBlocks,
  validateProgram,
  resultFor,
  pythonProgram,
  type Block,
  type World,
  type Instruction,
  type Lesson,
} from "../lib/program";
const SAVE = "kaczy-kod-v1";
const META = {
  forward: {
    label: "Idź do przodu",
    sub: "O jedną kratkę",
    icon: ArrowUp,
    color: "blue",
  },
  left: {
    label: "Skręć w lewo",
    sub: "Obróć się w miejscu",
    icon: CornerUpLeft,
    color: "purple",
  },
  right: {
    label: "Skręć w prawo",
    sub: "Obróć się w miejscu",
    icon: CornerUpRight,
    color: "purple",
  },
  quack: {
    label: "Powiedz kwa!",
    sub: "Kacze powitanie",
    icon: Volume2,
    color: "yellow",
  },
  wait: {
    label: "Poczekaj",
    sub: "Chwila oddechu",
    icon: Timer,
    color: "pink",
  },
  repeat: {
    label: "Powtórz",
    sub: "Zrób to kilka razy",
    icon: Repeat2,
    color: "orange",
  },
  flower: {
    label: "Jeśli kwiatek",
    sub: "Sprawdź kratkę pod sobą",
    icon: Flower2,
    color: "green",
  },
  clear: {
    label: "Jeśli wolna droga",
    sub: "Sprawdź przed sobą",
    icon: Footprints,
    color: "green",
  },
  while: {
    label: "Dopóki (while)",
    sub: "Sprawdzaj po każdym powtórzeniu",
    icon: Repeat2,
    color: "teal",
  },
  ifelse: {
    label: "Jeśli / inaczej",
    sub: "Dwie odpowiedzi · if/else",
    icon: Settings2,
    color: "purple",
  },
  define: {
    label: "Stwórz funkcję",
    sub: "Nazwij własny przepis",
    icon: Code2,
    color: "indigo",
  },
  call: {
    label: "Użyj funkcji",
    sub: "Wykonaj swój przepis",
    icon: Play,
    color: "indigo",
  },
};
function Duck({
  small = false,
  embedded = false,
}: {
  small?: boolean;
  embedded?: boolean;
}) {
  const art = (
    <>
      <ellipse cx="50" cy="101" rx="31" ry="6" fill="#214c3a" opacity=".13" />
      <path
        d="M38 72L33 94M61 72l6 22"
        stroke="#677e79"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M22 97h22m15 0h21"
        stroke="#eeaa43"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect
        x="30"
        y="54"
        width="42"
        height="29"
        rx="13"
        fill="#d9e5de"
        stroke="#516f63"
        strokeWidth="2"
      />
      <rect x="40" y="57" width="22" height="17" rx="6" fill="#9fbca9" />
      <path d="M49 18V8" stroke="#516f63" strokeWidth="3" />
      <circle cx="49" cy="7" r="5" fill="#e7b54b" />
      <rect
        x="13"
        y="18"
        width="75"
        height="45"
        rx="17"
        fill="#fffcf0"
        stroke="#516f63"
        strokeWidth="2"
      />
      <rect x="20" y="27" width="60" height="24" rx="10" fill="#e2ebe4" />
      <rect x="29" y="32" width="11" height="12" rx="5" fill="#255744" />
      <rect x="60" y="32" width="11" height="12" rx="5" fill="#255744" />
      <circle cx="33" cy="35" r="2" fill="white" />
      <circle cx="64" cy="35" r="2" fill="white" />
      <rect
        x="34"
        y="49"
        width="34"
        height="16"
        rx="7"
        fill="#f0b04f"
        stroke="#cf933b"
        strokeWidth="1.5"
      />
      <path d="M38 57h26" stroke="#cf933b" strokeWidth="1.5" />
      <path d="M16 33H8v17h10m67-17h8v17h-7" fill="#a3b9ad" />
    </>
  );
  return embedded ? (
    <g fill="none">{art}</g>
  ) : (
    <svg
      width="100"
      height="110"
      viewBox="0 0 100 110"
      fill="none"
      aria-hidden="true"
      className={small ? "duck small" : "duck"}
    >
      {art}
    </svg>
  );
}
function TileObjects({
  x,
  y,
  lesson: l,
  world: w,
}: {
  x: number;
  y: number;
  lesson: Lesson;
  world: World;
}) {
  const key = `${x},${y}`,
    checkpoint = l.checkpoints?.indexOf(key) ?? -1;
  return (
    <g transform={`translate(${106 + x * 61},${72 + y * 61})`}>
      {l.treasures?.includes(key) && !w.collected.includes(key) && (
        <g>
          <path
            d="M-8 6Q-6-9 5-15M8 5Q9-4 5-15"
            fill="none"
            stroke="#66884e"
            strokeWidth="2.5"
          />
          <ellipse
            cx="11"
            cy="-13"
            rx="7"
            ry="3"
            fill="#88a765"
            transform="rotate(-22 11 -13)"
          />
          <circle cx="-9" cy="10" r="8" fill="#c76b74" />
          <circle cx="9" cy="8" r="8" fill="#d57a7e" />
          <circle cx="-11" cy="7" r="2" fill="#ffe8d9" />
        </g>
      )}
      {checkpoint >= 0 && (
        <g>
          <circle
            r="20"
            fill={w.checkpoint > checkpoint ? "#c6dec0" : "#e0e2f5"}
            stroke={w.checkpoint > checkpoint ? "#6c9360" : "#9698c0"}
            strokeWidth="2"
          />
          <text
            y="6"
            textAnchor="middle"
            fill={w.checkpoint > checkpoint ? "#597e50" : "#7374a1"}
            fontSize="18"
            fontWeight="bold"
          >
            {w.checkpoint > checkpoint ? "✓" : checkpoint + 1}
          </text>
        </g>
      )}
      {l.key === key && !w.hasKey && (
        <g stroke="#bb8a2b" strokeWidth="4" fill="none">
          <circle cx="-7" cy="-5" r="9" fill="#f8df91" />
          <path d="m0 2 15 15m-5-5 5-5m-9 1 5-5" strokeLinecap="round" />
        </g>
      )}
      {l.gates?.includes(key) && (
        <g opacity={w.hasKey ? 0.35 : 1}>
          <rect x="-23" y="-21" width="7" height="44" rx="3" fill="#8c9e92" />
          <rect x="16" y="-21" width="7" height="44" rx="3" fill="#8c9e92" />
          {!w.hasKey && (
            <>
              <path
                d="M-16-9h32m-32 24h32m-25-33v39m9-39v39m9-39v39"
                stroke="#a3b0a2"
                strokeWidth="4"
              />
              <rect
                x="-7"
                y="-4"
                width="14"
                height="16"
                rx="4"
                fill="#e4b75b"
              />
              <circle cy="3" r="2" fill="#9e7939" />
            </>
          )}
        </g>
      )}
    </g>
  );
}
function Garden({
  world: w,
  lesson: l,
  active,
  success,
}: {
  world: World;
  lesson: Lesson;
  active: string | null;
  success: boolean;
}) {
  const colors =
    l.theme === "night"
      ? {
          bg: "#dcdfee",
          hill: "#cbd2e5",
          tree: "#7b8da8",
          leaf: "#a1adc4",
          tile: "#eef0f8",
          other: "#e3e7f2",
        }
      : l.theme === "lagoon"
        ? {
            bg: "#d5e9e8",
            hill: "#c3dddc",
            tree: "#76a69b",
            leaf: "#9dc5b5",
            tile: "#edf5f0",
            other: "#e0eee7",
          }
        : l.theme === "orchard"
          ? {
              bg: "#f1e6cc",
              hill: "#e7d9b9",
              tree: "#a4ad71",
              leaf: "#c3c48a",
              tile: "#fcf5e4",
              other: "#f3ecd6",
            }
          : {
              bg: "#dcebd4",
              hill: "#cee1c4",
              tree: "#7ca37a",
              leaf: "#a1be8c",
              tile: "#f2f4e4",
              other: "#eaf1de",
            };
  return (
    <svg
      viewBox="0 0 520 490"
      className="garden"
      role="img"
      aria-label={`Plansza sześć na sześć. Kaczka: kolumna ${w.x + 1}, wiersz ${w.y + 1}, patrzy ${["w górę", "w prawo", "w dół", "w lewo"][w.dir]}. Gwiazdka: kolumna ${l.goal[0] + 1}, wiersz ${l.goal[1] + 1}.`}
    >
      <defs>
        <pattern
          id="grass"
          width="44"
          height="39"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M8 18l2-4 2 4m23 15 2-4 2 4"
            stroke="#92b58c"
            strokeWidth="1.2"
            opacity=".6"
          />
        </pattern>
        <filter id="shadow" x="-50%" y="-40%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="5"
            floodColor="#3e6450"
            floodOpacity=".14"
          />
        </filter>
      </defs>
      <rect width="520" height="490" fill={colors.bg} />
      <rect width="520" height="490" fill="url(#grass)" />
      <path
        d="M-20 426c100-48 128 53 235 19s201-36 330-4v65H-20Z"
        fill={colors.hill}
      />
      <g fill={colors.tree}>
        <circle cx="25" cy="71" r="24" />
        <circle cx="9" cy="45" r="26" />
        <circle cx="33" cy="35" r="20" />
        <circle cx="496" cy="343" r="28" />
        <circle cx="512" cy="315" r="24" />
      </g>
      <g fill={colors.leaf}>
        <circle cx="21" cy="44" r="22" />
        <circle cx="505" cy="323" r="24" />
      </g>
      <path
        d="M376 448c-15-13-5-32 13-37s34 3 52 1 51 0 58 20-17 33-47 31-55 3-76-15Z"
        fill="#a6cfd1"
        stroke="#8fbabd"
        strokeWidth="2"
      />
      <path
        d="M408 432h20m27 12h18"
        stroke="#dbebdf"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g fill="#f9faf0" opacity=".9">
        <circle cx="58" cy="441" r="4" />
        <circle cx="65" cy="434" r="4" />
        <circle cx="70" cy="443" r="4" />
      </g>
      <circle cx="64" cy="440" r="4" fill="#e9b64b" />
      <rect
        x="73"
        y="38"
        width="374"
        height="374"
        rx="18"
        fill="#b9cfad"
        opacity=".6"
        transform="translate(0 6)"
      />
      {l.theme === "night" && (
        <g>
          <path
            d="M470 40a17 17 0 1 0 18 22 20 20 0 0 1-18-22"
            fill="#fff4be"
          />
          <path d="m47 225 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#fff8d8" />
        </g>
      )}
      {Array.from({ length: 36 }, (_, i) => {
        const x = i % 6,
          y = Math.floor(i / 6),
          key = `${x},${y}`,
          rock = l.rocks.includes(key),
          flower = l.flowers.includes(key),
          trail = w.trail.includes(key);
        return (
          <g key={key}>
            <rect
              x={77 + x * 61}
              y={42 + y * 61}
              width="59"
              height="59"
              rx="9"
              fill={(x + y) % 2 ? colors.other : colors.tile}
              stroke="#d1dfc2"
              strokeWidth="1"
            />
            {trail && (
              <circle cx={106 + x * 61} cy={72 + y * 61} r="5" fill="#a3c3a2" />
            )}
            {rock && (
              <g transform={`translate(${91 + x * 61},${58 + y * 61})`}>
                <path d="M0 29-2 15 8 2 26 4 34 22 25 31Z" fill="#a4ada0" />
                <path d="M8 2 14 16l20 6-8-18Z" fill="#b9c2b0" />
                <path d="M0 29l14-13L8 2-2 15Z" fill="#909e90" />
              </g>
            )}
            <TileObjects x={x} y={y} lesson={l} world={w} />
            {flower && (
              <g transform={`translate(${106 + x * 61},${72 + y * 61})`}>
                <path d="M0 0v18m0-4 9-7" stroke="#6c9d6b" strokeWidth="3" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse
                    key={a}
                    cx="0"
                    cy="-8"
                    rx="5"
                    ry="8"
                    fill={w.flowers.includes(key) ? "#f6c05a" : "#d89cb5"}
                    transform={`rotate(${a})`}
                  />
                ))}
                <circle r="5" fill="#fbebad" />
              </g>
            )}
          </g>
        );
      })}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} fill="#587456" fontSize="11" fontFamily="inherit">
          <text x={106 + i * 61} y="28" textAnchor="middle">
            {i + 1}
          </text>
          <text x="62" y={76 + i * 61} textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
      <g
        transform={`translate(${106 + l.goal[0] * 61},${72 + l.goal[1] * 61})`}
        className={success ? "goal collected" : "goal"}
      >
        <circle r="24" fill="#f9eab3" opacity=".75" />
        <path
          d="m0-18 5.6 11.3 12.5 1.8-9 8.8L11.2 16 0 10.1-11.2 16l2.1-12.1-9-8.8 12.5-1.8Z"
          fill="#eab849"
          stroke="#d29c32"
          strokeWidth="1.6"
        />
      </g>
      <g
        style={{
          transform: `translate(${106 + w.x * 61}px, ${72 + w.y * 61}px)`,
          transition: "transform .38s cubic-bezier(.2,.75,.3,1)",
        }}
      >
        <circle r="26" fill="#9ac3b3" opacity=".28" />
        <g
          className="robot-heading"
          data-heading={w.dir}
          style={{
            transform: `rotate(${w.angle}deg)`,
            transition: "transform .28s ease-in-out",
          }}
        >
          <path d="M-15-24 0-35 15-24" fill="#74a27c" opacity=".5" />
          <ellipse
            cy="14"
            rx="18"
            ry="13"
            fill="#a7beb2"
            stroke="#587463"
            strokeWidth="1.5"
          />
          <rect
            x="-22"
            y="14"
            width="15"
            height="10"
            rx="4"
            fill="#edaf48"
            stroke="#c98b32"
          />
          <rect
            x="7"
            y="14"
            width="15"
            height="10"
            rx="4"
            fill="#edaf48"
            stroke="#c98b32"
          />
          <rect
            x="-20"
            y="-17"
            width="40"
            height="32"
            rx="11"
            fill="#fffdf0"
            stroke="#526f60"
            strokeWidth="1.8"
          />
          <rect x="-15" y="-10" width="30" height="14" rx="6" fill="#d8e8dc" />
          <circle cx="-8" cy="-5" r="3.5" fill="#285641" />
          <circle cx="8" cy="-5" r="3.5" fill="#285641" />
          <path
            d="M-10-17v-7q10-8 20 0v7Z"
            fill="#f4b74f"
            stroke="#cc9238"
            strokeWidth="1.5"
          />
          <path d="M-7-23H7" stroke="#d99b3c" strokeWidth="1.5" />
          <rect x="-7" y="8" width="14" height="5" rx="2.5" fill="#94af9c" />
        </g>
        {active === "quack" && (
          <g>
            <rect
              x="14"
              y="-54"
              width="67"
              height="30"
              rx="13"
              fill="#fffdf6"
              stroke="#e4cd85"
            />
            <text
              x="47"
              y="-34"
              textAnchor="middle"
              fill="#716225"
              fontSize="15"
              fontWeight="bold"
            >
              kwa!
            </text>
          </g>
        )}
      </g>
      <g transform="translate(92 446)">
        <path d="m0 8 6-12 6 12m-6-12v26" stroke="#7ba171" strokeWidth="2" />
        <text x="24" y="11" fontFamily="inherit" fill="#5a7758" fontSize="12">
          Mały ogródek wielkich pomysłów
        </text>
      </g>
    </svg>
  );
}
function blockWord(n: number) {
  return n === 1
    ? "klocek"
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? "klocki"
      : "klocków";
}
function download(text: string, name: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function updateTree(
  bs: Block[],
  id: string,
  fn: (b: Block) => Block | null,
): Block[] {
  return bs.flatMap((b) => {
    if (b.id === id) {
      const n = fn(b);
      return n ? [n] : [];
    }
    return [
      {
        ...b,
        children: b.children ? updateTree(b.children, id, fn) : undefined,
        otherwise: b.otherwise ? updateTree(b.otherwise, id, fn) : undefined,
      },
    ];
  });
}
function depthOf(bs: Block[], id: string, depth = 0): number {
  for (const b of bs) {
    if (b.id === id) return depth;
    const d = depthOf(childBlocks(b), id, depth + 1);
    if (d >= 0) return d;
  }
  return -1;
}
function moveTree(bs: Block[], id: string, delta: number): Block[] {
  const i = bs.findIndex((b) => b.id === id);
  if (i >= 0) {
    const out = [...bs],
      j = i + delta;
    if (j >= 0 && j < out.length) [out[i], out[j]] = [out[j], out[i]];
    return out;
  }
  return bs.map((b) => ({
    ...b,
    children: b.children ? moveTree(b.children, id, delta) : undefined,
    otherwise: b.otherwise ? moveTree(b.otherwise, id, delta) : undefined,
  }));
}
const CONDITIONS: Record<Condition, string> = {
  clear: "wolna droga",
  flower: "stoję na kwiatku",
  notGoal: "nie ma mnie na gwiazdce",
};
const CONTAINERS: Block["type"][] = [
  "repeat",
  "flower",
  "clear",
  "while",
  "ifelse",
  "define",
];
function paletteTypes(lesson: Lesson): Block["type"][] {
  const base: Block["type"][] = [
    "forward",
    "left",
    "right",
    "quack",
    "wait",
    "repeat",
    "flower",
    ...(lesson.id === 0 || lesson.id >= 15 ? ["clear" as const] : []),
  ];
  const extra: Block["type"][] =
    lesson.id === 0 || lesson.id >= 28
      ? ["define", "call", "while", "ifelse"]
      : lesson.id >= 25
        ? ["ifelse", "while"]
        : lesson.id >= 21
          ? ["while"]
          : [];
  return [...extra, ...base];
}
export default function Home() {
  const [chapter, setChapter] = useState(0);
  const [lesson, setLesson] = useState(LESSONS[0]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [world, setWorld] = useState(() => initialWorld(LESSONS[0]));
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [targetBranch, setTargetBranch] = useState<"children" | "otherwise">(
    "children",
  );
  const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<"robot" | "parents" | "help" | null>(null);
  const [hint, setHint] = useState(false);
  const [sound, setSound] = useState(true);
  const [speed, setSpeed] = useState(650);
  const [message, setMessage] = useState("");
  const [won, setWon] = useState(false);
  const [tab, setTab] = useState<"blocks" | "code">("blocks");
  const [mapOpen, setMapOpen] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const worlds = useRef<World>(world);
  const execution = useRef<Execution | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allPrograms = useRef<Record<string, Block[]>>({});
  const importer = useRef<HTMLInputElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const runningRef = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE);
      if (raw) {
        const data = JSON.parse(raw);
        const id = Number(data.lesson);
        const l = [FREE, ...LESSONS].find((v) => v.id === id) ?? LESSONS[0];
        const programs: Record<string, Block[]> = {};
        if (data.programs && typeof data.programs === "object")
          for (const [key, value] of Object.entries(data.programs))
            try {
              programs[key] = validateProgram(value);
            } catch {}
        allPrograms.current = programs;
        setBlocks(programs[l.id] ?? starterProgram(l));
        setLesson(l);
        setChapter(chapterFor(l.id));
        const w = initialWorld(l);
        setWorld(w);
        worlds.current = w;
        setCompleted(validCompleted(data.completed));
        setSound(data.sound !== false);
      }
    } catch {
      setStorageWarning(true);
    }
    setLoaded(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    allPrograms.current[lesson.id] = blocks;
    try {
      localStorage.setItem(
        SAVE,
        JSON.stringify({
          lesson: lesson.id,
          programs: allPrograms.current,
          completed,
          sound,
        }),
      );
    } catch {
      setStorageWarning(true);
    }
  }, [blocks, lesson, completed, sound, loaded]);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".modal button:not(:disabled), .modal a[href]",
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
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [modal]);
  function halt() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    runningRef.current = false;
    setRunning(false);
    setActiveId(null);
    setActiveType(null);
  }
  function reset() {
    halt();
    const w = initialWorld(lesson);
    worlds.current = w;
    setWorld(w);
    execution.current = null;
    setMessage("");
    setWon(false);
  }
  function selectLesson(l: Lesson) {
    halt();
    allPrograms.current[lesson.id] = blocks;
    setBlocks(allPrograms.current[l.id] ?? starterProgram(l));
    setLesson(l);
    setChapter(chapterFor(l.id));
    const w = initialWorld(l);
    setWorld(w);
    worlds.current = w;
    execution.current = null;
    setTarget(null);
    setHint(false);
    setMessage("");
    setWon(false);
    setMapOpen(false);
    setTab("blocks");
    setNameDrafts({});
  }
  function edited(next: Block[]) {
    reset();
    setBlocks(next);
  }
  function add(type: Block["type"]) {
    if (runningRef.current) return;
    if (
      target &&
      depthOf(blocks, target) >= 3 &&
      CONTAINERS.includes(type) &&
      type !== "define"
    ) {
      setMessage(
        "Wystarczą cztery poziomy klocków. Dodaj zwykłe polecenie albo wróć na koniec programu.",
      );
      return;
    }
    if (countBlocks(blocks) >= 60) {
      setMessage("Masz już 60 klocków. Spróbuj użyć pętli lub funkcji.");
      return;
    }
    const definitions = blocks.filter((b) => b.type === "define");
    const owner = target
      ? definitions.find(
          (b) => b.id === target || depthOf(childBlocks(b), target) >= 0,
        )
      : undefined;
    const available = definitions.filter((b) => b.id !== owner?.id);
    if (type === "call" && !available.length) {
      setMessage(
        definitions.length
          ? "Dodaj wywołanie poza swoją definicją. Kliknij „Wróć na koniec programu”."
          : "Najpierw kliknij „Stwórz funkcję”, nazwij ją i dodaj do niej polecenia.",
      );
      return;
    }
    let name = "moj_przepis",
      n = 2;
    while (definitions.some((b) => b.name === name))
      name = `moj_przepis_${n++}`;
    const b: Block = {
      id: crypto.randomUUID(),
      type,
      ...(CONTAINERS.includes(type) ? { children: [] } : {}),
      ...(type === "repeat" ? { count: 2 } : {}),
      ...(type === "while" ? { condition: "clear" as const } : {}),
      ...(type === "ifelse"
        ? { condition: "flower" as const, otherwise: [] }
        : {}),
      ...(type === "define" ? { name } : {}),
      ...(type === "call" ? { name: available[0]?.name } : {}),
    };
    const next =
      target && type !== "define"
        ? updateTree(blocks, target, (p) => ({
            ...p,
            [targetBranch]: [...(p[targetBranch] ?? []), b],
          }))
        : [...blocks, b];
    edited(next);
    if (CONTAINERS.includes(type)) {
      setTarget(b.id);
      setTargetBranch("children");
    }
  }
  function renameFunction(id: string, value: string) {
    const definition = blocks.find((b) => b.id === id);
    if (!definition) return;
    const oldName = definition.name;
    try {
      validateProgram([{ type: "define", name: value, children: [] }]);
      function rename(list: Block[]): Block[] {
        return list.map((b) => ({
          ...b,
          name:
            b.id === id || (b.type === "call" && b.name === oldName)
              ? value
              : b.name,
          children: b.children ? rename(b.children) : undefined,
          otherwise: b.otherwise ? rename(b.otherwise) : undefined,
        }));
      }
      edited(rename(blocks));
    } catch (e) {
      setMessage((e as Error).message);
    }
    setNameDrafts((d) => {
      const next = { ...d };
      delete next[id];
      return next;
    });
  }
  function beep() {
    if (!sound) return;
    try {
      const ac = audio.current ?? new AudioContext();
      audio.current = ac;
      void ac.resume();
      const o = ac.createOscillator(),
        g = ac.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(460, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.16);
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.055, ac.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.2);
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.21);
    } catch {}
  }
  function finish(w: World) {
    halt();
    const r = resultFor(w, lesson, blocks);
    setMessage(r.message);
    setWon(r.success);
    if (r.success)
      setCompleted((v) => (v.includes(lesson.id) ? v : [...v, lesson.id]));
  }
  function tick(auto: boolean) {
    try {
      if (!execution.current) {
        finish(worlds.current);
        return;
      }
      const step = stepExecution(execution.current, worlds.current, lesson);
      worlds.current = step.world;
      setWorld(step.world);
      setActiveId(step.id);
      setActiveType(step.type);
      if (step.type === "quack") beep();
      if (step.world.bump) {
        halt();
        execution.current = null;
        setMessage(
          "Tu jest przeszkoda! Popraw trasę albo sprawdź drogę przed krokiem.",
        );
        return;
      }
      if (step.done) {
        timer.current = setTimeout(
          () => finish(worlds.current),
          auto ? speed : 200,
        );
        return;
      }
      if (auto) timer.current = setTimeout(() => tick(true), speed);
    } catch (e) {
      halt();
      execution.current = null;
      setMessage((e as Error).message);
    }
  }
  function run(step = false) {
    if (runningRef.current) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!blocks.length) {
      setMessage("Kliknij kolorowy klocek, żeby zacząć!");
      return;
    }
    try {
      if (
        !execution.current ||
        execution.current.pc >= execution.current.code.length
      ) {
        execution.current = createExecution(blocks);
        const w = initialWorld(lesson);
        worlds.current = w;
        setWorld(w);
      }
      if (!execution.current.code.length) {
        setMessage(
          "Sam przepis jeszcze niczego nie robi. Dodaj „Użyj funkcji” pod definicją albo wypełnij pustą pętlę.",
        );
        return;
      }
      setMessage("");
      setWon(false);
      if (!step) {
        runningRef.current = true;
        setRunning(true);
      }
      tick(!step);
    } catch (e) {
      halt();
      execution.current = null;
      setMessage((e as Error).message);
    }
  }
  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setMessage(
        "Ta przeglądarka nie obsługuje czytania. Przeczytajcie zadanie razem.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pl-PL";
    u.rate = 0.86;
    window.speechSynthesis.speak(u);
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 60000)
        throw Error(
          "Plik jest za duży. Wybierz program zapisany w Kaczym Kodzie.",
        );
      const data = JSON.parse(await file.text());
      if (data.format !== "kaczy-kod-v1")
        throw Error("To nie jest plik z Kaczego Kodu.");
      const bs = validateProgram(data.blocks);
      compile(bs);
      edited(bs);
      setTarget(null);
      setMessage("Program wczytany. Możesz go uruchomić!");
    } catch (e) {
      setMessage((e as Error).message);
    }
    if (importer.current) importer.current.value = "";
  }
  function exportPython() {
    try {
      if (!blocks.length) throw Error("Najpierw ułóż program z klocków.");
      download(pythonProgram(blocks), "kaczy-program.py", "text/x-python");
    } catch (e) {
      setMessage((e as Error).message);
      setModal(null);
    }
  }
  function renderBlocks(bs: Block[], depth = 0): React.ReactNode {
    return bs.map((b, i) => {
      const m = META[b.type],
        Icon = m.icon,
        container = CONTAINERS.includes(b.type);
      function branch(which: "children" | "otherwise") {
        const selected = target === b.id && targetBranch === which;
        return (
          <div
            className={`nested ${selected ? "insertion-selected" : ""} ${which === "otherwise" ? "else-branch" : ""}`}
          >
            {b.type === "ifelse" && (
              <div className="branch-label">
                {which === "children" ? "JEŚLI — TAK" : "INACZEJ — NIE"}
              </div>
            )}
            {renderBlocks(b[which] ?? [], depth + 1)}
            {depth < 4 && (
              <button
                className="insert"
                disabled={running}
                onClick={() => {
                  setTarget(selected ? null : b.id);
                  setTargetBranch(which);
                }}
              >
                {selected ? (
                  <>
                    <Check size={14} />
                    Gotowe
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    {b.type === "ifelse"
                      ? which === "children"
                        ? "Dodaj do „jeśli”"
                        : "Dodaj do „inaczej”"
                      : "Dodaj do środka"}
                  </>
                )}
              </button>
            )}
            {!b[which]?.length && (
              <small>
                {b.type === "define"
                  ? "Tu napisz przepis. Wykona się, gdy użyjesz funkcji."
                  : b.type === "while"
                    ? "Te polecenia będą powtarzane, dopóki warunek jest prawdziwy."
                    : b.type === "ifelse"
                      ? which === "children"
                        ? "Ta gałąź działa, gdy odpowiedź brzmi TAK."
                        : "Ta gałąź działa, gdy odpowiedź brzmi NIE."
                      : "Wybierz polecenie z kolorowych klocków."}
              </small>
            )}
          </div>
        );
      }
      return (
        <div
          key={b.id}
          className={`program-item ${m.color} ${container ? "container-block" : ""} ${activeId === b.id ? "executing" : ""} ${target === b.id ? "target" : ""} ${b.type === "define" ? "function-definition" : ""}`}
        >
          <div className="block-line">
            <Icon size={19} />
            <span className="block-label">{m.label}</span>
            {b.type === "repeat" && (
              <label className="repeat-count">
                <select
                  aria-label="Liczba powtórzeń"
                  value={b.count}
                  disabled={running}
                  onChange={(e) =>
                    edited(
                      updateTree(blocks, b.id, (p) => ({
                        ...p,
                        count: Number(e.target.value),
                      })),
                    )
                  }
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                razy
              </label>
            )}
            <div className="block-tools">
              <button
                disabled={running || i === 0}
                aria-label={`Przesuń w górę: ${m.label}`}
                onClick={() => edited(moveTree(blocks, b.id, -1))}
              >
                <ArrowUp size={13} />
              </button>
              <button
                disabled={running || i === bs.length - 1}
                aria-label={`Przesuń w dół: ${m.label}`}
                onClick={() => edited(moveTree(blocks, b.id, 1))}
              >
                <ArrowDown size={13} />
              </button>
              <button
                disabled={running}
                aria-label={`Usuń: ${m.label}`}
                onClick={() => {
                  edited(updateTree(blocks, b.id, () => null));
                  setTarget(null);
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
          {(b.type === "while" || b.type === "ifelse") && (
            <label className="block-setting">
              <span>Warunek:</span>
              <select
                aria-label={
                  b.type === "while" ? "Warunek pętli while" : "Warunek if/else"
                }
                value={b.condition ?? (b.type === "while" ? "clear" : "flower")}
                disabled={running}
                onChange={(e) =>
                  edited(
                    updateTree(blocks, b.id, (p) => ({
                      ...p,
                      condition: e.target.value as Condition,
                    })),
                  )
                }
              >
                {Object.entries(CONDITIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {b.type === "define" && (
            <label className="block-setting">
              <span>Nazwa:</span>
              <input
                aria-label="Nazwa funkcji"
                value={nameDrafts[b.id] ?? b.name ?? ""}
                placeholder="moj_przepis"
                maxLength={24}
                disabled={running}
                onChange={(e) =>
                  setNameDrafts((d) => ({ ...d, [b.id]: e.target.value }))
                }
                onBlur={(e) => renameFunction(b.id, e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </label>
          )}
          {b.type === "call" && (
            <label className="block-setting">
              <span>Wywołaj:</span>
              <select
                aria-label="Wywoływana funkcja"
                value={b.name}
                disabled={running}
                onChange={(e) =>
                  edited(
                    updateTree(blocks, b.id, (p) => ({
                      ...p,
                      name: e.target.value,
                    })),
                  )
                }
              >
                {!blocks.some(
                  (p) => p.type === "define" && p.name === b.name,
                ) && <option value={b.name}>{b.name} (brak definicji)</option>}
                {blocks
                  .filter((p) => p.type === "define")
                  .map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}()
                    </option>
                  ))}
              </select>
            </label>
          )}
          {container && branch("children")}
          {b.type === "ifelse" && branch("otherwise")}
        </div>
      );
    });
  }
  const code = (() => {
    try {
      return learningCode(blocks);
    } catch (e) {
      return "# " + (e as Error).message;
    }
  })();
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Kaczy Kod — strona główna">
          <span className="brand-icon">
            <Duck small />
          </span>
          <span>
            Kaczy<span className="brand-light">Kod</span>
            <small>MAŁE KROKI. WIELKIE ODKRYCIA.</small>
          </span>
        </a>
        <div className="top-middle">
          <span className="tiny-dot" /> Pracownia małych programistek i
          programistów
        </div>
        <div className="top-actions">
          <button
            className="icon-button"
            title={sound ? "Wyłącz dźwięk" : "Włącz dźwięk"}
            aria-label={sound ? "Wyłącz dźwięk" : "Włącz dźwięk"}
            onClick={() => setSound(!sound)}
          >
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button className="parent-link" onClick={() => setModal("parents")}>
            <Heart size={17} />
            Dla rodzica
          </button>
          <button className="robot-button" onClick={() => setModal("robot")}>
            <span className="connection-dot" />
            Nasz Microduck
            <ChevronRight size={16} />
          </button>
        </div>
      </header>
      <aside className={`sidebar ${mapOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-label">
          TWOJA PRZYGODA <span>01—{LESSONS.length}</span>
        </div>
        <div className="journey-heading">
          <Map size={19} />
          <span>Odkrywamy kod</span>
        </div>
        <div className="chapter-picker" role="group" aria-label="Rozdziały">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.title}
              className={chapter === i ? "chosen" : ""}
              onClick={() => setChapter(i)}
              aria-pressed={chapter === i}
            >
              <span>{c.range}</span>
              <strong>{c.title}</strong>
              <small>
                {
                  LESSONS.filter(
                    (l) =>
                      l.id >= c.from &&
                      l.id <= c.to &&
                      completed.includes(l.id),
                  ).length
                }
                /{c.to - c.from + 1} <Star size={10} />
              </small>
            </button>
          ))}
        </div>
        <nav aria-label="Przygody">
          {LESSONS.filter(
            (l) =>
              l.id >= CHAPTERS[chapter].from && l.id <= CHAPTERS[chapter].to,
          ).map((l) => (
            <button
              key={l.id}
              className={`lesson-link ${lesson.id === l.id ? "selected" : ""} ${completed.includes(l.id) ? "done" : ""}`}
              onClick={() => selectLesson(l)}
            >
              <span className="lesson-num">
                {completed.includes(l.id) ? (
                  <Check size={15} />
                ) : (
                  String(l.id).padStart(2, "0")
                )}
              </span>
              <span>
                {l.title}
                <small>{l.concept}</small>
              </span>
              {lesson.id === l.id && <span className="selected-dot" />}
            </button>
          ))}
        </nav>
        <div className="free-divider" />
        <button
          className={`free-button ${lesson.id === 0 ? "selected" : ""}`}
          onClick={() => selectLesson(FREE)}
        >
          <Sparkles size={19} />
          Swobodna zabawa
          <ArrowRight size={15} />
        </button>
        <div className="progress-card">
          <div className="progress-stars">
            <Star size={18} fill="#eaba50" />
            <strong>
              {completed.length}
              <span> / {LESSONS.length} gwiazdek</span>
            </strong>
          </div>
          <div className="progress-track">
            <span
              style={{ width: `${(completed.length / LESSONS.length) * 100}%` }}
            />
          </div>
          <p>Każdy pomysł to krok do przodu.</p>
        </div>
        <button className="help-link" onClick={() => setModal("help")}>
          <HelpCircle size={17} />
          Jak się bawić?
        </button>
        <span className="sidebar-footer">
          Z ciekawością, razem. <Heart size={12} />
        </span>
      </aside>
      <main>
        <div className="mobile-journey">
          <button onClick={() => setMapOpen(!mapOpen)}>
            <Map size={17} />
            Wybierz przygodę
            <ChevronDown size={16} />
          </button>
          <span>
            {completed.length}/{LESSONS.length} <Star size={15} />
          </span>
        </div>
        {lesson.id <= 8 &&
          [1, 2, 3, 4, 5, 6, 7, 8].every((id) => completed.includes(id)) && (
            <div className="new-adventures">
              <Sparkles size={20} />
              <span>
                <strong>{LESSONS.length - 8} nowych przygód już czeka!</strong>{" "}
                Wasze 8 gwiazdek zostaje z Wami.
              </span>
              <button onClick={() => selectLesson(LESSONS[8])}>
                Ruszamy dalej <ArrowRight size={16} />
              </button>
            </div>
          )}
        {lesson.id >= 9 &&
          lesson.id <= 20 &&
          Array.from({ length: 20 }, (_, i) => i + 1).every((id) =>
            completed.includes(id),
          ) && (
            <div className="new-adventures">
              <Sparkles size={20} />
              <span>
                <strong>Nowe: while, if/else i własne funkcje!</strong> Wasze 20
                gwiazdek zostaje z Wami.
              </span>
              <button onClick={() => selectLesson(LESSONS[20])}>
                Ruszamy dalej <ArrowRight size={16} />
              </button>
            </div>
          )}
        <section className="mission-heading">
          <div>
            <div className="eyebrow">
              <span>
                PRZYGODA {lesson.id ? String(lesson.id).padStart(2, "0") : "∞"}
              </span>
              <i /> {lesson.concept}
            </div>
            <h1>
              {lesson.title}
              <span className="title-spark">✳</span>
            </h1>
            <p>
              {lesson.id > 8
                ? CHAPTERS[chapterFor(lesson.id)].description +
                  ". Czas na nowy pomysł!"
                : "Trochę klocków. Szczypta wyobraźni. Twój pierwszy kod."}
            </p>
          </div>
          <div className="time-chip">
            <BookOpen size={18} />
            <span>
              Na dobry początek<small>10–15 minut razem</small>
            </span>
          </div>
        </section>
        <section className="mission-card">
          <div className="mission-duck">
            <Duck small />
          </div>
          <div>
            <span className="mission-caption">CZEŚĆ, TO JA, KACZKA!</span>
            <p>{lesson.intro}</p>
          </div>
          <button
            className="listen"
            title="Posłuchaj zadania"
            aria-label="Posłuchaj zadania"
            onClick={() => speak(lesson.intro)}
          >
            <Volume2 size={20} />
          </button>
          <button
            aria-label="Mała podpowiedź"
            className={`hint-button ${hint ? "shown" : ""}`}
            onClick={() => setHint(!hint)}
          >
            <Lightbulb size={18} />
            <span>Mała podpowiedź</span>
          </button>
        </section>
        {hint && (
          <div className="hint-panel">
            <Lightbulb size={20} />
            <p>{lesson.hint}</p>
            <button
              aria-label="Posłuchaj podpowiedzi"
              onClick={() => speak(lesson.hint)}
            >
              <Volume2 size={18} />
            </button>
          </div>
        )}
        {lesson.id > 8 && (
          <div className="mission-objectives" aria-label="Cele przygody">
            {lesson.treasures && (
              <span
                className={
                  world.collected.length === lesson.treasures.length
                    ? "achieved"
                    : ""
                }
              >
                🍒 Wisienki {world.collected.length}/{lesson.treasures.length}
              </span>
            )}
            {lesson.checkpoints && (
              <span
                className={
                  world.checkpoint === lesson.checkpoints.length
                    ? "achieved"
                    : ""
                }
              >
                <Flag size={15} />
                Przystanki {world.checkpoint}/{lesson.checkpoints.length}
              </span>
            )}
            {lesson.key && (
              <span className={world.hasKey ? "achieved" : ""}>
                ⚿{" "}
                {world.hasKey
                  ? "Klucz zebrany · furtka otwarta"
                  : "Znajdź klucz · furtka zamknięta"}
              </span>
            )}
            {lesson.maxMoves !== undefined && (
              <span
                className={world.moves > lesson.maxMoves ? "over-budget" : ""}
              >
                <Footprints size={15} />
                Kroki {world.moves}/{lesson.maxMoves}
              </span>
            )}
            {lesson.maxBlocks !== undefined && (
              <span
                className={
                  countBlocks(blocks) > lesson.maxBlocks ? "over-budget" : ""
                }
              >
                <Code2 size={15} />
                Klocki {countBlocks(blocks)}/{lesson.maxBlocks}
              </span>
            )}
            {lesson.functionRequired && (
              <span>
                <Code2 size={15} />
                Wywołania: {world.functionCalls}/{lesson.minCalls ?? 1}
              </span>
            )}
            {lesson.ifElseRequired && (
              <span>
                <Settings2 size={15} />
                TAK: {world.thenCount} · NIE: {world.elseCount}
              </span>
            )}
            {lesson.quacks !== undefined && (
              <span>
                <Volume2 size={15} />
                Kwa: {world.quacks}/{lesson.quacks}
              </span>
            )}
            {lesson.finishDir !== undefined && (
              <span>
                <ArrowUp
                  size={15}
                  style={{ transform: `rotate(${lesson.finishDir * 90}deg)` }}
                />
                Na koniec patrz{" "}
                {["w górę", "w prawo", "w dół", "w lewo"][lesson.finishDir]}
              </span>
            )}
            {lesson.starter && (
              <button
                disabled={running}
                onClick={() => {
                  edited(starterProgram(lesson));
                  setTarget(null);
                }}
              >
                <RotateCcw size={14} />
                Przywróć zagadkę
              </button>
            )}
          </div>
        )}
        {lesson.id >= 21 && (
          <details
            className="concept-card"
            key={`tip-${lesson.id}`}
            open={[21, 25, 28].includes(lesson.id)}
          >
            <summary>
              <BookOpen size={17} />
              {lesson.id <= 24
                ? "Nowy pomysł: while, czyli „dopóki”"
                : lesson.id <= 27
                  ? "Nowy pomysł: if/else, czyli „jeśli / inaczej”"
                  : "Nowy pomysł: funkcja, czyli Twój własny przepis"}
            </summary>
            <p>
              {lesson.id <= 24
                ? "„Powtórz” z góry zna liczbę powtórzeń. „Dopóki” pyta przed każdym powtórzeniem: czy warunek nadal jest prawdziwy? Jeżeli NIE — kończy pętlę."
                : lesson.id <= 27
                  ? "Kaczka sprawdza warunek i wybiera jedną drogę. TAK: wykonuje klocki pod „jeśli”. NIE: wykonuje klocki pod „inaczej”. Nigdy obu naraz."
                  : "Definicja mówi, JAK coś zrobić. Wywołanie mówi: ZRÓB TO TERAZ. Nadaj przepisowi nazwę i używaj go wielokrotnie. Zmiana jednej definicji poprawia każde wywołanie."}
            </p>
          </details>
        )}
        <div className="workbench">
          <section className="palette">
            <div className="section-heading">
              <h2>Twoje klocki</h2>
              <span>1</span>
            </div>
            <p className="section-description">Kliknij, żeby dodać.</p>
            <div className="palette-list">
              {paletteTypes(lesson).map((type, i) => {
                const m = META[type],
                  Icon = m.icon;
                return (
                  <div key={type}>
                    {((lesson.id < 21 && i === 5) ||
                      (lesson.id >= 21 && i === 0)) && (
                      <div className="palette-divider">
                        {lesson.id >= 21 ? "NOWY POMYSŁ" : "ODROBINA MAGII"}{" "}
                        <Sparkles size={12} />
                      </div>
                    )}
                    <button
                      className={`palette-block ${m.color}`}
                      disabled={running}
                      onClick={() => add(type)}
                    >
                      <span className="command-icon">
                        <Icon size={22} />
                      </span>
                      <span>
                        {m.label}
                        <small>{m.sub}</small>
                      </span>
                      <Plus size={15} className="add-icon" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mini-tip">
              <span>✦</span>
              <p>
                Komputer czyta klocki
                <br />
                <b>od góry do dołu.</b>
              </p>
            </div>
          </section>
          <section className="program-panel">
            <div className="section-heading">
              <h2>Twój program</h2>
              <span>2</span>
            </div>
            <div className="program-toolbar">
              <div className="code-tabs">
                <button
                  className={tab === "blocks" ? "on" : ""}
                  onClick={() => setTab("blocks")}
                >
                  <Code2 size={15} />
                  Klocki
                </button>
                <button
                  className={tab === "code" ? "on" : ""}
                  onClick={() => setTab("code")}
                >
                  Python
                </button>
              </div>
              <button
                className="icon-button compact"
                title="Wyczyść program"
                aria-label="Wyczyść program"
                disabled={running || !blocks.length}
                onClick={() => {
                  edited([]);
                  setTarget(null);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            {tab === "blocks" ? (
              <div className="program-canvas">
                <div className="start-block">
                  <Flag size={17} />
                  Kiedy kliknę start
                  <Play size={12} fill="currentColor" />
                </div>
                {blocks.length ? (
                  <div className="program-stack">{renderBlocks(blocks)}</div>
                ) : (
                  <div className="empty-program">
                    <div className="dashed-block">
                      <Plus size={24} />
                    </div>
                    <strong>Tu zaczyna się pomysł</strong>
                    <p>
                      Wybierz pierwszy klocek
                      <br />z kolorowej kolekcji obok.
                    </p>
                    <span className="empty-arrow">⤴</span>
                  </div>
                )}
                {target && (
                  <div className="target-note">
                    Dodajesz do{" "}
                    {targetBranch === "otherwise"
                      ? "gałęzi „inaczej”"
                      : "wybranego klocka"}
                    .
                    <button onClick={() => setTarget(null)}>
                      Wróć na koniec programu <ArrowDown size={12} />
                    </button>
                  </div>
                )}
                <div className="end-dot" />
              </div>
            ) : (
              <div className="code-preview">
                <span>Python do nauki · polecenia dotyczą planszy gry.</span>
                <pre>{code}</pre>
                <button
                  onClick={() => download(code, "moj-program-python.txt")}
                >
                  <Download size={15} />
                  Zapisz podgląd
                </button>
              </div>
            )}
            <div className="program-bottom">
              <span>
                {countBlocks(blocks)} {blockWord(countBlocks(blocks))}
              </span>
              <div>
                <button
                  title="Zapisz program do pliku"
                  aria-label="Zapisz program do pliku"
                  onClick={() =>
                    download(
                      JSON.stringify(
                        { format: "kaczy-kod-v1", blocks },
                        null,
                        2,
                      ),
                      "moj-kaczy-program.json",
                      "application/json",
                    )
                  }
                >
                  <Download size={17} />
                </button>
                <button
                  title="Wczytaj program z pliku"
                  aria-label="Wczytaj program z pliku"
                  disabled={running}
                  onClick={() => importer.current?.click()}
                >
                  <Upload size={17} />
                </button>
                <input
                  ref={importer}
                  type="file"
                  accept=".json,application/json"
                  hidden
                  onChange={(e) => void importFile(e.target.files?.[0])}
                />
              </div>
            </div>
          </section>
          <section className="stage-panel">
            <div className="section-heading stage-heading">
              <h2>
                {lesson.theme === "night"
                  ? "Nocna wyprawa"
                  : lesson.theme === "lagoon"
                    ? "Nad kaczym stawem"
                    : lesson.theme === "orchard"
                      ? "Wiśniowy sad"
                      : "Ogródek Kaczki"}
              </h2>
              <span className="simulation-badge">
                <i />
                SYMULATOR 2D
              </span>
            </div>
            <div className={`stage-viewport theme-${lesson.theme ?? "garden"}`}>
              <div className="stage-label">
                <span className="tiny-dot" />
                {running ? "Program w drodze…" : "Gotowa na przygodę"}
              </div>
              <Garden
                world={world}
                lesson={lesson}
                active={activeType}
                success={won}
              />
              <div className="stage-legend">
                <span className="heading-readout">
                  Przód: {["↑", "→", "↓", "←"][world.dir]} ·{" "}
                  {["góra", "prawo", "dół", "lewo"][world.dir]}
                </span>
                <span>
                  <Star size={13} fill="#e8ba50" />
                  Twój cel
                </span>
                <span>
                  <span className="legend-circle" />
                  Twój ślad
                </span>
                <button
                  title="Wróć na początek planszy"
                  aria-label="Wróć na początek planszy"
                  onClick={reset}
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>
            <div className="run-controls">
              <button
                className={`run-button ${running ? "stop" : ""}`}
                onClick={() => {
                  if (running) {
                    halt();
                    setMessage(
                      "Pauza. Możesz kontynuować albo wrócić na początek.",
                    );
                  } else run();
                }}
              >
                {running ? (
                  <>
                    <Square size={18} fill="currentColor" />
                    Zatrzymaj
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    Start!
                  </>
                )}
              </button>
              <button
                className="step-button"
                disabled={running}
                onClick={() => run(true)}
              >
                <Footprints size={19} />
                Po jednym
              </button>
              <div className="speed-control">
                <label htmlFor="speed">Tempo</label>
                <select
                  id="speed"
                  value={speed}
                  disabled={running}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                >
                  <option value="1000">Spokojnie</option>
                  <option value="650">W sam raz</option>
                  <option value="280">Szybciutko</option>
                </select>
              </div>
            </div>
            <div
              className={`feedback ${won ? "success" : ""}`}
              role="status"
              aria-live="polite"
            >
              {won ? (
                <Star size={21} fill="currentColor" />
              ) : message ? (
                <Lightbulb size={20} />
              ) : (
                <span className="feedback-spark">✧</span>
              )}
              <p>
                {message ||
                  "Najpierw ułóż plan. Potem sprawdź, co zrobi Kaczka!"}
              </p>
              {won && lesson.id < LESSONS.length && (
                <button
                  aria-label="Następna przygoda"
                  onClick={() => selectLesson(LESSONS[lesson.id])}
                >
                  <ArrowRight size={21} />
                </button>
              )}
            </div>
          </section>
        </div>
        <footer className="workspace-footer">
          <span>
            <span className="save-dot" />
            {storageWarning
              ? "Pobierz program, by zachować swoją pracę."
              : "Pomysły zapisują się w tej przeglądarce."}
          </span>
          <button onClick={() => setModal("parents")}>
            Dziś dziecko jest kapitanem. Ty — ciekawym pomocnikiem.
            <Heart size={14} />
          </button>
        </footer>
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
              className="modal-close icon-button"
              autoFocus
              aria-label="Zamknij"
              onClick={() => setModal(null)}
            >
              <X size={22} />
            </button>
            <div className="modal-symbol">
              {modal === "robot" ? (
                <Duck />
              ) : modal === "parents" ? (
                <Heart size={30} />
              ) : (
                <Lightbulb size={30} />
              )}
            </div>
            <div className="eyebrow">
              {modal === "robot"
                ? "OD KLOCKÓW DO PRAWDZIWEGO ROBOTA"
                : "ODKRYWAJCIE RAZEM"}
            </div>
            <h2 id="modal-title">
              {modal === "robot"
                ? "A kiedy przyjedzie Microduck…"
                : modal === "parents"
                  ? "Mała programistka. Wielkie pomysły."
                  : "Pierwszy program w 3 krokach"}
            </h2>
            {modal === "robot" ? (
              <>
                <p>
                  Zapisany program możecie wykonać na Microducku. Przygotowałem
                  eksport do Pythona korzystający z otwartego API Pollen
                  Robotics.
                </p>
                <div className="notice">
                  <strong>Teraz bawicie się w symulatorze 2D.</strong> Nie jest
                  połączony z robotem ani nie symuluje jego fizyki. Eksport
                  wymaga konfiguracji przez rodzica; nie był testowany na
                  fizycznym robocie.
                </div>
                <ol>
                  <li>
                    <b>Gdy robot przyjedzie:</b> przejdźcie oficjalną
                    konfigurację Pollen. Włączcie Bluetooth i zainstalujcie
                    narzędzie:
                    <code>brew install pierre-rouanet/tools/duckctl</code>
                  </li>
                  <li>
                    <b>Pobierz program</b> poniżej. W Terminalu, w folderze
                    Pobrane, skopiuj go na robota (wstaw jego nazwę z{" "}
                    <code>duckctl scan</code>):
                    <code>
                      duckctl --name TWOJA-KACZKA scp kaczy-program.py :/tmp/
                    </code>
                  </li>
                  <li>
                    <b>Zajrzyj na robota</b> przez{" "}
                    <code>duckctl --name TWOJA-KACZKA ssh</code>. Najpierw próba
                    bez ruchu:<code>python3 /tmp/kaczy-program.py</code>
                  </li>
                  <li>
                    <b>Rodzic uruchamia ruch.</b> Na wolnej, płaskiej podłodze
                    włącz chodzenie przyciskiem Start na padzie. Potem:
                    <code>sudo python3 /tmp/kaczy-program.py --run</code>
                  </li>
                </ol>
                <p className="modal-small">
                  Krok to ok. 8 cm, a skręt ok. 90° — wartości zależą od podłoża
                  i chodu robota. Warunki planszy, while i if/else działają
                  tylko w grze. Funkcje bez warunków można eksportować. Ctrl+C
                  zatrzymuje program i wysyła robot.stop; silniki pozostają
                  włączone. Sprawdź dostępność Pythona i SSH w dostarczonym
                  oprogramowaniu.
                </p>
                <button className="modal-primary" onClick={exportPython}>
                  <Download size={18} />
                  Pobierz program dla Microducka
                </button>
                <a
                  className="source-link"
                  href="https://github.com/pollen-robotics/microduck/blob/main/docs/robot/duckctl.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  Oficjalna instrukcja Pollen Robotics ↗
                </a>
              </>
            ) : modal === "parents" ? (
              <>
                <p>
                  Najlepsza pierwsza lekcja trwa 10–15 minut. Jedna przygoda
                  wystarczy. Zapytaj: „Jak myślisz, co teraz zrobi Kaczka?”.
                </p>
                <ul className="parent-tips">
                  <li>
                    <strong>Najpierw przewidujcie.</strong> Przed Startem
                    przejdźcie palcem po klockach. Program to plan, który
                    czytamy od góry.
                  </li>
                  <li>
                    <strong>Pomyłka daje podpowiedź.</strong> Użyjcie „Po
                    jednym”, znajdźcie zaskakujący krok i zmieńcie jeden klocek.
                  </li>
                  <li>
                    <strong>Zamieniajcie się rolami.</strong> Dziecko planuje,
                    rodzic klika. Potem na odwrót.
                  </li>
                  <li>
                    <strong>Najpierw krok, potem pętla.</strong> Przygody 1–4
                    uczą kolejności i skrętów, 5–6 powtarzania, 7 warunku, a 8
                    łączy pomysły. Przygody 9–14 dodają zbieranie, przystanki i
                    naprawianie kodu. W 15–20 pojawiają się klucze, furtki i
                    sprawdzanie drogi.
                  </li>
                </ul>
                <div className="notice">
                  Bez konta dziecka, reklam i czatu. Postępy są zapisane
                  lokalnie w przeglądarce. Użyj strzałki pobierania pod
                  programem, żeby zachować plik lub przenieść go na inny
                  komputer.
                </div>
                <button
                  className="modal-primary"
                  onClick={() => {
                    setModal(null);
                    selectLesson(LESSONS[0]);
                  }}
                >
                  Zaczynamy razem <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <ol className="howto">
                  <li>
                    <strong>Wybierz klocki.</strong> Kliknij kolorowe polecenia.
                    Pojawią się w Twoim programie.
                  </li>
                  <li>
                    <strong>Ułóż swój plan.</strong> Strzałki przy klocku
                    zmieniają kolejność, a krzyżyk go usuwa. W pętli kliknij
                    „Dodaj do środka”, potem wybierz polecenie.
                  </li>
                  <li>
                    <strong>Kliknij Start!</strong> Kaczka wykona polecenia od
                    góry do dołu. „Po jednym” pozwala obejrzeć każdy krok
                    osobno.
                  </li>
                </ol>
                <div className="notice">
                  Pomarańczowy dziób pokazuje przód Kaczki. Cały robot obraca
                  się przy skręcie. Lewo i prawo liczymy od strony Kaczki. Skręt
                  obraca ją w miejscu. Przeszkoda zatrzymuje program — popraw go
                  i spróbuj jeszcze raz.
                </div>
                <button
                  className="modal-primary"
                  onClick={() => setModal(null)}
                >
                  Wszystko jasne! <Check size={18} />
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
