// pages/api/uploads/chat/[filename].js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { filename } = req.query;

  const filePath = path.join("/uploads/chat", filename); // مسیر mount دیسک

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentTypeMap = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  res.setHeader(
    "Content-Type",
    contentTypeMap[ext] || "application/octet-stream"
  );

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

