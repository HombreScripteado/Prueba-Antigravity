import { getFullMenu } from "./lib/menu";

async function run() {
  const data = await getFullMenu();
  console.log(JSON.stringify(data, null, 2));
}

run();
