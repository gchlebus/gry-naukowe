import type { CSSProperties } from "react";
const paths: Record<string, React.ReactNode> = {
  hair: (
    <>
      <path d="M7 21c-3-5-4-13 1-16s11 0 11 6c0 5 2 6 1 10M8 17c2-3 0-8 4-9 0 4 5 4 4 9" />
      <path d="m5 14-2 2m16-2 2 2" />
    </>
  ),
  brush: (
    <>
      <path d="m6 18 4-4m-5 8-3-3 5-5 3 3-5 5Z" />
      <rect
        x="8"
        y="2"
        width="10"
        height="14"
        rx="5"
        transform="rotate(35 13 9)"
      />
      <path d="m12 5-3 5m6-3-4 6m7-4-3 5" />
    </>
  ),
  curler: (
    <>
      <path d="m4 21 4-8m1-2 5-8 4 2-5 9-4-3Z" />
      <path d="m13 6 4 3m-6 0 4 3m-7 0-2-4 3-4M7 15l4 2" />
    </>
  ),
  crimper: (
    <>
      <path d="m5 21 3-8m0 0 3-11 3 1-3 11-3-1Zm0 0 10-7 2 3-9 7Z" />
      <path d="m11 6 1 2-2 2m4 0 2 1 1-2" />
    </>
  ),
  straightener: (
    <>
      <path d="m6 21 3-7m0 0 1-12h4l-1 13-4-1Zm0 0L19 5l3 3-10 9Z" />
      <path d="m11 5 1 7m3 0 4-4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  lipstick: (
    <>
      <path d="M8 12h8v10H8zM9 12V5l6-3v10M8 17h8" />
    </>
  ),
  blush: (
    <>
      <circle cx="12" cy="15" r="7" />
      <path d="m12 8 4-6 3 2-5 6m-8 7c2-3 5-3 7-2" />
    </>
  ),
  powder: (
    <>
      <ellipse cx="12" cy="16" rx="9" ry="5" />
      <path d="M3 16V9c0-7 18-7 18 0v7M8 10c2-2 6-2 8 0" />
    </>
  ),
  brow: (
    <>
      <path d="M3 12c5-6 12-7 18-2l-1 3c-5-4-11-4-17 0Z" />
    </>
  ),
  lashes: (
    <>
      <path d="M4 13c4 5 12 5 16 0M4 13l-2 3m6 0-1 4m5-3v5m5-6 1 4m2-7 2 3" />
    </>
  ),
  nails: (
    <>
      <path d="M7 21V7c0-5 10-5 10 0v14ZM7 12c3-2 7-2 10 0" />
      <path d="m10 6 1-1" />
    </>
  ),
  dress: (
    <>
      <path d="m8 3-2 5 4 4-5 9h14l-5-9 4-4-2-5-4 3-4-3Z" />
      <path d="M10 12h4M9 17h6" />
    </>
  ),
  shoe: (
    <>
      <path d="M3 13v7h18c1-6-5-4-9-5l-4-6-3 4ZM3 17h18" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4" />
    </>
  ),
  undo: (
    <>
      <path d="m9 5-6 5 6 5m-6-5h10c9 0 9 11 0 11" />
    </>
  ),
  redo: (
    <>
      <path d="m15 5 6 5-6 5m6-5H11c-9 0-9 11 0 11" />
    </>
  ),
  camera: (
    <>
      <path d="M3 7h5l2-3h4l2 3h5v14H3Z" />
      <circle cx="12" cy="14" r="4" />
    </>
  ),
  album: (
    <>
      <rect x="4" y="3" width="16" height="19" rx="2" />
      <path d="M4 7H2m2 5H2m2 5H2m6-2 4-5 5 7H8Z" />
    </>
  ),
  doll: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21v-5c0-5 14-5 14 0v5M9 7h0m6 0h0" />
    </>
  ),
  close: <path d="m5 5 14 14M5 19 19 5" />,
  check: <path d="m5 12 4 4L20 5" />,
  reset: (
    <>
      <path d="M3 10a9 9 0 1 1 2 9M3 4v6h6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M3 15v6h18v-6" />
    </>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  move: (
    <>
      <path d="M3 12h18M12 3v18m-4-4 4 4 4-4M8 7l4-4 4 4M7 8l-4 4 4 4m10-8 4 4-4 4" />
    </>
  ),
  none: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m6 18 12-12" />
    </>
  ),
  volume: (
    <>
      <path d="m11 4-6 5H2v6h3l6 5V4Zm5 4c3 2 3 6 0 8m3-11c5 4 5 10 0 14" />
    </>
  ),
  heart: <path d="M12 21 3 12C-3 3 8-1 12 6 16-1 27 3 21 12Z" />,
  shirt: (
    <>
      <path d="m8 3-6 5 4 5 2-2v10h8V11l2 2 4-5-6-5c0 4-8 4-8 0Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v7m0-12v1" />
    </>
  ),
};
export function Icon({
  name,
  size = 22,
  style,
  className,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
      className={className}
    >
      {paths[name] ?? paths.sparkles}
    </svg>
  );
}
