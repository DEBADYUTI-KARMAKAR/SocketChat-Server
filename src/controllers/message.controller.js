const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    console.log("inv");

    throw new ApiError(400, "Invalid request");
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    
    const chat = message.chat;
    if (chat?.users) {
      chat.users.forEach((user) => {
        // Don't notify the sender
        if (user._id.toString() === req.user._id.toString()) return;

        // Emit to receiver's personal room (they joined via socket "setup")
        global.io.in(user._id.toString()).emit("message received", message);
      });
    }

    res.status(200).json({
      data: message,
      status: 200,
    });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json({
      data: messages,
      status: 200,
    });
  } catch (error) {
    throw new ApiError(400,error.message)
  }
});

module.exports = {
  sendMessage,
  allMessages,
};
