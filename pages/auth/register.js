import styles from "@/styles/addcontact.module.css";
import ValidateToken from "@/utils/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
export default function Register() {
  const router = useRouter();
  const [loding, setLoding] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const showPassHandler = () => {
    setShowPass(!showPass);
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const regisetHandler = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      return toast.error("لطفا همه فیلدها را پر کنید");
    }
    // چک کردن ساختار نام
    if (firstName.length < 3 || firstName.length > 15) {
      return toast.error("نام باید بین 3 تا 15 کاراکتر باشه");
    }
    // چک کردن ساختار نام خانوادگی
    if (lastName.length < 3 || lastName.length > 15) {
      return toast.error("نام خانوادگی باید بین 3 تا 15 کاراکتر باشه");
    }
    // چک کردن ساختار جیمیل
    if (!email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i)) {
      return toast.error("ساختار جیمیل معتبر نیست");
    }
    //چک کردن طول پسوورد
    if (password.length < 8 || password.length > 20) {
      return toast.error("طول پسوورد باید بین 8 و 20 کاراکتر باشد");
    }
    //ارسال دیتا به یک اند
    setLoding(true);
    await axios
      .post("/api/auth/register", formData)
      .then((res) => {
        if (res.status == 201) {
          toast.success(res.data.message,{duration:5000});
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
        }
        setLoding(false);
        router.replace("/auth/login");
      })
      .catch((error) => {
        if (error.response) {
          // 1️⃣ سرور پاسخ داده ولی با وضعیت خطا
          if (
            error.response.status === 405 ||
            error.response.status === 422 ||
            error.response.status === 409
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
  const regexFirstName = /^.{3,15}$/;
  const isValidFirstName = regexFirstName.test(formData.firstName);
  const regexLastName = /^.{3,15}$/;
  const isValidLastName = regexLastName.test(formData.lastName);
  const regexEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  const isValidEmail = regexEmail.test(formData.email);
  const regexPassword = /^.{8,20}$/;
  const isValidPassword = regexPassword.test(formData.password);

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.inputWrapper}>
          <h2>ثبت نام</h2>
          <input
            className={isValidFirstName ? styles.valueTrue : ""}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            value={formData.firstName}
            type="text"
            placeholder="نام"
          />
          {formData.firstName.length > 0 &&
            (isValidFirstName ? (
              <FaCheckCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "290px",
                  top: "81%",
                  transform: "translateY(-50%)",
                  color: "rgb(3, 157, 3)",
                }}
              />
            ) : (
              <FaTimesCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "290px",
                  top: "81%",
                  transform: "translateY(-50%)",
                  color: "red",
                }}
              />
            ))}
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={isValidLastName ? styles.valueTrue : ""}
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            type="text"
            placeholder="نام خانوادگی"
          />
          {formData.lastName.length > 0 &&
            (isValidLastName ? (
              <FaCheckCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "290px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgb(3, 157, 3)",
                }}
              />
            ) : (
              <FaTimesCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "290px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "red",
                }}
              />
            ))}
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={isValidEmail ? styles.valueTrue : ""}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type="text"
            placeholder="ایمیل"
          />
          {formData.email.length > 0 &&
            (isValidEmail ? (
              <FaCheckCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "290px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgb(3, 157, 3)",
                }}
              />
            ) : (
              <FaTimesCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "290px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "red",
                }}
              />
            ))}
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={isValidPassword ? styles.valueTrue : ""}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            type={showPass ? "text" : "password"}
            placeholder="پسوورد"
          />
          {formData.password.length > 0 &&
            (isValidPassword ? (
              <FaCheckCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "265px",
                  top: "51%",
                  transform: "translateY(-50%)",
                  color: "rgb(3, 157, 3)",
                }}
              />
            ) : (
              <FaTimesCircle
                size={18}
                style={{
                  position: "absolute",
                  right: "265px",
                  top: "51%",
                  transform: "translateY(-50%)",
                  color: "red",
                }}
              />
            ))}
          {showPass ? (
            <FaRegEyeSlash
              size={20}
              onClick={showPassHandler}
              style={{
                position: "absolute",
                right: "290px",
                top: "30%",
              }}
            />
          ) : (
            <FaRegEye
              size={20}
              onClick={showPassHandler}
              style={{
                position: "absolute",
                right: "290px",
                top: "30%",
              }}
            />
          )}
        </div>
        <button onClick={regisetHandler}>ثبت نام</button>
        <div className={styles.notRegister}>
          ایا قبلا ثبت نام کرده اید؟
          <Link href="/auth/login">
            <span> ورود </span>
          </Link>
        </div>
      </form>
      {loding ? <span className={styles.loader}></span> : ""}
    </div>
  );
}

//در اینجا می خوایم
//چک کنیم اگر کاربر ورود کرد بود
// و دارای توکن معتبر بود
//دیگر اجازه ورود به صفحه
//رجیستر و ثبت نام رو بهش ندیم
//اگر توکنی معبری وجود داشت
//کاربر را ریدایرکت میکنیم
//به صفحه داشبورد
export async function getServerSideProps(context) {
  const payload = ValidateToken(context);
  if (payload) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {},
  };
}