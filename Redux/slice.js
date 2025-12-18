import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "cart",
  initialState: { addToCart: 0, addedProduct: [] },
  reducers: {
    resetCart: (state, action) => {
      state.addToCart = 0;
      state.addedProduct = [];
    },
    addToCart: (state, action) => {
      state.addToCart += 1;
      if (state.addedProduct.some((item) => item._id == action.payload._id)) {
        state.addedProduct.map((obj) => {
          if (obj._id == action.payload._id) {
            obj.count = obj.count + 1;
            obj.totalPrice = obj.count * obj.price;
          }
        });
      } else {
        const newObj = { ...action.payload };
        newObj.count = 1;
        newObj.totalPrice = action.payload.price * newObj.count;
        state.addedProduct = [...state.addedProduct, newObj];
      }
    },
    increaseInCart: (state, action) => {
      state.addToCart += 1;
      state.addedProduct.map((obj) => {
        if (obj._id == action.payload) {
          obj.count += 1;
          obj.totalPrice = obj.count * obj.price;
        }
      });
    },
    decreaseInCart: (state, action) => {
      state.addToCart -= 1;
      state.addedProduct.map((obj) => {
        if (obj._id == action.payload) {
          obj.count -= 1;
          obj.totalPrice = obj.count * obj.price;
        }
      });
    },
    removeFromCart: (state, action) => {
      state.addToCart -= 1;
      state.addedProduct = state.addedProduct.filter(
        (obj) => obj._id !== action.payload
      );
    },
  },
});
export const { resetCart,addToCart, increaseInCart, decreaseInCart, removeFromCart } =
  slice.actions;
export default slice.reducer;
// اسلایس برای مدیریت اکشن ها و تایپ ها استفاده میشه
//برای این کار از متد کری ایت اسلایس
//استفاده میکنیم و بهش یک ابجکت ورودی میدهیم
//و یک اسم با معنی مرتبط با پروژه مدیریت رداکسمون
// با پراپرتی نیم بهش میدیم
//مثلا در اینجا برای مدیریت سبد خریدمون از
//ریداکس استفاده میکنیم پس نیم رو مینویسیم کارت

//در پراپرتی دوم از ابجکت ورودی
//کری ایت اسلایس مقدار اولیه استیت رو با پراپ
//اینیشیالز استیت وارد میکنیم

//در پراپرتی سوم از ابجکت ورودی متد
//کری ایت اسلایس از ریداکس تولکیت
//فانکشن ردیوسر ریداکسمون رو باید بنویسیم
//برای اینکار پراپ ردیوسرز رو به ابجکت کری ایت اسلایس
//میدهیم و مقدار ردیوسرز باز خودش یک ابجکته
// که در واقع همون ساختار سوییچ کیس هامونه
//با یه سینتکس نوشتاری متفاوت
//در این سینتکس اکشن تایپ هامون رو به عنوان
//یک پراپ به ابکجت ردیوسرز میدهیم
//و کدهایی که باید برای اون اکشن تایپ
//اجرا بشند رو هم درون یک اررو فانکشن
//به عنوان مقدا به پراپ اکشن تایپمون میدیم
// و ورودی های اررو فانکشنمون هم استیت و اکشن
//هستند

//در اکسپورت کردن اسلایس
//مینویسیم اسلایس نقطه ردیوسر
//slice.reducer

//اکشن تایپ هامون رو باید به صورت دیستراکچرینگ
//اسلایس نقطه اکشن بگیریم و اکسپورت کنیم
//و در محلی که می خوایم دیستپچ کنیم
// این اکشن تایپ هارو که از اسلایس
//اکسپورت کرده بودیم رو ایمپورت کرده
// و در ورودی دیسپتچ قرار بدیم
// و مقدایری رو هم که می خوایم
//به همراه دیپتچ بفرستیم
//به عنوان ووردی  اکشن تایپ ایمپورت شده
//و قرار داده شده در دیسپتچ می نویسیم
// در اسلایس
//در محل ایجرا اکشن تایپ
// این مقادیر در اکشن نقطه پایلود
//گرفته میشن

// همچنین در ریداکس تولیکت دیگه نیاز نیست
//نگران کپی عمیف گرفتن باشیم
// نیاز به کپی گرفتن از استیت برای تغیر استیت نداریم
//و همچنین نیاز به ریترن کردن استیت نداریم
