export const DOLLS = [
  {
    id: "mila",
    name: "Mila",
    skin: "#edb99b",
    hair: "#74432e",
    eyes: "#648577",
    description: "Kasztanowe włosy i zielone oczy",
    style: "long",
  },
  {
    id: "nina",
    name: "Nina",
    skin: "#995d43",
    hair: "#312423",
    eyes: "#9c753e",
    description: "Ciemne loczki i bursztynowe oczy",
    style: "puffs",
  },
  {
    id: "lena",
    name: "Lena",
    skin: "#d59b77",
    hair: "#302c32",
    eyes: "#626e91",
    description: "Czarne włosy i niebieskie oczy",
    style: "braids",
  },
  {
    id: "pola",
    name: "Pola",
    skin: "#f0c7b0",
    hair: "#c39654",
    eyes: "#729ba0",
    description: "Złote włosy i błękitne oczy",
    style: "ponytail",
  },
] as const;
export type DollId = (typeof DOLLS)[number]["id"];
export const HAIRSTYLES = [
  { id: "long", name: "Rozpuszczone" },
  { id: "bob", name: "Krótki bob" },
  { id: "ponytail", name: "Kucyk" },
  { id: "twintails", name: "Dwa kucyki" },
  { id: "braid", name: "Warkocz" },
  { id: "braids", name: "Dwa warkocze" },
  { id: "bun", name: "Koczek" },
  { id: "puffs", name: "Dwa koczki" },
] as const;
export type HairStyle = (typeof HAIRSTYLES)[number]["id"];
export type Texture = "natural" | "straight" | "curly" | "crimped";
export const HAIR_TOOLS = [
  { id: "brush", name: "Szczotka", hint: "Uczesz włosy", icon: "brush" },
  { id: "curly", name: "Lokówka", hint: "Miękkie loczki", icon: "curler" },
  {
    id: "crimped",
    name: "Karbownica",
    hint: "Drobne zygzaki",
    icon: "crimper",
  },
  {
    id: "straight",
    name: "Prostownica",
    hint: "Proste pasma",
    icon: "straightener",
  },
] as const;
export const DRESSES = [
  { id: "daisy", name: "Stokrotka" },
  { id: "party", name: "Na przyjęcie" },
  { id: "rainbow", name: "Tęczowa" },
  { id: "picnic", name: "Na piknik" },
  { id: "stars", name: "Gwiazdki" },
  { id: "garden", name: "W ogrodzie" },
] as const;
export const TOPS = [
  { id: "tee", name: "Koszulka" },
  { id: "sweater", name: "Sweterek" },
  { id: "blouse", name: "Bluzka z falbanką" },
  { id: "hoodie", name: "Bluza z kapturem" },
] as const;
export const BOTTOMS = [
  { id: "skirt", name: "Spódniczka" },
  { id: "jeans", name: "Spodnie" },
  { id: "shorts", name: "Szorty" },
  { id: "tutu", name: "Tiulowa spódnica" },
] as const;
export const SHOES = [
  { id: "ballet", name: "Balerinki" },
  { id: "sneakers", name: "Trampki" },
  { id: "boots", name: "Kozaczki" },
  { id: "sandals", name: "Sandałki" },
  { id: "maryjane", name: "Buty z paseczkiem" },
] as const;
export const ACCESSORIES = [
  { id: "bow", name: "Kokardka" },
  { id: "headband", name: "Opaska" },
  { id: "crown", name: "Korona" },
  { id: "glasses", name: "Okulary" },
  { id: "bag", name: "Torebka" },
] as const;
export const MAKEUP = [
  { id: "shadow", name: "Cienie", icon: "eye" },
  { id: "lipstick", name: "Szminka", icon: "lipstick" },
  { id: "blush", name: "Róż", icon: "blush" },
  { id: "powder", name: "Puder", icon: "powder" },
  { id: "brows", name: "Brwi", icon: "brow" },
  { id: "lashes", name: "Rzęsy", icon: "lashes" },
] as const;
export type Makeup = (typeof MAKEUP)[number]["id"];
export const PALETTE = [
  ["Lawenda", "#b59bdf"],
  ["Róż", "#e88db0"],
  ["Brzoskwinia", "#edb08c"],
  ["Mięta", "#8cbbaa"],
  ["Błękit", "#83afd3"],
  ["Koral", "#d97472"],
  ["Śliwka", "#835c93"],
  ["Czerwień", "#bf4664"],
  ["Krem", "#f3e2bc"],
  ["Złoto", "#cfab64"],
  ["Granat", "#475277"],
  ["Kasztan", "#74432e"],
  ["Brąz", "#a47653"],
  ["Blond", "#d5b16b"],
  ["Czerń", "#302c36"],
  ["Biel", "#f7f3ec"],
] as const;
export const COSMETIC_PALETTES: Record<
  Makeup,
  readonly (readonly [string, string])[]
> = {
  shadow: PALETTE.slice(0, 11),
  lipstick: [
    ["Malina", "#bd416b"],
    ["Różowa piwonia", "#df7d9e"],
    ["Koral", "#dc775e"],
    ["Jagoda", "#8b527e"],
    ["Czerwień", "#ba4655"],
    ["Delikatny róż", "#dba3a1"],
    ["Fiolet", "#a986bc"],
    ["Brąz", "#a66d61"],
  ],
  blush: [
    ["Różany", "#df8ea3"],
    ["Brzoskwiniowy", "#e89a79"],
    ["Malinowy", "#c45d88"],
    ["Morelowy", "#d99471"],
    ["Lawendowy", "#b796cd"],
  ],
  powder: [
    ["Jasny krem", "#f4dfc6"],
    ["Brzoskwiniowy", "#eac0a4"],
    ["Miodowy", "#c99469"],
    ["Ciepły brąz", "#a87554"],
    ["Kakaowy", "#744c3b"],
  ],
  brows: [
    ["Ciemny brąz", "#4b3029"],
    ["Kasztan", "#774f3a"],
    ["Blond", "#b38d57"],
    ["Czerń", "#26232d"],
    ["Róż", "#c7759c"],
    ["Fiolet", "#8e70a9"],
  ],
  lashes: [
    ["Czerń", "#2c2635"],
    ["Brąz", "#73513b"],
    ["Fiolet", "#8c62ad"],
    ["Niebieski", "#5279b6"],
    ["Róż", "#cf7197"],
    ["Zieleń", "#4c947e"],
  ],
};
export type Look = {
  hairStyle: HairStyle;
  texture: Texture;
  dye: string | null;
  brushed: boolean;
  shadow: string | null;
  lipstick: string | null;
  blush: string | null;
  powder: string | null;
  brows: string | null;
  lashes: string | null;
  shimmer: boolean;
  nails: string | null;
  nailPattern: "plain" | "dots" | "sparkle";
  outfit: "dress" | "separates";
  dress: string;
  top: string;
  bottom: string;
  shoes: string;
  dressColor: string;
  topColor: string;
  bottomColor: string;
  shoeColor: string;
  accessories: string[];
};
export type AlbumLook = { id: string; name: string; doll: DollId; look: Look };
export type Book = {
  version: 1;
  doll: DollId;
  looks: Record<DollId, Look>;
  album: AlbumLook[];
  sound: boolean;
};
export type Editor = { book: Book; past: Book[]; future: Book[] };
export const STORAGE_KEY = "atelier-lalek-v1";
export function defaultLook(doll: DollId = "mila"): Look {
  return {
    hairStyle: DOLLS.find((d) => d.id === doll)!.style,
    texture: doll === "nina" ? "curly" : "natural",
    dye: null,
    brushed: false,
    shadow: null,
    lipstick: null,
    blush: null,
    powder: null,
    brows: null,
    lashes: null,
    shimmer: false,
    nails: null,
    nailPattern: "plain",
    outfit: "dress",
    dress: "daisy",
    top: "tee",
    bottom: "skirt",
    shoes: "ballet",
    dressColor: {
      mila: "#b59bdf",
      nina: "#8cbbaa",
      lena: "#e88db0",
      pola: "#83afd3",
    }[doll],
    topColor: "#f3e2bc",
    bottomColor: "#83afd3",
    shoeColor: "#9c7caf",
    accessories: [],
  };
}
export function freshBook(): Book {
  return {
    version: 1,
    doll: "mila",
    looks: Object.fromEntries(
      DOLLS.map((d) => [d.id, defaultLook(d.id)]),
    ) as Record<DollId, Look>,
    album: [],
    sound: false,
  };
}
const color = (v: unknown): v is string =>
  typeof v === "string" && /^#[\da-f]{6}$/i.test(v);
const member = (v: unknown, items: readonly { id: string }[]) =>
  items.some((x) => x.id === v);
export function cleanLook(v: unknown, doll: DollId): Look {
  const s = defaultLook(doll);
  if (!v || typeof v !== "object") return s;
  const x = v as Record<string, unknown>;
  for (const k of [
    "dye",
    "shadow",
    "lipstick",
    "blush",
    "powder",
    "brows",
    "lashes",
    "nails",
  ] as const)
    if (x[k] === null || color(x[k])) s[k] = x[k] as string | null;
  for (const k of [
    "dressColor",
    "topColor",
    "bottomColor",
    "shoeColor",
  ] as const)
    if (color(x[k])) s[k] = x[k];
  if (member(x.hairStyle, HAIRSTYLES)) s.hairStyle = x.hairStyle as HairStyle;
  if (["natural", "straight", "curly", "crimped"].includes(String(x.texture)))
    s.texture = x.texture as Texture;
  for (const [k, items] of [
    ["dress", DRESSES],
    ["top", TOPS],
    ["bottom", BOTTOMS],
    ["shoes", SHOES],
  ] as const)
    if (member(x[k], items)) s[k] = x[k] as string;
  if (x.outfit === "separates") s.outfit = "separates";
  if (x.nailPattern === "dots" || x.nailPattern === "sparkle")
    s.nailPattern = x.nailPattern;
  s.shimmer = x.shimmer === true;
  s.brushed = x.brushed === true;
  s.accessories = Array.isArray(x.accessories)
    ? [
        ...new Set<string>(
          x.accessories.filter(
            (a): a is string => typeof a === "string" && member(a, ACCESSORIES),
          ),
        ),
      ]
    : [];
  return s;
}
export function parseBook(raw: string): Book {
  const x = JSON.parse(raw);
  if (x?.version !== 1) throw Error("Nieprawidłowy zapis");
  const s = freshBook();
  if (member(x.doll, DOLLS)) s.doll = x.doll;
  for (const d of DOLLS) s.looks[d.id] = cleanLook(x.looks?.[d.id], d.id);
  s.sound = x.sound === true;
  if (Array.isArray(x.album))
    s.album = x.album
      .slice(0, 24)
      .filter(
        (a: unknown) =>
          a && typeof a === "object" && member((a as AlbumLook).doll, DOLLS),
      )
      .map((a: AlbumLook, i: number) => ({
        id: typeof a.id === "string" ? a.id.slice(0, 80) : "restored-" + i,
        name:
          typeof a.name === "string" ? a.name.slice(0, 40) : "Moja stylizacja",
        doll: a.doll,
        look: cleanLook(a.look, a.doll),
      }));
  return s;
}
export type Action =
  | { type: "edit"; patch: Partial<Look> }
  | { type: "doll"; id: DollId }
  | { type: "reset" }
  | { type: "restore"; book: Book }
  | { type: "sound"; value: boolean }
  | { type: "save"; id: string; name: string }
  | { type: "load"; id: string }
  | { type: "delete"; id: string }
  | { type: "undo" }
  | { type: "redo" };
export function reducer(state: Editor, action: Action): Editor {
  if (action.type === "restore")
    return { book: action.book, past: [], future: [] };
  if (action.type === "undo") {
    if (!state.past.length) return state;
    return {
      book: { ...state.past.at(-1)!, sound: state.book.sound },
      past: state.past.slice(0, -1),
      future: [state.book, ...state.future],
    };
  }
  if (action.type === "redo") {
    if (!state.future.length) return state;
    return {
      book: { ...state.future[0], sound: state.book.sound },
      past: [...state.past, state.book],
      future: state.future.slice(1),
    };
  }
  const b = state.book;
  let next = b;
  if (action.type === "edit")
    next = {
      ...b,
      looks: {
        ...b.looks,
        [b.doll]: cleanLook({ ...b.looks[b.doll], ...action.patch }, b.doll),
      },
    };
  if (action.type === "reset")
    next = { ...b, looks: { ...b.looks, [b.doll]: defaultLook(b.doll) } };
  if (action.type === "doll") next = { ...b, doll: action.id };
  if (action.type === "sound")
    return { ...state, book: { ...b, sound: action.value } };
  if (action.type === "save" && b.album.length < 24)
    next = {
      ...b,
      album: [
        ...b.album,
        {
          id: action.id,
          name: action.name.trim().slice(0, 40) || "Moja stylizacja",
          doll: b.doll,
          look: {
            ...b.looks[b.doll],
            accessories: [...b.looks[b.doll].accessories],
          },
        },
      ],
    };
  if (action.type === "load") {
    const a = b.album.find((x) => x.id === action.id);
    if (a)
      next = {
        ...b,
        doll: a.doll,
        looks: {
          ...b.looks,
          [a.doll]: { ...a.look, accessories: [...a.look.accessories] },
        },
      };
  }
  if (action.type === "delete")
    next = { ...b, album: b.album.filter((a) => a.id !== action.id) };
  if (JSON.stringify(next) === JSON.stringify(b)) return state;
  return { book: next, past: [...state.past.slice(-39), b], future: [] };
}
export function mix(hex: string, other: string, amount: number) {
  const a = hex
      .slice(1)
      .match(/../g)!
      .map((x) => parseInt(x, 16)),
    b = other
      .slice(1)
      .match(/../g)!
      .map((x) => parseInt(x, 16));
  return (
    "#" +
    a
      .map((x, i) =>
        Math.round(x + (b[i] - x) * amount)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
