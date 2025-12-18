import { appContext } from "@/pages/_app";
import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/productPage.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { FaAward } from "react-icons/fa";
import Comments from '@/components/comments/containerComments/containerComments'
export default function ProductPage() {
  const { productId, category } = useRouter().query;
  const { productList } = useContext(appContext);

  if (!category || !productId) {
    return <h2 className={styles.loading}>در حال بارگذاری...</h2>;
  }

  const targetProduct = productList?.[category]?.find(
    (item) => item.id == productId
  );

  if (!targetProduct) {
    return <h2 className={styles.notFound}>محصول مورد نظر یافت نشد.</h2>;
  }

  return (
    <Container>
      <div className={styles.boxProduct}>
        <div className={styles.container}>
          <img src={targetProduct.image} alt="" />
          <div className={styles.titel}>
            <h5>{targetProduct.text}</h5>
          </div>
          <hr />
          <p>
            <FaAward size={30} /> گارانتی{" "}
          </p>
          <div className={styles.price}>قیمت :{targetProduct.price}</div>
          <div className={styles.btn}>افزودن به سبد خرید</div>
        </div>
      </div>
      <Comments/>
    </Container>
  );
}
