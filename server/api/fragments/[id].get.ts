import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default defineEventHandler(async (event): Promise<Fragment|undefined> => {
  const id = event.context.params.id;

  await delay(1000);

  return fragments.show(id);
});
