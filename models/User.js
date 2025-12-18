import { models, model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    minLength: [3, "نام باید حداقل سه کاراکتر باشد"],
    maxLength: [15, "نام نمی‌تواند بیش از ۱۵ کاراکتر باشد"],
    required: [true, "لطفا نام را وارد کنید"],
  },
  lastName: {
    type: String,
    trim: true,
    minLength: [3, "نام خانوادگی باید حداقل سه کاراکتر باشد"],
    maxLength: [15, "نام خانوادگی نمی‌تواند بیش از ۱۵ کاراکتر باشد"],
    required: [true, "لطفا نام خانوادگی را وارد کنید"],
  },
  email: {
    type: String,
    unique: [true, "این ایمیل قبلا در وبسایت ثبت نام کرده است"],
    required: [true, "لطفا ایمیل را وارد کنید"],
  },
  password: {
    type: String,
    required: [true, "لطفا یک پسوورد انتخاب کنید"],
    // minLength: [8, "پسوورد باید حده اقل 8 کاراکتر باشد"],
    // maxLength: [20, "پسوورد باید حداقل 20 کاراکتر باشد"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
const User = models.User || model("User", userSchema);
export default User;
