import PanelNav from "@/components/panelNav/panelNav";
import styles from "@/styles/orders.module.css";
import { Container, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import ValidateToken from "@/utils/auth";
import OrderRegister from "@/components/orderRegister/orderRegister";
import { useEffect, useState } from "react";
import connectDB from "@/utils/connectDB";
import Orders from "@/models/Orders";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
export default function Handler({ doingOrders, sentOrders }) {
  const [doingOrderss, setDoingOrderss] = useState(doingOrders);
  const [sentOrderss, setSentOrderss] = useState(sentOrders);
  const [changHandler, setChangHandler] = useState(true);
  const [register, setRegister] = useState({});
  const [search, setSearch] = useState("");
  useEffect(() => {
    const allOrders = [...doingOrders];

    const initialState = allOrders.reduce((acc, order) => {
      acc[order.orderId] = false;
      return acc;
    }, {});

    setRegister(initialState);
  }, []);
  const HandlerstateRegister = (id) => {
    setRegister((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const searchHandler = () => {
    if (changHandler) {
      const result = doingOrders.filter((item) =>
        item.orderId.toLowerCase().includes(search.toLowerCase())
      );
      setDoingOrderss(result);
    } else {
      const result = sentOrders.filter((item) =>
        item.orderId.toLowerCase().includes(search.toLowerCase())
      );
      setSentOrderss(result);
    }
  };
  const targetMap = changHandler ? doingOrderss : sentOrderss;
  return (
    <Container>
      <Row>
        <PanelNav />
        <div className={styles.container}>
          <h1>سفارشات</h1>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="جستجو سفارش"
          />
          <button onClick={searchHandler}>جستجو</button>
          <div
            style={{ marginRight: "85%", position: "relative", top: "-37px" }}
            className={styles.changState}
          >
            <FaArrowAltCircleRight
              onClick={() =>
                changHandler ? null : setChangHandler(!changHandler)
              }
              style={{
                marginLeft: "6px",
                cursor: "pointer",
                color: changHandler ? "black" : "#888787ff",
              }}
              size={35}
            />
            <FaArrowAltCircleLeft
              onClick={() =>
                changHandler ? setChangHandler(!changHandler) : null
              }
              style={{
                cursor: "pointer",
                color: changHandler ? "#888787ff" : "black",
              }}
              size={35}
            />
          </div>
          <div className={styles.containerOrders}>
            {changHandler
              ? doingOrderss.length === 0 && (
                  <p
                    style={{
                      fontSize: "25px",
                      position: "relative",
                      right: "32%",
                    }}
                  >
                    سفارشی موجود نیست.
                  </p>
                )
              : sentOrderss.length === 0 && (
                  <p
                    style={{
                      fontSize: "25px",
                      position: "relative",
                      right: "32%",
                    }}
                  >
                    سفارشی موجود نیست.
                  </p>
                )}

            {targetMap.map((order) => (
              <div key={order.orderId} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span>کاربر: {order.userId.firstName}</span>
                  <span>
                    تاریخ:{" "}
                    {new Intl.DateTimeFormat("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(new Date(order.createdAt))}
                  </span>

                  <span
                    style={{
                      color: order.status === "در حال انجام" ? "red" : "green",
                    }}
                  >
                    وضعیت: {order.status}
                  </span>
                  <span>
                    مبلغ کل: {order.orderAmount.toLocaleString()} تومان
                  </span>
                </div>

                <Swiper
                  modules={[Pagination]}
                  pagination={{ dynamicBullets: true }}
                  spaceBetween={10}
                  slidesPerView={1}
                >
                  {order.cartItems.map((item, idx) => (
                    <SwiperSlide key={item._id + idx}>
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
                <div className="">
                  <p
                    style={{
                      position: "relative",
                      top: changHandler ? "41px" : "7px",
                    }}
                  >
                    شماره سفارش : {order.orderId}
                  </p>
                  {changHandler ? (
                    <p
                      onClick={() => HandlerstateRegister(order.orderId)}
                      className={styles.sabt}
                      style={{
                        position: "relative",
                        right: "84%",
                        cursor: "pointer",
                      }}
                    >
                      ثبت نهایی
                    </p>
                  ) : (
                    <p
                      style={{
                        position: "relative",
                      }}
                    >
                      کد رهگیری : {order.trackingCode}
                    </p>
                  )}
                </div>
                <OrderRegister
                  HandlerstateRegister={HandlerstateRegister}
                  setDoingOrderss={setDoingOrderss}
                  setSentOrderss={setSentOrderss}
                  state={register[order.orderId]}
                  address={order.address}
                  orderId={order._id}
                />
              </div>
            ))}
          </div>
        </div>
      </Row>
    </Container>
  );
}
export async function getServerSideProps(context) {
  const payload = ValidateToken(context);

  if (payload.role !== "admin") {
    return {
      redirect: {
        destination: "/?message=admin_required",
      },
    };
  }

  connectDB();
  const orders = await Orders.find().populate("userId", "firstName");

  const doingOrders = orders.filter((o) => o.status === "در حال انجام");
  const sentOrders = orders.filter((o) => o.status === "ارسال شده");

  return {
    props: {
      doingOrders: JSON.parse(JSON.stringify(doingOrders)),
      sentOrders: JSON.parse(JSON.stringify(sentOrders)),
    },
  };
}
