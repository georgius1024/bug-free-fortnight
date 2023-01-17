import { getQuery } from "h3";
import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";
export default defineEventHandler((event): Promise<Fragment[]> => {
  const query = getQuery(event);
  const search =
    (Array.isArray(query?.search) ? query.search[0] : query?.search) ?? "";
  return fragments.index(search);
});
