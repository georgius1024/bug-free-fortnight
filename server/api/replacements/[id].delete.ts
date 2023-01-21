import replacements from "@/src/replacements";
export default defineEventHandler(async (event): Promise<string|null> => {
  const id: string = event.context.params.id;
  return replacements.destroy(id);
});
