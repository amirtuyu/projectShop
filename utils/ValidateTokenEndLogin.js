import { verify } from "jsonwebtoken";

export default function ValidateTokenEndLogin(context) {
  const { token } = context.req.cookies;
  //چک کردن اینکه توکنی در کوکی کاربر
  //وجود دارد
  if (!token) {
    return false;
  }
  //اعتبارسنجی توکن
  try {
    const payload = verify(token, process.env.SECRET_KE_END_LOGIN);
    return payload;
  } catch (error) {
    return false;
  }
}