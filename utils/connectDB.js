import mongoose from "mongoose";

export default async function connectDB() {
  try {
    // اگر اتصال برقرار نیست، وصل شو
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect( process.env.MONGO_URI);
    }
  } catch (err) {
    console.error("❌ اتصال با خطا مواجه شد:", err);
  }
}

//پروسه کانکشن به دیتابیس یک پروسه تکراریه
//پس تبدیلش میکنیم به یک کامپوننت
// و به جای اینکه عملیات کانکشن رو هربار
//دوباره بنویسیم فقط یکبار کامپوننتشو صدا میزنیم


// حتی می تونیم به صورت داینامیک
//دامین و کالکشن رو دریافت کرده و جایگذاری
//کنیم برای اتصال به دیتابیس