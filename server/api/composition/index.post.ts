import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { Replacement } from "@/src/types";
import composition from "@/src/composition";
import replacements from "@/src/replacements";
import transformDocs from "@/src/TransformDocs";

export default defineEventHandler(async (event) => {

  const idList = await composition.show();
  const files = idList.map(id => path.resolve("files", "fragments", `${id}.docx`))
  const list = await replacements.index()
  const fields = list.reduce((fields: Object, item: Replacement) => {
    return {
      ...fields,
      [item.code]: item.replacement
    }
  }, {})

  const composedName = path.resolve("composed.docx")
  await transformDocs(fields, files, composedName)

  const res = event.node.res;
  const stats = await fs.stat(composedName);

  res.writeHead(200, {
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Length": stats.size,
    "Content-Disposition": `attachment; filename=composed.docx`,
  });
  const s = createReadStream(composedName);
  s.pipe(res);
  s.on("end", () => {
    fs.unlink(composedName)
    res.end()
  });

});
