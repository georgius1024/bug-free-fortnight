import fs from "fs";
import path from "path";
import { Stats } from "@/src/types";
export default defineEventHandler((event): Stats => {
  const id = event.context.params.id;
  const fileName: string = path.resolve("files", "fragments", `${id}.docx`);
  try {
    const { size } = fs.statSync(fileName);

    return {
      id,
      size,
    };
  } catch {
    return { id, size: 0 };
  }
});
