import {
  COLORS,
  FACES,
  FACE_NAMES,
  type Color,
  type Centers,
  type Face,
  colored,
} from "../lib/cube";

export function FaceGrid({
  cells,
  large = false,
  onPaint,
  face,
}: {
  cells: string[];
  large?: boolean;
  onPaint?: (i: number) => void;
  face: Face;
}) {
  return (
    <div
      className={"face-grid " + (large ? "large" : "")}
      aria-label={`Ścianka: ${FACE_NAMES[face]}`}
    >
      {cells.map((v, i) => {
        const c = COLORS[v as Color],
          style = { background: c?.hex ?? "#ece9df" };
        return onPaint ? (
          <button
            key={i}
            style={style}
            disabled={i === 4}
            onClick={() => onPaint(i)}
            aria-label={`${FACE_NAMES[face]}, rząd ${Math.floor(i / 3) + 1}, kolumna ${(i % 3) + 1}: ${c?.name ?? "puste"}${i === 4 ? ", środek" : ""}`}
          >
            <span>{c?.label ?? "·"}</span>
            {i === 4 && <small>środek</small>}
          </button>
        ) : (
          <span key={i} style={style} title={c?.name ?? "puste"}>
            {c?.label ?? "·"}
          </span>
        );
      })}
    </div>
  );
}
export function Net({
  net,
  centers,
  state,
  select,
  active,
}: {
  net?: string[];
  centers: Centers;
  state?: string;
  select?: (f: Face) => void;
  active?: Face;
}) {
  const cells = state ? colored(state, centers) : net!;
  return (
    <div className="cube-net">
      {FACES.map((f, i) => (
        <div
          className={"net-face face-" + f + (active === f ? " active" : "")}
          key={f}
        >
          {select ? (
            <button
              className="net-title"
              onClick={() => select(f)}
              aria-label={`Edytuj: ${FACE_NAMES[f]}`}
              aria-pressed={active === f}
            >
              {FACE_NAMES[f]} <b>{f}</b>
            </button>
          ) : (
            <span className="net-title">
              {FACE_NAMES[f]} <b>{f}</b>
            </span>
          )}
          <FaceGrid cells={cells.slice(i * 9, i * 9 + 9)} face={f} />
        </div>
      ))}
    </div>
  );
}
