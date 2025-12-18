import styles from './ProductItemInCart.module.css'
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import{increaseInCart,decreaseInCart, removeFromCart} from '@/Redux/slice'
function ProductItemInCart({ _id, name, image, count, totalPrice }) {
  const dispatch = useDispatch();
  const decreaseHandler = () => {
    dispatch(decreaseInCart(_id));
  };
  const increaseHandler = () => {
    dispatch(increaseInCart(_id));
  };
  const RemoveFromCartHandler = () => {
    dispatch(removeFromCart(_id));
  };
  return (
    <div className={styles.productItemInCart}>
      <div className={styles.cardLeft}>
        <img src={image} />
      </div>

      <div className={styles.cardMiddle}>
        {count > 1 ? (
          <button onClick={decreaseHandler}>-</button>
        ) : (
          <button onClick={RemoveFromCartHandler}>
            <RiDeleteBin6Line />
          </button>
        )}
        <span>{count}</span>
        <button onClick={increaseHandler}>+</button>
      </div>

      <div className={styles.cardRight}>
        <h5>{name}</h5>
        <p>price : {totalPrice.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProductItemInCart;
