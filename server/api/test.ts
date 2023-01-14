import { Fragment } from "@/src/types";
import fragments from "@/src/fragments";

export default defineEventHandler(async (event): Promise<Fragment> => {
  const list: Fragment[] = await fragments.list();
  return list[0] || {};
  return {
    id: '101',
    description: 'missed',
    createdAt: new Date(),
    updatedAt: new Date()
  };
});
