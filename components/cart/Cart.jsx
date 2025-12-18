import styles from "./Cart.module.css";
import ProductItemInCart from "./ProductItemInCart";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "@/Redux/slice";
import OrderForm from "../formAddres/formAddres";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import OrderHistoryBox from "../HistoryOrder/HistoryOrder";
import { Container, Row } from "react-bootstrap";
function Cart({ orders }) {
  const [orderList, setOrderList] = useState(orders);
  const dispatch = useDispatch();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    city: "",
    postalCode: "",
    addressLine: "",
  });
  const state = useSelector((state) => state.addedProduct);
  const total = state.reduce((sum, item) => sum + item.totalPrice, 0);
  const hadlerRegisterOrder = async () => {
    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.postalCode ||
      !address.city ||
      !address.addressLine
    ) {
      return toast.error("لطفا تمام فیلدهای آدرس را پر کنید");
    }
    if (state.length == 0) {
      return toast.error("سبد خرید خالی است");
    }
    await axios
      .post("/api/orders/insertOrder", { address, cartItems: state })
      .then((res) => {
        if (res.status == 201) {
          toast.success("سفارش با موفقیت ثبت شد");
          setOrderList((prev) => [...prev, res.data.order]);
          dispatch(resetCart());
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
  useEffect(() => {
    if (orders.length > 0) {
      setAddress(orders[0].address);
    }
  }, []);
  return (
    <>
      <Container>
        <div style={{ marginTop: "50px" }} className={styles.container}>
          <div className={styles.cartContainer}>
            {state.length ? (
              state.map((item) => <ProductItemInCart {...item} />)
            ) : (
              <p>The shoping Cart is empty</p>
            )}
          </div>
          <div className={styles.totalContainer}>
            <div className={styles.header}>
              <h2>مجموع پرداختی</h2>
              <span className={styles.amount}>
                {total} <small>تومان</small>
              </span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.actions}>
              <button
                onClick={hadlerRegisterOrder}
                className={styles.payButton}
              >
                پرداخت
              </button>
            </div>
          </div>
        </div>
        <div className={styles.containerHistory}>
          <h2>سابقه سفارش :</h2>
          <Row>
            {orderList.map((order) => (
              <OrderHistoryBox key={order.orderId} order={order} />
            ))}
          </Row>
        </div>
        <OrderForm setAddres={setAddress} addres={address} />
      </Container>
    </>
  );
}
export default Cart;
