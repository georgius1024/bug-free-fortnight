import fs from "fs";
import path from "path";
export default defineEventHandler((event) => {
  const id = '7nu2yhRAXMqLy_AucmwET';
  const fileName: string = path.resolve("files", "fragments", `${id}.docx`);
  const res = event.node.res;
  console.log(fileName)
  const stats = fs.statSync(fileName);
  res.writeHead(200, {
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Length": stats.size,
    "Content-Disposition": `attachment; filename=${id}.docx`,
  });

  const s = fs.createReadStream(fileName);
  s.pipe(res);
  s.on("end", () => res.end());
});
