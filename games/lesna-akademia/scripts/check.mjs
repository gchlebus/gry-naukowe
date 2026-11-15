import { readdir, stat, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { PHOTOS } from "../dist/js/photos.mjs";
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
if (PHOTOS.length !== 8 || new Set(PHOTOS.map((p) => p.id)).size !== 8)
  throw Error("Oczekiwano ośmiu różnych fotografii.");
for (const photo of PHOTOS) {
  const bytes = await readFile("dist/" + photo.src.replace(/^\.\//, ""));
  if (!photo.author || !photo.source || !photo.license || !photo.licenseUrl)
    throw Error("Brak atrybucji fotografii: " + photo.id);
  if (createHash("sha256").update(bytes).digest("hex") !== photo.sha256)
    throw Error("Fotografia różni się od pobranego pliku: " + photo.id);
}
console.log("Składnia i zasoby: OK");
