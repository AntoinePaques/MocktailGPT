import { getSpecs } from "./generated/vanScrapperAPI";

(async () => {
  if ((import.meta as any).env?.MODE === "development") {
    const { worker } = await import("./generated/msw");
    await worker.start();
  }
})();

async function main() {
  const result = await getSpecs({ brand: "Ford", engine: "V8" });
  console.log(result);
}

main();
