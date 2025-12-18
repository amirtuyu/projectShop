import Orders from "@/models/Orders";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";

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
    const userId = payload.userId;

    const { address, cartItems } = req.body;
    const formattedCartItems = cartItems.map((item) => ({
      productId: item._id,
      title: item.title,
      image: item.image,
      price: item.price,
      count: item.count,
      totalPrice: item.totalPrice,
    }));

    // 3. اعتبارسنجی آدرس
    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.postalCode ||
      !address.city ||
      !address.addressLine
    ) {
      return res
        .status(400)
        .json({ message: "لطفا تمام فیلدهای ادرس را پر کنید" });
    }

    // 4. اعتبارسنجی cartItems
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "کاربر باید سفارشی داشته باشد" });
    }
    for (let item of cartItems) {
      if (
        !item._id ||
        !item.title ||
        !item.image ||
        !item.price ||
        !item.count ||
        !item.totalPrice
      ) {
        return res
          .status(400)
          .json({ message: "اطلاعات محصول سفارشی کاربر تکمیل نمی باشد" });
      }
    }

    // 5. محاسبه مبلغ کل سفارش
    const orderAmount = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // 6. ساخت شماره سفارش شش رقمی رندوم
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // ثبت سفارش
    const newOrder = new Orders({
      orderId,
      userId,
      status: "در حال انجام",
      orderAmount,
      trackingCode: null,
      address,
      cartItems:formattedCartItems,
    });

    await newOrder.save();

    return res
      .status(201)
      .json({ message: "سفارش با موفقیت ثبت شد", order: newOrder });
  } catch (error) {
    return res.status(500).json({ message: "خطایی در سرور به وجود امده" });
  }
}
