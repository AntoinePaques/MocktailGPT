import assert from "assert";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "../../../../..");
const cli = path.join(root, "packages/@mocktailgpt/ts/dist/cli.js");
const example = path.join(root, "example/vanScrapper");
const outDir = path.join(example, "generated");

spawnSync(
  "node",
  [
    cli,
    "generate",
    "--input",
    path.join(example, "swagger.yaml"),
    "--output",
    outDir,
    "--force",
  ],
  { stdio: "inherit" },
);

assert.ok(fs.existsSync(path.join(outDir, "globalMockMutator.ts")));
const gm = fs.readFileSync(path.join(outDir, "globalMockMutator.ts"), "utf8");
assert.ok(/chat\.completion/.test(gm));
assert.ok(/choices/.test(gm));

const msw = fs.readFileSync(path.join(outDir, "msw.ts"), "utf8");
assert.ok(/http\.post/.test(msw));
assert.ok(/\/specs/.test(msw));

assert.ok(fs.existsSync(path.join(outDir, "mockServiceWorker.js")));

const idx = fs.readFileSync(path.join(outDir, "index.ts"), "utf8");
assert.ok(idx.includes("./msw"));
assert.ok(idx.includes("globalMockMutator"));

console.log("generate cli ok");
