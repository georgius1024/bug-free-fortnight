import BusBoy from "busboy";

export default function formData(event) {
  const request = event.node.req;
  const parser = BusBoy({ headers: request.headers });
  const files = [];
  const fields = {};
  return new Promise((resolve) => {
    parser.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];
      file.on("data", (chunk) => {
        chunks.push(chunk);
      });
      file.on("end", () => {
        files.push({
          fieldname: name,
          filename,
          encoding,
          mimetype: mimeType,
          buffer: Buffer.concat(chunks),
        });
      });
    });
    parser.on("field", (name, value) => {
      fields[name] = value;
    });
    parser.on("finish", () => {
      resolve({ files, fields });
    });
    request.pipe(parser);
  });
}
