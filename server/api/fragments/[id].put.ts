import { readBody } from "h3";
import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";
export default defineEventHandler(async (event): Promise<void> => {
  const id: string = event.context.params.id;
  const body: Fragment = await readBody(event);
  return fragments.update(id, body);
});
