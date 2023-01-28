import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";

export default defineEventHandler(async (event): Promise<Fragment|undefined> => {
  const id = event.context.params.id;

  return fragments.show(id);
});
