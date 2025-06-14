import { getSpecs } from "./generated/client";
import { worker } from "./generated/msw";

async function run() {
  await worker.start();
  const res = await getSpecs({ brand: "Ford", engine: "V8" });
  console.log(res);
}

run();
