//api/chat
import Chat from "@/models/Chat";
import User from "@/models/User";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET" && req.method !== "PUT") {
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
  const userID = payload.userId;
  //______POST_____
  if (req.method == "POST") {
    const { message, sender } = req.body;
    //چک کردن ساختار پیام دریافتی
    if (
      typeof message !== "string" ||
      typeof sender !== "string" ||
      (sender !== "user" && sender !== "support")
    ) {
      return res.status(400).json({ message: "ساختار پیام ارسالی نادرست است" });
    }
    //چک کردن وجود سابقه چت
    let chat = await Chat.findOne({ userId: userID }).populate(
      "userId",
      "firstName lastName"
    );
    if (chat) {
      chat.messages.push(req.body);
      chat.isRead = req.body.sender === "user" ? false : true;
      await chat.save();
      const formattedChat = {
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
      };

      const io = res.socket.server.io;

      if (io) {
        const userId = "69102ae1dba868c45f8572f4";
        io.to(userId).emit("newMessage",formattedChat);
      }
      return res.status(200).json({ message: "پیام شما به پشتیبانی ارسال شد" });
    }
    if (!chat) {
      await Chat.create({
        userId: userID,
        messages: [req.body],
        isRead: false,
      });
      return res.status(200).json({ message: "پیام شما به پشتیبانی ارسال شد" });
    }
  }
  //______GET________
  if (req.method == "GET") {
    let chat = await Chat.findOne({ userId: userID });
    if (!chat || !chat.messages) {
      return res.status(200).json([]);
    }
    const formattedMessages = chat.messages.map((msg) => ({
      message: `${
        msg.message
      }\n<span style="display:block; text-align:right;">${new Date(
        msg.createdAt
      ).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      })}</span>`,
      sender: msg.sender,
      sentTime: new Date(msg.createdAt).toLocaleTimeString("fa-IR"),
    }));
    return res
      .status(200)
      .json({ messages: formattedMessages, flagNotf: chat.isReadForClient });
  }
  //______PUT________
  if (req.method == "PUT") {
    let chat = await Chat.findOne({ userId: userID });
    if (chat.isReadForClient) {
      chat.isReadForClient = false;
      await chat.save();
      res.status(200).json({ message: "فلگ نوتیف پاک شد" });
    } else {
      res.status(400).json({ message: "چت پیدا نشد یا فلگ false بود" });
    }
  }
}
