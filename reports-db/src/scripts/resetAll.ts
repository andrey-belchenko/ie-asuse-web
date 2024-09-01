import declaration from "../declaration/obj";
import { createObject, resetObjects } from "../utils/management";

const run = async () => {
  await resetObjects(declaration);
  console.log("done")
};

run();
