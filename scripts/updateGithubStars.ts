import fs from "node:fs";
import path from "node:path";
import { getTotalStars } from "../utils/github";

const FILENAME = "./data/github.json";
const filepath = path.join(__dirname, "..", FILENAME);

async function main() {
  const totalStars = await getTotalStars("inngest");

  const fileTemplate = {
    __generated: `File generated at ${new Date().toISOString()}`,
    stars: totalStars,
  };
  fs.writeFileSync(filepath, JSON.stringify(fileTemplate, null, 2));
  console.log(`${totalStars} total stars`);
}

main();
