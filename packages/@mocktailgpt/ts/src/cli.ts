#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

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

if (require.main === module) {
  run(process.argv[2]);
}
