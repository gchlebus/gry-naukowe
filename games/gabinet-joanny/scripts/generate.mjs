import { writeFile } from "node:fs/promises";
import { CHAPTERS, TYPES, PUZZLES, PROFESSOR_NOTES } from "./puzzle-source.mjs";
const source =
  "// Generated deterministically by npm run generate. Edit scripts/puzzle-source.mjs.\n" +
  Object.entries({ CHAPTERS, TYPES, PUZZLES, PROFESSOR_NOTES })
    .map(
      ([name, value]) =>
        `export const ${name} = ${JSON.stringify(value, null, 2)};`,
    )
    .join("\n\n") +
  "\nexport const BY_ID = new Map(PUZZLES.map(p => [p.id,p]));\n";
await writeFile(new URL("../dist/js/puzzles.mjs", import.meta.url), source);
console.log(`Przygotowano ${PUZZLES.length} zagadki.`);
