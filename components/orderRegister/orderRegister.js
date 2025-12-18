import { motion, AnimatePresence } from "framer-motion";
import styles from "./orderRegister.module.css";
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function OrderRegister({ orderId, state, address ,setDoingOrderss, setSentOrderss,HandlerstateRegister}) {
  const [trackingCode, setTrackingCode] = useState(null);
  const endRegisterHandler = async () => {
    if (!trackingCode) {
      toast.error("لطفا کد رهگیری پستی را وارد کنید");
    }
    await axios
      .post("/api/orders/endRegister", { trackingCode, orderId })
      .then((res) => {
        if (res.status == 201) {
          setDoingOrderss((prev) => prev.filter(order => order.orderId !== res.data.order.orderId))
          HandlerstateRegister(res.data.order.orderId)
          setSentOrderss((prev)=>[...prev,res.data.order])
          toast.success("سفارش ثبت نهایی شد");
        }
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
            toast.error(error.response.data.message);
          }
        } else if (error.request) {
          //2️⃣ درخواست فرستاده شده ولی پاسخی نیومده
          toast.error("خطا در برقراری ارتباط");
        }
      });
  };
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          className="Text"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div className={styles.historyBox}>
            <div className={styles.containerOrdar}>
              <div className={styles.box}>
                <h4>آدرس گیرنده :</h4>

                <div className={styles.addressInfo}>
                  <p>
                    <strong>نام گیرنده:</strong> {address.fullName}
                  </p>
                  <p>
                    <strong>شماره تماس:</strong> {address.phone}
                  </p>
                  <p>
                    <strong>کد پستی:</strong> {address.postalCode}
                  </p>
                  <p>
                    <strong>شهر:</strong> {address.city}
                  </p>
                  <p>
                    <strong>آدرس:</strong> {address.addressLine}
                  </p>
                </div>

                <div className={styles.inputGroup}>
                  <label>کد رهگیری :</label>
                  <input
                    onChange={(e) => {
                      setTrackingCode(e.target.value);
                    }}
                    type="text"
                    placeholder="مثال: 7836541200258"
                  />
                </div>

                <button
                  onClick={endRegisterHandler}
                  className={styles.submitBtn}
                >
                  ثبت نهایی سفارش
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
