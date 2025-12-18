import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice";
const store = configureStore({ reducer: reducer });
export default store;
// در اینجا فقط فانکشن ردیوسر
//رو از اسلایس میگیریم
// و به استور میدهیم
//فانکشن ردیوسر خودش در اسلایس مقداردهی اولیه شده
