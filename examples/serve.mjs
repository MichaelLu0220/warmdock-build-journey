// A dependency-free static server for the browser demo. Node standard library
// only — nothing to install. Serves the repo so the demo page can import the
// real ../../src modules over http.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Repo root, without a trailing separator so the containment check is exact.
const ROOT = fileURLToPath(new URL("..", import.meta.url)).replace(
  new RegExp(`\\${sep}$`),
  "",
);
const PORT = Number(process.env.PORT) || 4173;
const ENTRY = "/examples/web/index.html";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname === "/") pathname = ENTRY;

    // Keep every request inside the repo root — no path traversal.
    const filePath = normalize(join(ROOT, pathname));
    if (!filePath.startsWith(ROOT + sep) && filePath !== ROOT) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": TYPES[extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}${ENTRY}`;
  console.log(`\n  WarmDock concept demo running:\n\n    ${url}\n`);
  console.log("  Drag the card sideways to turn it. Ctrl+C to stop.\n");
  open(url);
});

// Best-effort: open the default browser. Never fails the process if it can't.
function open(url) {
  const platform = process.platform;
  const cmd =
    platform === "win32" ? "cmd" : platform === "darwin" ? "open" : "xdg-open";
  const args = platform === "win32" ? ["/c", "start", "", url] : [url];
  import("node:child_process")
    .then(({ spawn }) => {
      spawn(cmd, args, { stdio: "ignore", detached: true }).on("error", () => {});
    })
    .catch(() => {});
}
