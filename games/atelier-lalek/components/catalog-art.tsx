import { Icon } from "./icon";
export function CatalogArt({
  kind,
  id,
  color = "#b59bdf",
}: {
  kind: string;
  id: string;
  color?: string;
}) {
  if (kind === "tool") return <Icon name={id} size={52} />;
  return (
    <svg viewBox="0 0 120 108" aria-hidden="true" className="catalog-art">
      <defs>
        <pattern
          id={"gingham-" + id}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="12" fill="#fff9ed" opacity=".5" />
          <rect height="6" width="12" fill="#fff9ed" opacity=".5" />
        </pattern>
      </defs>
      {kind === "dress" ? (
        <g>
          <path
            d={
              id === "party"
                ? "m44 16-15 9 9 20 7-3-4 13-24 41q43 17 86 0L79 55l-4-13 7 3 9-20-15-9q-16 13-32 0Z"
                : "m44 16-15 9 9 20 7-3-4 13-18 38q37 14 74 0L79 55l-4-13 7 3 9-20-15-9q-16 13-32 0Z"
            }
            fill={color}
          />
          {id === "picnic" && (
            <path
              d="m44 16-15 9 9 20 7-3-4 13-18 38q37 14 74 0L79 55l-4-13 7 3 9-20-15-9q-16 13-32 0Z"
              fill={"url(#gingham-" + id + ")"}
            />
          )}
          <path
            d="M43 55h34m-33-39q16 15 32 0"
            stroke="#fff5e4"
            strokeWidth="4"
            fill="none"
          />
          {id === "rainbow" && (
            <g strokeWidth="9">
              <path d="m45 60-12 31" stroke="#e9a5ba" />
              <path d="m54 60-4 35" stroke="#e4c482" />
              <path d="m64 60 2 35" stroke="#94bdac" />
              <path d="m73 60 12 31" stroke="#8caccd" />
            </g>
          )}
          {["daisy", "garden"].includes(id) && (
            <g fill="#fff8e5">
              {[43, 63, 79].map((x, i) => (
                <g key={x} transform={`translate(${x} ${71 + (i % 2) * 12})`}>
                  <path d="M0-7C9-10 6 0 1 1 8 8-3 10-2 3-11 6-11-5-4-3-8-10 2-12 0-7Z" />
                  <circle r="2" fill="#d9b96b" />
                </g>
              ))}
            </g>
          )}
          {id === "stars" && (
            <g fill="#fff4c7">
              <path d="m48 66 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm25 15 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
            </g>
          )}
          {id === "party" && (
            <path
              d="M31 78q29 16 58 0M25 91q35 16 70 0"
              stroke="#fff4e0"
              strokeOpacity=".6"
              strokeWidth="5"
              fill="none"
            />
          )}
        </g>
      ) : kind === "top" ? (
        <g>
          <path
            d={
              ["sweater", "hoodie"].includes(id)
                ? "m44 19-17 8-14 45 19 7 13-34-4 44h38l-4-44 13 34 19-7-14-45-17-8q-16 12-32 0Z"
                : "m44 19-22 10-13 20 19 15 15-18-2 43h38l-2-43 15 18 19-15-13-20-22-10q-16 12-32 0Z"
            }
            fill={color}
          />
          {id === "hoodie" ? (
            <>
              <path d="m44 21 4-10h24l4 10-16 16Z" fill="#baa5cc" />
              <path
                d="M47 66h26v15H47M51 34v18m18-18v18"
                stroke="#fff5ed"
                strokeWidth="2"
                fill="none"
              />
            </>
          ) : id === "sweater" ? (
            <path
              d="m45 49 8 9 8-9 8 9 8-9m-32 18 8 9 8-9 8 9 8-9"
              stroke="#fff5e4"
              strokeWidth="3"
              fill="none"
            />
          ) : id === "blouse" ? (
            <path
              d="M44 20q6 30 16 8 10 22 16-8l9 17q-13 17-25 4-14 13-25-4Z"
              fill="#fff7e9"
            />
          ) : (
            <path d="m60 48 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#fff4df" />
          )}
        </g>
      ) : kind === "bottom" ? (
        <g>
          <path
            d={
              id === "jeans"
                ? "M34 14h52l-4 85H65l-5-60-5 60H38Z"
                : id === "shorts"
                  ? "M34 25h52l8 49-28 3-6-24-6 24-28-3Z"
                  : id === "tutu"
                    ? "M41 23h38l25 58q-44 21-88 0Z"
                    : "M41 23h38l18 61q-37 17-74 0Z"
            }
            fill={color}
          />
          {["jeans", "shorts"].includes(id) ? (
            <path
              d="M35 26q12 12 19 0m12 0q7 12 19 0M60 16v27"
              stroke="#fff3e2"
              strokeOpacity=".6"
              strokeWidth="2"
              fill="none"
            />
          ) : (
            <path
              d="m48 31-9 51m20-51v58m12-58 13 51"
              stroke="#fff8e4"
              strokeOpacity=".5"
              strokeWidth="3"
              fill="none"
            />
          )}
          <path
            d={id === "jeans" ? "M35 19h50" : "M41 26h38"}
            stroke="#8a7095"
            strokeWidth="5"
          />
        </g>
      ) : kind === "shoes" ? (
        <g>
          {id === "boots" && (
            <path d="M26 20h24v42H23Zm43 0h24v42H66Z" fill={color} />
          )}
          <path
            d="M25 57h24l5 22Q47 94 18 85c-12-9 1-15 7-28Zm43 0h24l5 22Q90 94 61 85c-12-9 1-15 7-28Z"
            fill={color}
          />
          {id === "sneakers" ? (
            <path
              d="m27 64 17 2m-19 5 18 1m-29 10 34 1m22-19 17 2m-19 5 18 1m-29 10 34 1"
              stroke="#fff9ef"
              strokeWidth="3"
            />
          ) : id === "sandals" ? (
            <path
              d="m25 60 19 16m-19 0 19-16m24 0 19 16m-19 0 19-16"
              stroke="#f3c6a7"
              strokeWidth="4"
            />
          ) : (
            <path
              d="M26 60q10 19 20 0m23 0q10 19 20 0"
              stroke="#f3c6a7"
              strokeWidth="6"
              fill="none"
            />
          )}
          {id === "maryjane" && (
            <path d="m25 64 20 3m24-3 20 3" stroke={color} strokeWidth="4" />
          )}
        </g>
      ) : kind === "accessory" ? (
        id === "bow" ? (
          <g fill={color}>
            <path d="M54 43C2-7 1 101 54 62L66 62C119 101 118-7 66 43Z" />
            <rect x="51" y="38" width="18" height="33" rx="6" fill="#9c77b6" />
          </g>
        ) : id === "headband" ? (
          <path
            d="M23 84C-10-13 130-13 97 84"
            stroke={color}
            strokeWidth="13"
            fill="none"
          />
        ) : id === "crown" ? (
          <g>
            <path
              d="m24 78-8-47 27 18 17-28 17 28 27-18-8 47Z"
              fill="#ddba74"
            />
            <circle cx="60" cy="59" r="9" fill={color} />
          </g>
        ) : id === "glasses" ? (
          <g stroke={color} strokeWidth="5" fill="#f6e7ee">
            <rect x="10" y="37" width="43" height="35" rx="14" />
            <rect x="67" y="37" width="43" height="35" rx="14" />
            <path d="M53 48q7-6 14 0" fill="none" />
          </g>
        ) : (
          <g>
            <path d="M28 44q32-30 64 0l-4 48H32Z" fill={color} />
            <path
              d="M43 42C31-3 89-3 77 42M30 52q30 40 60 0"
              stroke="#a1825e"
              strokeWidth="4"
              fill="none"
            />
            <circle cx="60" cy="67" r="5" fill="#e5c27d" />
          </g>
        )
      ) : null}
    </svg>
  );
}
