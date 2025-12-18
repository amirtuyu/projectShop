import { Container } from "react-bootstrap";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { appContext } from "../../../pages/_app";
import { useContext } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { useRouter } from "next/router";
import { FaCog } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
function Navbar() {
  
  const { route } = useRouter();
  const logOutHandler = async () => {
    await axios
      .get("/api/auth/logout")
      .then((response) => {
        if (response.status == 200) {
          toast.success(response.data.message, { duration: 5000 });
          setIsAuthenticated(false);
          setUserPayload(false)
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data?.message, { duration: 5000 });
        }
        if (error.request) {
          toast.error("خطا در برقراری ارتباط", { duration: 5000 });
        } else {
          toast.error("یک خطای غیرمنتظره رخ داد", { duration: 5000 });
        }
      });
  };
  const { setIsAuthenticated, isAuthenticated, userPayload ,setUserPayload} =
    useContext(appContext);
  const addToCart = useSelector((state) => state.addToCart);
  const { setOpenAndClose } = useContext(appContext);
  return (
    <div className={styles.navbar}>
      <Container>
        <div className={styles.containerNav}>
          <ul>
            <li>
              <IoMenu
                onClick={() => setOpenAndClose("")}
                size={35}
                style={{ position: "relative", top: "2px" }}
              />
            </li>
            <li>
              <Link href="/">صفحه اصلی</Link>
            </li>
            <li>
              <Link href="/Contact">تماس با ما</Link>
            </li>
          </ul>
          <div className={styles.containerLogin}>
            {userPayload && userPayload.role === "admin" ? (
              <Link href={"/admin-panel/showUsers"} className={styles.login}>
                پنل ادمین <FaCog />
              </Link>
            ) : (
              ""
            )}
            {isAuthenticated ? (
              <Link
                style={{ marginRight: "25px" }}
                className={styles.login}
                href={"/auth/login"}
                onClick={logOutHandler}
              >
                 خروج  
                 <CgLogOut /> 
              </Link>
            ) : (
              <Link className={styles.login} href={"/auth/login"}>
                <CgLogIn />
                ورود
              </Link>
            )}
            <p className={styles.bag}>
              <Link href="/cartPage">
                <TiShoppingCart color="white" size={30} />
              </Link>
              {addToCart ? <span>{addToCart}</span> : ""}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default Navbar;
