import { verificationTemplate } from "@/components/schimaMessageCode";
import sendEmail from "@/components/sendEmail";
import Orders from "@/models/Orders";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست" });
  }
  await connectDB();
  try {
    //اهراز هویت کاربر
    const context = { req };
    const payload = ValidateToken(context);
    if (!payload) {
      return res.status(401).json({
        message: "برای ثبت سفارش لطفا ورود یا ثبت نام انجام دهید",
      });
    }
    if (payload.role != "admin") {
      return res.status(401).json({
        message: "این عملیات مختص به ادمین سایت هست",
      });
    }
    const { trackingCode, orderId } = req.body;
    // چک کردن فرمت ایدی
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "شناسه سفارش معتبر نیست" });
    }
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: "ارسال شده",
          trackingCode,
        },
      },
      { new: true }
    ).populate("userId", "email firstName");

    if (!updatedOrder) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }
    const result = await sendEmail({
      to: updatedOrder.userId.email,
      subject: "سفارش شما ارسال شد",
      htmlContent: verificationTemplate({
        trackingCode,
        name: updatedOrder.userId.firstName,
      }),
      title: "Shop Service",
    });
    if (!result) {
      return res.status(404).json({ message: "ایمیل ارسال نشد" });
    }
    return res.status(201).json({
      message: "سفارش ثبت نهایی شد",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "خطایی در سرور به وجود امده" });
  }
}
