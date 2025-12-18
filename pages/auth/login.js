import Link from "next/link";
import styles from "@/styles/addcontact.module.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import ValidateToken from "@/utils/auth";
export default function Login() { 
  const router = useRouter();
  const [loding, setLoding] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const showPassHandler = () => {
    setShowPass(!showPass);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const loginHandler = async (event) => {
    event.preventDefault();
    setLoding(true);
    await axios
      .post("/api/auth/login", formData)
      .then((res) => {
        if (res.status == 200) {
          setFormData({
            email: "",
            password: "",
          });
        }
        setLoding(false);
        router.replace("/auth/endLogin");
      })
      .catch((error) => {
        if (error.response) {
          // 1️⃣ سرور پاسخ داده ولی با وضعیت خطا
          if (
            error.response.status === 405 ||
            error.response.status === 422 ||
            error.response.status === 409 ||
            error.response.status === 401
          ) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.error("سرور دچار مشکل شده است");
          }
        } else if (error.request) {
          // 2️⃣ درخواست فرستاده شده ولی پاسخی نیومده
          toast.error("خطا در برقراری ارتباط");
        }
        setLoding(false);
      });
  };
  return (
    <div className={styles.container}>
      <form>
        <div className={styles.inputWrapper}>
          <h2>ورود</h2>
          <input
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
            type="text"
            placeholder="ایمیل"
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
            type={showPass ? "text" : "password"}
            placeholder="پسوورد"
          />
          {showPass ? (
            <FaRegEyeSlash
              size={20}
              onClick={showPassHandler}
              style={{
                position: "absolute",
                right: "283px",
                top: "30%",
              }}
            />
          ) : (
            <FaRegEye
              size={20}
              onClick={showPassHandler}
              style={{
                position: "absolute",
                right: "283px",
                top: "30%",
              }}
            />
          )}
        </div>
        <button onClick={loginHandler}>ورود</button>
        <div className={styles.notRegister}>
          ثبت نام نکرده اید ؟ 
          <Link href="/auth/register">
            <span> ساخت حساب کاربری </span>
          </Link>
        </div>
      </form>
      {loding ? <span className={styles.loader}></span> : ""}
    </div>
  );
}

//در اینجا می خوایم
//چک کنیم اگر کاربر ورودی کرد بود
// و دارای توکن معتبر بود
//دیگر اجازه ورود به صفحه
//لاگین رو بهش ندیم
//اگر توکنی معبری وجود داشت
//کاربر را ریدایرکت میکنیم
//به صفحه داشبورد
export async function getServerSideProps(context) {
  const payload = ValidateToken(context);
  if (payload) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
}