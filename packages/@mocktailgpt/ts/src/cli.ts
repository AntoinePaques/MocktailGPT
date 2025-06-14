#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import yaml from "js-yaml";

// TODO: support merging global mock mutator when provided by the user

const deepMerge = (base: any, extra: any): any => {
  const out = { ...base };
  for (const key of Object.keys(extra)) {
    if (
      key in base &&
      typeof base[key] === "object" &&
      typeof extra[key] === "object"
    ) {
      out[key] = deepMerge(base[key], extra[key]);
    } else {
      out[key] = extra[key];
    }
  }
  return out;
};

export const run = (configPath?: string) => {
  const basePath = path.join(__dirname, "../orval.config.js");
  const baseCfg = require(basePath);
  let cfg = baseCfg;
  let userMutator: string | undefined;
  let cfgDir = path.dirname(basePath);
  if (configPath) {
    const resolved = path.resolve(configPath);
    const userCfg = require(resolved);
    cfgDir = path.dirname(resolved);
    cfg = deepMerge(baseCfg, userCfg);
    userMutator =
      userCfg?.default?.output?.override?.mutator?.path ||
      userCfg?.output?.override?.mutator?.path;
  }
  const resolveFromCwd = (p: string) => path.resolve(process.cwd(), p);
  const resolveUser = (p: string) =>
    path.isAbsolute(p) ? p : path.join(cfgDir, p);
  if (cfg?.default?.input?.target) {
    cfg.default.input.target = resolveFromCwd(cfg.default.input.target);
  }
  if (cfg?.default?.output?.target) {
    cfg.default.output.target = resolveFromCwd(cfg.default.output.target);
  }
  if (cfg?.default?.output?.schemas) {
    cfg.default.output.schemas = resolveFromCwd(cfg.default.output.schemas);
  }
  if (userMutator) {
    const wrapper = path.join(os.tmpdir(), "mocktail-user-mutator.js");
    fs.writeFileSync(
      wrapper,
      `const { openaiMutator } = require('${path.join(__dirname, "mutators/openaiMutator")}');\n` +
        `const user = require('${resolveUser(userMutator)}');\n` +
        `module.exports = async opts => {\n` +
        `  await openaiMutator(opts);\n` +
        `  if (typeof user === 'function') return user(opts);\n` +
        `  if (user && typeof user.default === 'function') return user.default(opts);\n` +
        `  if (user && typeof user.mutator === 'function') return user.mutator(opts);\n` +
        `};\n`,
    );
    cfg.default.output.override = cfg.default.output.override || {};
    cfg.default.output.override.mutator = { path: wrapper };
  }
  const tempCfg = path.join(os.tmpdir(), "mocktail-orval.json");
  fs.writeFileSync(tempCfg, JSON.stringify(cfg, null, 2));
  const orvalBin = path.join(__dirname, "../node_modules/.bin/orval");
  spawnSync(orvalBin, ["--config", tempCfg], { stdio: "inherit" });
};

const parseArgs = (argv: string[]) => {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
};

const loadConfig = (p: string) => {
  if (!fs.existsSync(p)) return {};
  const raw = fs.readFileSync(p, "utf8");
  const js = raw.replace(/export\s+default/, "module.exports =");
  const tmp = path.join(os.tmpdir(), "mocktail-config.js");
  fs.writeFileSync(tmp, js);
  return require(tmp);
};

export const generate = (argv: string[]) => {
  const args = parseArgs(argv);
  const cfgPath = (args.config as string) || "mocktail.config.ts";
  const cfg = loadConfig(cfgPath);
  const input = (args.input as string) || cfg.input || "./swagger.yaml";
  const outDir = (args.output as string) || cfg.output || "generated";
  const force = !!args.force;
  if (fs.existsSync(outDir)) {
    if (!force) {
      console.error(
        `Directory ${outDir} already exists. Use --force to overwrite.`,
      );
      process.exit(1);
    }
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  const mutatorPath = path.join(path.resolve(outDir), "globalMutator.ts");

  const orvalCfg = {
    client: {
      input: { target: path.resolve(input) },
      output: {
        mode: "single",
        target: path.join(path.resolve(outDir), "client.ts"),
        client: "fetch",
        schemas: path.join(path.resolve(outDir), "models"),
        mock: true,
        override: {
          mutator: { path: mutatorPath },
          mock: {
            properties: {
              path: path.join(__dirname, "mutators/mockMutator.ts"),
            },
          },
        },
      },
    },
    sdk: {
      input: { target: path.join(__dirname, "../mocktail.sdk.yaml") },
      output: {
        mode: "single",
        target: path.join(path.resolve(outDir), "sdk.ts"),
        client: "fetch",
      },
    },
  } as any;

  const gmPath = path.join(outDir, "globalMutator.ts");
  if (cfg.mutator) {
    const resolved = path.resolve(cfg.mutator);
    fs.writeFileSync(
      gmPath,
      `import { openaiMutator } from "@mocktailgpt/ts";\n` +
        `import userMutator from "${resolved}";\n` +
        `export const globalMutator = async (opts: any) => {\n` +
        `  await openaiMutator(opts);\n` +
        `  if (typeof userMutator === 'function') return userMutator(opts);\n` +
        `  if (userMutator && typeof userMutator.default === 'function') return userMutator.default(opts);\n` +
        `  if (userMutator && typeof userMutator.mutator === 'function') return userMutator.mutator(opts);\n` +
        `};\n`,
    );
  } else {
    fs.writeFileSync(
      gmPath,
      `import { openaiMutator } from "@mocktailgpt/ts";\n` +
        `export const globalMutator = openaiMutator;\n`,
    );
  }

  const tempCfg = path.join(os.tmpdir(), "mocktail-generate.json");
  fs.writeFileSync(tempCfg, JSON.stringify(orvalCfg, null, 2));
  const orvalBin = path.join(__dirname, "../node_modules/.bin/orval");
  spawnSync(orvalBin, ["--config", tempCfg], { stdio: "inherit" });

  console.log("Generating mocks...");
  const tplDir = path.join(__dirname, "../templates");
  const staticFiles = ["mockServiceWorker.js", "index.ts"];
  for (const f of staticFiles) {
    fs.copyFileSync(path.join(tplDir, f), path.join(outDir, f));
  }

  const swagger = yaml.load(
    fs.readFileSync(path.resolve(input), "utf8"),
  ) as any;
  const paths = swagger.paths || {};

  const gmMockPath = path.join(outDir, "globalMockMutator.ts");
  const opCases: string[] = [];
  for (const ops of Object.values(paths) as any[]) {
    for (const [method, op] of Object.entries(ops as Record<string, any>)) {
      if (op && op.operationId) {
        opCases.push(
          `    case '${op.operationId}':\n      content = '${op.operationId} mocked response';\n      break;`,
        );
      }
    }
  }
  fs.writeFileSync(
    gmMockPath,
    `export const globalMockMutator = async (opts: any) => {\n  const id = 'mock-' + Math.random().toString(36).slice(2);\n  const op = opts.operation?.operationId;\n  let content = 'Mocked response';\n  switch (op) {\n${opCases.join("\n")}\n    default:\n      break;\n  }\n  return {\n    id,\n    object: 'chat.completion',\n    created: Date.now(),\n    model: 'gpt-4o',\n    choices: [{ index: 0, message: { role: 'assistant', content } }],\n  };\n};\n`,
  );

  const mswPath = path.join(outDir, "msw.ts");
  const handlers: string[] = [];
  for (const [p, ops] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(ops as Record<string, any>)) {
      const opId = op.operationId || "";
      handlers.push(
        `  rest.${method}('${p}', async (_req, res, ctx) => {\n` +
          `    const json = await globalMockMutator({ operation: { operationId: '${opId}' } });\n` +
          `    return res(ctx.json(json as any));\n` +
          `  }),`,
      );
    }
  }
  fs.writeFileSync(
    mswPath,
    `import { rest, setupWorker, setupServer } from 'msw';\n` +
      `import { globalMockMutator } from './globalMockMutator';\n\n` +
      `export const handlers = [\n${handlers.join("\n")}\n];\n\n` +
      `export const worker = setupWorker(...handlers);\n` +
      `export const server = setupServer(...handlers);\n`,
  );

  console.log("Done");
};

if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === "generate") {
    generate(rest);
  } else {
    run(cmd);
  }
}
