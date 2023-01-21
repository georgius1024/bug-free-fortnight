import formData from "@/src/formData";
import fs from "fs/promises";
import path from "path";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export default defineEventHandler(async (event): Promise<boolean> => {
  const { files, fields } = await formData(event);
  const id = fields.id;
  const file = files[0];
  const fileName: string = path.resolve("files", "fragments", `${id}.docx`);
  await fs.writeFile(fileName, file.buffer);
  await delay(5000);
  return true;
});
