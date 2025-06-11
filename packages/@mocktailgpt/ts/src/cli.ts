#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";

export const run = (configPath?: string) => {
  const config = configPath ?? path.join(__dirname, "../orval.config.ts");
  spawnSync("orval", ["--config", config], { stdio: "inherit" });
};

if (require.main === module) {
  run(process.argv[2]);
}
