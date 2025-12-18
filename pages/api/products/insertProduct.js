import Categories from "@/models/Categories";
import Products from "@/models/Products";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست" });
  }

  await connectDB();

  try {
    // احراز هویت
    const context = { req };
    const payload = ValidateToken(context);

    if (!payload) {
      return res.status(401).json({
        message: "برای ثبت محصول ابتدا وارد شوید",
      });
    }
    if (payload.role !== "admin") {
      return res.status(401).json({
        message: "این عملیات برای ادمین است",
      });
    }

    const { title, category, brand, price, image } = req.body;

    if (!title || !category || !brand || !price || !image) {
      return res.status(400).json({
        message: "لطفا همه فیلدها را پر کنید",
      });
    }

    // ایجاد محصول
    await Products.create({
      title,
      category,
      brand,
      price,
      image,
    });

    // دریافت همه دسته‌بندی‌ها
    const allCategories = await Categories.find({});

    // بررسی وجود برند در کل دسته‌بندی‌ها
    const normalizedBrand = brand.trim().toLowerCase();

    const brandExists = allCategories.some((cat) =>
      cat.brands.some(
        (b) =>
          typeof b === "string" && b.trim().toLowerCase() === normalizedBrand
      )
    );

    if (!brandExists) {
      // یافتن دسته‌بندی مربوطه
      const targetCategory = await Categories.findOne({
        name: category.toLowerCase(),
      });

      if (!targetCategory) {
        return res.status(400).json({
          message: "دسته بندی وارده نامعتبر است",
        });
      }

      // افزودن برند جدید
      targetCategory.brands.push(brand);
      await targetCategory.save();
    }

    return res.status(201).json({ message: "محصول با موفقیت اضافه شد" });
  } catch (error) {
    return res.status(500).json({
      message: "مشکلی در سرور به وجود آمده",
    });
  }
}
