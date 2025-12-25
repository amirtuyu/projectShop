import styles from "@/styles/endLogin.module.css";
import ValidateTokenEndLogin from "@/utils/ValidateTokenEndLogin";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { appContext } from "@/pages/_app";
import { FaArrowLeft } from "react-icons/fa";
export default function EndLogin() {
  const router = useRouter();
  const [timer, setTimer] = useState(0);
  const { setIsAuthenticated, setState, state, setUserPayload } =
    useContext(appContext);
  const [loding, setLoding] = useState(false);
  const [inputData, setInputData] = useState({
    code: "",
  });
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const creatOtpHadler = async () => {
    await axios
      .get("/api/auth/endLogin")
      .then((res) => {
        toast.success(`ارسال کد دارای مشکل هست این کد تایید شماست:${res.data.code}`, { duration: 5000 });
        setTimer(120);
      })
      .catch((error) => {
        setTimer(0); // ❗ اگر ارور داشت، اجازه کلیک دوباره بده
        if (error.response) {
          if (
            error.response.status === 429 &&
            error.response.data.message === "کد شما هنوز منقضی نشده است"
          ) {
            setTimer(error.response.data.time);
          }
          toast.error(error.response.data.message || "خطایی رخ داده");
        } else {
          toast.error("خطا در برقراری ارتباط");
        }
      });
  };

  useEffect(() => {
    creatOtpHadler();
  }, []);
  const sendHandler = async (event) => {
    event.preventDefault();
    setLoding(true);
    const regexCode = /^[0-9]+$/;
    if (inputData.code.length > 4 || inputData.code.length < 4) {
      setLoding(false);
      return toast.error("کد باید 4 کاراکتر باشد");
    }
    if (!regexCode.test(inputData.code)) {
      setLoding(false);
      return toast.error("کاراکتر وارده باید عدد باشد");
    }
    await axios
      .post("/api/auth/endLogin", inputData)
      .then((res) => {
        if (res.status == 200) {
          toast.success(res.data.message, { duration: 5000 });
          setInputData({
            code: "",
          });
        }
        setUserPayload(res.data.payload);
        setIsAuthenticated(true);
        setState(!state);
        setLoding(false);
        router.replace("/");
      })
      .catch((error) => {
        if (error.response) {
          if (
            error.response.status === 429 &&
            error.response.data.message === "تعداد تکرار اشتباه بیش از حد مجاز"
          ) {
            setTimer(0);
          }

          if (
            error.response.status === 405 ||
            error.response.status === 422 ||
            error.response.status === 409 ||
            error.response.status === 401 ||
            error.response.status === 400 ||
            error.response.status === 429
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
      <form className={styles.otpForm}>
        <div>
          <div
            onClick={() => {
              router.replace("/auth/login");
            }}
            className={styles.pervStep}
          >
            <FaArrowLeft />
            <span>مرحله قبل</span>
          </div>
          <h2 style={{ marginTop: "-30px" }}>تایید ایمیل</h2>
          <label htmlFor="">کد ارسال شده را وارد کنید</label>
          <input
            value={inputData.code}
            onChange={(e) => {
              setInputData({
                ...inputData,
                code: e.target.value,
              });
            }}
            type="text"
            placeholder="کد"
          />
          {timer > 0 ? (
            <p className={styles.tryAgain}>
              ارسال مجدد کد بعد از {timer} ثانیه دیگر
            </p>
          ) : (
            <p onClick={creatOtpHadler} className={styles.sendAgain}>
              ارسال مجدد کد تایید
            </p>
          )}
          <button onClick={sendHandler}>ارسال کد تایید</button>
        </div>
      </form>
      {loding ? <span className={styles.loader}></span> : ""}
    </div>
  );
}
export async function getServerSideProps(context) {
  const payload = ValidateTokenEndLogin(context);
  if (!payload) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }
  return {
    props: {},
  };
}
