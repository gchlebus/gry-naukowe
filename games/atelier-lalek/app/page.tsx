"use client";
import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Doll, type Focus } from "../components/doll";
import { CatalogArt } from "../components/catalog-art";
import { Icon } from "../components/icon";
import { Dialog } from "../components/dialog";
import {
  DOLLS,
  HAIRSTYLES,
  HAIR_TOOLS,
  DRESSES,
  TOPS,
  BOTTOMS,
  SHOES,
  ACCESSORIES,
  MAKEUP,
  PALETTE,
  COSMETIC_PALETTES,
  STORAGE_KEY,
  defaultLook,
  freshBook,
  parseBook,
  reducer,
  type Look,
  type DollId,
  type Makeup,
  type Texture,
  type HairStyle,
} from "../lib/salon";

type Section = "hair" | "makeup" | "nails" | "clothes";
type HairTab = "styles" | "tools" | "dye";
type Wardrobe = "dress" | "top" | "bottom" | "shoes" | "accessory";
type Choice = {
  id: string;
  label: string;
  patch: Partial<Look>;
  kind: string;
  icon?: string;
  color?: string;
  tool?: string;
};
type Drag = { choice: Choice; x: number; y: number; over: boolean };
const SECTIONS = [
  { id: "hair", name: "Włosy", icon: "hair" },
  { id: "makeup", name: "Makijaż", icon: "blush" },
  { id: "nails", name: "Paznokcie", icon: "nails" },
  { id: "clothes", name: "Garderoba", icon: "dress" },
] as const;
const WARDROBE = [
  { id: "dress", name: "Sukienki" },
  { id: "top", name: "Góry" },
  { id: "bottom", name: "Doły" },
  { id: "shoes", name: "Buty" },
  { id: "accessory", name: "Dodatki" },
] as const;
const FOCUS = [
  { id: "whole", name: "Cała lalka" },
  { id: "face", name: "Twarz" },
  { id: "hair", name: "Włosy" },
  { id: "hands", name: "Dłonie" },
] as const;

export default function Page() {
  const [editor, dispatch] = useReducer(reducer, {
      book: freshBook(),
      past: [],
      future: [],
    }),
    [ready, setReady] = useState(false),
    [section, setSection] = useState<Section>("hair"),
    [hairTab, setHairTab] = useState<HairTab>("styles"),
    [makeup, setMakeup] = useState<Makeup>("shadow"),
    [wardrobe, setWardrobe] = useState<Wardrobe>("dress"),
    [focus, setFocus] = useState<Focus>("whole");
  const [modal, setModal] = useState<
      "dolls" | "album" | "save" | "help" | null
    >(null),
    [name, setName] = useState("Moja wymarzona stylizacja"),
    [notice, setNotice] = useState(""),
    [drag, setDrag] = useState<Drag | null>(null),
    [motion, setMotion] = useState(""),
    [motionId, setMotionId] = useState(0),
    [confetti, setConfetti] = useState(false),
    [exporting, setExporting] = useState(false),
    [storageWarning, setStorageWarning] = useState("");
  const benchRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null),
    noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    audio = useRef<AudioContext | null>(null),
    skipClick = useRef(false),
    dragStart = useRef<{
      choice: Choice;
      x: number;
      y: number;
      moved: boolean;
    } | null>(null);
  useEffect(() => {
    benchRef.current?.scrollTo({ top: 0 });
  }, [section, hairTab, makeup, wardrobe]);
  const { book } = editor,
    look = book.looks[book.doll],
    doll = DOLLS.find((x) => x.id === book.doll)!;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "restore", book: parseBook(raw) });
    } catch {
      setStorageWarning(
        "Nie udało się odczytać zapisu. Możesz stworzyć nową stylizację.",
      );
    }
    setReady(true);
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      void audio.current?.close();
    };
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
      } catch {
        setStorageWarning(
          "Przeglądarka nie zapisała zmian. Pobierz gotowe stylizacje jako obrazki.",
        );
      }
  }, [book, ready]);
  useEffect(() => {
    if (!motion) return;
    const timer = setTimeout(() => setMotion(""), 1500);
    return () => clearTimeout(timer);
  }, [motion, motionId]);
  useEffect(() => {
    if (!confetti) return;
    const timer = setTimeout(() => setConfetti(false), 2400);
    return () => clearTimeout(timer);
  }, [confetti]);
  function toast(text: string) {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3400);
  }
  function tone(final = false) {
    if (!book.sound) return;
    try {
      const ctx = audio.current ?? (audio.current = new AudioContext());
      void ctx.resume();
      [523.25, final ? 783.99 : 659.25, ...(final ? [1046.5] : [])].forEach(
        (f, i) => {
          const o = ctx.createOscillator(),
            g = ctx.createGain(),
            t = ctx.currentTime + i * 0.11;
          o.type = "sine";
          o.frequency.value = f;
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(0.045, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
          o.connect(g).connect(ctx.destination);
          o.start(t);
          o.stop(t + 0.35);
        },
      );
    } catch {
      /* Optional audio. */
    }
  }
  function edit(patch: Partial<Look>) {
    dispatch({ type: "edit", patch });
  }
  function choose(c: Choice) {
    edit(c.patch);
    setMotion(c.tool ?? c.kind);
    setMotionId((n) => n + 1);
    tone();
    toast(c.tool === "brush" ? "Włosy uczesane!" : c.label + " — gotowe!");
  }
  function changeSection(id: Section) {
    setSection(id);
    setFocus(id === "makeup" ? "face" : id === "nails" ? "hands" : "whole");
  }
  function pointerDown(
    e: ReactPointerEvent<HTMLButtonElement>,
    choice: Choice,
    handle = false,
  ) {
    if (!ready || e.button !== 0) return;
    skipClick.current = false;
    if (e.pointerType === "touch" && !handle) return;
    dragStart.current = { choice, x: e.clientX, y: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = dragStart.current;
    if (!d) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 7) d.moved = true;
    if (d.moved) {
      const over = !!document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest("[data-doll-drop]");
      setDrag({ choice: d.choice, x: e.clientX, y: e.clientY, over });
    }
  }
  function pointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = dragStart.current;
    if (!d) return;
    if (d.moved) {
      skipClick.current = true;
      const over = !!document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest("[data-doll-drop]");
      if (over) choose(d.choice);
      else toast("Upuść wybór na lalce albo po prostu go kliknij.");
    }
    dragStart.current = null;
    setDrag(null);
  }
  function pointerCancel() {
    dragStart.current = null;
    setDrag(null);
    skipClick.current = true;
  }
  function choiceClick(c: Choice) {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    choose(c);
  }
  function dragEvents(c: Choice, handle = false) {
    return {
      onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) =>
        pointerDown(e, c, handle),
      onPointerMove: pointerMove,
      onPointerUp: pointerUp,
      onPointerCancel: pointerCancel,
    };
  }
  function card(c: Choice, art: ReactNode, selected: boolean) {
    return (
      <div key={c.id} className={"choice-card " + (selected ? "selected" : "")}>
        <button
          className="choice-main"
          disabled={!ready}
          aria-label={c.label}
          aria-pressed={selected}
          {...dragEvents(c)}
          onClick={() => choiceClick(c)}
        >
          {selected && (
            <span className="selected-check">
              <Icon name="check" size={12} />
            </span>
          )}
          <span className="choice-art">{art}</span>
          <span className="choice-name">{c.label}</span>
        </button>
        <button
          className="drag-handle"
          aria-label={"Przeciągnij: " + c.label}
          disabled={!ready}
          {...dragEvents(c, true)}
          onClick={() => choiceClick(c)}
          title="Przeciągnij na lalkę"
        >
          <Icon name="move" size={12} />
        </button>
      </div>
    );
  }
  function colors(
    palette: readonly (readonly [string, string])[],
    value: string | null,
    patch: (c: string | null) => Partial<Look>,
    none = "Bez koloru",
  ) {
    return (
      <>
        <div className="swatch-grid">
          <button
            className={
              "color-swatch no-color " + (value === null ? "active" : "")
            }
            aria-label={none}
            aria-pressed={value === null}
            disabled={!ready}
            onClick={() =>
              choose({
                id: "none",
                label: none,
                kind: "color",
                patch: patch(null),
              })
            }
          >
            <Icon name="none" size={20} />
          </button>
          {palette.map(([label, color]) => {
            const c: Choice = {
              id: color,
              label,
              kind: "color",
              color,
              patch: patch(color),
            };
            return (
              <button
                key={color}
                className={
                  "color-swatch " +
                  (value?.toLowerCase() === color.toLowerCase() ? "active" : "")
                }
                style={{ "--swatch": color } as CSSProperties}
                aria-label={"Kolor: " + label}
                title={label}
                aria-pressed={value?.toLowerCase() === color.toLowerCase()}
                {...dragEvents(c)}
                onClick={() => choiceClick(c)}
                disabled={!ready}
              >
                {value?.toLowerCase() === color.toLowerCase() && (
                  <Icon name="check" size={17} />
                )}
              </button>
            );
          })}
        </div>
        <label className="custom-color">
          <span>Twój własny kolor</span>
          <span
            className="color-input-wrap"
            style={{ background: value ?? "#b59bdf" }}
          >
            <input
              type="color"
              aria-label="Twój własny kolor"
              value={value ?? "#b59bdf"}
              onChange={(e) => {
                edit(patch(e.target.value));
                setMotion("color");
                setMotionId((n) => n + 1);
              }}
            />
          </span>
        </label>
      </>
    );
  }
  const garmentKey =
    wardrobe === "top"
      ? "topColor"
      : wardrobe === "bottom"
        ? "bottomColor"
        : wardrobe === "shoes"
          ? "shoeColor"
          : "dressColor";
  async function exportImage() {
    if (!svgRef.current) return;
    setExporting(true);
    let url = "";
    try {
      const node = svgRef.current.cloneNode(true) as SVGSVGElement;
      node.setAttribute("viewBox", "0 0 520 760");
      node.setAttribute("width", "1040");
      node.setAttribute("height", "1520");
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("width", "520");
      bg.setAttribute("height", "760");
      bg.setAttribute("fill", "#f8f0f2");
      node.insertBefore(bg, node.firstChild);
      const caption = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      caption.setAttribute("x", "260");
      caption.setAttribute("y", "733");
      caption.setAttribute("text-anchor", "middle");
      caption.setAttribute("fill", "#826487");
      caption.setAttribute("font-family", "Georgia,serif");
      caption.setAttribute("font-size", "15");
      caption.textContent = "Atelier Lalek · " + doll.name;
      node.appendChild(caption);
      url = URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(node)], {
          type: "image/svg+xml;charset=utf-8",
        }),
      );
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(Error("image"));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1040;
      canvas.height = 1520;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw Error("canvas");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(Error("png"))),
          "image/png",
        ),
      );
      const png = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = png;
      a.download = "atelier-lalek-" + doll.name.toLowerCase() + ".png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(png), 1500);
      toast("Obrazek jest gotowy do pobrania!");
    } catch {
      toast("Nie udało się pobrać obrazka. Spróbuj ponownie.");
    } finally {
      if (url) URL.revokeObjectURL(url);
      setExporting(false);
    }
  }
  function saveLook() {
    if (book.album.length >= 24) {
      toast("Album ma 24 miejsca. Usuń jedną stylizację, by zapisać następną.");
      return;
    }
    dispatch({ type: "save", id: crypto.randomUUID(), name });
    setModal(null);
    setConfetti(true);
    tone(true);
    toast("Stylizacja zapisana w Twoim albumie!");
  }
  function reset() {
    dispatch({ type: "reset" });
    setFocus("whole");
    toast("Nowy początek! Poprzedni pomysł przywrócisz przyciskiem Cofnij.");
  }
  const availableClothes =
    wardrobe === "dress"
      ? DRESSES
      : wardrobe === "top"
        ? TOPS
        : wardrobe === "bottom"
          ? BOTTOMS
          : wardrobe === "shoes"
            ? SHOES
            : ACCESSORIES;
  const subtitle =
    section === "hair"
      ? hairTab === "styles"
        ? "Mała zmiana, zupełnie nowy pomysł."
        : hairTab === "tools"
          ? "Uczesz, zakręć albo wyprostuj."
          : "Naturalne włosy czy kolorowa fantazja?"
      : section === "makeup"
        ? "Wybierz kosmetyk, a potem jego kolor."
        : section === "nails"
          ? "Dziesięć małych miejsc na Twój kolor."
          : "Mieszaj ubrania tak, jak lubisz.";
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M17 17C-6-4-1 38 17 24L23 24C41 38 46-4 23 17Z"
                fill="currentColor"
              />
              <rect x="17" y="15" width="6" height="12" rx="2" fill="#f6d9e8" />
            </svg>
          </span>
          <div>
            Atelier Lalek<small>PRACOWNIA MAŁYCH POMYSŁÓW</small>
          </div>
        </div>
        <div className="header-actions">
          <div className="history-controls">
            <button
              className="icon-button"
              title="Cofnij"
              aria-label="Cofnij zmianę"
              disabled={!editor.past.length}
              onClick={() => dispatch({ type: "undo" })}
            >
              <Icon name="undo" size={19} />
            </button>
            <button
              className="icon-button"
              title="Ponów"
              aria-label="Ponów zmianę"
              disabled={!editor.future.length}
              onClick={() => dispatch({ type: "redo" })}
            >
              <Icon name="redo" size={19} />
            </button>
          </div>
          <button
            className="reset-button"
            aria-label="Zacznij od nowa"
            onClick={reset}
            disabled={!ready}
          >
            <Icon name="reset" size={16} />
            <span>Zacznij od nowa</span>
          </button>
          <button
            className="primary save-top"
            aria-label="Zapisz stylizację"
            onClick={() => {
              setName("Moja wymarzona stylizacja");
              setModal("save");
            }}
            disabled={!ready}
          >
            <Icon name="camera" size={18} />
            <span>Zapisz stylizację</span>
          </button>
        </div>
      </header>
      {storageWarning && (
        <div className="storage-warning" role="status">
          {storageWarning}
        </div>
      )}
      <div className="intro">
        <div>
          <span className="eyebrow">WITAJ W SWOJEJ PRACOWNI</span>
          <h1>
            Dziś tworzę <em>po swojemu.</em>
          </h1>
        </div>
        <p>
          Trochę koloru. Odrobina wyobraźni.
          <br />I stylizacja, która jest cała Twoja.
        </p>
      </div>
      <main className="salon-layout">
        <nav className="category-rail" aria-label="Wybierz część salonu">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={section === s.id ? "active" : ""}
              aria-pressed={section === s.id}
              onClick={() => changeSection(s.id)}
            >
              <span>
                <Icon name={s.icon} size={26} />
              </span>
              {s.name}
            </button>
          ))}
          <div className="rail-divider" />
          <button
            className="album-nav"
            aria-label={`Mój album, stylizacji: ${book.album.length}`}
            onClick={() => setModal("album")}
          >
            <span>
              <Icon name="album" size={25} />
              {book.album.length > 0 && <b>{book.album.length}</b>}
            </span>
            Mój album
          </button>
          <button className="help-nav" onClick={() => setModal("help")}>
            <Icon name="info" size={20} />
            <span>Jak się bawić?</span>
          </button>
        </nav>
        <section className="studio">
          <div className="studio-top">
            <div className="model-name">
              <span className="tiny-dot" />
              {doll.name}
              <span className="model-tag">TWOJA LALKA</span>
            </div>
            <button className="doll-picker" onClick={() => setModal("dolls")}>
              <Icon name="doll" size={16} /> Zmień lalkę <span>⌄</span>
            </button>
          </div>
          <div
            className={"doll-stage " + (drag?.over ? "drop-over" : "")}
            data-doll-drop="true"
            aria-label="Miejsce na lalkę — tutaj upuść wybrany kosmetyk, ubranie lub narzędzie"
          >
            <div className="arch" />
            <div className="studio-caption">
              <span>✧</span> MAŁE ATELIER, WIELKA WYOBRAŹNIA
            </div>
            <div className="doll-holder">
              <Doll
                dollId={book.doll}
                look={look}
                focus={focus}
                svgRef={svgRef}
              />
            </div>
            <span className="stage-star star-one">✧</span>
            <span className="stage-star star-two">✦</span>
            <span className="stage-star star-three">✧</span>
            {drag && (
              <div className="drop-invitation">
                <Icon name="move" size={18} />
                {drag.over ? "Puść — gotowe!" : "Przeciągnij tutaj"}
              </div>
            )}
            {motion && (
              <div
                key={motionId}
                className={"tool-motion motion-" + motion}
                aria-hidden="true"
              >
                {["brush", "curly", "straight", "crimped"].includes(motion) ? (
                  <span className="moving-tool">
                    <Icon
                      name={
                        motion === "curly"
                          ? "curler"
                          : motion === "straight"
                            ? "straightener"
                            : motion === "crimped"
                              ? "crimper"
                              : "brush"
                      }
                      size={54}
                    />
                  </span>
                ) : null}
                <span className="twinkle t1">✧</span>
                <span className="twinkle t2">✦</span>
                <span className="twinkle t3">✧</span>
              </div>
            )}
            <button
              className="download-stage"
              aria-label="Pobierz obrazek całej lalki"
              title="Pobierz obrazek"
              disabled={exporting}
              onClick={() => void exportImage()}
            >
              <Icon name="download" size={18} />
            </button>
          </div>
          <div className="focus-controls" aria-label="Zbliżenie lalki">
            {FOCUS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFocus(f.id)}
                aria-pressed={focus === f.id}
                className={focus === f.id ? "active" : ""}
              >
                {f.name}
              </button>
            ))}
          </div>
          <div className="studio-bottom">
            <span>
              <Icon name="move" size={15} /> Kliknij wybór lub przeciągnij go na
              lalkę.
            </span>
            <span className="autosave">
              <i /> Zapisuje się samo
            </span>
          </div>
        </section>
        <aside className="workbench">
          <div className="workbench-heading">
            <span className="eyebrow">TWOJE MAŁE ATELIER</span>
            <div>
              <h2>{SECTIONS.find((s) => s.id === section)!.name}</h2>
              <span className="panel-icon">
                <Icon name={SECTIONS.find((s) => s.id === section)!.icon} />
              </span>
            </div>
            <p>{subtitle}</p>
          </div>
          {section === "hair" && (
            <div className="subtabs" aria-label="Wybór dla włosów">
              {[
                { id: "styles", name: "Fryzury" },
                { id: "tools", name: "Narzędzia" },
                { id: "dye", name: "Kolory" },
              ].map((t) => (
                <button
                  key={t.id}
                  className={hairTab === t.id ? "active" : ""}
                  aria-pressed={hairTab === t.id}
                  onClick={() => setHairTab(t.id as HairTab)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
          {section === "makeup" && (
            <div className="makeup-tools">
              {MAKEUP.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={makeup === m.id}
                  className={makeup === m.id ? "active" : ""}
                  onClick={() => setMakeup(m.id)}
                >
                  <Icon name={m.icon} size={22} />
                  {m.name}
                  {look[m.id] && <i style={{ background: look[m.id]! }} />}
                </button>
              ))}
            </div>
          )}
          {section === "clothes" && (
            <div className="subtabs wardrobe-tabs" aria-label="Część garderoby">
              {WARDROBE.map((w) => (
                <button
                  key={w.id}
                  className={wardrobe === w.id ? "active" : ""}
                  aria-pressed={wardrobe === w.id}
                  onClick={() => setWardrobe(w.id)}
                >
                  {w.name}
                </button>
              ))}
            </div>
          )}
          <div className="workbench-body" ref={benchRef}>
            {section === "hair" && hairTab === "styles" && (
              <>
                <div className="choice-grid hair-grid">
                  {HAIRSTYLES.map((h) =>
                    card(
                      {
                        id: h.id,
                        label: h.name,
                        kind: "hair",
                        patch: { hairStyle: h.id, brushed: false },
                      },
                      <Doll
                        dollId={book.doll}
                        look={{ ...look, hairStyle: h.id }}
                        portrait
                      />,
                      look.hairStyle === h.id,
                    ),
                  )}
                </div>
                <div className="panel-tip">
                  <Icon name="brush" size={20} />
                  <p>
                    Fryzura wybrana? W „Narzędziach” czeka szczotka, lokówka i
                    karbownica.
                  </p>
                </div>
              </>
            )}
            {section === "hair" && hairTab === "tools" && (
              <>
                <div className="choice-grid tool-grid">
                  {HAIR_TOOLS.map((t) =>
                    card(
                      {
                        id: t.id,
                        label: t.name,
                        kind: "tool",
                        icon: t.icon,
                        tool: t.id,
                        patch:
                          t.id === "brush"
                            ? { brushed: true }
                            : { texture: t.id as Texture, brushed: true },
                      },
                      <>
                        <CatalogArt kind="tool" id={t.icon} />
                        <small>{t.hint}</small>
                      </>,
                      t.id === "brush" ? look.brushed : look.texture === t.id,
                    ),
                  )}
                </div>
                <div className="texture-summary">
                  <span className="eyebrow">TAK WYGLĄDAJĄ TERAZ WŁOSY</span>
                  <strong>
                    {
                      {
                        natural: "Naturalne pasma",
                        straight: "Gładkie i proste",
                        curly: "Miękkie loczki",
                        crimped: "Drobne karbowane pasma",
                      }[look.texture]
                    }
                  </strong>
                  <button
                    className="text-button"
                    onClick={() =>
                      choose({
                        id: "natural-texture",
                        label: "Naturalne pasma",
                        kind: "hair",
                        patch: { texture: defaultLook(book.doll).texture },
                      })
                    }
                  >
                    Przywróć naturalne pasma
                  </button>
                </div>
                <div className="panel-tip">
                  <Icon name="move" size={20} />
                  <p>
                    Możesz też przeciągnąć narzędzie za małe strzałki na lalkę.
                  </p>
                </div>
              </>
            )}
            {section === "hair" && hairTab === "dye" && (
              <>
                <div className="section-label">
                  <h3>Paleta do włosów</h3>
                  <span>FARBOWANIE JEST OPCJĄ</span>
                </div>
                {colors(
                  PALETTE,
                  look.dye,
                  (c) => ({ dye: c }),
                  "Naturalny kolor włosów",
                )}
                <div className="natural-hair">
                  <span style={{ background: doll.hair }} />
                  <p>
                    Naturalny kolor{" "}
                    {doll.name === "Mila"
                      ? "Mili"
                      : doll.name === "Nina"
                        ? "Niny"
                        : doll.name === "Lena"
                          ? "Leny"
                          : "Poli"}{" "}
                    też jest do wyboru. Kliknij przekreślone kółeczko, żeby do
                    niego wrócić.
                  </p>
                </div>
              </>
            )}
            {section === "makeup" && (
              <>
                <div className="cosmetic-preview">
                  <span style={{ color: look[makeup] ?? "#ac8cbb" }}>
                    <Icon
                      name={MAKEUP.find((m) => m.id === makeup)!.icon}
                      size={45}
                    />
                  </span>
                  <div>
                    <h3>{MAKEUP.find((m) => m.id === makeup)!.name}</h3>
                    <p>
                      {makeup === "shadow"
                        ? "Kolor pojawi się nad oczami."
                        : makeup === "lipstick"
                          ? "Kolor pojawi się na ustach."
                          : makeup === "blush"
                            ? "Odrobina koloru na policzkach."
                            : makeup === "powder"
                              ? "Delikatna warstwa na twarzy."
                              : makeup === "brows"
                                ? "Pokoloruj brwi tak, jak lubisz."
                                : "Wybierz kolor rzęs."}
                    </p>
                  </div>
                </div>
                {colors(
                  COSMETIC_PALETTES[makeup],
                  look[makeup],
                  (c) => ({ [makeup]: c }),
                  "Zmyj: " + MAKEUP.find((m) => m.id === makeup)!.name,
                )}
                {makeup === "shadow" && (
                  <label className="shimmer-toggle">
                    <span>
                      <Icon name="sparkles" size={20} /> Odrobina blasku
                    </span>
                    <input
                      type="checkbox"
                      checked={look.shimmer}
                      onChange={(e) => edit({ shimmer: e.target.checked })}
                    />
                  </label>
                )}
                <button
                  className="clear-makeup"
                  onClick={() => {
                    edit({
                      shadow: null,
                      lipstick: null,
                      blush: null,
                      powder: null,
                      brows: null,
                      lashes: null,
                      shimmer: false,
                    });
                    toast("Makijaż zmyty. Możesz wymyślić nowy!");
                  }}
                >
                  <Icon name="none" size={16} /> Zmyj cały makijaż
                </button>
                <div className="panel-tip">
                  <Icon name="eye" size={20} />
                  <p>
                    Przycisk „Twarz” pod lalką pozwala obejrzeć każdy szczegół.
                  </p>
                </div>
              </>
            )}
            {section === "nails" && (
              <>
                <div className="nail-preview">
                  <div style={{ background: look.nails ?? "#e6b7a7" }}>
                    <i />
                  </div>
                  <span>
                    <h3>Mały kolorowy detal</h3>
                    <p>
                      Lakier pojawi się na wszystkich paznokciach. Także na
                      kciukach!
                    </p>
                  </span>
                </div>
                {colors(
                  PALETTE,
                  look.nails,
                  (c) => ({ nails: c }),
                  "Naturalne paznokcie",
                )}
                <div className="section-label">
                  <h3>Może jeszcze wzorek?</h3>
                </div>
                <div className="nail-patterns">
                  {[
                    { id: "plain", name: "Gładkie", icon: "nails" },
                    { id: "dots", name: "Kropeczki", icon: "blush" },
                    { id: "sparkle", name: "Gwiazdki", icon: "sparkles" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      className={look.nailPattern === p.id ? "active" : ""}
                      aria-pressed={look.nailPattern === p.id}
                      onClick={() =>
                        choose({
                          id: p.id,
                          label: p.name,
                          kind: "nails",
                          patch: {
                            nailPattern: p.id as Look["nailPattern"],
                            nails: look.nails ?? "#e88db0",
                          },
                        })
                      }
                    >
                      <Icon name={p.icon} size={20} />
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="panel-tip">
                  <Icon name="nails" size={20} />
                  <p>
                    Wybierz „Dłonie”, aby przyjrzeć się paznokciom z bliska.
                  </p>
                </div>
              </>
            )}
            {section === "clothes" && (
              <>
                <div className="choice-grid clothes-grid">
                  {availableClothes.map((item) => {
                    const accessory = wardrobe === "accessory",
                      active = accessory
                        ? look.accessories.includes(item.id)
                        : wardrobe === "dress"
                          ? look.outfit === "dress" && look.dress === item.id
                          : wardrobe === "shoes"
                            ? look.shoes === item.id
                            : look.outfit === "separates" &&
                              look[wardrobe] === item.id;
                    const patch: Partial<Look> = accessory
                      ? {
                          accessories: active
                            ? look.accessories.filter((x) => x !== item.id)
                            : [...look.accessories, item.id],
                        }
                      : wardrobe === "dress"
                        ? { outfit: "dress", dress: item.id }
                        : wardrobe === "shoes"
                          ? { shoes: item.id }
                          : { outfit: "separates", [wardrobe]: item.id };
                    return card(
                      { id: item.id, label: item.name, kind: wardrobe, patch },
                      <CatalogArt
                        kind={wardrobe}
                        id={item.id}
                        color={look[garmentKey]}
                      />,
                      active,
                    );
                  })}
                </div>
                <div className="section-label garment-color-label">
                  <h3>
                    {wardrobe === "accessory"
                      ? "Kolor dodatków"
                      : wardrobe === "shoes"
                        ? "Kolor butów"
                        : wardrobe === "top"
                          ? "Kolor góry"
                          : wardrobe === "bottom"
                            ? "Kolor dołu"
                            : "Kolor sukienki"}
                  </h3>
                </div>
                {colors(
                  PALETTE,
                  look[garmentKey],
                  (c) => ({
                    [garmentKey]: c ?? defaultLook(book.doll)[garmentKey],
                    ...(wardrobe === "top" || wardrobe === "bottom"
                      ? { outfit: "separates" as const }
                      : wardrobe === "dress"
                        ? { outfit: "dress" as const }
                        : {}),
                  }),
                  "Przywróć domyślny kolor",
                )}
                <div className="panel-tip">
                  <Icon name="dress" size={20} />
                  <p>
                    {wardrobe === "accessory"
                      ? "Kliknij wybrany dodatek jeszcze raz, żeby go zdjąć."
                      : wardrobe === "top" || wardrobe === "bottom"
                        ? "Góry i doły możesz łączyć dowolnie. Sukienka zastępuje taki komplet."
                        : "Wybierz ubranie albo buty, potem nadaj im własny kolor."}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="workbench-footer">
            <span>✧</span> Tu każdy pomysł ma swoje miejsce.
          </div>
        </aside>
      </main>
      <footer className="site-footer">
        <span>
          Stworzone do zabawy wyobraźnią <Icon name="heart" size={13} />
        </span>
        <div>
          <label className="sound-toggle">
            <input
              type="checkbox"
              checked={book.sound}
              onChange={(e) =>
                dispatch({ type: "sound", value: e.target.checked })
              }
            />
            <Icon name="volume" size={15} /> Dźwięki
          </label>
          <button onClick={() => setModal("help")}>Dla rodzica</button>
        </div>
      </footer>
      <div
        className={"toast " + (notice ? "visible" : "")}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Icon name="sparkles" size={18} />
            {notice}
          </>
        )}
      </div>
      {drag && (
        <div
          className={"drag-ghost " + (drag.over ? "over" : "")}
          style={{ left: drag.x, top: drag.y }}
          aria-hidden="true"
        >
          {drag.choice.color ? (
            <span style={{ background: drag.choice.color }} />
          ) : (
            <Icon
              name={
                drag.choice.icon ??
                (drag.choice.kind === "hair"
                  ? "hair"
                  : drag.choice.kind === "shoes"
                    ? "shoe"
                    : "sparkles")
              }
              size={30}
            />
          )}
          <b>{drag.choice.label}</b>
        </div>
      )}
      {confetti && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 25 }, (_, i) => (
            <span
              key={i}
              style={
                {
                  "--x": `${(i * 31) % 100}%`,
                  "--delay": `${(i % 5) * 0.1}s`,
                  "--spin": `${i * 31}deg`,
                } as CSSProperties
              }
            >
              {["✦", "✧", "♡", "❀"][i % 4]}
            </span>
          ))}
        </div>
      )}
      {modal === "dolls" && (
        <Dialog
          title="Z kim dzisiaj tworzysz?"
          onClose={() => setModal(null)}
          wide
        >
          <p className="dialog-description">
            Wybierz lalkę. Każda pamięta swoją fryzurę i ubrania.
          </p>
          <div className="doll-selection">
            {DOLLS.map((d) => (
              <button
                key={d.id}
                aria-label={"Wybierz lalkę: " + d.name}
                aria-pressed={book.doll === d.id}
                className={book.doll === d.id ? "active" : ""}
                onClick={() => {
                  dispatch({ type: "doll", id: d.id });
                  setModal(null);
                  toast(d.name + " jest gotowa na Twoje pomysły!");
                }}
              >
                <div>
                  <Doll dollId={d.id} look={book.looks[d.id]} portrait />
                </div>
                <strong>{d.name}</strong>
                <small>{d.description}</small>
                {book.doll === d.id && (
                  <span className="doll-selected">
                    <Icon name="check" size={15} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </Dialog>
      )}
      {modal === "save" && (
        <Dialog title="To jest Twój pomysł!" onClose={() => setModal(null)}>
          <div className="save-preview">
            <Doll dollId={book.doll} look={look} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveLook();
            }}
          >
            <label className="look-name">
              Jak nazwiemy tę stylizację?
              <input
                data-autofocus
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                placeholder="Na przykład: Lawendowy sen"
              />
            </label>
            <p className="small">
              W albumie jest {book.album.length} / 24 stylizacje. Zapis zostanie
              w tej przeglądarce.
            </p>
            <button
              className="primary full"
              type="submit"
              disabled={book.album.length >= 24}
            >
              <Icon name="album" size={18} /> Zapisz w albumie
            </button>
          </form>
          <button
            className="text-button export-save"
            disabled={exporting}
            onClick={() => void exportImage()}
          >
            <Icon name="download" size={17} />
            {exporting ? "Przygotowuję obrazek…" : "Pobierz też obrazek PNG"}
          </button>
        </Dialog>
      )}
      {modal === "album" && (
        <Dialog title="Mój album pomysłów" onClose={() => setModal(null)} wide>
          {book.album.length ? (
            <>
              <p className="dialog-description">
                Każda stylizacja to nowy pomysł. Możesz do niej wrócić i tworzyć
                dalej.
              </p>
              <div className="album-grid">
                {book.album.map((a) => (
                  <article key={a.id}>
                    <div className="album-art">
                      <Doll dollId={a.doll} look={a.look} />
                    </div>
                    <h3>{a.name}</h3>
                    <small>{DOLLS.find((d) => d.id === a.doll)!.name}</small>
                    <div>
                      <button
                        className="secondary"
                        aria-label={"Wczytaj stylizację: " + a.name}
                        onClick={() => {
                          dispatch({ type: "load", id: a.id });
                          setFocus("whole");
                          setModal(null);
                          toast("Wczytano: " + a.name);
                        }}
                      >
                        Wczytaj <Icon name="arrow" size={14} />
                      </button>
                      <button
                        className="delete-look"
                        aria-label={"Usuń stylizację: " + a.name}
                        onClick={() => {
                          dispatch({ type: "delete", id: a.id });
                          toast(
                            "Usunięto z albumu. Przycisk Cofnij przywróci stylizację.",
                          );
                        }}
                      >
                        Usuń
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-album">
              <Icon name="album" size={55} />
              <h3>Tu zamieszkają Twoje pomysły.</h3>
              <p>Ubierz lalkę i kliknij „Zapisz stylizację”.</p>
              <button className="primary" onClick={() => setModal(null)}>
                Wracam tworzyć <Icon name="arrow" size={17} />
              </button>
            </div>
          )}
        </Dialog>
      )}
      {modal === "help" && (
        <Dialog
          title="Twoja lalka. Twoje pomysły."
          onClose={() => setModal(null)}
        >
          <div className="help-content">
            <p>
              <b>1. Wybierz lalkę.</b> Kliknij „Zmień lalkę”. Każda z czterech
              lalek zachowuje swoją stylizację.
            </p>
            <p>
              <b>2. Wybierz część salonu.</b> Włosy, makijaż, paznokcie lub
              garderobę. Klikaj kolory i rzeczy albo przeciągaj je na lalkę. Na
              telefonie przeciągaj rzeczy za przycisk ze strzałkami.
            </p>
            <p>
              <b>3. Przyjrzyj się szczegółom.</b> Przyciski „Twarz”, „Włosy” i
              „Dłonie” pod lalką pokazują zbliżenie. Kosmetyki pojawiają się
              bezpośrednio na lalce. Przekreślone kółeczko przywraca naturalny
              wygląd danej części.
            </p>
            <p>
              <b>4. Eksperymentuj.</b> Szczotka czesze włosy, lokówka robi
              loczki, karbownica zygzaki, a prostownica proste pasma. Kolor
              włosów nie jest obowiązkowy. Możesz cofnąć i ponowić zmiany.
            </p>
            <p>
              <b>5. Zapisz pomysł.</b> W albumie zmieścisz 24 stylizacje.
              Pobierz też obrazek PNG: zawsze przedstawia całą lalkę, nawet gdy
              oglądasz zbliżenie.
            </p>
            <p className="small">
              Postępy zapisują się wyłącznie w tej przeglądarce. Zmiana
              urządzenia lub adresu strony oraz wyczyszczenie danych
              przeglądarki mogą usunąć lub odseparować zapis. Pobrane obrazki
              możesz zachować poza grą. Gra nie korzysta z aparatu, zdjęć
              dziecka, zakupów ani kont lalek. Ilustracje zostały narysowane
              specjalnie do tej gry.
            </p>
            <button className="primary full" onClick={() => setModal(null)}>
              Czas na moje pomysły <Icon name="sparkles" size={18} />
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
