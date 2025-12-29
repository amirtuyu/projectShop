import Chat from "@/models/Chat";
import User from "@/models/User";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import upload from "@/utils/upload"; // فرض: multer اینجاست
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!["POST", "GET", "PUT"].includes(req.method)) {
    return res.status(405).json({ message: "متد نامعتبر است" });
  }

  await connectDB();

  const payload = ValidateToken({ req });
  if (!payload) {
    return res.status(401).json({ message: "احراز هویت ناموفق" });
  }

  const userID = payload.userId;

  //  POST
  if (req.method === "POST") {
    return upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { type, sender, content: textContent } = req.body;

      if (!["user", "support"].includes(sender))
        return res.status(400).json({ message: "sender نامعتبر است" });

      if (!["text", "image"].includes(type))
        return res.status(400).json({ message: "type نامعتبر است" });

      let content;

      if (type === "text") {
        if (!textContent?.trim())
          return res.status(422).json({ message: "متن نامعتبر است" });
        content = textContent.trim();
      }

      if (type === "image") {
        if (!req.file)
          return res.status(422).json({ message: "عکس ارسال نشده" });
        content = `/uploads/chat/${req.file.filename}`;
      }

      const newMessage = {
        sender,
        type,
        content,
        createdAt: new Date(),
      };

      const newMessagee = {
        sender,
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
            : content,
        createdAt: new Date(),
      };

      let chat = await Chat.findOne({ userId: userID });
      let user = await User.findOne({ _id: userID });

      if (!chat) {
        chat = await Chat.create({
          userId: userID,
          messages: [newMessage],
          isRead: sender === "support",
          isReadForClient: sender === "user",
        });
      } else {
        chat.messages.push(newMessage);
        chat.isRead = sender === "support";
        await chat.save();
      }
      const formattedMessages = {
        userId: payload.userId.toString(),
        name: `${user.firstName} ${user.lastName}`,
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
      };

      const io = res.socket.server.io;
      if (io) {
        io.to("69102ae1dba868c45f8572f4").emit("newMessage", formattedMessages);
      }

      return res.status(200).json({ message: newMessagee });
    });
  }

  // GET
  if (req.method === "GET") {
    const chat = await Chat.findOne({ userId: userID });
    if (!chat) return res.status(200).json([]);

    const formattedMessages = chat.messages.map((m) => ({
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
      createdAt: m.createdAt,
    }));

    return res.status(200).json({
      messages: formattedMessages,
      flagNotf: chat.isReadForClient,
    });
  }

  // PUT
  if (req.method === "PUT") {
    const chat = await Chat.findOne({ userId: userID });
    if (!chat) return res.status(404).json({ message: "چت یافت نشد" });

    chat.isReadForClient = false;
    await chat.save();

    return res.status(200).json({ message: "فلگ نوتیف پاک شد" });
  }
}
