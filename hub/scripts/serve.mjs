import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../dist/", import.meta.url)),
  arg = process.argv.indexOf("--port"),
  port = arg < 0 ? 5180 : Number(process.argv[arg + 1]);
const catalog = JSON.parse(await readFile(new URL("../catalog.json", import.meta.url), "utf8"));
const embedded = new Map();
for (const game of catalog.games.filter(game => game.embedded)) {
  const pathname = new URL(game.url).pathname;
  const deployed = path.join(root, pathname);
  const hasDeployedFiles = await stat(deployed).then(info => info.isDirectory()).catch(() => false);
  embedded.set(pathname, hasDeployedFiles ? deployed :
    fileURLToPath(new URL(`../../games/${game.id}/dist/`, import.meta.url)));
}
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("Podaj poprawny --port.");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (embedded.has(pathname + "/")) {
      res.writeHead(308, { Location: pathname + "/" });
      res.end();
      return;
    }
    const mount = [...embedded.keys()].find(prefix => pathname.startsWith(prefix));
    const directory = mount ? embedded.get(mount) : root;
    const relative = pathname.slice(mount?.length ?? 1);
    const file = path.resolve(directory, relative || "index.html");
    if (!file.startsWith(directory) || !(await stat(file)).isFile()) {
      res.writeHead(404);
      res.end("Nie znaleziono pliku");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Nie znaleziono pliku");
  }
});
server.listen(port, "127.0.0.1", () =>
  process.stdout.write(
    `Kraina Gier: http://localhost:${port}\nZatrzymanie: Ctrl+C\n`,
  ),
);
process.on("SIGINT", () => server.close(() => process.exit(0)));
