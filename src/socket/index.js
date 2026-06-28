const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Track online users: { userId: socketId }
const onlineUsers = new Map();

const initSocket = (server) => {
  const io = socketIO(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ─── Middleware: Authenticate socket with JWT ───────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   const user = await User.findById(decoded._id).select("-password");
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user; // attach user to socket
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ─── Connection ─────────────────────────────────────────────────────────────
  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.user.name} (${socket.id})`);

    // ── 1. Setup: join personal room ─────────────────────────────────────────
    const userId = socket.user._id.toString();
    socket.join(userId);
    socket.userId = userId;

    // Track online users
    onlineUsers.set(userId, socket.id);

    // Notify others this user is online
    socket.broadcast.emit("user online", userId);

    // Send current online users to this socket
    socket.emit("online users", Array.from(onlineUsers.keys()));

    console.log(`👤 ${socket.user.name} joined personal room: ${userId}`);

    // ── 2. Join chat room ────────────────────────────────────────────────────
    socket.on("join chat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId);
      console.log(`💬 ${socket.user.name} joined chat: ${chatId}`);
    });

    // ── 3. Leave chat room ───────────────────────────────────────────────────
    socket.on("leave chat", (chatId) => {
      if (!chatId) return;
      socket.leave(chatId);
      console.log(`🚪 ${socket.user.name} left chat: ${chatId}`);
    });

    // ── 4. Typing indicators ─────────────────────────────────────────────────
    socket.on("typing", (chatId) => {
      if (!chatId) return;
      socket.in(chatId).emit("typing", {
        chatId,
        userId,
        userName: socket.user.name,
      });
    });

    socket.on("stop typing", (chatId) => {
      if (!chatId) return;
      socket.in(chatId).emit("stop typing", { chatId, userId });
    });

    // ── 5. New message via socket ─────────────────────────────────────────────
    socket.on("new message", (newMessage) => {
      const chat = newMessage?.chat;
      if (!chat?.users) {
        return socket.emit("error", { message: "chat.users not defined" });
      }

      chat.users.forEach((user) => {
        const receiverId = user._id?.toString();
        if (!receiverId || receiverId === userId) return; // skip sender

        socket.in(receiverId).emit("message received", newMessage);
      });
    });

    // ── 6. Message read/seen ──────────────────────────────────────────────────
    socket.on("message read", ({ chatId, userId: readerId }) => {
      if (!chatId || !readerId) return;
      socket.in(chatId).emit("message read", { chatId, readerId });
    });

    // ── 7. Disconnect ─────────────────────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${socket.user.name} — reason: ${reason}`);

      onlineUsers.delete(userId);

      // Notify others this user is offline
      socket.broadcast.emit("user offline", userId);

      socket.leave(userId);
    });

    // ── 8. Handle socket errors ───────────────────────────────────────────────
    socket.on("error", (err) => {
      console.error(`Socket error for ${socket.user.name}:`, err.message);
    });
  });

  return io;
};

module.exports = { initSocket, onlineUsers };
