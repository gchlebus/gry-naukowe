import { useId, type Ref } from "react";
import {
  DOLLS,
  mix,
  type DollId,
  type Look,
  type HairStyle,
} from "../lib/salon";
export type Focus = "whole" | "face" | "hair" | "hands";
export const VIEWS: Record<Focus, string> = {
  whole: "0 0 520 760",
  face: "140 60 240 245",
  hair: "90 0 340 365",
  hands: "115 375 290 110",
};
const cap =
  "M174 155C155 85 184 38 240 35C306 13 359 69 347 156L331 165C326 119 281 132 246 87C234 121 195 119 187 165Z";
const backPaths: Record<HairStyle, string[]> = {
  long: [
    "M179 118C161 155 166 217 151 317Q156 356 205 349L247 273L276 283Q325 365 368 328C349 264 359 177 342 119Z",
  ],
  bob: [
    "M175 119C156 179 167 217 158 251Q187 280 237 253L277 256Q325 279 362 250C347 212 363 175 344 118Z",
  ],
  ponytail: [
    "M327 111C385 96 416 172 388 205C367 240 407 275 367 325Q316 293 343 248C353 211 313 186 327 111Z",
  ],
  twintails: [
    "M183 112C127 91 100 154 127 208C142 241 99 273 142 315C181 322 201 286 183 249C160 198 205 174 183 112Z",
    "M337 112C393 91 420 154 393 208C378 241 421 273 378 315C339 322 319 286 337 249C360 198 315 174 337 112Z",
  ],
  braid: [
    "M178 121Q163 195 190 238L238 262L278 254Q351 256 345 118Z",
    "M250 258C221 279 276 291 242 314C217 335 277 358 251 378L278 380C303 349 257 330 286 310C312 285 268 274 281 260Z",
  ],
  braids: [
    "M177 125C161 173 165 213 184 246L214 250L239 199L280 200L306 251L337 245C354 206 355 172 343 123Z",
    "M181 229C159 250 202 263 180 281C157 301 203 319 185 335L208 340C232 318 192 302 215 284C237 263 198 252 213 233Z",
    "M307 232C284 252 328 265 306 282C282 302 329 320 310 337L334 341C359 319 318 303 341 285C364 264 325 253 340 233Z",
  ],
  bun: [
    "M206 65C178 20 220-8 256 13C285-10 331 26 308 66Z",
    "M176 125Q163 196 196 235L226 230L246 167L282 162L301 232Q351 247 344 124Z",
  ],
  puffs: [
    "M199 77C161 98 116 70 126 42C120 7 162-7 183 13C217-3 244 40 216 64Z",
    "M322 74C355 97 403 72 394 42C401 7 359-7 337 13C303-4 278 39 305 64Z",
    "M176 124Q161 199 194 233L225 221L247 177L281 175L301 226Q353 242 343 124Z",
  ],
};
function Flower({
  x,
  y,
  r = 9,
  color = "#fff8e8",
}: {
  x: number;
  y: number;
  r?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`} fill={color}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cy={-r * 0.62}
          rx={r * 0.32}
          ry={r * 0.58}
          transform={`rotate(${a})`}
        />
      ))}
      <circle r={r * 0.27} fill="#e7bc65" />
    </g>
  );
}
function Star({
  x,
  y,
  r = 6,
  color = "#fff6dc",
}: {
  x: number;
  y: number;
  r?: number;
  color?: string;
}) {
  return (
    <path
      d={`M${x} ${y - r}l${r * 0.28} ${r * 0.72} ${r * 0.72} ${r * 0.28}-${r * 0.72} ${r * 0.28}-${r * 0.28} ${r * 0.72}-${r * 0.28}-${r * 0.72}-${r * 0.72}-${r * 0.28} ${r * 0.72}-${r * 0.28}Z`}
      fill={color}
    />
  );
}
export function Doll({
  dollId,
  look,
  focus = "whole",
  svgRef,
  portrait = false,
}: {
  dollId: DollId;
  look: Look;
  focus?: Focus;
  svgRef?: Ref<SVGSVGElement>;
  portrait?: boolean;
}) {
  const uid = "d" + useId().replace(/[^a-zA-Z0-9]/g, ""),
    doll = DOLLS.find((d) => d.id === dollId)!,
    skin = doll.skin,
    skinDark = mix(skin, "#7a443d", 0.23),
    hair = look.dye ?? doll.hair,
    hairDark = mix(hair, "#251e30", 0.3),
    hairLight = mix(hair, "#fff2d4", 0.32),
    cloth = look.outfit === "dress" ? look.dressColor : look.topColor;
  const gradient = (id: string) => `url(#${uid + id})`,
    hairShapes = [...backPaths[look.hairStyle], cap];
  const strand = (x: number, y: number, h: number) =>
    look.texture === "crimped"
      ? `M${x} ${y}` +
        Array.from(
          { length: Math.ceil(h / 10) },
          (_, i) => `l${i % 2 ? 7 : -7} 10`,
        ).join("")
      : look.texture === "curly"
        ? `M${x} ${y}` +
          Array.from(
            { length: Math.ceil(h / 20) },
            (_, i) => `q${i % 2 ? -19 : 19} 10 0 20`,
          ).join("")
        : `M${x} ${y}q${(x - 260) * 0.12} ${h * 0.55} ${(x - 260) * 0.08} ${h}`;
  function hand(mirror = false) {
    return (
      <g transform={mirror ? "translate(520 0) scale(-1 1)" : undefined}>
        <path
          d="M159 398C151 400 149 414 153 430L157 445Q160 452 163 446L161 424L165 448Q168 454 172 448L168 423L174 444Q178 450 181 443L175 419L181 430Q185 436 188 429L180 408C175 399 169 396 159 398Z"
          fill={gradient("skin")}
          stroke={skinDark}
          strokeWidth="1.2"
        />
        {[
          { x: 155, y: 426, r: -10 },
          { x: 159, y: 443, r: -8 },
          { x: 168, y: 446, r: -8 },
          { x: 177, y: 441, r: -12 },
          { x: 184, y: 427, r: -28 },
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.r})`}>
            <rect
              x="-2.3"
              y="-4"
              width="4.6"
              height="7"
              rx="2"
              fill={look.nails ?? mix(skin, "#f7e3da", 0.35)}
            />
            {look.nails && (
              <path d="M-1-2v2" stroke="white" opacity=".65" strokeWidth=".7" />
            )}
            {look.nails && look.nailPattern === "dots" && (
              <g fill="#fff8e8">
                <circle cy="-1.5" r=".7" />
                <circle cy="1" r=".7" />
              </g>
            )}
            {look.nails && look.nailPattern === "sparkle" && (
              <Star x={0} y={-0.5} r={1.8} />
            )}
          </g>
        ))}
      </g>
    );
  }
  function shoe(mirror = false) {
    return (
      <g transform={mirror ? "translate(520 0) scale(-1 1)" : undefined}>
        {look.shoes === "boots" && (
          <path
            d="M229 601H257L259 649H222Z"
            fill={gradient("shoe")}
            stroke={mix(look.shoeColor, "#423448", 0.2)}
            strokeWidth="2"
          />
        )}
        <path
          d={
            look.shoes === "sneakers"
              ? "M230 643L255 643L259 663Q260 674 248 677L216 676Q207 669 217 662Z"
              : "M230 643L255 643L258 666Q254 679 235 677L216 674Q205 666 217 660Z"
          }
          fill={gradient("shoe")}
          stroke={mix(look.shoeColor, "#423448", 0.23)}
          strokeWidth="2"
        />
        {look.shoes === "ballet" && (
          <>
            <path
              d="M228 647Q237 661 253 648"
              stroke={skin}
              strokeWidth="9"
              fill="none"
            />
            <path
              d="m231 661 6-4 5 5-6 2Z"
              fill={mix(look.shoeColor, "#fff4df", 0.5)}
            />
          </>
        )}
        {look.shoes === "maryjane" && (
          <>
            <path
              d="M227 647Q238 659 254 648"
              stroke={skin}
              strokeWidth="8"
              fill="none"
            />
            <path d="m227 650 24 5" stroke={look.shoeColor} strokeWidth="5" />
            <circle cx="250" cy="655" r="2" fill="#eacb87" />
          </>
        )}
        {look.shoes === "sneakers" && (
          <>
            <path d="M214 672h42" stroke="#fff9ee" strokeWidth="6" />
            <path
              d="m231 650 18 3m-20 3 18 3m-21 2 18 3"
              stroke="#fffaf0"
              strokeWidth="2.5"
            />
          </>
        )}
        {look.shoes === "sandals" && (
          <>
            <path d="M221 652q20 11 32-4" stroke={skin} strokeWidth="10" />
            <path
              d="m226 650 20 14m-21 0 22-14"
              stroke={look.shoeColor}
              strokeWidth="5"
            />
          </>
        )}
        {look.shoes === "boots" && (
          <>
            <path
              d="M232 610h21m-22 6h22"
              stroke={mix(look.shoeColor, "#fff5de", 0.5)}
              strokeWidth="2"
            />
            <path
              d="M213 672h41"
              stroke={mix(look.shoeColor, "#3a3442", 0.4)}
              strokeWidth="4"
            />
          </>
        )}
      </g>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      viewBox={portrait ? "130 15 260 255" : VIEWS[focus]}
      className="doll-illustration"
      role="img"
      aria-label={`${doll.name}: lalka w wybranej fryzurze, stroju i makijażu`}
    >
      <defs>
        <linearGradient id={uid + "skin"} x1="0" y1="0" x2="1" y2=".2">
          <stop stopColor={mix(skin, "#fff4df", 0.08)} />
          <stop offset=".6" stopColor={skin} />
          <stop offset="1" stopColor={skinDark} />
        </linearGradient>
        <radialGradient id={uid + "face"} cx="38%" cy="30%" r="80%">
          <stop stopColor={mix(skin, "#fff4df", 0.17)} />
          <stop offset=".75" stopColor={skin} />
          <stop offset="1" stopColor={skinDark} />
        </radialGradient>
        <linearGradient id={uid + "hair"} x1="0" y1="0" x2="1" y2=".3">
          <stop stopColor={hairDark} />
          <stop offset=".4" stopColor={hair} />
          <stop offset=".65" stopColor={hairLight} />
          <stop offset="1" stopColor={hairDark} />
        </linearGradient>
        <linearGradient id={uid + "cloth"} x1="0" y1="0" x2="1" y2=".7">
          <stop stopColor={mix(cloth, "#fff9ed", 0.3)} />
          <stop offset=".55" stopColor={cloth} />
          <stop offset="1" stopColor={mix(cloth, "#69517c", 0.18)} />
        </linearGradient>
        <linearGradient id={uid + "shoe"}>
          <stop stopColor={mix(look.shoeColor, "#fff5de", 0.2)} />
          <stop offset="1" stopColor={look.shoeColor} />
        </linearGradient>
        <radialGradient id={uid + "blush"}>
          <stop stopColor={look.blush ?? "transparent"} stopOpacity=".7" />
          <stop
            offset="1"
            stopColor={look.blush ?? "transparent"}
            stopOpacity="0"
          />
        </radialGradient>
        <clipPath id={uid + "hairclip"}>
          <path d={cap} />
        </clipPath>
        <clipPath id={uid + "hairbackclip"}>
          {backPaths[look.hairStyle].map((p, i) => (
            <path key={i} d={p} />
          ))}
        </clipPath>
        <clipPath id={uid + "skirtclip"}>
          <path d="M221 347H301L338 470Q261 492 181 470Z" />
        </clipPath>
        <pattern
          id={uid + "gingham"}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <rect width="10" height="20" fill="#fffaf0" opacity=".35" />
          <rect width="20" height="10" fill="#fffaf0" opacity=".35" />
        </pattern>
        <filter
          id={uid + "shadow"}
          x="-30%"
          y="-20%"
          width="160%"
          height="150%"
        >
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="5"
            floodColor="#69517c"
            floodOpacity=".13"
          />
        </filter>
      </defs>
      <ellipse
        cx="260"
        cy="694"
        rx="106"
        ry="15"
        fill="#a38b9e"
        opacity=".12"
      />
      <g filter={gradient("shadow")}>
        <g fill={gradient("hair")} stroke={hairDark} strokeWidth="2">
          {backPaths[look.hairStyle].map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        <g
          clipPath={gradient("hairbackclip")}
          fill="none"
          stroke={hairLight}
          opacity=".42"
          strokeWidth={
            look.texture === "crimped"
              ? 2.7
              : look.texture === "curly"
                ? 4
                : 2.2
          }
        >
          {Array.from({ length: 23 }, (_, i) => (
            <path key={i} d={strand(125 + i * 12, 35, 350)} />
          ))}
        </g>
        <path
          d="M229 412C221 478 227 540 225 587L229 651Q242 664 255 649L258 543L258 438Z"
          fill={gradient("skin")}
          stroke={skinDark}
          strokeWidth="1.2"
        />
        <path
          d="M263 433L265 544L265 649Q279 662 291 650L295 590C289 534 302 471 291 412Z"
          fill={gradient("skin")}
          stroke={skinDark}
          strokeWidth="1.2"
        />
        <path
          d="M211 280C193 288 184 324 175 359L161 398L181 410L204 355L229 311Z"
          fill={gradient("skin")}
          stroke={skinDark}
          strokeWidth="1.2"
        />
        <path
          d="M309 280C327 288 336 324 345 359L359 398L339 410L316 355L291 311Z"
          fill={gradient("skin")}
          stroke={skinDark}
          strokeWidth="1.2"
        />
        <path
          d="M242 227V271Q224 276 212 284L225 351L215 432H306L296 351L309 284Q295 276 278 271V227Z"
          fill={gradient("skin")}
          stroke={skinDark}
          strokeWidth="1.2"
        />
        <path
          d="M242 245q19 10 36 0v15q-19 5-36-1Z"
          fill={skinDark}
          opacity=".25"
        />
        <path
          d="M216 279L239 273Q259 296 281 273L305 282L297 352L306 432H215L224 352Z"
          fill="#f1e5ef"
        />
        <path d="M218 409h86l2 23H215Z" fill="#e0cedf" />
        {look.outfit === "dress" ? (
          <g>
            <path
              d="M212 281L238 271Q259 288 282 271L310 282L324 307L302 319L298 350L223 350L219 319L196 307Z"
              fill={gradient("cloth")}
            />
            <path
              d={
                look.dress === "party"
                  ? "M222 345H300L350 491Q261 520 169 491Z"
                  : look.dress === "garden"
                    ? "M222 345H300L331 491Q261 510 188 491Z"
                    : "M221 347H301L338 470Q261 492 181 470Z"
              }
              fill={gradient("cloth")}
            />
            <path
              d="M225 350Q260 357 299 350"
              fill="none"
              stroke={mix(cloth, "#58426c", 0.2)}
              strokeWidth="5"
            />
            {look.dress === "rainbow" && (
              <g clipPath={gradient("skirtclip")}>
                {[
                  "#e89fbb",
                  "#eab37f",
                  "#e6d397",
                  "#a7c9ac",
                  "#99bbd8",
                  "#b29bd2",
                ].map((c, i) => (
                  <path
                    d={`M${210 + i * 16} 352l-12 136h34l${i > 2 ? 15 : -5}-136Z`}
                    fill={c}
                    key={c}
                  />
                ))}
              </g>
            )}
            {look.dress === "picnic" && (
              <>
                <path
                  d="M221 347H301L338 470Q261 492 181 470Z"
                  fill={gradient("gingham")}
                />
                <path
                  d="m224 291 15-20q20 16 43 0l14 21-34 4Z"
                  fill="#fff6e9"
                />
              </>
            )}
            {look.dress === "daisy" && (
              <>
                {[
                  { x: 218, y: 396 },
                  { x: 276, y: 428 },
                  { x: 308, y: 453 },
                  { x: 236, y: 461 },
                  { x: 287, y: 381 },
                ].map((f, i) => (
                  <Flower key={i} {...f} r={8} />
                ))}
                <Flower x={261} y={350} r={10} />
              </>
            )}
            {look.dress === "garden" && (
              <>
                <path
                  d="M201 442q60 17 118 0m-129 47q70 20 140 0"
                  stroke={mix(cloth, "#fff8ec", 0.5)}
                  strokeWidth="6"
                  fill="none"
                />
                {[217, 258, 300].map((x, i) => (
                  <Flower key={x} x={x} y={385 + (i % 2) * 25} r={7} />
                ))}
              </>
            )}
            {look.dress === "party" && (
              <>
                <path
                  d="M197 430q64 34 128 0m-141 40q77 39 153 0"
                  fill="none"
                  stroke={mix(cloth, "#fff8eb", 0.55)}
                  strokeWidth="9"
                />
                <path
                  d="m251 348-24-12v25l24-9m18-4 24-12v25l-24-9"
                  fill="#fff4df"
                />
                <circle cx="260" cy="350" r="7" fill="#d9b67b" />
              </>
            )}
            {look.dress === "stars" && (
              <>
                {[210, 244, 280, 311].map((x, i) => (
                  <Star key={x} x={x} y={392 + (i % 2) * 54} r={9} />
                ))}
                <Star x={260} y={310} r={11} />
              </>
            )}
            {!["party", "garden"].includes(look.dress) && (
              <path
                d="M230 365l-10 101m32-101-3 109m29-109 12 103m8-97 17 91"
                fill="none"
                stroke={mix(cloth, "#69517c", 0.3)}
                opacity=".22"
                strokeWidth="2"
              />
            )}
            <path
              d="M238 271Q260 295 282 271"
              fill="none"
              stroke="#fff8eb"
              strokeWidth="7"
            />
          </g>
        ) : (
          <g>
            <path
              d={
                look.top === "hoodie" || look.top === "sweater"
                  ? "M214 280L238 273H282L309 282L328 351L307 358L296 319L299 365H222L224 319L208 358L188 351Z"
                  : "M212 281L238 273Q260 289 282 273L309 282L326 310L305 323L296 313L299 359H222L224 313L210 323L194 310Z"
              }
              fill={gradient("cloth")}
            />
            {look.top === "hoodie" && (
              <>
                <path
                  d="M236 277q23-28 48 0l-12 22h-25Z"
                  fill={mix(look.topColor, "#705980", 0.2)}
                />
                <path
                  d="m245 291 2 32m27-32-1 32M239 338q21-11 42 0v15h-42Z"
                  fill="none"
                  stroke={mix(look.topColor, "#fff8eb", 0.55)}
                  strokeWidth="3"
                />
              </>
            )}
            {look.top === "blouse" && (
              <path
                d="M237 276q10 29 22 12 13 18 25-12l12 18q-17 26-37 9-19 18-34-9Z"
                fill="#fff8eb"
              />
            )}
            {look.top === "sweater" && (
              <>
                <path
                  d="M240 276q19 15 42 0M225 351h72"
                  fill="none"
                  stroke={mix(look.topColor, "#6e567c", 0.25)}
                  strokeWidth="6"
                />
                <path
                  d="m238 311 12 12 12-12 12 12 12-12m-48 18 12 12 12-12 12 12 12-12"
                  fill="none"
                  stroke={mix(look.topColor, "#fff8eb", 0.5)}
                  strokeWidth="2"
                />
              </>
            )}
            {look.top === "tee" && <Flower x={260} y={316} r={14} />}
            {look.bottom === "jeans" ? (
              <>
                <path
                  d="M222 357H299L302 437L294 638H266L260 431L254 638H225L218 439Z"
                  fill={look.bottomColor}
                />
                <path
                  d="M260 359v73m-38-57q18 16 27-1m23 0q13 14 25-1m-71 253h28m13 0h28"
                  fill="none"
                  stroke={mix(look.bottomColor, "#fff8eb", 0.5)}
                  strokeWidth="3"
                />
                <circle cx="260" cy="368" r="3" fill="#d9be82" />
              </>
            ) : look.bottom === "shorts" ? (
              <>
                <path
                  d="M222 357H299L307 430L268 439L260 403L253 439L214 430Z"
                  fill={look.bottomColor}
                />
                <path
                  d="M218 425l34 7m17 0 33-8M260 361v41"
                  stroke={mix(look.bottomColor, "#fff8eb", 0.5)}
                  fill="none"
                  strokeWidth="4"
                />
              </>
            ) : (
              <>
                <path
                  d={
                    look.bottom === "tutu"
                      ? "M222 356H299L341 444Q260 472 180 444Z"
                      : "M222 356H299L323 452Q260 469 198 452Z"
                  }
                  fill={look.bottomColor}
                />
                {look.bottom === "tutu" && (
                  <>
                    <path
                      d="M222 360H299L333 430Q260 455 187 430Z"
                      fill={mix(look.bottomColor, "#fff5ec", 0.2)}
                    />
                    <path
                      d="M223 360H298L320 413Q260 440 202 413Z"
                      fill={mix(look.bottomColor, "#fff5ec", 0.4)}
                    />
                  </>
                )}
                <path
                  d="m234 365-10 80m23-80-2 88m29-88 10 83m1-83 16 80"
                  stroke={mix(look.bottomColor, "#5b4676", 0.2)}
                  strokeWidth="2"
                  opacity=".3"
                  fill="none"
                />
              </>
            )}
            <path
              d="M222 358h77"
              stroke={mix(look.bottomColor, "#69517c", 0.25)}
              strokeWidth="6"
            />
          </g>
        )}
        {shoe()}
        {shoe(true)}
        {hand()}
        {hand(true)}
        <ellipse cx="179" cy="169" rx="13" ry="21" fill={gradient("skin")} />
        <ellipse cx="342" cy="169" rx="13" ry="21" fill={gradient("skin")} />
        <path
          d="M178 162q-5 3 0 13m164-13q5 3 0 13"
          fill="none"
          stroke={skinDark}
          strokeWidth="2"
        />
        <path
          d="M180 139C181 87 207 61 261 61C314 61 341 91 341 144L338 180C330 230 289 254 260 254C227 254 186 228 180 180Z"
          fill={gradient("face")}
          stroke={skinDark}
          strokeWidth="1"
        />
        {look.powder && (
          <path
            d="M180 139C181 87 207 61 261 61C314 61 341 91 341 144L338 180C330 230 289 254 260 254C227 254 186 228 180 180Z"
            fill={look.powder}
            opacity=".27"
          />
        )}
        {look.blush && (
          <g fill={gradient("blush")}>
            <ellipse cx="207" cy="187" rx="23" ry="17" />
            <ellipse cx="313" cy="187" rx="23" ry="17" />
          </g>
        )}
        <path
          d="m257 171-4 14q7 6 14 0"
          stroke={skinDark}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity=".65"
        />
        {[false, true].map((mirror) => (
          <g
            key={String(mirror)}
            transform={mirror ? "translate(520 0) scale(-1 1)" : undefined}
          >
            {look.shadow && (
              <path
                d="M207 152C207 130 238 128 247 148L246 161Q227 145 208 160Z"
                fill={look.shadow}
                opacity=".8"
              />
            )}
            <path
              d="M209 155Q225 138 245 154Q233 172 217 165Z"
              fill="#fff9ee"
            />
            <ellipse cx="229" cy="155" rx="9" ry="11" fill={doll.eyes} />
            <ellipse cx="230" cy="156" rx="5" ry="8" fill="#34303c" />
            <circle cx="226" cy="151" r="3" fill="#fffdf6" />
            <circle cx="232" cy="159" r="1.5" fill="#fffdf6" />
            <path
              d="M208 154Q225 138 245 154"
              stroke={look.lashes ?? "#573d38"}
              strokeWidth={look.lashes ? 3.5 : 2.2}
              fill="none"
              strokeLinecap="round"
            />
            {look.lashes && (
              <path
                d="m212 150-5-8m12 5-3-9m10 8-1-9m8 9 2-8m-25 15-7-4"
                stroke={look.lashes}
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
            )}
            <path
              d="M211 128Q227 117 244 126"
              stroke={look.brows ?? mix(doll.hair, "#593f36", 0.3)}
              strokeWidth={look.brows ? 6 : 4.5}
              fill="none"
              strokeLinecap="round"
            />
            {look.shimmer && look.shadow && (
              <g fill="#fff8df">
                <circle cx="217" cy="141" r="1.5" />
                <circle cx="225" cy="137" r="1" />
                <circle cx="237" cy="140" r="1.7" />
                <circle cx="230" cy="144" r=".9" />
              </g>
            )}
          </g>
        ))}
        <path
          d="M244 205Q251 198 260 202Q268 198 276 205Q262 222 244 205Z"
          fill={look.lipstick ?? "#c97f80"}
        />
        <path
          d="M247 206q13 4 26-1"
          fill="none"
          stroke={
            look.lipstick ? mix(look.lipstick, "#60374b", 0.3) : "#b36f73"
          }
          strokeWidth="1.2"
        />
        <path
          d="M255 211q5 2 10 0"
          fill="none"
          stroke="#fff2dc"
          strokeWidth="1.2"
          opacity=".6"
        />
        <path
          d={cap}
          fill={gradient("hair")}
          stroke={hairDark}
          strokeWidth="2"
        />
        <g
          clipPath={gradient("hairclip")}
          fill="none"
          stroke={hairLight}
          opacity={look.texture === "natural" ? 0.27 : 0.49}
          strokeWidth={
            look.texture === "crimped"
              ? 2.7
              : look.texture === "curly"
                ? 4
                : 2.2
          }
        >
          {Array.from({ length: 23 }, (_, i) => (
            <path
              key={i}
              d={strand(
                125 + i * 12,
                36 + (i % 4) * 8,
                look.hairStyle === "bob" ? 220 : 350,
              )}
            />
          ))}
        </g>
        {!look.brushed && (
          <g
            stroke={hair}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity=".7"
          >
            <path d="M196 56q-15-8-13-17m124 14q15-12 18-4m-94-12q-7-15 3-17" />
          </g>
        )}
        {look.hairStyle === "braids" && (
          <>
            <path
              d="m184 252 27 4m-29 27 30 3m-28 25 27 3m96-58 31 2m-31 27 32 2m-31 28 30 2"
              stroke={hairDark}
              strokeWidth="4"
              opacity=".55"
            />
            <path
              d="m184 335 25 3m101 0 25 2"
              stroke={look.dressColor}
              strokeWidth="9"
            />
          </>
        )}
        {look.hairStyle === "braid" && (
          <path
            d={backPaths.braid[1]}
            fill={gradient("hair")}
            stroke={hairDark}
            strokeWidth="1.5"
          />
        )}
        {look.hairStyle === "braid" && (
          <path
            d="m245 278 37 5m-39 25 38 5m-39 21 38 6m-28 36 23 1"
            stroke={hairDark}
            strokeWidth="4"
            opacity=".55"
          />
        )}
        {look.hairStyle === "ponytail" && (
          <path
            d="m333 117 14 12"
            stroke={look.dressColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
        )}
        {look.accessories.includes("headband") && (
          <path
            d="M180 117C181 29 338 29 341 119"
            stroke={look.dressColor}
            strokeWidth="12"
            fill="none"
          />
        )}
        {look.accessories.includes("bow") && (
          <g transform="translate(313 87) rotate(24)">
            <path
              d="M0 0C-41-29-45 27-3 14L4 13C42 39 49-21 9 0Z"
              fill={look.dressColor}
              stroke={mix(look.dressColor, "#6b4779", 0.2)}
              strokeWidth="1.5"
            />
            <rect
              x="-3"
              y="-1"
              width="13"
              height="19"
              rx="4"
              fill={mix(look.dressColor, "#fff7e8", 0.25)}
            />
          </g>
        )}
        {look.accessories.includes("crown") && (
          <>
            <path
              d="m207 57-8-32 28 13 32-28 32 28 28-13-8 32Z"
              fill="#e5bf70"
              stroke="#c49d52"
              strokeWidth="2"
            />
            <path d="M210 50h99" stroke="#fff2c2" strokeWidth="4" />
            <circle cx="260" cy="36" r="7" fill={look.dressColor} />
          </>
        )}
        {look.accessories.includes("glasses") && (
          <g fill="#e9d9f0" fillOpacity=".15" stroke="#81668e" strokeWidth="3">
            <rect x="205" y="144" width="43" height="31" rx="12" />
            <rect x="272" y="144" width="43" height="31" rx="12" />
            <path d="M248 152q12-7 24 0m-68-1-17-6m128 6 17-6" fill="none" />
          </g>
        )}
        {look.accessories.includes("bag") && (
          <g>
            <path
              d="M303 292q40 54 35 112"
              stroke="#b88c5b"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M314 403q25-12 49 0l-3 54q-22 14-43-1Z"
              fill={look.dressColor}
              stroke={mix(look.dressColor, "#594168", 0.3)}
              strokeWidth="2"
            />
            <path
              d="M317 414q21 23 44 0"
              fill="none"
              stroke={mix(look.dressColor, "#fff4e0", 0.3)}
              strokeWidth="3"
            />
            <circle cx="339" cy="430" r="4" fill="#e8c985" />
          </g>
        )}
      </g>
      {!portrait && (
        <g fill="#c5acd3" opacity=".65">
          <Star x={104} y={223} r={9} />
          <Star x={411} y={369} r={7} />
          <Star x={121} y={555} r={5} />
          <circle cx="401" cy="148" r="3" />
          <circle cx="95" cy="402" r="2" />
        </g>
      )}
    </svg>
  );
}
