import Link from "next/link";
import styles from "./SubMenu.module.css";
function SubMenu({ category }) {
  return (
    <div className={styles.subMenu}>
      <div className="container">
        <ul>
          {category?.brands?.map((brand) => (
            <li>
              <Link href={`/products/${category.name}/${brand}`}>{brand}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SubMenu;
