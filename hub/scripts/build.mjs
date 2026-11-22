import { cp, readFile } from "node:fs/promises";

const hub = new URL("../", import.meta.url);
const catalog = JSON.parse(await readFile(new URL("catalog.json", hub), "utf8"));
for (const game of catalog.games.filter(game => game.embedded)) {
  const source = new URL(`../games/${game.id}/dist/`, hub);
  const destination = new URL("dist" + new URL(game.url).pathname, hub);
  await cp(source, destination, { recursive: true });
}
