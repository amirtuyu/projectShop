import { motion, AnimatePresence } from "framer-motion";
import styles from "./historyUser.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function HistoryUser({ state, history }) {
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
              {history.length!=0 ? (
                history.map((order) => (
                  <div key={order.orderId} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <span>
                        {" "}
                        تاریخ:{" "}
                        {new Intl.DateTimeFormat("fa-IR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }).format(new Date(order.createdAt))}
                      </span>
                      <span>وضعیت: {order.status}</span>
                      <span>
                        مبلغ کل: {order.orderAmount.toLocaleString()} تومان
                      </span>
                    </div>
                    <Swiper
                      pagination={{ dynamicBullets: true }}
                      modules={[Pagination]}
                      className="mySwiper"
                      spaceBetween={10}
                      slidesPerView={1}
                    >
                      {order.cartItems.map((item) => (
                        <SwiperSlide key={item._id}>
                          <div className={styles.itemCard}>
                            <img src={item.image} alt="product" />
                            <div>
                              <p>تعداد: {item.count}</p>
                              <p>قیمت: {item.price.toLocaleString()} تومان</p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ))
              ) : (
                <h3>کاربر سابقه سفارشی ندارد</h3>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
