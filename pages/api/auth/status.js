import { verify } from "jsonwebtoken";

export default async function Handler(req, res) {
  //چک کردن متد
  if (req.method !== "GET") {
    return res.status(405).json({ meassage: "متد مجاز نیست" });
  }

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "شما ورود انجام نکرده اید" });
  }

  //اعتبار سنجی توکن
  try {
    const payload = verify(token, process.env.SECRET_KEY);
    if (payload) {
      return res
        .status(200)
        .json({ message: "کاربر با موفقیت ورود کرد", payload });
    }
  } catch (error) {
    return res.status(401).json({ message: "توکن شما غیر معتبر است" });
  }
}

//در این روت قرار است وضعیت
//ورود کاربر چک بشود
