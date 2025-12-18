import { Col, Container, Row } from "react-bootstrap";
import styles from "./Footer.module.css";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
function Footer() {
  return (
    <div className={styles.footer}>
      <Container>
        <Row>
          <Col  xs={6} sm={6} md={3}>
            <h4>امیر آی تی</h4>
            <ul>
              <li>مجوز و کواینامه ما</li>
              <li>قوانین و مقررات</li>
              <li>حریم خصوصی</li>
              <li>درباره ما</li>
            </ul>
          </Col>
          <Col  xs={6} sm={6} md={3}>
            <h4>راهنما</h4>
            <ul>
              <li>تضمین اصالت کالا</li>
              <li>شرایط عودت کالا</li>
              <li>راهنمای خرید</li>
              <li>تخفیف ها</li>
            </ul>
          </Col>
          <Col  xs={6} sm={6} md={3}>
            <h4>خدمات</h4>
            <ul>
              <li>مشاوره رایگان</li>
              <li>پشتیبانی</li>
              <li>تبلیغات</li>
              <li>اعتبار سنجی خریداران</li>
              <li>اسمبل انلاین</li>
            </ul>
          </Col>
          <Col className={styles.socials}  xs={6} sm={6} md={3}>
            <h4>با ما در ارتباط باشید</h4>
            <ul>
              <li>
                <FaInstagram size={30} />
              </li>
              <li>
                <FaTwitter size={30} />
              </li>
              <li>
                <FaTelegram size={30} />
              </li>
              <li>
                <FaFacebook size={30} />
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Footer;
