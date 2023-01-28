import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { Replacement } from "@/src/types";
import composition from "@/src/composition";
import replacements from "@/src/replacements";
import concatDocs from "@/src/ConcatDocs";
import mergeFields from "@/src/MergeFields";
import { defineSSRCustomElement } from "nuxt/dist/app/compat/capi";

export default defineEventHandler(async (event) => {

  const idList = await composition.show();
  const files = idList.map(id => path.resolve("files", "fragments", `${id}.docx`))
  const rawName = path.resolve("output.raw.docx")
  await concatDocs(files, rawName)
  const list = await replacements.index()
  const fields = list.reduce((fields: Object, item: Replacement) => {
    return {
      ...fields,
      [item.code]: item.replacement
    }
  }, {})

  const composedName = path.resolve("composed.docx")
  await mergeFields(rawName, fields, composedName)

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
    fs.unlink(rawName)
    fs.unlink(composedName)
    res.end()
  });

});
