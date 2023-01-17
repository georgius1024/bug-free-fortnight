import fragments from "@/src/fragments";
export default defineEventHandler(async (event): Promise<string> => {
  const id: string = event.context.params.id;
  return fragments.destroy(id);
});
