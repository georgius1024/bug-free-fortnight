import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";
export default defineEventHandler(async (event): Promise<Fragment[]> => {
  const list: Fragment[] = await fragments.list();
  return list;
});
