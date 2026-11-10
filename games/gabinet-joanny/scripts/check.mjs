import { readdir, readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
for (const dir of ["dist/js", "scripts", "tests"])
  for (const file of await readdir(path.join(root, dir)))
    if (file.endsWith(".mjs")) {
      const r = spawnSync(
        process.execPath,
        ["--check", path.join(root, dir, file)],
        { stdio: "inherit" },
      );
      if (r.status !== 0) process.exit(1);
    }
for (const file of [
  "dist/index.html",
  "dist/styles.css",
  "dist/art/gabinet.png",
  ".openai/hosting.json",
])
  if (!(await stat(path.join(root, file))).isFile())
    throw Error("Brak pliku: " + file);
const html = await readFile(path.join(root, "dist/index.html"), "utf8");
if (!html.includes('lang="pl"')) throw Error("Brak polskiej wersji");
console.log("Składnia i pliki gry: OK");
