import { getQuery } from "h3";
import { Replacement } from "@/src/types";
import replacements from "@/src/replacements";
export default defineEventHandler((event): Promise<Replacement[]> => {
  const query = getQuery(event);
  const search =
    (Array.isArray(query?.search) ? query.search[0] : query?.search) ?? "";
  return replacements.index(search);
});
