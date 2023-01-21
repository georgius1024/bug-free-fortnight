import { readBody } from "h3";
import { Replacement } from "@/src/types";
import replacements from "@/src/replacements";
export default defineEventHandler(async (event): Promise<Replacement> => {
  const raw = await readBody(event) as Replacement;
  return replacements.create(raw);
});
