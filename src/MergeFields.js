import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

function mergeFields(fileName, mergeFields, writeTo) {
  const content = fs.readFileSync(fileName, "binary");
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(mergeFields);

  const buffer = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  fs.writeFileSync(writeTo, buffer);
}

export default mergeFields;
