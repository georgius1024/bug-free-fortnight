import { readBody } from "h3";
import { Replacement } from "@/src/types";
import replacements from "@/src/replacements";
export default defineEventHandler(async (event): Promise<Replacement> => {
  const code: string = event.context.params.code;
  const body: Replacement = await readBody(event);
  return replacements.update(code, body);
});
