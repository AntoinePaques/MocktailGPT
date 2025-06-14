import { getSpecs } from "./generated/client";

(async () => {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./generated/msw");
    await worker.start();
  }
})();

async function main() {
  const result = await getSpecs({ brand: "Ford", engine: "V8" });
  console.log(result);
}

main();
