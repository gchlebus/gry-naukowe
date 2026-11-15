import { readdir, stat, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
for (const dir of ["dist/js", "scripts", "tests"])
  for (const file of await readdir(dir))
    if (file.endsWith(".mjs")) {
      const r = spawnSync(process.execPath, ["--check", `${dir}/${file}`], {
        stdio: "inherit",
      });
      if (r.status) process.exit(r.status);
    }
for (const file of [
  "dist/index.html",
  "dist/styles.css",
  "dist/favicon.svg",
  ".openai/hosting.json",
])
  if (!(await stat(file)).isFile()) throw Error("Brak " + file);
if (!(await readFile("dist/index.html", "utf8")).includes('lang="pl"'))
  throw Error("Brak języka polskiego.");
console.log("Składnia i zasoby: OK");
