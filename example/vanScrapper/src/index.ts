import { getSpecs } from "./generated/vanScrapperAPI";

async function main() {
  const result = await getSpecs({ brand: "Ford", engine: "V8" });
  console.log(result);
}

main();
