import fs from "fs/promises";
import DocxMerger from 'docx-merger';


const docxSavePromisified = (docx: any): any => {
  return new Promise(resolve => {
    docx.save("nodebuffer", resolve)
  })
}

export default async function concatDocs(fileNames: string[], writeTo: string): Promise<any> {
  const promises = fileNames.map((name) => fs.readFile(name, "binary"))
  const files = await Promise.all(promises)
  const docx = new DocxMerger({}, files);
  const buffer = await docxSavePromisified(docx)
  return fs.writeFile(writeTo, buffer);
}
