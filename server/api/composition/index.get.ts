import { Composition } from "@/src/types";
import composition from "@/src/composition";
export default defineEventHandler((event): Promise<Composition> => {
  return composition.show();
});
