import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
export default async function handler(req, res) {
  // چک کردن متد که فقط متد پست باشد
  if (req.method != "POST") {
    return res.status(405).json({ message: "متد درخواستی نامعتبر است" });
  }

  //ترای و کتچ برای این است که اگر هر مشکلی
  //در کد های بک اند پیش امد برناممون خطا ندهد
  //و یک ارور با وضعیت 500برای کاربر ارسال
  //بشود
  try {
    //چک کردن اینکه فیلدهای پسوورد و ایمیل
    //پر شده باشند
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
      return res.status(422).json({ message: "لطفا تمام فیلد ها را پر کنید" });
    }

    //چک کردن اینکه ساختار جیمیل وارده درست باشد
    const regexEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!regexEmail.test(email)) {
      return res.status(422).json({ message: "ساختار جیمیل اشتباه است" });
    }

    //وصل شدن به دیتابیس
    await connectDB();

    //چک کردن اینکه ایمیل در دیتابیس وجود دارد
    //یا نه
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "ایمیل یا پسوورد نامعتبر است" });
    }

    //چک کردن پسوورد
    const isValidPassword = await bcrypt.compare(password, user.password);
    //متد کامپیر از پکیج بکریپت
    //بهش پسوورد وارده کاربر و کدهشی که در دیتابیس
    //ذخیره کرده بودیم رو میدیم
    //زمانی که فایند ان کرده بودیم روی ایمیل
    //کل ابجکت اون ایمیل رو بهمون برگردوند
    //و درون یوزر ذخیره کرد که کد هش مربوط به اون
    //ایمیل هم درون ابجکت بود
    // پس پسوورد وارده کاربر و کدهش
    // که از دیتابیس گرفته شده و
    //درون یوزر ذخیره شده رو به متد
    //بکریپت نقطه کامپیر میدیم
    //اگه کد هش با رمز وارده کاربر مطابقت داشت
    //متد بکریپت کامپیر ترو رو بهمون برمیگردونه
    // که بر اساس اون تشخیص میدیم
    //که کاربر ورود کنه یا نه
    //متد بکریپت کامپیر یک کار زمان بر رو
    //انجام میده پس پشتش اویت مینویسیم
    //تا زمانی که جواب بکریپت نیاد
    //کدهای بعدی اجرا نشند
    if (!isValidPassword) {
      return res.status(401).json({ message: "ایمیل یا پسوورد نامعتیر است" });
    }

    //ساخت توکن
    const token = jwt.sign(
      { email: user.email, userId: user._id, role: user.role },
      process.env.SECRET_KE_END_LOGIN,
      {
        expiresIn: "20m",
      }
    );

    //ست کردن کوکی
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true, //یعنی این کوکی فقط از طریق پروتکل اچ تی تی پی در دسترس هست
        path: "/", //یعنی کوکی توی تمامی مسیر های سایتمون قابل دسترس باشه
        maxAge: 60 * 60 * 2, //تاریخ انقضا کوکیمون در مرورگر کاربر هستش اطلاعات تکمیلی پایین
        sameSite: "strict", //برای جلوگیری از حملات سی اس ار اف
      })
    );
   return res.status(200).json({message:"ورود مرحله اول با موفقیت انجام شد"})
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود امده است" });
  }
}
// localhost:port/api/auth/login
