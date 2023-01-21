import { Replacement } from "@/src/types";
import replacements from "@/src/replacements";

export default defineEventHandler(async (event): Promise<Replacement|undefined> => {
  const id = event.context.params.id;
  return replacements.show(id);
});
