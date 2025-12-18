import Chat from "@/models/Chat";
import User from "@/models/User";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import { message } from "antd";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "متد درخواستی نامعتبر است" });
  }
  await connectDB();
  //اهراز هویت کاربر
  const context = { req };
  const payload = ValidateToken(context);
  if (!payload) {
    return res.status(401).json({
      message: "برای ارتباط با پشتیبانی لطفا ورود یا ثبت نام انجام دهید",
    });
  }
  if (payload.role !== "admin") {
    return res.status(401).json({ message: "این بخش مخصوص ادمین سایت است" });
  }

  //______GET_________
  if (req.method == "GET") {
    const chats = await Chat.find({ isRead: false })
      .populate("userId", "firstName lastName")
      .sort({ updatedAt: -1 }); // جدیدترین‌ها بالا

    const formattedChats = chats.map((chat) => ({
      userId: chat.userId._id.toString(),
      name: `${chat.userId.firstName} ${chat.userId.lastName}`,
      messages: chat.messages.map((m) => ({
        sender: m.sender,
        message: `${
          m.message
        }\n<span style="display:block; text-align:right;">${new Date(
          m.createdAt
        ).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        })}</span>`,
        createdAt: m.createdAt,
      })),
    }));
    res.status(200).json(formattedChats);
  }
  //_______POST________
  if (req.method === "POST") {
    if (
      typeof req.body !== "object" ||
      req.body === null ||
      !req.body.userId ||
      !req.body.message ||
      !req.body.message.message ||
      !req.body.message.sender
    ) {
      return res.status(401).json({ message: "ساختار پیام ارسالی اشتباه است" });
    }
  }
  let chat = await Chat.findOne({ userId: req.body.userId });
  if (!chat) {
    return res.status(401).json({ message: "ساختار پیام ارسالی اشتباه است" });
  } else {
    chat.messages.push(req.body.message);
    chat.isRead = req.body.message.sender === "support" ? true : false;
    chat.isReadForClient = req.body.message.sender === "support" ? true : false;
    await chat.save();
    const now = new Date();

    const formattedMessage = {
      message: `${
        req.body.message.message
      }\n<span style="display:block; text-align:right;">${now.toLocaleTimeString(
        "fa-IR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}</span>`,
      sender: req.body.message.sender,
      sentTime: now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const io = res.socket.server.io;

    if (io) {
      io.to(req.body.userId).emit("newMessage", formattedMessage);
    }
    return res
      .status(200)
      .json({ message: "پیام شما برای کاربر مورد نظر ارسال شد" });
  }
}

// {
//   userId: '69183093fef32a7c70ce5762',
//   message: { message: 'dfgdg', sender: 'support' }
// }
