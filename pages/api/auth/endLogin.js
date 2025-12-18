import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import ValidateTokenEndLogin from "@/utils/ValidateTokenEndLogin";
import Otp from "@/models/otp";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import sendEmail from "@/components/sendEmail";
import { verificationTemplate } from "@/components/schimaMessageAuth";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "متد درخواستی نامعتبر است" });
  }

  try {
    await connectDB();
    const context = { req };
    const payload = ValidateTokenEndLogin(context);

    if (!payload) {
      return res
        .status(401)
        .json({ message: "لطفا مرحله اول اهراز هویت را انجام دهید" });
    }
    // ------------ GET (ارسال کد) ---------- //
    if (req.method === "GET") {
      const otpRecord = await Otp.findOne({ email: payload.email });

      if (otpRecord) {
        const expTime = otpRecord.expTime;
        const now = Date.now();
        const isExpired = now > expTime;

        if (!isExpired) {
          const secondsLeft = Math.floor((expTime - now) / 1000);
          return res.status(429).json({
            message: "کد شما هنوز منقضی نشده است",
            time: secondsLeft,
          });
        }

        // اگر منقضی شده، حذف شود
        await Otp.deleteOne({ email: payload.email });
      }

      const code = Math.floor(Math.random() * 9000 + 1000);

      await Otp.deleteMany({ email: payload.email }); // حذف هر OTP قبلی، اگر موردی باقی مانده باشد

      // ✅ اول ایمیل را بفرست
      const result = await sendEmail({
        to: payload.email,
        subject: "کد تایید ورود",
        htmlContent: verificationTemplate(code),
        title: "کد تایید ورود",
      });

      // ❌ اگر خطا داشت: OTP ذخیره نشود
      if (!result?.success) {
        return res
          .status(500)
          .json({ message: "مشکلی در ارسال ایمیل پیش آمد" });
      }

      // ✅ اگر ایمیل موفق ارسال شد: حالا OTP را ذخیره کن
      await Otp.create({
        email: payload.email,
        code,
        expTime: new Date().getTime() + 120 * 1000,
      });

      return res.status(200).json({
        message: "کد تایید ارسال شد. لطفا کد را وارد کنید",
      });
    }

    // ------------ POST (تایید کد) ---------- //
    const { code } = req.body;
    const otpRecord = await Otp.findOne({ email: payload.email });

    if (!otpRecord) {
      return res
        .status(401)
        .json({ message: "کد منقضی شده است لطفا ارسال مجدد را بزنید" });
    }
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res.status(401).json({ message: "ایمیل یا پسوورد نامعتبر است" });
    }
    if (otpRecord) {
      const expTime = otpRecord.expTime;
      const now = Date.now();
      const isExpired = now > expTime;

      if (isExpired) {
        return res.status(400).json({
          message: "کد منقضی شده است لطفا ارسال مجدد را بزنید",
        });
      }
    }
    if (otpRecord.attempts >= 6) {
      await Otp.deleteOne({ email: payload.email });
      return res
        .status(429)
        .json({ message: "تعداد تکرار اشتباه بیش از حد مجاز" });
    }
    if (otpRecord.code !== code) {
      await Otp.findOneAndUpdate(
        { email: payload.email },
        { $inc: { attempts: 1 } }
      );
      return res.status(401).json({ message: "کد اشتباه است" });
    }
    if (otpRecord.code === code) {
      // پاک کردن OTP بعد از تایید کد
      await Otp.deleteOne({ email: payload.email });

      const token = jwt.sign(
        { email: user.email, userId: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );

      res.setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 2,
          sameSite: "strict",
        })
      );

      return res
        .status(200)
        .json({ message: "ورود با موفقیت انجام شد", token ,payload});
    }
  } catch (err) {
    return res.status(500).json({ message: "مشکلی در سرور به وجود آمد" });
  }
}
