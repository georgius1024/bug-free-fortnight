import { readBody } from "h3";
import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";
export default defineEventHandler(async (event): Promise<Fragment> => {
  const raw = await readBody(event);
  const fragment: Fragment = raw
  return fragments.create(fragment);
});
