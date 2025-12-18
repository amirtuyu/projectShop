// pages/api/socket.js.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
