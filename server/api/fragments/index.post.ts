import { readBody } from "h3";
import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";
export default defineEventHandler(async (event): Promise<Fragment> => {
  const body = await readBody(event);
  return fragments.create(body as Fragment);
});
