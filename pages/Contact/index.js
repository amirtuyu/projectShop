import Orders from "@/models/Orders"
import styles from "@/styles/Contact.module.css"
import ValidateToken from "@/utils/auth"
import connectDB from "@/utils/connectDB"
import { FaPhone } from "react-icons/fa6"
import { IoLocationSharp } from "react-icons/io5"
import { IoTimeSharp } from "react-icons/io5"

function Contact() {
   return (
      <div className="container">
         <div className={styles.contactContainer}>
            <h3>پیگیری سفارش، انتقاد و پیشنهاد</h3>
            <p>برای پیگیری یا سؤال درباره سفارش و ارسال پیام بهتر است از فرم زیر استفاده کنید.</p>

            <form>
               <div className={styles.inputBox}>
                  <label htmlFor="fullName">نام و نام خانوادگی</label>
                  <input type="text" id="fullName" />
               </div>
               <div className={styles.inputBox}>
                  <label htmlFor="phone">شماره تماس</label>
                  <input type="text" id="phone" />
               </div>
               <div className={styles.inputBox}>
                  <label htmlFor="email">ایمیل</label>
                  <input type="text" id="email" />
               </div>
               <div className={styles.inputBox}>
                  <label htmlFor="order">شماره سفارش</label>
                  <input type="text" id="order" />
               </div>
               <div className={styles.inputBox}>
                  <label htmlFor="message">متن پیام</label>
                  <textarea rows="5" type="text" id="message" />
               </div>
            </form>
         </div>
         <div>
            <div className={styles.contactBox}>
               <FaPhone size="25px" color="#666" />
               <p>
                  تلفن فروش:45691000 - داخلی 2 | خدمات پس از فروش:داخلی 3 | پیگیری سفارشات:داخلی 1
               </p>
            </div>

            <div className={styles.contactBox}>
               <IoLocationSharp size="25px" color="#666" />
               <p>
                  نشانی (دفتر مرکزی):تهران، خیابان مطهری، خیابان فجر، کوچه مدائن، پلاک ۷، ساختمان
                  مقداد آی تی
               </p>
            </div>
            <div className={styles.contactBox}>
               <IoTimeSharp size="25px" color="#666" />
               <p>
                  ساعت کاری مجموعه: شنبه تا چهارشنبه (از ساعت ۹ تا ۱۸) پنجشنبه (از ساعت ۹ الی ۱۴)
               </p>
            </div>
         </div>
      </div>
   )
}
export default Contact
export async function getServerSideProps(context) {
  const payload = ValidateToken(context);
  if (!payload) {
    return {
      redirect: {
        destination: "/?message=login_required",
      },
    };
  }
  await connectDB();
  const userOrders = await Orders.find({ userId: payload.userId }).sort({
    createdAt: -1,
  });

  return {
    props: {
      orders: JSON.parse(JSON.stringify(userOrders)), // تبدیل ObjectId و Date
    },
  };
}