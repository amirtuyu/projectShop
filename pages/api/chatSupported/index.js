import Chat from "@/models/Chat";
import User from "@/models/User";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import upload from "@/utils/upload";
export const config = {
  api: {
    bodyParser: false,
  },
};

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
        type: m.type,
        content:
          m.type === "text"
            ? `${
                m.content
              }\n<span style="display:block; text-align:right;">${new Date(
                m.createdAt
              ).toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              })}</span>`
            : m.content,
      })),
    }));
    res.status(200).json(formattedChats);
  }
  //_______POST________
  if (req.method === "POST") {
    return upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { userId, type, content } = req.body;

      if (!userId) {
        return res.status(422).json({ message: "userId ارسال نشده" });
      }

      if (!["text", "image"].includes(type)) {
        return res.status(422).json({ message: "type نامعتبر است" });
      }

      let finalContent;

      if (type === "text") {
        if (!content?.trim()) {
          return res.status(422).json({ message: "متن پیام نامعتبر است" });
        }
        finalContent = content.trim();
      }

      if (type === "image") {
        if (!req.file) {
          return res.status(422).json({ message: "عکس ارسال نشده" });
        }
        finalContent = `/api/uploads/chat/${req.file.filename}`;
      }

      const chat = await Chat.findOne({ userId });
      if (!chat) {
        return res.status(404).json({ message: "چت مورد نظر یافت نشد" });
      }

      const newMessage = {
        sender: "support",
        type,
        content: finalContent,
        createdAt: new Date(),
      };

      chat.messages.push(newMessage);
      chat.isRead = true;
      chat.isReadForClient = true;
      await chat.save();

      // پیام فرمت‌شده برای سوکت (نه DB)
      const formattedMessage = {
        sender: "support",
        type,
        content:
          type === "text"
            ? `${content}\n<span style="display:block; text-align:right;">${new Date().toLocaleTimeString(
                "fa-IR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}</span>`
            : finalContent,
        time: new Date(newMessage.createdAt).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const io = res.socket.server.io;
      if (io) {
        io.to(userId).emit("newMessage", formattedMessage);
      }

      return res.status(200).json({
        message: "پیام پشتیبانی ارسال شد",
        data: formattedMessage,
      });
    });
  }
}

// {
//   userId: '69183093fef32a7c70ce5762',
//   message: { message: 'dfgdg', sender: 'support' }
// }
