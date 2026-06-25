import { build } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "assets"), { recursive: true });

await build({
  absWorkingDir: root,
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "esm",
  target: ["es2020"],
  outfile: resolve(dist, "assets/app.js"),
  loader: {
    ".svg": "file",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".webp": "file"
  }
});

await cp(resolve(root, "public"), dist, { recursive: true });

await writeFile(
  resolve(dist, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Astrotalk Clone</title>
    <link rel="stylesheet" href="/assets/app.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/app.js"></script>
  </body>
</html>
`,
  "utf8"
);
