import Categories from "@/models/Categories";
import connectDB from "@/utils/connectDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "متد مجاز نیست" });
  }

  try {
    await connectDB();

    const categories = await Categories.find(
      {},
      { name: 1, brands: 1, _id: 0 }
    );

    return res.status(200).json(categories);
  } catch {
    return res.status(500).json({ message: "خطای سرور" });
  }
}
