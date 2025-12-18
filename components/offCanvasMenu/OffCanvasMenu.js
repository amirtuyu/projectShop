import Link from "next/link";
import styles from "./OffCanvasMenu.module.css";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { appContext } from "../../pages/_app";
import { useContext, useEffect, useState } from "react";
import SubMenu from "./subMenu/subMenu";
import axios from "axios";
import toast from "react-hot-toast";
function OffCanvasMenu() {
  const [categories, setCategories] = useState([]);
  const [showSubMenu, setShowSubMenu] = useState({
    subMenuLaptops: false,
    subMenuMobiles: false,
    subMenuCameras: false,
  });
  const { openAndClose, setOpenAndClose,} = useContext(appContext);
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
    <aside className={openAndClose ? openAndClose : styles.offCanvasMenu}>
      <div className={styles.offCanvasHeader}>
        <h3>فروشگاه امیر آی تی</h3>
        <IoMdClose size={20} onClick={() => setOpenAndClose("close")} />
      </div>
      <ul>
        <li
          onClick={() => {
            setShowSubMenu((prev) => ({
              ...prev,
              subMenuLaptops: !prev.subMenuLaptops,
            }));
          }}
        >
          <Link href="/products/laptop">لپ تاپ</Link>
          <MdKeyboardArrowDown />
        </li>
        {showSubMenu.subMenuLaptops && (
          <SubMenu category={categories.laptops} />
        )}
        <li
          onClick={() => {
            setShowSubMenu((prev) => ({
              ...prev,
              subMenuMobiles: !prev.subMenuMobiles,
            }));
          }}
        >
          <Link href="/products/mobile">موبایل</Link>
          <MdKeyboardArrowDown />
        </li>
        {showSubMenu.subMenuMobiles && (
          <SubMenu category={categories.mobiles} />
        )}
        <li>
          <Link href="/products/tablets">تبلت</Link>
          <MdKeyboardArrowDown />
        </li>

        <li
           onClick={() => {
            setShowSubMenu((prev) => ({
              ...prev,
              subMenuCameras: !prev.subMenuCameras,
            }));
          }}
        >
          <Link href="/products/camera">دوربین</Link>
          <MdKeyboardArrowDown />
        </li>
        {showSubMenu.subMenuCameras && (
          <SubMenu category={categories.cameras} />
        )}
        <li>
          <Link href="/products/consoles">کنسول بازی</Link>
          <MdKeyboardArrowDown />
        </li>
      </ul>
    </aside>
  );
}
export default OffCanvasMenu;
