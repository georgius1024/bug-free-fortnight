import fragments from "@/src/fragments";
export default defineEventHandler((event): Promise<void> => {
  const id: string = event.context.params.id;
  return fragments.destroy(id);
});
