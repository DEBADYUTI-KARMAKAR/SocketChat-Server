const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { onlineUsers } = require("../socket/index");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    throw new ApiError(400, "Invalid request");
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // ── Emit to all receivers ──────────────────────────────────────────────
    const chat = message.chat;
    if (chat?.users) {
      chat.users.forEach((user) => {
        const receiverId = user._id.toString();

        // Skip sender
        if (receiverId === req.user._id.toString()) return;

        // Emit via socket
        global.io.in(receiverId).emit("message received", message);

        // Optional: log if user is online
        const isOnline = onlineUsers.has(receiverId);
        console.log(`📨 Message sent to ${user.name} — online: ${isOnline}`);
      });
    }

    res.status(200).json({ data: message, status: 200 });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json({ data: messages, status: 200 });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

module.exports = { sendMessage, allMessages };