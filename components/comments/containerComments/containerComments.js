import styles from "./containerComments.module.css";
import { BiComment } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
import BoxComment from "../boxComment/boxComment";
export default function containerComments() {
  return (
    <div className={styles.containerComments}>
      <div className={styles.header}>
        <p>
          <BiComment /> نظرات{" "}
        </p>
      </div>
      <div className={styles.body}>
        <BoxComment/>
      </div>
      <div className={styles.footer}>
        <div className={styles.insertComments}>
          <h5>قوانین ثبت دیدگاه</h5>
          <p><FcCheckmark /> نظر واقعیت رو در مورد محصول بگو</p>
          <div className={styles.boxInsert}>
            <form>
              <label htmlFor="name">نام و نام خانوادگی</label>
              <input
                type="text"
                id="name"
                placeholder="مثلاً امیرمحمد فتح اللهی"
                required
              />

              <label htmlFor="comment">نظر شما</label>
              <textarea
                id="comment"
                placeholder="نظر خود را بنویسید..."
                required
              ></textarea>

              <button type="submit">ارسال نظر</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
