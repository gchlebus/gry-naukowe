import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../dist/", import.meta.url)),
  arg = process.argv.indexOf("--port"),
  port = arg < 0 ? 5179 : Number(process.argv[arg + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("Podaj poprawny --port.");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
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
    const file = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!file.startsWith(root) || !(await stat(file)).isFile()) {
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
    `Gabinet Joanny: http://localhost:${port}\nZatrzymanie: Ctrl+C\n`,
  ),
);
process.on("SIGINT", () => server.close(() => process.exit(0)));
