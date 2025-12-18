import React from "react";
import styles from "./HistoryOrder.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Col, Row } from "react-bootstrap";

export default function OrderHistoryBox({ order }) {
  const iranDate = new Date(order.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Col xs={12} md={6}>
      <div className={styles.box}>
        <div className={styles.headerSection}>
          <h3>کد سفارش: {order.orderId}</h3>
          <p className={styles.date}>تاریخ ثبت: {iranDate}</p>
          {order.status === "ارسال شده" ? (
            <p style={{ color: "green" }} className={styles.status}>
              وضعیت: {order.status}
            </p>
          ) : (
            <p style={{ color: "red" }} className={styles.status}>
              وضعیت: {order.status}
            </p>
          )}

          {order.trackingCode && (
            <p style={{color:"black"}} className={styles.tracking}>
              کد رهگیری پستی: {order.trackingCode}
            </p>
          )}
        </div>

        <div className={styles.divider} />

        <h4 className={styles.productsTitle}>محصولات سفارش:</h4>

        <Swiper
          modules={[Pagination]}
          pagination={{ dynamicBullets: true }}
          spaceBetween={10}
          slidesPerView={1}
        >
          {order.cartItems.map((item) => (
            <SwiperSlide key={item.productId}>
              <div className={styles.productCard}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.productImage}
                />

                <div>
                  <p className={styles.productTitle}>{item.title}</p>
                  <p className={styles.productCount}>تعداد: {item.count}</p>
                  <p className={styles.productPrice}>
                    قیمت کل: {item.totalPrice.toLocaleString()} تومان
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.totalPriceBox}>
          مبلغ کل سفارش: {order.orderAmount.toLocaleString()} تومان
        </div>
      </div>
    </Col>
  );
}
