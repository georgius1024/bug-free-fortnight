import fs from "fs/promises";
import DocxMerger from "@/src/docx-merger/index.js";

const docxSavePromisified = (docx: any) => {
  return new Promise((resolve) => {
    docx.save("nodebuffer", resolve);
  });
};

export default async function transformDocs(
  replacements: any,
  fileNames: string[],
  writeTo: string
) {
  const promises = fileNames.map((name) => fs.readFile(name, "binary"));
  const files = await Promise.all(promises);
  const docx = new DocxMerger({ pageBreak: false, replacements }, files);
  const buffer = await docxSavePromisified(docx);
  return fs.writeFile(writeTo, buffer as string);
}
