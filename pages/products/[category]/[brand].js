import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "@/components/productCard/ProductCard";
import Products from "@/models/Products";
import connectDB from "@/utils/connectDB";
function ProductsByBrand({ products,brand }) {
  return (
    <Container>
      <h1 style={{ margin: "26px 0" }}>{brand}</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export default ProductsByBrand;
export async function getServerSideProps(context) {
  const { brand } = context.query;

  await connectDB();

  const products = await Products.find({ brand }).lean();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      brand, 
    },
  };
}
