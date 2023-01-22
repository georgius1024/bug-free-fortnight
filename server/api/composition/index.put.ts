import { readBody } from "h3";
import { Composition } from "@/src/types";
import composition from "@/src/composition";
export default defineEventHandler(async (event): Promise<Composition> => {
  const body = await readBody(event);
  return composition.update(body);
});
