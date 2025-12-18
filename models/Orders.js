import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  image: String,
  price: Number,
  count: Number,
  totalPrice: Number,
});

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  addressLine: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      default: "در حال انجام",
    },

    orderAmount: Number,

    trackingCode: {
      type: String,
      default: null,
    },

    address: addressSchema,

    cartItems: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
