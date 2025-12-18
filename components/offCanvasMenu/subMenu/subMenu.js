import Link from "next/link";
import styles from "./sunMenu.module.css";
import { appContext } from "../../../pages/_app";
import { useContext } from "react";
function SubMenu({ category }) {
  const { setOpenAndClose } = useContext(appContext);
  return (
    <div className={styles.subMenu}>
      <ul>
        {category.brands.map((brand) => (
          <li onClick={()=>setOpenAndClose ("close")}>
            <Link href={`/products/${category.name}/${brand}`}>{brand}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubMenu;
