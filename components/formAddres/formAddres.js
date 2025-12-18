import { useState } from "react";
import styles from "./formAddres.module.css";
import { Col, Container, Row } from "react-bootstrap";

export default function OrderForm({ setAddres, addres }) {
  const provinces = [
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "اردبیل",
    "اصفهان",
    "البرز",
    "ایلام",
    "بوشهر",
    "تهران",
    "چهارمحال و بختیاری",
    "خراسان جنوبی",
    "خراسان رضوی",
    "خراسان شمالی",
    "خوزستان",
    "زنجان",
    "سمنان",
    "سیستان و بلوچستان",
    "فارس",
    "قزوین",
    "قم",
    "کردستان",
    "کرمان",
    "کرمانشاه",
    "کهگیلویه و بویراحمد",
    "گلستان",
    "گیلان",
    "لرستان",
    "مازندران",
    "مرکزی",
    "هرمزگان",
    "همدان",
    "یزد",
  ];
  return (
    <Container className={styles.formWrapper}>
      <form className={styles.formContainer}>
        <h2>فرم ثبت آدرس</h2>
        <Row className="g-3">
          <Col xs={12} lg={4}>
            <input
              value={addres.fullName}
              onChange={(e) => {
                setAddres((prev) => ({ ...prev, fullName: e.target.value }));
              }}
              name="fullName"
              placeholder="نام و نام خانوادگی"
              required
            />
          </Col>
          <Col xs={12} lg={4}>
            <input
              value={addres.phone}
              onChange={(e) => {
                setAddres((prev) => ({ ...prev, phone: e.target.value }));
              }}
              name="phone"
              type="tel"
              placeholder="شماره تلفن"
              required
            />
          </Col>
          <Col xs={12} lg={4}>
            <input
              list="provinceList"
              value={addres.city}
              onChange={(e) =>
                setAddres((prev) => ({ ...prev, city: e.target.value }))
              }
              placeholder="انتخاب استان"
              required
            />
            <datalist id="provinceList">
              {provinces.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </Col>
          <Col xs={12} lg={4}>
            <input
              value={addres.postalCode}
              onChange={(e) => {
                setAddres((prev) => ({ ...prev, postalCode: e.target.value }));
              }}
              name="postalCode"
              type="text"
              maxLength="10"
              placeholder="کد پستی (۱۰ رقم)"
              required
            />
          </Col>
          <Col xs={12} lg={4}>
            <textarea
              value={addres.addressLine}
              onChange={(e) => {
                setAddres((prev) => ({ ...prev, addressLine: e.target.value }));
              }}
              name="address"
              rows="3"
              placeholder="آدرس دقیق"
              required
            />
          </Col>
        </Row>
      </form>
    </Container>
  );
}

