import mongoose, { Schema, model, models } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: String,
    enum: ["user", "support"],
    required: true,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  messages: [messageSchema],
  isRead: { type: Boolean, default: false },
  isReadForClient: { type: Boolean, default: false },
});

const Chat = models.Chat || model("Chat", chatSchema);
export default Chat;
