import Link from "next/link";
import styles from "./panelNav.module.css";
import { usePathname } from "next/navigation";
import { TiShoppingCart } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
import { PackagePlus } from "lucide-react";
export default function PanelNav() {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <Link href="/admin-panel/insertProduct">
        <div
          className={`${styles.box} ${
            pathname === "/admin-panel/insertProduct" ? styles.active : ""
          }`}
        >
          <p> اضافه کردن محصول</p>
        </div>
      </Link>
      <Link href="/admin-panel/showUsers">
        <div
          className={`${styles.box} ${
            pathname === "/admin-panel/showUsers" ? styles.active : ""
          }`}
        >
          <p> مشاهده کاربران</p>
        </div>
      </Link>
      <Link href="/admin-panel/orders">
        <div
          className={`${styles.box} ${
            pathname === "/admin-panel/orders" ? styles.active : ""
          }`}
        >
          <p> سفارشات</p>
        </div>
      </Link>
    </div>
  );
}
