import ProductCard from "@/components/productCard/ProductCard";
import { Col, Container, Row } from "react-bootstrap";
import connectDB from "@/utils/connectDB";
import Products from "@/models/Products";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
export default function Home({ productList }) {
  const router = useRouter();
  const { message } = router.query;

  useEffect(() => {
    if (message === "login_required") {
      toast.error("برای دسترسی به سبد خرید باید ورود یا ثبت‌نام انجام دهید", {
        duration: 3000,
        position: "top-center",
      });

      router.replace("/", undefined, { shallow: true });
    } else if (message === "admin_required") {
      toast.error("این صفحه مختص به ادمین سایت هست", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/", undefined, { shallow: true });
    }
  }, [message, router]);

  return (
    <Container>
      <h1 style={{ margin: "26px 0" }}>لپ تاپ(laptop)</h1>
      <Row>
        {productList.laptops.slice(0, 4).map((product) => (
          <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      <h1 style={{ margin: "26px 0" }}>موبایل(mobile)</h1>
      <Row>
        {productList.mobiles.slice(0, 4).map((product) => (
          <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      <h1 style={{ margin: "26px 0" }}>دوربین(camera)</h1>
      <Row>
        {productList.cameras.slice(0, 4).map((product) => (
          <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export async function getServerSideProps() {
  await connectDB();

  const laptops = await Products.find({ category: "laptop" }).limit(4).lean();

  const mobiles = await Products.find({ category: "mobile" }).limit(4).lean();

  const cameras = await Products.find({ category: "camera" }).limit(4).lean();

  return {
    props: {
      productList: JSON.parse(
        JSON.stringify({
          laptops,
          mobiles,
          cameras,
        })
      ),
    },
  };
}
