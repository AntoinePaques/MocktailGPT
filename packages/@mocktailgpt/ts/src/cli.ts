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
  if (configPath) {
    const userCfg = require(path.resolve(configPath));
    cfg = deepMerge(baseCfg, userCfg);
    userMutator =
      userCfg?.default?.output?.override?.mutator?.path ||
      userCfg?.output?.override?.mutator?.path;
  }
  if (userMutator) {
    const wrapper = path.join(os.tmpdir(), "mocktail-user-mutator.js");
    fs.writeFileSync(
      wrapper,
      `const { openaiMutator } = require('${path.join(__dirname, "mutators/openaiMutator")}');\n` +
        `const user = require('${path.resolve(userMutator)}');\n` +
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
  spawnSync("orval", ["--config", tempCfg], { stdio: "inherit" });
};

if (require.main === module) {
  run(process.argv[2]);
}
