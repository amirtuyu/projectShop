import ProductCard from "@/components/productCard/ProductCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "@/styles/ProductsByCategory.module.css";
import connectDB from "@/utils/connectDB";
import Products from "@/models/Products";
function ProductsByCategory({ products }) {
  const { category } = useRouter().query;
  const [searchKey, setSearchKey] = useState("");
  const [product, setProduct] = useState(products);
  useEffect(() => {
    setProduct(products);
    setSearchKey("");
  }, [category]);
  useEffect(() => {
    if (searchKey) {
      const searchProduct = products.filter((product) =>
        product.title.includes(searchKey)
      );
      setProduct(searchProduct);
    } else {
      setProduct(products);
    }
  }, [searchKey]);
  return (
    <Container>
      <div className={styles.searchingContainer}>
        <input
          type="text"
          placeholder="دنبال چی میگردی؟"
          className={styles.search}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>
      <h1 style={{ margin: "26px 0" }}>محصولات({category})</h1>
      <Row>
        {product?.map((product) => (
          <Col key={product.id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export default ProductsByCategory;
export async function getServerSideProps(context) {
  const { category } = context.query;

  await connectDB();

  const products = await Products.find({ category }).lean();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)), // برای ارسال به فرانت‌اند
    },
  };
}
