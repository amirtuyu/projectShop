import { verify } from "jsonwebtoken";

export default function ValidateToken(context) {
  const { token } = context.req.cookies;
  //چک کردن اینکه توکنی در کوکی کاربر
  //وجود دارد
  if (!token) {
    return false;
  }
  //اعتبارسنجی توکن
  try {
    const payload = verify(token, process.env.SECRET_KEY);
    return payload;
  } catch (error) {
    return false;
  }
}
