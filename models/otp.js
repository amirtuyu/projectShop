import { models, model, Schema } from "mongoose";

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  expTime: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 220 });
const Otp = models.Otp || model("Otp", otpSchema);
export default Otp;
