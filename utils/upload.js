import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// مسیر ذخیره عکس‌ها
const uploadDir = path.join(process.cwd(), "public/uploads/chat");

// اگر فولدر وجود نداشت بساز
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomUUID(); // نام یکتا
    cb(null, `${uniqueName}${ext}`);
  },
});

// فقط عکس
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("فقط فایل تصویری مجاز است"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
