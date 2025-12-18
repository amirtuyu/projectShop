import { useState } from "react";
import axios from "axios";
import styles from "@/styles/insertProduct.module.css";
import { Form, Input, InputNumber, Button, Select, message, Card } from "antd";
import PanelNav from "@/components/panelNav/panelNav";
import { Col, Container, Row } from "react-bootstrap";
import ValidateToken from "@/utils/auth";
import toast from "react-hot-toast";

const { Option } = Select;

export default function InsertProduct() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);

    // چک نهایی برای اینکه هیچ فیلدی خالی نباشد
    if (
      !values?.category ||
      !values?.image ||
      !values?.text ||
      !values?.brand ||
      !values?.price
    ) {
      toast.error("لطفا تمام فیلدها را تکمیل کنید");
      setLoading(false);
      return;
    }

    // ارسال به API

    const payload = {
      title: values.text,
      category: values.category,
      brand: values.brand,
      price: values.price,
      image: values.image,
    };

    const res = await axios
      .post("/api/products/insertProduct", payload)
      .then((res) => {
        if (res.status == 201) {
          toast.success("محصول با موفقیت اضافه شد");
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          // 1️⃣ سرور پاسخ داده ولی با وضعیت خطا
          if (
            error.response.status === 405 ||
            error.response.status === 422 ||
            error.response.status === 409 ||
            error.response.status === 401 ||
            error.response.status === 400
          ) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.error("سرور دچار مشکل شده است");
          }
        } else if (error.request) {
          // 2️⃣ درخواست فرستاده شده ولی پاسخی نیومده
          toast.error("خطا در برقراری ارتباط");
        }
        setLoading(false);
      });
  };
  return (
    <Container>
      <Row>
        <PanelNav />
        <Card
          title={<h1 className={styles.cardTitle}>افزودن محصول جدید</h1>}
          className={styles.ContainerForm}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="دسته‌بندی"
              name="category"
              rules={[{ required: true, message: "دسته را انتخاب کنید" }]}
            >
              <Select placeholder="انتخاب دسته">
                <Option value="laptop">لپ‌تاپ</Option>
                <Option value="mobile">موبایل</Option>
                <Option value="camera">دوربین</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="آدرس تصویر"
              name="image"
              rules={[{ required: true, message: "آدرس تصویر را وارد کنید" }]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item
              label="توضیحات محصول"
              name="text"
              rules={[
                { required: true, message: "توضیحات محصول را وارد کنید" },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="قیمت (تومان)"
              name="price"
              rules={[{ required: true, message: "قیمت را وارد کنید" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/,/g, "")}
              />
            </Form.Item>

            <Form.Item
              label="برند"
              name="brand"
              rules={[{ required: true, message: "برند را وارد کنید" }]}
            >
              <Input placeholder="مثلاً asus یا samsung" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                افزودن محصول
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const payload = ValidateToken(context);
  if (payload.role !== "admin") {
    return {
      redirect: { destination: "/?message=admin_required" },
    };
  }
  return { props: {} };
}
