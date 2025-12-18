import { Container } from "react-bootstrap";
import styles from "./MainMenu.module.css";
import Link from "next/link";
import { RxCaretDown } from "react-icons/rx";
import { useEffect, useState } from "react";
import SubMenu from "../subMenu/SubMenu";
import toast from "react-hot-toast";
import axios from "axios";
function MainMenu() {
  const [categories, setCategories] = useState([]);
  const [showSubMenu, setShowSubMenu] = useState({
    subMenuLaptops: false,
    subMenuMobiles: false,
    subMenuCameras: false,
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/products/categories");
        const laptops = res.data.find(
          (cat) => cat.name.toLowerCase() === "laptop"
        );
        const mobiles = res.data.find(
          (cat) => cat.name.toLowerCase() === "mobile"
        );
        const cameras = res.data.find(
          (cat) => cat.name.toLowerCase() === "camera"
        );

        setCategories({ laptops, mobiles, cameras });
      } catch (error) {
        toast.error("خطا در دریافت دسته‌بندی‌ها در نوبار");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles.menu}>
      <Container>
        <ul>
          <li
            onMouseEnter={() => {
              setShowSubMenu((prev) => ({ ...prev, subMenuLaptops: true }));
            }}
            onMouseLeave={() => {
              setShowSubMenu((prev) => ({ ...prev, subMenuLaptops: false }));
            }}
          >
            <Link href="/products/laptop">لپ تاپ</Link>
            <RxCaretDown />
            {showSubMenu.subMenuLaptops && (
              <SubMenu category={categories.laptops} />
            )}
          </li>
          <li
            onMouseEnter={() => {
              setShowSubMenu((prev) => ({ ...prev, subMenuMobiles: true }));
            }}
            onMouseLeave={() => {
              setShowSubMenu((prev) => ({ ...prev, subMenuMobiles: false }));
            }}
          >
            <Link href="/products/mobile">موبایل</Link>
            <RxCaretDown />
            {showSubMenu.subMenuMobiles && (
              <SubMenu category={categories.mobiles} />
            )}
          </li>
          <li>
            <Link href="/products/tablets">تبلت</Link>
            <RxCaretDown />
          </li>
          <li
            onMouseEnter={() => {
              setShowSubMenu((prev) => ({ ...prev, subMenuCameras: true }));
            }}
            onMouseLeave={() => {
              setShowSubMenu((prev) => ({ ...prev, subMenuCameras: false }));
            }}
          >
            <Link href="/products/camera">دوربین</Link>
            <RxCaretDown />
            {showSubMenu.subMenuCameras && (
              <SubMenu category={categories.cameras} />
            )}
          </li>
          <li>
            <Link href="/products/consoles">کنسول بازی</Link>
            <RxCaretDown />
          </li>
        </ul>
      </Container>
    </div>
  );
}
export default MainMenu;
