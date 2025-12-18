import { Col, Container, Row } from "react-bootstrap";
import PanelNav from "@/components/panelNav/panelNav";
import { useEffect, useState } from "react";
import styles from "@/styles/showUsers.module.css";
import HistoryUser from "@/components/historyUser/historyUser";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import Orders from "@/models/Orders";
import User from "@/models/User";
export default function showUsers({ users }) {
  const [userss,setUserss]=useState(users)
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState({});
  useEffect(() => {
    const initialState = users.reduce((acc, user) => {
      acc[user._id] = false;
      return acc;
    }, {});
    setHistory(initialState);
  }, []);
  const HandlerstateHistory = (id) => {
    setHistory((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const searchHandler = () => {
      const result = users.filter((item) =>
        item.email.toLowerCase().includes(search.toLowerCase())
      );
      setUserss(result);
  };
  return (
    <>
      <Container>
        <Row>
          <PanelNav />
          <div className={styles.containerUser}>
            <h1>کاربران</h1>
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجو کاربر"
            />
            <button onClick={searchHandler}>جستجو</button>
            <hr />
            <div className={styles.containerBoxUser}>
              {userss.map((user) => (
                <div key={user._id}>
                  <div className={styles.boxUser}>
                    <div className={styles.nameuser}>
                      <p>نام کاربر : {user.firstName}</p>
                    </div>
                    <div
                      className={styles.historyUser}
                      onClick={() => HandlerstateHistory(user._id)}
                    >
                      <p>
                        سابقه کاربر:
                        {history[user.id] ? (
                          <AiOutlineEye
                            style={{ color: "green", fontSize: "20px" }}
                          />
                        ) : (
                          <AiOutlineEyeInvisible
                            style={{ color: "red", fontSize: "20px" }}
                          />
                        )}
                      </p>
                    </div>
                    <div className={styles.email}>
                      <p>ایمیل کاربر : {user.email}</p>
                    </div>
                  </div>
                  <HistoryUser
                    state={history[user._id]}
                    history={user.orders}
                  />
                </div>
              ))}
            </div>
          </div>
        </Row>
      </Container>
    </>
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

  // گرفتن همه کاربران
  const allUsers = await User.find({}, "firstName lastName email");

  // گرفتن همه سفارش‌ها و وصل کردن اطلاعات کاربر
  const allOrders = await Orders.find().populate(
    "userId",
    "firstName lastName email"
  );

  // ساخت یک لیست کاربران که سفارش‌هایشان هم داخلشان است
  const usersWithOrders = allUsers.map((user) => {
    const orders = allOrders.filter(
      (order) => order.userId?._id.toString() === user._id.toString()
    );

    return {
      ...user.toObject(),
      orders,
    };
  });
  return {
    props: {
      users: JSON.parse(JSON.stringify(usersWithOrders)),
    },
  };
}
