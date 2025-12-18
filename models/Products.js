// models/Products.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const productsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Products = models?.Products || model("Products", productsSchema);
export default Products;
