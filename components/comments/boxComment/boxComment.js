import styles from './boxComment.module.css'
import { FaUserCircle } from "react-icons/fa";

export default function BoxComment(){
    return(
        <div className={styles.container}>
            <div className={styles['icon-name-date']}>
                <div className={styles.icon}>
                    <FaUserCircle size={40}/>
                </div>
                <div className={styles.name}>
                    <p>بنیامین</p>
                </div>
                <div className={styles.date}>
                    <p>5 جولای 2025</p>
                </div>
            </div>
            <div className={styles.comment}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis ipsam vitae at ut quasi nostrum delectus ullam recusandae soluta rem veniam veritatis aperiam laborum numquam, dolor saepe odio doloribus itaque!سلام آقای بهرامی ای کاش یه تخفیف خیلی خوب</p>
            </div>
        </div>
    )
}