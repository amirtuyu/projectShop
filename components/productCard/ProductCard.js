import { useDispatch } from "react-redux";
import styles from "./ProductCard.module.css";
import { addToCart } from "@/Redux/slice";
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const AddtoCartHandler = () => {
    dispatch(addToCart(product));
  };
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <img src={product.image} alt="" />
      </div>
      <div className={styles.cardMiddle}>{product.title}</div>
      <div className={styles.cardFooter}>
        <button onClick={AddtoCartHandler}>افزودن به سبد خرید</button>
        <p>{product.price.toLocaleString("fa-IR")}</p>
      </div>
    </div>
  );
}
export default ProductCard;
