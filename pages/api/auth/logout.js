import { serialize } from "cookie";

export default async function Handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "متد مجاز نیست" });
  }
  //برای پیاده سازی قابلیت خروج
  //و لاگ اوت
  //دقیقا همون عملیات ست کردن کوکی
  //رو برای کاربر انجام میدیم
  //با این تفاوت که
  //مکس اج یا تاریخ انقضاشو
  //صفر قرار میدیم
  //در ورودی دوم
  //متد سریالایز که
  //توکن رو وارد میکردیم
  //به جاش یک استرینگ
  //خالی قرار میدیم
  try {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true, //یعنی این کوکی فقط از طریق پروتکل اچ تی تی پی در دسترس هست
        path: "/", //یعنی کوکی توی تمامی مسیر های سایتمون قابل دسترس باشه
        maxAge:0, //تاریخ انقضا کوکیمون در مرورگر کاربر هستش اطلاعات تکمیلی پایین
        sameSite: "strict", //برای جلوگیری از حملات سی اس ار اف
      })
    );
    return res.status(200).json({message:"کاربر با موفقیت خارج شد"})
  } catch (error) {
    return res.status(500).json({message:"مشکلی در سرور به وجود امده"})
  }
}
//localhost:port/api/auth/logout
